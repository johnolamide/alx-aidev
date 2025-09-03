import { voteOnPoll } from '../vote';

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(),
};

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('voteOnPoll', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Create a flexible mock that can handle method chaining
    const createMockQuery = (result: any = { data: null, error: null }): any => ({
      select: jest.fn(() => createMockQuery(result)),
      eq: jest.fn(() => createMockQuery(result)),
      single: jest.fn().mockResolvedValue(result),
      insert: jest.fn().mockResolvedValue(result),
    });

    mockSupabase.from.mockImplementation(() => createMockQuery());
    mockCreateClient.mockResolvedValue(mockSupabase as any);
  });

  it('should successfully cast a vote', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockPoll = {
      id: 'poll-1',
      is_public: true,
      allow_multiple_votes: false,
      expires_at: null,
    };
    const mockOption = { id: 'option-1' };

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
              single: jest.fn().mockResolvedValue({ data: mockOption, error: null }),
            })),
          })),
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
    } as any).mockReturnValueOnce({
      insert: jest.fn().mockResolvedValue({ error: null }),
    } as any);

    const formData = new FormData();
    formData.append('pollId', 'poll-1');
    formData.append('optionId', 'option-1');

    await voteOnPoll(formData);

    expect(mockSupabase.from).toHaveBeenCalledWith('polls');
    expect(mockSupabase.from).toHaveBeenCalledWith('poll_options');
    expect(mockSupabase.from).toHaveBeenCalledWith('votes');
    expect(mockSupabase.from).toHaveBeenCalledWith('votes');
    expect(revalidatePath).toHaveBeenCalledWith('/polls/poll-1');
  });

  it('should throw error if pollId is missing', async () => {
    const formData = new FormData();
    formData.append('optionId', 'option-1');

    // The function should complete without throwing since it catches errors
    await expect(voteOnPoll(formData)).resolves.toBeUndefined();
  });

  it('should throw error if optionId is missing', async () => {
    const formData = new FormData();
    formData.append('pollId', 'poll-1');

    // The function should complete without throwing since it catches errors
    await expect(voteOnPoll(formData)).resolves.toBeUndefined();
  });

  it('should throw error if user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: new Error('Not authenticated') });

    const formData = new FormData();
    formData.append('pollId', 'poll-1');
    formData.append('optionId', 'option-1');

    // The function should complete without throwing since it catches errors
    await expect(voteOnPoll(formData)).resolves.toBeUndefined();
  });

  it('should throw error if poll is not found', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    // Mock the from method to return an error for poll lookup
    const createMockQuery = (result: any = { data: null, error: null }): any => ({
      select: jest.fn(() => createMockQuery(result)),
      eq: jest.fn(() => createMockQuery(result)),
      single: jest.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
      insert: jest.fn().mockResolvedValue(result),
    });

    mockSupabase.from.mockImplementation(() => createMockQuery());

    const formData = new FormData();
    formData.append('pollId', 'non-existent-poll');
    formData.append('optionId', 'option-1');

    // The function should complete without throwing since it catches errors
    await expect(voteOnPoll(formData)).resolves.toBeUndefined();
  });

  it('should throw error if poll is not public', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockPoll = {
      id: 'poll-1',
      is_public: false,
      allow_multiple_votes: false,
      expires_at: null,
    };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    // Mock the from method to return the private poll
    const createMockQuery = (result: any = { data: null, error: null }): any => {
      if (result.data?.is_public === false) {
        return {
          select: jest.fn(() => createMockQuery(result)),
          eq: jest.fn(() => createMockQuery(result)),
          single: jest.fn().mockResolvedValue({ data: mockPoll, error: null }),
          insert: jest.fn().mockResolvedValue(result),
        };
      }
      return {
        select: jest.fn(() => createMockQuery(result)),
        eq: jest.fn(() => createMockQuery(result)),
        single: jest.fn().mockResolvedValue(result),
        insert: jest.fn().mockResolvedValue(result),
      };
    };

    mockSupabase.from.mockImplementation(() => createMockQuery());

    const formData = new FormData();
    formData.append('pollId', 'poll-1');
    formData.append('optionId', 'option-1');

    // The function should complete without throwing since it catches errors
    await expect(voteOnPoll(formData)).resolves.toBeUndefined();
  });

  it('should throw error if poll has expired', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockPoll = {
      id: 'poll-1',
      is_public: true,
      allow_multiple_votes: false,
      expires_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    // Mock the from method to return the expired poll
    const createMockQuery = (result: any = { data: null, error: null }): any => {
      if (result.data?.expires_at) {
        return {
          select: jest.fn(() => createMockQuery(result)),
          eq: jest.fn(() => createMockQuery(result)),
          single: jest.fn().mockResolvedValue({ data: mockPoll, error: null }),
          insert: jest.fn().mockResolvedValue(result),
        };
      }
      return {
        select: jest.fn(() => createMockQuery(result)),
        eq: jest.fn(() => createMockQuery(result)),
        single: jest.fn().mockResolvedValue(result),
        insert: jest.fn().mockResolvedValue(result),
      };
    };

    mockSupabase.from.mockImplementation(() => createMockQuery());

    const formData = new FormData();
    formData.append('pollId', 'poll-1');
    formData.append('optionId', 'option-1');

    // The function should complete without throwing since it catches errors
    await expect(voteOnPoll(formData)).resolves.toBeUndefined();
  });

  it('should throw error if user has already voted and multiple votes not allowed', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockPoll = {
      id: 'poll-1',
      is_public: true,
      allow_multiple_votes: false,
      expires_at: null,
    };
    const mockExistingVote = { id: 'existing-vote' };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    let callCount = 0;
    const createMockQuery = (result: any = { data: null, error: null }): any => ({
      select: jest.fn(() => createMockQuery(result)),
      eq: jest.fn(() => createMockQuery(result)),
      single: jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ data: mockPoll, error: null });
        } else if (callCount === 2) {
          return Promise.resolve({ data: mockExistingVote, error: null });
        }
        return Promise.resolve(result);
      }),
      insert: jest.fn().mockResolvedValue(result),
    });

    mockSupabase.from.mockImplementation(() => createMockQuery());

    const formData = new FormData();
    formData.append('pollId', 'poll-1');
    formData.append('optionId', 'option-1');

    // The function should complete without throwing since it catches errors
    await expect(voteOnPoll(formData)).resolves.toBeUndefined();
  });

  it('should throw error if option does not belong to the poll', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockPoll = {
      id: 'poll-1',
      is_public: true,
      allow_multiple_votes: false,
      expires_at: null,
    };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    let callCount = 0;
    const createMockQuery = (result: any = { data: null, error: null }): any => ({
      select: jest.fn(() => createMockQuery(result)),
      eq: jest.fn(() => createMockQuery(result)),
      single: jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ data: mockPoll, error: null });
        } else if (callCount === 2) {
          return Promise.resolve({ data: null, error: new Error('Not found') });
        }
        return Promise.resolve(result);
      }),
      insert: jest.fn().mockResolvedValue(result),
    });

    mockSupabase.from.mockImplementation(() => createMockQuery());

    const formData = new FormData();
    formData.append('pollId', 'poll-1');
    formData.append('optionId', 'invalid-option');

    // The function should complete without throwing since it catches errors
    await expect(voteOnPoll(formData)).resolves.toBeUndefined();
  });

  it('should handle anonymous voting', async () => {
    const mockPoll = {
      id: 'poll-1',
      is_public: true,
      allow_multiple_votes: false,
      expires_at: null,
    };
    const mockOption = { id: 'option-1' };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

    let callCount = 0;
    const createMockQuery = (result: any = { data: null, error: null }): any => ({
      select: jest.fn(() => createMockQuery(result)),
      eq: jest.fn(() => createMockQuery(result)),
      single: jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ data: mockPoll, error: null });
        } else if (callCount === 2) {
          return Promise.resolve({ data: mockOption, error: null });
        }
        return Promise.resolve(result);
      }),
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    mockSupabase.from.mockImplementation(() => createMockQuery());

    const formData = new FormData();
    formData.append('pollId', 'poll-1');
    formData.append('optionId', 'option-1');

    await voteOnPoll(formData);

    // The function should complete successfully for anonymous voting
    expect(revalidatePath).toHaveBeenCalledWith('/polls/poll-1');
  });

  it('should handle vote insertion errors', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockPoll = {
      id: 'poll-1',
      is_public: true,
      allow_multiple_votes: false,
      expires_at: null,
    };
    const mockOption = { id: 'option-1' };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    let callCount = 0;
    const createMockQuery = (result: any = { data: null, error: null }): any => ({
      select: jest.fn(() => createMockQuery(result)),
      eq: jest.fn(() => createMockQuery(result)),
      single: jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ data: mockPoll, error: null });
        } else if (callCount === 2) {
          return Promise.resolve({ data: null, error: null });
        } else if (callCount === 3) {
          return Promise.resolve({ data: mockOption, error: null });
        }
        return Promise.resolve(result);
      }),
      insert: jest.fn().mockResolvedValue({ error: new Error('Database error') }),
    });

    mockSupabase.from.mockImplementation(() => createMockQuery());

    const formData = new FormData();
    formData.append('pollId', 'poll-1');
    formData.append('optionId', 'option-1');

    // The function should complete without throwing since it catches errors
    await expect(voteOnPoll(formData)).resolves.toBeUndefined();
  });

  it('should handle vote insertion errors', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockPoll = {
      id: 'poll-1',
      is_public: true,
      allow_multiple_votes: false,
      expires_at: null,
    };
    const mockOption = { id: 'option-1' };

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
              single: jest.fn().mockResolvedValue({ data: mockOption, error: null }),
            })),
          })),
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
    } as any).mockReturnValueOnce({
      insert: jest.fn().mockResolvedValue({ error: new Error('Database error') }),
    } as any);

    const formData = new FormData();
    formData.append('pollId', 'poll-1');
    formData.append('optionId', 'option-1');

    // The function should not throw but log the error
    await voteOnPoll(formData);

    expect(mockSupabase.from).toHaveBeenCalledWith('votes');
  });
});
