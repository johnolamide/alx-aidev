'use server';

import { PollOperations } from './utils/poll-operations';
import { ErrorUtils } from './utils/errors';

/**
 * Server Action: Submit Vote
 * Handles vote submission from poll forms
 *
 * This action:
 * - Validates poll and option IDs from form data
 * - Submits vote using PollOperations.castVote
 * - Handles authentication and authorization
 * - Manages anonymous voting for public polls
 *
 * @param formData - FormData containing pollId and optionId
 * @throws Error if validation fails or voting is not allowed
 */
export async function submitVote(formData: FormData): Promise<void> {
  try {
    // Extract required fields from form submission
    const pollId = formData.get('pollId') as string;
    const optionId = formData.get('optionId') as string;

    // Basic validation of required fields
    if (!pollId || !optionId) {
      throw ErrorUtils.createError('Missing required fields', 'VALIDATION_ERROR');
    }

    // Submit vote using poll operations utility
    await PollOperations.castVote(pollId, optionId);
  } catch (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
}
