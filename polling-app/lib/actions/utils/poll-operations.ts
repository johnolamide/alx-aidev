import { Poll, PollOption, Vote, CreatePollData } from '@/lib/types';
import { getSupabaseClient } from './supabase-client';
import { AuthUtils } from './auth';
import { ValidationUtils } from './validation';
import { ErrorUtils, Errors } from './errors';

/**
 * Extended Poll interface with additional details
 * Includes poll options and user's vote information
 */
export interface PollWithDetails extends Poll {
  poll_options: PollOption[];  // Array of poll options with vote counts
  userVote?: Vote | null;      // User's vote if authenticated
}

/**
 * PollOperations Class
 * Handles all poll-related database operations and business logic
 *
 * This class provides methods for:
 * - Creating polls with options
 * - Retrieving polls with details
 * - Managing user votes
 * - Handling poll permissions and validation
 */
export class PollOperations {
  /**
   * Create a new poll with options
   * Handles the complete poll creation process including validation and cleanup
   *
   * @param data - Poll creation data including title, description, options, and settings
   * @returns Promise<PollWithDetails> - Complete poll object with options
   * @throws Error if validation fails or database operations fail
   */
  static async createPoll(data: CreatePollData): Promise<PollWithDetails> {
    // Ensure user is authenticated before creating poll
    const user = await AuthUtils.requireAuth();

    // Validate input data structure and content
    const validation = ValidationUtils.validateCreatePollData(data);
    if (!validation.isValid) {
      throw ErrorUtils.handleValidationError(validation.errors);
    }

    const supabase = await getSupabaseClient();

    // Calculate expiration date if specified
    let expiresAt: string | null = null;
    if (data.expirationDays && data.expirationDays !== 'never') {
      const days = parseInt(data.expirationDays);
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + days);
      expiresAt = expirationDate.toISOString();
    }

    // Insert poll record into database
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: data.title.trim(),
        description: data.description?.trim() || null,
        created_by: user.id,
        is_public: data.isPublic,
        allow_multiple_votes: data.allowMultipleVotes,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (pollError) {
      throw ErrorUtils.handleDatabaseError(pollError);
    }

    // Create poll options in batch
    const pollOptions = data.options
      .filter(option => option && option.trim().length > 0)
      .map(optionText => ({
        poll_id: poll.id,
        option_text: optionText.trim(),
      }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(pollOptions);

    if (optionsError) {
      // Clean up the poll if options creation fails to maintain data integrity
      await supabase.from('polls').delete().eq('id', poll.id);
      throw ErrorUtils.handleDatabaseError(optionsError);
    }

    // Return complete poll with options
    return this.getPollById(poll.id);
  }

  /**
   * Get poll by ID with full details
   * Retrieves a poll with its options and user's vote (if authenticated)
   *
   * @param pollId - Unique identifier of the poll
   * @returns Promise<PollWithDetails> - Poll with options and user vote info
   * @throws Error if poll not found or access denied
   */
  static async getPollById(pollId: string): Promise<PollWithDetails> {
    // Validate poll ID format
    const validation = ValidationUtils.validatePollId(pollId);
    if (!validation.isValid) {
      throw ErrorUtils.handleValidationError(validation.errors);
    }

    const supabase = await getSupabaseClient();
    const { user } = await AuthUtils.getCurrentUser();

    // Fetch poll with options using Supabase join
    const { data: poll, error } = await supabase
      .from('polls')
      .select(`
        id,
        title,
        description,
        created_at,
        expires_at,
        is_public,
        allow_multiple_votes,
        total_votes,
        updated_at,
        created_by,
        poll_options (
          id,
          poll_id,
          option_text,
          vote_count,
          created_at
        )
      `)
      .eq('id', pollId)
      .single();

    if (error) {
      throw ErrorUtils.handleDatabaseError(error);
    }

    // Get user's vote if authenticated
    let userVote = null;
    if (user) {
      const { data: vote } = await supabase
        .from('votes')
        .select('id, option_id')
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .single();

      userVote = vote || null;
    }

    // Add creator information if user is the poll creator
    const creator = user && user.id === poll.created_by
      ? { id: user.id, email: user.email }
      : undefined;

    return {
      ...poll,
      creator,
      userVote,
    };
  }

  static async getUserPolls(): Promise<PollWithDetails[]> {
    const user = await AuthUtils.requireAuth();
    const supabase = await getSupabaseClient();

    const { data: polls, error } = await supabase
      .from('polls')
      .select(`
        id,
        title,
        description,
        created_by,
        created_at,
        expires_at,
        is_public,
        allow_multiple_votes,
        total_votes,
        updated_at,
        poll_options (
          id,
          poll_id,
          option_text,
          vote_count,
          created_at
        )
      `)
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw ErrorUtils.handleDatabaseError(error);
    }

    return (polls || []).map((poll: any) => ({
      ...poll,
      creator: { id: user.id, email: user.email },
    }));
  }

  static async getPublicPolls(): Promise<PollWithDetails[]> {
    const supabase = await getSupabaseClient();
    const { user } = await AuthUtils.getCurrentUser();

    const { data: polls, error } = await supabase
      .from('polls')
      .select(`
        id,
        title,
        description,
        created_by,
        created_at,
        expires_at,
        is_public,
        allow_multiple_votes,
        total_votes,
        updated_at,
        poll_options (
          id,
          poll_id,
          option_text,
          vote_count,
          created_at
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw ErrorUtils.handleDatabaseError(error);
    }

    // Add user vote info for authenticated users
    const pollsWithVotes = await Promise.all((polls || []).map(async (poll: any) => {
      let userVote = null;
      if (user) {
        const { data: vote } = await supabase
          .from('votes')
          .select('id, option_id')
          .eq('poll_id', poll.id)
          .eq('user_id', user.id)
          .single();

        userVote = vote || null;
      }

      return {
        ...poll,
        creator: user && user.id === poll.created_by
          ? { id: user.id, email: user.email }
          : undefined,
        userVote,
      };
    }));

    return pollsWithVotes;
  }

  static async updatePoll(pollId: string, data: Partial<CreatePollData>): Promise<PollWithDetails> {
    const user = await AuthUtils.requireAuth();

    const validation = ValidationUtils.validatePollId(pollId);
    if (!validation.isValid) {
      throw ErrorUtils.handleValidationError(validation.errors);
    }

    const supabase = await getSupabaseClient();

    // Check ownership
    const { data: existingPoll, error: fetchError } = await supabase
      .from('polls')
      .select('created_by')
      .eq('id', pollId)
      .single();

    if (fetchError || !existingPoll) {
      throw Errors.POLL_NOT_FOUND;
    }

    if (existingPoll.created_by !== user.id) {
      throw Errors.PERMISSION_DENIED;
    }

    // Calculate expiration date
    let expiresAt: string | null = null;
    if (data.expirationDays && data.expirationDays !== 'never') {
      const days = parseInt(data.expirationDays);
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + days);
      expiresAt = expirationDate.toISOString();
    }

    // Update poll
    const { error: updateError } = await supabase
      .from('polls')
      .update({
        title: data.title?.trim(),
        description: data.description?.trim() || null,
        is_public: data.isPublic,
        allow_multiple_votes: data.allowMultipleVotes,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pollId)
      .eq('created_by', user.id);

    if (updateError) {
      throw ErrorUtils.handleDatabaseError(updateError);
    }

    return this.getPollById(pollId);
  }

  static async deletePoll(pollId: string): Promise<void> {
    const user = await AuthUtils.requireAuth();

    const validation = ValidationUtils.validatePollId(pollId);
    if (!validation.isValid) {
      throw ErrorUtils.handleValidationError(validation.errors);
    }

    const supabase = await getSupabaseClient();

    // Check ownership
    const { data: existingPoll, error: fetchError } = await supabase
      .from('polls')
      .select('created_by')
      .eq('id', pollId)
      .single();

    if (fetchError || !existingPoll) {
      throw Errors.POLL_NOT_FOUND;
    }

    if (existingPoll.created_by !== user.id) {
      throw Errors.PERMISSION_DENIED;
    }

    // Delete poll (cascade will handle options and votes)
    const { error: deleteError } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)
      .eq('created_by', user.id);

    if (deleteError) {
      throw ErrorUtils.handleDatabaseError(deleteError);
    }
  }

  /**
   * Cast a vote for a poll option
   * Handles both authenticated and anonymous voting with validation
   *
   * @param pollId - ID of the poll being voted on
   * @param optionId - ID of the option being voted for
   * @returns Promise<Vote> - The created vote record
   * @throws Error if validation fails, poll is private, expired, or user already voted
   */
  static async castVote(pollId: string, optionId: string): Promise<Vote> {
    // Validate input parameters
    const validation = ValidationUtils.validateVoteData(pollId, optionId);
    if (!validation.isValid) {
      throw ErrorUtils.handleValidationError(validation.errors);
    }

    const supabase = await getSupabaseClient();
    const { user } = await AuthUtils.getCurrentUser();

    // Verify poll exists and check accessibility
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('id, is_public, allow_multiple_votes, expires_at')
      .eq('id', pollId)
      .single();

    if (pollError || !poll) {
      throw Errors.POLL_NOT_FOUND;
    }

    // Ensure poll is public (required for voting)
    if (!poll.is_public) {
      throw Errors.POLL_PRIVATE;
    }

    // Check if poll has expired
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      throw Errors.POLL_EXPIRED;
    }

    // Prevent duplicate votes if multiple votes not allowed
    if (user && !poll.allow_multiple_votes) {
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        throw Errors.ALREADY_VOTED;
      }
    }

    // Verify the option belongs to the poll
    const { data: option, error: optionError } = await supabase
      .from('poll_options')
      .select('id')
      .eq('id', optionId)
      .eq('poll_id', pollId)
      .single();

    if (optionError || !option) {
      throw Errors.OPTION_NOT_FOUND;
    }

    // Prepare vote data with user or anonymous identifier
    const voteData: any = {
      poll_id: pollId,
      option_id: optionId,
    };

    if (user) {
      // Authenticated user vote
      voteData.user_id = user.id;
    } else {
      // Anonymous vote - generate unique identifier
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      voteData.anonymous_id = `anon_${timestamp}_${randomString}`;
    }

    // Insert vote into database
    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .insert(voteData)
      .select()
      .single();

    if (voteError) {
      throw ErrorUtils.handleDatabaseError(voteError);
    }

    return vote;
  }
}
