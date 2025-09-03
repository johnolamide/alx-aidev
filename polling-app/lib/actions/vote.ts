'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function voteOnPoll(formData: FormData) {
  const supabase = await createClient();

  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // Extract form data
    const pollId = formData.get('pollId') as string;
    const optionId = formData.get('optionId') as string;

    // Validate required fields
    if (!pollId || !optionId) {
      throw new Error('Poll ID and option ID are required');
    }

    // Check if poll exists and is public
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('id, is_public, allow_multiple_votes, expires_at')
      .eq('id', pollId)
      .single();

    if (pollError || !poll) {
      throw new Error('Poll not found');
    }

    if (!poll.is_public) {
      throw new Error('This poll is not public');
    }

    // Check if poll has expired
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      throw new Error('This poll has expired');
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
        throw new Error('You have already voted on this poll');
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
      throw new Error('Invalid option selected');
    }

    // Insert the vote
    const voteData: any = {
      poll_id: pollId,
      option_id: optionId,
    };

    if (user) {
      voteData.user_id = user.id;
    } else {
      // For anonymous votes, use IP address as identifier
      // In a real app, you'd want to use a more sophisticated anonymous ID system
      const ipAddress = 'anonymous'; // Placeholder - in production, get from request headers
      voteData.anonymous_id = ipAddress;
    }

    const { error: voteError } = await supabase
      .from('votes')
      .insert(voteData);

    if (voteError) {
      console.error('Vote insertion error:', voteError);
      throw new Error('Failed to submit vote');
    }

    // Revalidate the poll page to show updated results
    revalidatePath(`/polls/${pollId}`);

  } catch (error) {
    console.error('Voting error:', error);
    // In a real app, you'd want to show this error to the user
    // For now, we'll just log it and continue
  }
}
