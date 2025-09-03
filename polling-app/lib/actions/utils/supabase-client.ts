// Centralized Supabase client creation
import { createClient } from '@/lib/supabase/server';

export class SupabaseClient {
  private static instance: any = null;

  static async getClient() {
    if (!this.instance) {
      this.instance = await createClient();
    }
    return this.instance;
  }

  static reset() {
    this.instance = null;
  }
}

export const getSupabaseClient = () => SupabaseClient.getClient();
