import { createPoll, updatePoll, deletePoll } from '../create-poll';

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));

// Mock Next.js functions
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(() => ({
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(),
      })),
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn(),
      })),
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn(),
      })),
    })),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
      })),
    })),
  })),
};

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('createPoll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockResolvedValue(mockSupabase as any);
  });

  it('should create a poll successfully', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockPoll = { id: 'poll-123', title: 'Test Poll' };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockSupabase.from.mockReturnValue({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: mockPoll, error: null }),
        })),
      })),
    } as any);

    const formData = new FormData();
    formData.append('title', 'Test Poll');
    formData.append('description', 'Test Description');
    formData.append('isPublic', 'true');
    formData.append('allowMultipleVotes', 'false');
    formData.append('expirationDays', '7');
    formData.append('options[0]', 'Option 1');
    formData.append('options[1]', 'Option 2');

    await createPoll(formData);

    expect(mockSupabase.from).toHaveBeenCalledWith('polls');
    expect(mockSupabase.from).toHaveBeenCalledWith('poll_options');
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
    expect(revalidatePath).toHaveBeenCalledWith('/polls');
    expect(redirect).toHaveBeenCalledWith('/polls?success=true');
  });

  it('should throw error if user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: new Error('Not authenticated') });

    const formData = new FormData();
    formData.append('title', 'Test Poll');

    await expect(createPoll(formData)).rejects.toThrow('You must be logged in to create a poll');
  });

  it('should throw error if title is missing', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    const formData = new FormData();
    formData.append('title', '');

    await expect(createPoll(formData)).rejects.toThrow('Poll title is required');
  });

  it('should throw error if less than 2 options provided', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    const formData = new FormData();
    formData.append('title', 'Test Poll');
    formData.append('options[0]', 'Option 1');

    await expect(createPoll(formData)).rejects.toThrow('At least 2 options are required');
  });

  it('should handle poll creation failure', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    mockSupabase.from.mockReturnValue({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: null, error: new Error('Database error') }),
        })),
      })),
    } as any);

    const formData = new FormData();
    formData.append('title', 'Test Poll');
    formData.append('options[0]', 'Option 1');
    formData.append('options[1]', 'Option 2');

    await expect(createPoll(formData)).rejects.toThrow('Failed to create poll');
  });
});

describe('updatePoll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockResolvedValue(mockSupabase as any);
  });

  it('should update a poll successfully', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockPoll = { created_by: 'user-123' };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: mockPoll, error: null }),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({ error: null }),
        })),
      })),
    } as any);

    const formData = new FormData();
    formData.append('pollId', 'poll-123');
    formData.append('title', 'Updated Poll');
    formData.append('isPublic', 'true');

    await updatePoll(formData);

    expect(mockSupabase.from).toHaveBeenCalledWith('polls');
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
    expect(revalidatePath).toHaveBeenCalledWith('/polls/poll-123');
  });

  it('should throw error if user does not own the poll', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockPoll = { created_by: 'different-user' };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: mockPoll, error: null }),
        })),
      })),
    } as any);

    const formData = new FormData();
    formData.append('pollId', 'poll-123');
    formData.append('title', 'Updated Poll');

    await expect(updatePoll(formData)).rejects.toThrow('You can only edit your own polls');
  });
});

describe('deletePoll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockResolvedValue(mockSupabase as any);
  });

  it('should delete a poll successfully', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockPoll = { created_by: 'user-123' };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: mockPoll, error: null }),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({ error: null }),
        })),
      })),
    } as any);

    await deletePoll('poll-123');

    expect(mockSupabase.from).toHaveBeenCalledWith('polls');
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
    expect(revalidatePath).toHaveBeenCalledWith('/polls');
  });

  it('should throw error if user does not own the poll', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockPoll = { created_by: 'different-user' };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: mockPoll, error: null }),
        })),
      })),
    } as any);

    await expect(deletePoll('poll-123')).rejects.toThrow('You can only delete your own polls');
  });
});
