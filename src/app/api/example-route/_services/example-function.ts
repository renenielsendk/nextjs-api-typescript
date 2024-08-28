import { createChildLogger } from '@/libs/logger';
import { APIError } from '@/types/api';

type Props = {
  exampleProperty: string;
};

/**
 * Demonstrates handling of custom logic with error management using a provided example property.
 *
 * @param {Object} props - The properties passed to the function.
 * @param {string} props.exampleProperty - A string property used in processing the logic.
 * @returns {Promise<void>} - A promise that resolves when the process is complete.
 */
export const exampleFunction = async ({ exampleProperty }: Props): Promise<void> => {
  // Create a child logger to track the flow of this specific logic
  // The 'exampleProperty' is included for additional context in log messages
  const logger = createChildLogger({ trace: 'exampleFunction', exampleProperty });

  logger.info('Processing example logic', { exampleProperty });

  // Example condition to simulate an input validation error
  if ('input_validation_failed' === 'input_validation_failed') {
    logger.error('Input validation failed example', { 'inputField': 'validator.result' });
    // Throw an APIError for input validation failures
    // This simulates handling an error where the input does not meet expected criteria
    // The logic here does NOT know about HTTP status codes; this separation
    // keeps the core logic decoupled from application-layer concerns
    throw new APIError({
      type: 'ValidationError',
      message: 'An error occurred while processing the example logic',
    });
  }
  // Example condition to simulate an item not found error
  else if ('example_item_not_found' === 'example_item_not_found') {
    // Throw an APIError for not found errors
    // This simulates handling an error where a required resource was not found
    // The logic here does NOT know about HTTP status codes; this separation
    // keeps the core logic decoupled from application-layer concerns
    throw new APIError({
      type: 'NotFoundError',
      message: 'The example item was not found',
    });
  }
};
