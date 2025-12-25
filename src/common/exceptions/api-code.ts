import { HttpStatus } from '@nestjs/common';

export const ApiCode = {
  USER_INVALID_CREDENTIALS: {
    code: 'USER_INVALID_CREDENTIALS',
    message: 'Invalid username or password',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  INSUFFICIENT_PERMISSIONS: {
    code: 'INSUFFICIENT_PERMISSIONS',
    message: 'Insufficient permissions',
    statusCode: HttpStatus.FORBIDDEN,
  },
  BAD_REQUEST: {
    code: 'BAD_REQUEST',
    message: 'The request could not be understood or was missing required parameters.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'The requested resource could not be found.',
    statusCode: HttpStatus.NOT_FOUND,
  },
  CONFLICT: {
    code: 'CONFLICT',
    message: 'Conflict',
    statusCode: HttpStatus.CONFLICT,
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Unauthorized',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Internal server error',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  STATUS_CODE_WITH_FAILED_RESPONSE: (statusCode: HttpStatus) => ({
    code: 'STATUS_CODE_WITH_FAILED_RESPONSE',
    message: `Request was processed with status code ${statusCode}, but response is empty.`,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  }),
};
