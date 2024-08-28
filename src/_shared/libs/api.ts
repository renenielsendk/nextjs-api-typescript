import { NextRequest, NextResponse } from 'next/server';
import { ApiRequestProps, APIError } from '@/types/api';
import { initializeLogger } from './logger';

/**
 * A higher-order function that wraps API route handlers with common logic such as logging,
 * error handling, and potential authentication checks.
 *
 * @param handler - The handler function that contains the specific logic for the API route.
 * @returns A wrapped function that handles the request and response, with enhanced logging and error management.
 */
export const apiHandler = (handler: ({ req, params }: ApiRequestProps) => Promise<any>) => {
  return async function (req: NextRequest, { params }: any) {
    // Initialize a logger instance for this specific API request
    const logger = initializeLogger(req);

    try {
      // Example authentication logic to protect all endpoints (commented out)
      // Replace with actual authentication logic as needed
      // const user = await currentUser();
      // if (!user) {
      //   logger.error({ trace: 'apiHandler' }, 'UserNotFound: AuthProvider');
      //   throw new CustomAPIError({ type: 'UnauthorizedError' });
      // }

      // Execute the provided handler function with the request and parameters
      const response = await handler({
        req,
        params,
        // user: user - Example of passing the user object to the API handler
      });

      // Log the successful end of the API request
      logger.info('Request ended');

      // Return the handler's response
      return response;
    } catch (error: any) {
      // Log the error that occurred during request handling
      logger.error('An error occurred', error);

      // Handle custom API errors by returning appropriate HTTP responses
      if (error instanceof APIError) {
        switch (error.type) {
          case 'ValidationError': {
            // Return a 400 Bad Request response for validation errors
            return NextResponse.json({ message: error.message || 'ValidationError' }, { status: 400 });
          }
          case 'UnauthorizedError': {
            // Return a 401 Unauthorized response for authentication errors
            return NextResponse.json({ message: error.message || 'UnauthorizedError' }, { status: 401 });
          }
          case 'NotFoundError': {
            // Return a 404 Not Found response for missing resources
            return NextResponse.json({ message: error.message || 'NotFoundError' }, { status: 404 });
          }
          default: {
            // Return a 500 Internal Server Error for any other APIError types
            // Never expose detailed error messages to the client
            return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
          }
        }
      } else {
        // If the error is not an APIError, return a generic 500 Internal Server Error
        return NextResponse.json({ message: 'ServerError' }, { status: 500 });
      }
    }
  };
};
