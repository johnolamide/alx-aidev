import { getUserPolls, getPublicPolls, getPollById } from '../get-polls';

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@/lib/supabase/server';

const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(),
};

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('getUserPolls', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Create a flexible mock that can handle method chaining
    const createMockQuery = (result: any = { data: null, error: null }): any => ({
      select: jest.fn(() => createMockQuery(result)),
      eq: jest.fn(() => createMockQuery(result)),
      order: jest.fn(() => createMockQuery(result)),
      single: jest.fn().mockResolvedValue(result),
    });

    mockSupabase.from.mockImplementation(() => createMockQuery());
    mockCreateClient.mockResolvedValue(mockSupabase as any);
  });

  it('should fetch user polls successfully', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockPolls = [
      {
        id: 'poll-1',
        title: 'Test Poll 1',
        created_by: 'user-123',
        poll_options: [],
      },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn().mockResolvedValue({ data: mockPolls, error: null }),
        })),
      })),
    } as any);

    const result = await getUserPolls();

    expect(result).toEqual([
      {
        ...mockPolls[0],
        creator: { id: mockUser.id, email: mockUser.email },
      },
    ]);
    expect(mockSupabase.from).toHaveBeenCalledWith('polls');
  });

  it('should throw error if user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: new Error('Not authenticated') });

    await expect(getUserPolls()).rejects.toThrow('You must be logged in to view polls');
  });

  it('should handle database errors', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn().mockResolvedValue({ data: null, error: new Error('Database error') }),
        })),
      })),
    } as any);

    await expect(getUserPolls()).rejects.toThrow('Failed to fetch polls');
  });
});

describe('getPublicPolls', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Create a flexible mock that can handle method chaining
    const createMockQuery = (result: any = { data: null, error: null }): any => ({
      select: jest.fn(() => createMockQuery(result)),
      eq: jest.fn(() => createMockQuery(result)),
      order: jest.fn(() => createMockQuery(result)),
      single: jest.fn().mockResolvedValue(result),
    });

    mockSupabase.from.mockImplementation(() => createMockQuery());
    mockCreateClient.mockResolvedValue(mockSupabase as any);
  });

  it('should fetch public polls successfully', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockPolls = [
      {
        id: 'poll-1',
        title: 'Public Poll 1',
        created_by: 'user-123',
        poll_options: [],
      },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockSupabase.from.mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn().mockResolvedValue({ data: mockPolls, error: null }),
        })),
      })),
    } as any).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({ data: null, error: null }),
            })),
          })),
        })),
      })),
    } as any);

    const result = await getPublicPolls();

    expect(result).toEqual([
      {
        ...mockPolls[0],
        creator: { id: mockUser.id, email: mockUser.email },
        userVote: null,
      },
    ]);
  });

  it('should handle polls without user authentication', async () => {
    const mockPolls = [
      {
        id: 'poll-1',
        title: 'Public Poll 1',
        created_by: 'different-user',
        poll_options: [],
      },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn().mockResolvedValue({ data: mockPolls, error: null }),
        })),
      })),
    } as any);

    const result = await getPublicPolls();

    expect(result).toEqual([
      {
        ...mockPolls[0],
        creator: undefined,
        userVote: null,
      },
    ]);
  });

  it('should handle database errors', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn().mockResolvedValue({ data: null, error: new Error('Database error') }),
        })),
      })),
    } as any);

    await expect(getPublicPolls()).rejects.toThrow('Failed to fetch polls');
  });
});

describe('getPollById', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Create a flexible mock that can handle method chaining
    const createMockQuery = (result: any = { data: null, error: null }): any => ({
      select: jest.fn(() => createMockQuery(result)),
      eq: jest.fn(() => createMockQuery(result)),
      order: jest.fn(() => createMockQuery(result)),
      single: jest.fn().mockResolvedValue(result),
    });

    mockSupabase.from.mockImplementation(() => createMockQuery());
    mockCreateClient.mockResolvedValue(mockSupabase as any);
  });

  it('should fetch a poll by ID successfully', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockPoll = {
      id: 'poll-1',
      title: 'Test Poll',
      created_by: 'user-123',
      poll_options: [],
    };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockSupabase.from.mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: mockPoll, error: null }),
        })),
      })),
    } as any).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({ data: null, error: null }),
            })),
          })),
        })),
      })),
    } as any);

    const result = await getPollById('poll-1');

    expect(result).toEqual({
      ...mockPoll,
      creator: { id: mockUser.id, email: mockUser.email },
      userVote: null,
    });
  });

  it('should handle poll not found', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
        })),
      })),
    } as any);

    await expect(getPollById('non-existent-poll')).rejects.toThrow('Poll not found');
  });

  it('should handle user vote lookup', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockPoll = {
      id: 'poll-1',
      title: 'Test Poll',
      created_by: 'user-123',
      poll_options: [],
    };
    const mockVote = { id: 'vote-1', option_id: 'option-1' };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockSupabase.from.mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: mockPoll, error: null }),
        })),
      })),
    } as any).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({ data: mockVote, error: null }),
            })),
          })),
        })),
      })),
    } as any);

    const result = await getPollById('poll-1');

    expect(result.userVote).toEqual(mockVote);
  });
});
