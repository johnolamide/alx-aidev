import { AuthUser } from '@/lib/types';
import { getSupabaseClient } from './supabase-client';

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
}

export class AuthUtils {
  static async getCurrentUser(): Promise<AuthResult> {
    try {
      const supabase = await getSupabaseClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        return { user: null, error: error.message };
      }

      if (!user) {
        return { user: null, error: 'User not authenticated' };
      }

      return {
        user: {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || '',
          avatar: user.user_metadata?.avatar_url,
        },
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  }

  static async requireAuth(): Promise<AuthUser> {
    const { user, error } = await this.getCurrentUser();

    if (error || !user) {
      throw new Error(error || 'Authentication required');
    }

    return user;
  }
}
