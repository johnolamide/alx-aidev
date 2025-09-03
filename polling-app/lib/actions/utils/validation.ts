import { CreatePollData } from '@/lib/types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationUtils {
  static validateCreatePollData(data: Partial<CreatePollData>): ValidationResult {
    const errors: string[] = [];

    // Title validation
    if (!data.title || data.title.trim().length === 0) {
      errors.push('Poll title is required');
    } else if (data.title.length > 200) {
      errors.push('Poll title must be less than 200 characters');
    }

    // Description validation
    if (data.description && data.description.length > 1000) {
      errors.push('Poll description must be less than 1000 characters');
    }

    // Options validation
    if (!data.options || data.options.length < 2) {
      errors.push('At least 2 options are required');
    } else if (data.options.length > 10) {
      errors.push('Maximum 10 options allowed');
    } else {
      // Check for empty options
      const validOptions = data.options.filter(option => option && option.trim().length > 0);
      if (validOptions.length < 2) {
        errors.push('At least 2 valid options are required');
      }

      // Check for option length
      validOptions.forEach((option, index) => {
        if (option.length > 200) {
          errors.push(`Option ${index + 1} must be less than 200 characters`);
        }
      });

      // Check for duplicates
      const uniqueOptions = new Set(validOptions.map(opt => opt.toLowerCase()));
      if (uniqueOptions.size !== validOptions.length) {
        errors.push('Duplicate options are not allowed');
      }
    }

    // Expiration validation
    if (data.expirationDays && data.expirationDays !== 'never') {
      const days = parseInt(data.expirationDays);
      if (isNaN(days) || days <= 0 || days > 365) {
        errors.push('Expiration days must be between 1 and 365');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validatePollId(pollId: string | null | undefined): ValidationResult {
    const errors: string[] = [];

    if (!pollId || pollId.trim().length === 0) {
      errors.push('Poll ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateOptionId(optionId: string | null | undefined): ValidationResult {
    const errors: string[] = [];

    if (!optionId || optionId.trim().length === 0) {
      errors.push('Option ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateVoteData(pollId: string, optionId: string): ValidationResult {
    const pollValidation = this.validatePollId(pollId);
    const optionValidation = this.validateOptionId(optionId);

    return {
      isValid: pollValidation.isValid && optionValidation.isValid,
      errors: [...pollValidation.errors, ...optionValidation.errors],
    };
  }
}
