import { wait } from "./helpers/wait";

export async function retryFetch(
  url: string,
  options: RequestInit = {},
  retries: number = 3,
  retryDelay: (attempt: number) => number = (attempt): number => Math.pow(2, attempt) * 1000
): Promise<Response> {
  let attempt = 0;

  while (attempt < retries) {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (attempt >= retries - 1) throw error;

      await wait(retryDelay(attempt++));
    }
  }

  // technically unreachable
  throw new Error('Failed to fetch after retries');
}
