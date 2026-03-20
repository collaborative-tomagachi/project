import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

/******************************************************************************
                                 Classes
******************************************************************************/

/**
 * Error with status code and message.
 */
export class RouteError extends Error {
  public status: number;

  public constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Handle validation errors.
 */
export class ValidationError extends RouteError {
  public static MESSAGE =
    'The validation function discovered one or ' + 'more errors.';

  public constructor(errors: string[]) {
    const msg = JSON.stringify({
      message: ValidationError.MESSAGE,
      errors,
    });
    super(HttpStatusCodes.BAD_REQUEST, msg);
  }
}
