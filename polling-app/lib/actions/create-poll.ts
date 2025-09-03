'use server';

import { CreatePollData } from '@/lib/types';
import { PollOperations } from './utils/poll-operations';
import { ValidationUtils } from './utils/validation';
import { ErrorUtils } from './utils/errors';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPoll(formData: FormData) {
  try {
    // Extract form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const isPublic = formData.get('isPublic') === 'true';
    const allowMultipleVotes = formData.get('allowMultipleVotes') === 'true';
    const expirationDays = formData.get('expirationDays') as string;

    // Extract options from form data
    const options: string[] = [];
    for (let i = 0; i < 4; i++) {
      const option = formData.get(`options[${i}]`) as string;
      if (option && option.trim().length > 0) {
        options.push(option.trim());
      }
    }

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

    // Revalidate and redirect
    revalidatePath('/dashboard');
    revalidatePath('/polls');
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
