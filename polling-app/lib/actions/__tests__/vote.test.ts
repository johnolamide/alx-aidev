import { submitVote } from '../vote';

// Mock the utility modules
jest.mock('../utils/poll-operations', () => ({
  PollOperations: {
    castVote: jest.fn(),
  },
}));

jest.mock('../utils/errors', () => ({
  ErrorUtils: {
    createError: jest.fn(),
  },
}));

import { PollOperations } from '../utils/poll-operations';
import { ErrorUtils } from '../utils/errors';

const mockCastVote = PollOperations.castVote as jest.MockedFunction<typeof PollOperations.castVote>;
const mockCreateError = ErrorUtils.createError as jest.MockedFunction<typeof ErrorUtils.createError>;

describe('submitVote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully submit a vote', async () => {
    const mockResult = { success: true };
    mockCastVote.mockResolvedValue(mockResult as any);

    const formData = new FormData();
    formData.append('pollId', 'poll-1');
    formData.append('optionId', 'option-1');

    const result = await submitVote(formData);

    expect(mockCastVote).toHaveBeenCalledWith('poll-1', 'option-1');
    expect(result).toEqual(mockResult);
  });

  it('should throw error if pollId is missing', async () => {
    const error = { code: 'VALIDATION_ERROR', message: 'Missing required fields' };
    mockCreateError.mockReturnValue(error as any);

    const formData = new FormData();
    formData.append('optionId', 'option-1');

    await expect(submitVote(formData)).rejects.toEqual(error);
  });

  it('should throw error if optionId is missing', async () => {
    const error = { code: 'VALIDATION_ERROR', message: 'Missing required fields' };
    mockCreateError.mockReturnValue(error as any);

    const formData = new FormData();
    formData.append('pollId', 'poll-1');

    await expect(submitVote(formData)).rejects.toEqual(error);
  });

  it('should handle poll operations errors', async () => {
    const error = new Error('Poll operation failed');
    mockCastVote.mockRejectedValue(error);

    const formData = new FormData();
    formData.append('pollId', 'poll-1');
    formData.append('optionId', 'option-1');

    await expect(submitVote(formData)).rejects.toThrow('Poll operation failed');
  });
});
