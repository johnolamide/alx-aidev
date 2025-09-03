import { ApiResponse } from '@/lib/types';

export interface AppError {
  code: string;
  message: string;
  statusCode: number;
}

export class ErrorUtils {
  static createError(code: string, message: string, statusCode: number = 500): AppError {
    return {
      code,
      message,
      statusCode,
    };
  }

  static handleDatabaseError(error: any): AppError {
    console.error('Database error:', error);

    if (error?.code === 'PGRST116') {
      return this.createError('NOT_FOUND', 'Resource not found', 404);
    }

    if (error?.code === '23505') {
      return this.createError('DUPLICATE', 'Resource already exists', 409);
    }

    if (error?.code === '42501') {
      return this.createError('PERMISSION_DENIED', 'Permission denied', 403);
    }

    return this.createError('DATABASE_ERROR', 'Database operation failed', 500);
  }

  static handleAuthError(error: any): AppError {
    console.error('Authentication error:', error);
    return this.createError('AUTH_ERROR', error?.message || 'Authentication failed', 401);
  }

  static handleValidationError(errors: string[]): AppError {
    return this.createError('VALIDATION_ERROR', errors.join(', '), 400);
  }

  static createApiResponse<T>(
    success: boolean,
    data?: T,
    error?: string,
    message?: string
  ): ApiResponse<T> {
    return {
      success,
      data,
      error,
      message,
    };
  }

  static createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
    return this.createApiResponse(true, data, undefined, message);
  }

  static createErrorResponse(error: string, message?: string): ApiResponse {
    return this.createApiResponse(false, undefined, error, message);
  }
}

// Predefined errors
export const Errors = {
  AUTH_REQUIRED: ErrorUtils.createError('AUTH_REQUIRED', 'Authentication required', 401),
  POLL_NOT_FOUND: ErrorUtils.createError('POLL_NOT_FOUND', 'Poll not found', 404),
  OPTION_NOT_FOUND: ErrorUtils.createError('OPTION_NOT_FOUND', 'Option not found', 404),
  POLL_EXPIRED: ErrorUtils.createError('POLL_EXPIRED', 'Poll has expired', 400),
  ALREADY_VOTED: ErrorUtils.createError('ALREADY_VOTED', 'You have already voted on this poll', 400),
  POLL_PRIVATE: ErrorUtils.createError('POLL_PRIVATE', 'This poll is not public', 403),
  PERMISSION_DENIED: ErrorUtils.createError('PERMISSION_DENIED', 'You do not have permission to perform this action', 403),
  VALIDATION_FAILED: ErrorUtils.createError('VALIDATION_FAILED', 'Validation failed', 400),
} as const;
