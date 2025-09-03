import { getUserPolls, getPublicPolls, getPollById } from '../get-polls';

// Mock the utility modules
jest.mock('../utils/poll-operations', () => ({
  PollOperations: {
    getUserPolls: jest.fn(),
    getPublicPolls: jest.fn(),
    getPollById: jest.fn(),
  },
}));

import { PollOperations } from '../utils/poll-operations';

const mockGetUserPolls = PollOperations.getUserPolls as jest.MockedFunction<typeof PollOperations.getUserPolls>;
const mockGetPublicPolls = PollOperations.getPublicPolls as jest.MockedFunction<typeof PollOperations.getPublicPolls>;
const mockGetPollById = PollOperations.getPollById as jest.MockedFunction<typeof PollOperations.getPollById>;

describe('getUserPolls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch user polls successfully', async () => {
    const mockPolls = [
      {
        id: 'poll-1',
        title: 'Test Poll 1',
        created_by: 'user-123',
        created_at: new Date(),
        is_public: true,
        allow_multiple_votes: false,
        total_votes: 0,
        updated_at: new Date(),
        poll_options: [],
      },
    ];

    mockGetUserPolls.mockResolvedValue(mockPolls);

    const result = await getUserPolls();

    expect(mockGetUserPolls).toHaveBeenCalled();
    expect(result).toEqual(mockPolls);
  });

  it('should handle errors', async () => {
    const error = new Error('Database error');
    mockGetUserPolls.mockRejectedValue(error);

    await expect(getUserPolls()).rejects.toThrow('Database error');
  });
});

describe('getPublicPolls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch public polls successfully', async () => {
    const mockPolls = [
      {
        id: 'poll-1',
        title: 'Public Poll 1',
        created_by: 'user-123',
        created_at: new Date(),
        is_public: true,
        allow_multiple_votes: false,
        total_votes: 0,
        updated_at: new Date(),
        poll_options: [],
      },
    ];

    mockGetPublicPolls.mockResolvedValue(mockPolls);

    const result = await getPublicPolls();

    expect(mockGetPublicPolls).toHaveBeenCalled();
    expect(result).toEqual(mockPolls);
  });

  it('should handle errors', async () => {
    const error = new Error('Database error');
    mockGetPublicPolls.mockRejectedValue(error);

    await expect(getPublicPolls()).rejects.toThrow('Database error');
  });
});

describe('getPollById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch poll by ID successfully', async () => {
    const mockPoll = {
      id: 'poll-1',
      title: 'Test Poll',
      created_by: 'user-123',
      created_at: new Date(),
      is_public: true,
      allow_multiple_votes: false,
      total_votes: 0,
      updated_at: new Date(),
      poll_options: [],
    };

    mockGetPollById.mockResolvedValue(mockPoll);

    const result = await getPollById('poll-1');

    expect(mockGetPollById).toHaveBeenCalledWith('poll-1');
    expect(result).toEqual(mockPoll);
  });

  it('should handle errors', async () => {
    const error = new Error('Poll not found');
    mockGetPollById.mockRejectedValue(error);

    await expect(getPollById('non-existent')).rejects.toThrow('Poll not found');
  });
});
