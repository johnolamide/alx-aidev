// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Poll types
export interface Poll {
  id: string;
  title: string;
  description?: string;
  created_by: string;
  created_at: Date;
  expires_at?: Date;
  is_public: boolean;
  allow_multiple_votes: boolean;
  total_votes: number;
  updated_at: Date;
  poll_options?: PollOption[];
  votes?: Vote[];
  creator?: {
    id: string;
    email?: string;
  } | undefined;
  userVote?: {
    id: string;
    option_id: string;
  } | null;
}

export interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  vote_count: number;
  created_at: Date;
}

export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id?: string;
  anonymous_id?: string;
  created_at: Date;
  ip_address?: string;
  user_agent?: string;
}

// Form types
export interface CreatePollData {
  title: string;
  description?: string;
  options: string[];
  isPublic: boolean;
  allowMultipleVotes: boolean;
  expiresAt?: Date;
  expirationDays?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Dashboard types
export interface DashboardStats {
  totalPolls: number;
  totalVotes: number;
  recentPolls: Poll[];
  popularPolls: Poll[];
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Session {
  user: AuthUser;
  expires: string;
}
