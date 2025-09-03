'use server';

import { PollOperations } from './utils/poll-operations';
import { ErrorUtils } from './utils/errors';

export async function submitVote(formData: FormData): Promise<void> {
  try {
    const pollId = formData.get('pollId') as string;
    const optionId = formData.get('optionId') as string;

    if (!pollId || !optionId) {
      throw ErrorUtils.createError('Missing required fields', 'VALIDATION_ERROR');
    }

    await PollOperations.castVote(pollId, optionId);
  } catch (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
}
