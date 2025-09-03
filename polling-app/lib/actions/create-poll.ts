'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPoll(formData: FormData) {
  const supabase = await createClient();

  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('You must be logged in to create a poll');
    }

    // Extract form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const isPublic = formData.get('isPublic') === 'true';
    const allowMultipleVotes = formData.get('allowMultipleVotes') === 'true';
    const expirationDays = formData.get('expirationDays') as string;

    // Validate required fields
    if (!title || title.trim().length === 0) {
      throw new Error('Poll title is required');
    }

    if (title.length > 200) {
      throw new Error('Poll title must be less than 200 characters');
    }

    if (description && description.length > 1000) {
      throw new Error('Poll description must be less than 1000 characters');
    }

    // Extract options from form data
    const options: string[] = [];
    for (let i = 0; i < 4; i++) {
      const option = formData.get(`options[${i}]`) as string;
      if (option && option.trim().length > 0) {
        if (option.length > 200) {
          throw new Error(`Option ${i + 1} must be less than 200 characters`);
        }
        options.push(option.trim());
      }
    }

    // Validate options
    if (options.length < 2) {
      throw new Error('At least 2 options are required');
    }

    if (options.length > 10) {
      throw new Error('Maximum 10 options allowed');
    }

    // Check for duplicate options
    const uniqueOptions = new Set(options.map(opt => opt.toLowerCase()));
    if (uniqueOptions.size !== options.length) {
      throw new Error('Duplicate options are not allowed');
    }

    // Calculate expiration date
    let expiresAt: Date | null = null;
    if (expirationDays && expirationDays !== 'never') {
      const days = parseInt(expirationDays);
      if (!isNaN(days) && days > 0 && days <= 365) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);
      }
    }

    // Start a transaction to create poll and options
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: title.trim(),
        description: description ? description.trim() : null,
        created_by: user.id,
        is_public: isPublic,
        allow_multiple_votes: allowMultipleVotes,
        expires_at: expiresAt?.toISOString() || null,
      })
      .select()
      .single();

    if (pollError) {
      console.error('Poll creation error:', pollError);
      throw new Error('Failed to create poll');
    }

    // Create poll options
    const pollOptions = options.map(optionText => ({
      poll_id: poll.id,
      option_text: optionText,
    }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(pollOptions);

    if (optionsError) {
      console.error('Options creation error:', optionsError);
      // If options creation fails, we should clean up the poll
      await supabase.from('polls').delete().eq('id', poll.id);
      throw new Error('Failed to create poll options');
    }

    // Revalidate the dashboard page to show the new poll
    revalidatePath('/dashboard');
    revalidatePath('/polls');

    // Redirect to the polls page with success message
    redirect('/polls?success=true');

  } catch (error) {
    console.error('Poll creation error:', error);
    throw error;
  }
}

export async function updatePoll(formData: FormData) {
  const supabase = await createClient();

  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('You must be logged in to update a poll');
    }

    const pollId = formData.get('pollId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const isPublic = formData.get('isPublic') === 'true';
    const allowMultipleVotes = formData.get('allowMultipleVotes') === 'true';
    const expirationDays = formData.get('expirationDays') as string;

    // Validate required fields
    if (!pollId || !title || title.trim().length === 0) {
      throw new Error('Poll ID and title are required');
    }

    // Check if user owns the poll
    const { data: existingPoll, error: fetchError } = await supabase
      .from('polls')
      .select('created_by')
      .eq('id', pollId)
      .single();

    if (fetchError || !existingPoll) {
      throw new Error('Poll not found');
    }

    if (existingPoll.created_by !== user.id) {
      throw new Error('You can only edit your own polls');
    }

    // Calculate expiration date
    let expiresAt: Date | null = null;
    if (expirationDays && expirationDays !== 'never') {
      const days = parseInt(expirationDays);
      if (!isNaN(days) && days > 0 && days <= 365) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);
      }
    }

    // Update the poll
    const { error: updateError } = await supabase
      .from('polls')
      .update({
        title: title.trim(),
        description: description ? description.trim() : null,
        is_public: isPublic,
        allow_multiple_votes: allowMultipleVotes,
        expires_at: expiresAt?.toISOString() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pollId)
      .eq('created_by', user.id);

    if (updateError) {
      console.error('Poll update error:', updateError);
      throw new Error('Failed to update poll');
    }

    // Revalidate the dashboard and poll pages
    revalidatePath('/dashboard');
    revalidatePath(`/polls/${pollId}`);

  } catch (error) {
    console.error('Poll update error:', error);
    throw error;
  }
}

export async function deletePoll(pollId: string) {
  const supabase = await createClient();

  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('You must be logged in to delete a poll');
    }

    // Check if user owns the poll
    const { data: existingPoll, error: fetchError } = await supabase
      .from('polls')
      .select('created_by')
      .eq('id', pollId)
      .single();

    if (fetchError || !existingPoll) {
      throw new Error('Poll not found');
    }

    if (existingPoll.created_by !== user.id) {
      throw new Error('You can only delete your own polls');
    }

    // Delete the poll (cascade will handle options and votes)
    const { error: deleteError } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)
      .eq('created_by', user.id);

    if (deleteError) {
      console.error('Poll deletion error:', deleteError);
      throw new Error('Failed to delete poll');
    }

    // Revalidate the dashboard and polls pages
    revalidatePath('/dashboard');
    revalidatePath('/polls');

  } catch (error) {
    console.error('Poll deletion error:', error);
    throw error;
  }
}
