'use server';

import { PollOperations } from './utils/poll-operations';
import { ErrorUtils } from './utils/errors';

export async function getUserPolls() {
  try {
    return await PollOperations.getUserPolls();
  } catch (error) {
    console.error('Error fetching user polls:', error);
    throw error;
  }
}

export async function getPublicPolls() {
  try {
    return await PollOperations.getPublicPolls();
  } catch (error) {
    console.error('Error fetching public polls:', error);
    throw error;
  }
}

export async function getPollById(pollId: string) {
  try {
    return await PollOperations.getPollById(pollId);
  } catch (error) {
    console.error('Error fetching poll by ID:', error);
    throw error;
  }
}
