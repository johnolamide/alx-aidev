'use server';

import { createClient } from '@/lib/supabase/server';

export async function getUserPolls() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('You must be logged in to view polls');
  }

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
    console.error('Error fetching polls:', error);
    throw new Error('Failed to fetch polls');
  }

  // For user polls, we know the creator is the current user
  const pollsWithCreators = (polls || []).map(poll => ({
    ...poll,
    creator: { id: user.id, email: user.email }
  }));

  return pollsWithCreators;
}

export async function getPublicPolls() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

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
    console.error('Error fetching public polls:', error);
    throw new Error('Failed to fetch polls');
  }

  // Set creator info and user vote info for polls
  const pollsWithInfo = await Promise.all((polls || []).map(async (poll) => {
    let userVote = null;
    if (user) {
      const { data: vote } = await supabase
        .from('votes')
        .select('id, option_id')
        .eq('poll_id', poll.id)
        .eq('user_id', user.id)
        .single();

      userVote = vote;
    }

    return {
      ...poll,
      creator: user && user.id === poll.created_by
        ? { id: user.id, email: user.email }
        : undefined,
      userVote
    };
  }));

  return pollsWithInfo;
}

export async function getPollById(pollId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
    console.error('Error fetching poll:', error);
    throw new Error('Poll not found');
  }

  // Get user's vote if they exist
  let userVote = null;
  if (user) {
    const { data: vote } = await supabase
      .from('votes')
      .select('id, option_id')
      .eq('poll_id', pollId)
      .eq('user_id', user.id)
      .single();

    userVote = vote;
  }

  // For single poll, try to get current user info if they're the creator
  const creator = user && user.id === poll.created_by
    ? { id: user.id, email: user.email }
    : undefined;

  return {
    ...poll,
    creator,
    userVote
  };
}
