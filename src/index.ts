import { wait } from "./helpers/wait";

interface RetryFetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: (attempt: number) => number;
}

export async function retryFetch(
  url: string,
  options: RetryFetchOptions = {}
): Promise<Response> {
  const {
    retries = 3,
    retryDelay = (attempt: number): number => Math.pow(2, attempt) * 1000,
    ...fetchOptions
  } = options;

  let attempt = 0;

  while (attempt < retries) {
    try {
      return await fetch(url, fetchOptions);
    } catch (error) {
      if (attempt >= retries - 1) throw error;

      await wait(retryDelay(attempt++));
    }
  }

  // technically unreachable
  throw new Error('Failed to fetch after retries');
}
