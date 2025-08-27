// Application constants and configuration
export const APP_CONFIG = {
  name: "PollApp",
  description: "Create, share, and analyze polls with real-time results",
  version: "1.0.0",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};

// Poll constants
export const POLL_LIMITS = {
  titleMaxLength: 200,
  descriptionMaxLength: 1000,
  maxOptions: 10,
  minOptions: 2,
  optionMaxLength: 100,
  maxPolls: 100, // Per user
};

// User constants
export const USER_LIMITS = {
  nameMaxLength: 50,
  emailMaxLength: 254,
  passwordMinLength: 8,
};

// Pagination defaults
export const PAGINATION = {
  defaultPageSize: 10,
  maxPageSize: 50,
  defaultPage: 1,
};

// Time constants (in milliseconds)
export const TIME_CONSTANTS = {
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
};

// Poll expiration options (in days)
export const POLL_EXPIRATION_OPTIONS = [
  { label: "Never", value: null },
  { label: "1 day", value: 1 },
  { label: "3 days", value: 3 },
  { label: "1 week", value: 7 },
  { label: "2 weeks", value: 14 },
  { label: "1 month", value: 30 },
  { label: "Custom", value: "custom" },
];

// Analytics time frames
export const ANALYTICS_TIMEFRAMES = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 3 months", value: "90d" },
  { label: "Last year", value: "1y" },
];

// Poll status types
export const POLL_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  EXPIRED: "expired",
  PAUSED: "paused",
} as const;

// Vote types
export const VOTE_TYPES = {
  SINGLE: "single",
  MULTIPLE: "multiple",
} as const;

// Poll visibility types
export const POLL_VISIBILITY = {
  PUBLIC: "public",
  PRIVATE: "private",
  UNLISTED: "unlisted",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_EXISTS: "A user with this email already exists",
  WEAK_PASSWORD: "Password must be at least 8 characters long",
  INVALID_EMAIL: "Please enter a valid email address",

  // Poll errors
  POLL_NOT_FOUND: "Poll not found or has been deleted",
  POLL_EXPIRED: "This poll has expired and is no longer accepting votes",
  ALREADY_VOTED: "You have already voted in this poll",
  INVALID_OPTION: "Invalid poll option selected",
  POLL_LIMIT_REACHED: "You have reached the maximum number of polls allowed",

  // General errors
  UNAUTHORIZED: "You are not authorized to perform this action",
  FORBIDDEN: "Access denied",
  INTERNAL_ERROR: "Something went wrong. Please try again later",
  NETWORK_ERROR: "Network error. Please check your connection",
  VALIDATION_ERROR: "Please check your input and try again",
};

// Success messages
export const SUCCESS_MESSAGES = {
  POLL_CREATED: "Poll created successfully!",
  POLL_UPDATED: "Poll updated successfully!",
  POLL_DELETED: "Poll deleted successfully!",
  VOTE_RECORDED: "Your vote has been recorded!",
  ACCOUNT_CREATED: "Account created successfully!",
  LOGIN_SUCCESS: "Welcome back!",
  LOGOUT_SUCCESS: "You have been logged out",
  SETTINGS_UPDATED: "Settings updated successfully!",
  EMAIL_SENT: "Email sent successfully!",
};

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  LOGOUT: "/api/auth/logout",
  REFRESH: "/api/auth/refresh",

  // Polls
  POLLS: "/api/polls",
  POLL_BY_ID: (id: string) => `/api/polls/${id}`,
  POLL_VOTE: (id: string) => `/api/polls/${id}/vote`,
  POLL_ANALYTICS: (id: string) => `/api/polls/${id}/analytics`,

  // Users
  USER_PROFILE: "/api/user/profile",
  USER_POLLS: "/api/user/polls",
  USER_VOTES: "/api/user/votes",

  // Analytics
  ANALYTICS_OVERVIEW: "/api/analytics/overview",
  ANALYTICS_DETAILED: "/api/analytics/detailed",
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "pollapp_auth_token",
  REFRESH_TOKEN: "pollapp_refresh_token",
  USER_PREFERENCES: "pollapp_user_preferences",
  THEME: "pollapp_theme",
  RECENT_POLLS: "pollapp_recent_polls",
};

// Theme configuration
export const THEME_CONFIG = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

// Chart colors for analytics
export const CHART_COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
  "#f97316", // orange-500
  "#ec4899", // pink-500
  "#6b7280", // gray-500
];

// File upload constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  MAX_FILES: 1,
};

// Regular expressions for validation
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
};

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: true,
  ENABLE_SOCIAL_LOGIN: true,
  ENABLE_EMAIL_NOTIFICATIONS: false,
  ENABLE_REAL_TIME_UPDATES: true,
  ENABLE_POLL_TEMPLATES: false,
  ENABLE_POLL_SCHEDULING: false,
};

// Rate limiting
export const RATE_LIMITS = {
  POLLS_PER_HOUR: 10,
  VOTES_PER_MINUTE: 5,
  API_REQUESTS_PER_MINUTE: 100,
};

// Social media sharing
export const SOCIAL_SHARE = {
  TWITTER: "https://twitter.com/intent/tweet",
  FACEBOOK: "https://www.facebook.com/sharer/sharer.php",
  LINKEDIN: "https://www.linkedin.com/sharing/share-offsite",
  REDDIT: "https://www.reddit.com/submit",
};

// Export all constants as default for easy importing
export default {
  APP_CONFIG,
  POLL_LIMITS,
  USER_LIMITS,
  PAGINATION,
  TIME_CONSTANTS,
  POLL_EXPIRATION_OPTIONS,
  ANALYTICS_TIMEFRAMES,
  POLL_STATUS,
  VOTE_TYPES,
  POLL_VISIBILITY,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  API_ENDPOINTS,
  STORAGE_KEYS,
  THEME_CONFIG,
  CHART_COLORS,
  FILE_UPLOAD,
  REGEX_PATTERNS,
  FEATURE_FLAGS,
  RATE_LIMITS,
  SOCIAL_SHARE,
};
