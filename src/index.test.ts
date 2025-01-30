import { retryFetch } from ".";

describe('retryFetch', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('should successfully fetch on first try', async () => {
    const mockResponse = new Response('success');
    fetchSpy.mockResolvedValueOnce(mockResponse);

    const result = await retryFetch('https://api.example.com');

    expect(result).toBe(mockResponse);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and succeed', async () => {
    const mockResponse = new Response('success');
    fetchSpy
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockResponse);

    const result = await retryFetch('https://api.example.com');

    expect(result).toBe(mockResponse);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('should throw after all retries fail', async () => {
    const networkError = new Error('Network error');
    fetchSpy.mockRejectedValue(networkError);

    await expect(retryFetch('https://api.example.com')).rejects.toThrow(networkError);
    expect(fetchSpy).toHaveBeenCalledTimes(3); // Default 3 retries
  });

  it('should use custom retry delay function', async () => {
    const customDelay = (attempt: number) => attempt * 1000;
    fetchSpy.mockRejectedValue(new Error('Network error'));

    await expect(retryFetch('https://api.example.com', {}, 3, customDelay)).rejects.toThrow();
    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });

  it('should respect custom number of retries', async () => {
    fetchSpy.mockRejectedValue(new Error('Network error'));

    await expect(retryFetch('https://api.example.com', {}, 4, (attempt) => attempt * 1000)).rejects.toThrow();
    expect(fetchSpy).toHaveBeenCalledTimes(4);
  });
});