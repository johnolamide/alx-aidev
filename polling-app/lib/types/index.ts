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
  creatorId: string;
  creator: User;
  options: PollOption[];
  votes: Vote[];
  isPublic: boolean;
  allowMultipleVotes: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PollOption {
  id: string;
  pollId: string;
  text: string;
  votes: Vote[];
  createdAt: Date;
}

export interface Vote {
  id: string;
  pollId: string;
  optionId: string;
  userId: string;
  user: User;
  createdAt: Date;
}

// Form types
export interface CreatePollData {
  title: string;
  description?: string;
  options: string[];
  isPublic: boolean;
  allowMultipleVotes: boolean;
  expiresAt?: Date;
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
