'use server';

import { CreatePollData } from '@/lib/types';
import { PollOperations } from './utils/poll-operations';
import { ValidationUtils } from './utils/validation';
import { ErrorUtils } from './utils/errors';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Server Action: Create Poll
 * Handles poll creation from form submissions
 *
 * This action:
 * - Extracts and validates form data
 * - Creates a new poll with options using PollOperations
 * - Revalidates relevant cache paths
 * - Redirects to polls page on success
 *
 * @param formData - FormData object containing poll creation data
 * @throws Error if poll creation fails or validation errors occur
 */
export async function createPoll(formData: FormData) {
  try {
    // Extract form data from the submitted form
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const isPublic = formData.get('isPublic') === 'true';
    const allowMultipleVotes = formData.get('allowMultipleVotes') === 'true';
    const expirationDays = formData.get('expirationDays') as string;

    // Extract poll options from form data (supports up to 4 options)
    const options: string[] = [];
    for (let i = 0; i < 4; i++) {
      const option = formData.get(`options[${i}]`) as string;
      if (option && option.trim().length > 0) {
        options.push(option.trim());
      }
    }

    // Structure the poll data for creation
    const pollData: CreatePollData = {
      title,
      description,
      options,
      isPublic,
      allowMultipleVotes,
      expirationDays,
    };

    // Create poll using the operations utility
    await PollOperations.createPoll(pollData);

    // Revalidate cache for dashboard and polls pages
    revalidatePath('/dashboard');
    revalidatePath('/polls');

    // Redirect to polls page with success indicator
    redirect('/polls?success=true');

  } catch (error) {
    console.error('Poll creation error:', error);
    throw error;
  }
}

export async function updatePoll(formData: FormData) {
  try {
    const pollId = formData.get('pollId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const isPublic = formData.get('isPublic') === 'true';
    const allowMultipleVotes = formData.get('allowMultipleVotes') === 'true';
    const expirationDays = formData.get('expirationDays') as string;

    const updateData: Partial<CreatePollData> = {
      title,
      description,
      isPublic,
      allowMultipleVotes,
      expirationDays,
    };

    // Update poll using the operations utility
    await PollOperations.updatePoll(pollId, updateData);

    // Revalidate
    revalidatePath('/dashboard');
    revalidatePath(`/polls/${pollId}`);

  } catch (error) {
    console.error('Poll update error:', error);
    throw error;
  }
}

export async function deletePoll(pollId: string) {
  try {
    // Delete poll using the operations utility
    await PollOperations.deletePoll(pollId);

    // Revalidate
    revalidatePath('/dashboard');
    revalidatePath('/polls');

  } catch (error) {
    console.error('Poll deletion error:', error);
    throw error;
  }
}
