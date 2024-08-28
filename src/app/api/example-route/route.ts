import { NextResponse } from 'next/server';
import { apiHandler } from '@/libs/api';
import { ApiRequestProps } from '@/types/api';
import { exampleFunction } from './_services/example-function';

// The route is wrapped with apiHandler to manage error handling, request validation, and other middleware logic.
export const POST = apiHandler(async ({ req, params }: ApiRequestProps) => {
  // 'req' can be used for extracting headers, cookies, and other request-level data.
  // 'params' can be used for extracting query parameters, route parameters, etc.
  // Example: const { routeId } = params;

  // Place core logic outside the application layer for better separation of concerns
  await exampleFunction({
    exampleProperty: 'exampleValue',
  });

  // Return a JSON response with a 200 status code upon successful execution of the logic
  return NextResponse.json({}, { status: 200 });
});
