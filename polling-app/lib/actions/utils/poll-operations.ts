import { Poll, PollOption, Vote, CreatePollData } from '@/lib/types';
import { getSupabaseClient } from './supabase-client';
import { AuthUtils } from './auth';
import { ValidationUtils } from './validation';
import { ErrorUtils, Errors } from './errors';

export interface PollWithDetails extends Poll {
  poll_options: PollOption[];
  userVote?: Vote | null;
}

export class PollOperations {
  static async createPoll(data: CreatePollData): Promise<PollWithDetails> {
    const user = await AuthUtils.requireAuth();

    // Validate input data
    const validation = ValidationUtils.validateCreatePollData(data);
    if (!validation.isValid) {
      throw ErrorUtils.handleValidationError(validation.errors);
    }

    const supabase = await getSupabaseClient();

    // Calculate expiration date
    let expiresAt: string | null = null;
    if (data.expirationDays && data.expirationDays !== 'never') {
      const days = parseInt(data.expirationDays);
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + days);
      expiresAt = expirationDate.toISOString();
    }

    // Create poll
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

    // Create poll options
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
      // Clean up the poll if options creation fails
      await supabase.from('polls').delete().eq('id', poll.id);
      throw ErrorUtils.handleDatabaseError(optionsError);
    }

    // Fetch the complete poll with options
    return this.getPollById(poll.id);
  }

  static async getPollById(pollId: string): Promise<PollWithDetails> {
    const validation = ValidationUtils.validatePollId(pollId);
    if (!validation.isValid) {
      throw ErrorUtils.handleValidationError(validation.errors);
    }

    const supabase = await getSupabaseClient();
    const { user } = await AuthUtils.getCurrentUser();

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

    // Set creator info
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

  static async castVote(pollId: string, optionId: string): Promise<Vote> {
    const validation = ValidationUtils.validateVoteData(pollId, optionId);
    if (!validation.isValid) {
      throw ErrorUtils.handleValidationError(validation.errors);
    }

    const supabase = await getSupabaseClient();
    const { user } = await AuthUtils.getCurrentUser();

    // Check if poll exists and is accessible
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('id, is_public, allow_multiple_votes, expires_at')
      .eq('id', pollId)
      .single();

    if (pollError || !poll) {
      throw Errors.POLL_NOT_FOUND;
    }

    if (!poll.is_public) {
      throw Errors.POLL_PRIVATE;
    }

    // Check if poll has expired
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      throw Errors.POLL_EXPIRED;
    }

    // Check if user has already voted (if not allowing multiple votes)
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

    // Check if option belongs to the poll
    const { data: option, error: optionError } = await supabase
      .from('poll_options')
      .select('id')
      .eq('id', optionId)
      .eq('poll_id', pollId)
      .single();

    if (optionError || !option) {
      throw Errors.OPTION_NOT_FOUND;
    }

    // Insert the vote
    const voteData: any = {
      poll_id: pollId,
      option_id: optionId,
    };

    if (user) {
      voteData.user_id = user.id;
    } else {
      // For anonymous votes
      voteData.anonymous_id = 'anonymous';
    }

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
