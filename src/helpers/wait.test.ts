import { wait } from "./wait";

describe('wait', () => {
  let setTimeoutSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should wait for the specified time', async () => {
    setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const waitPromise = wait(1000);

    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    jest.runAllTimers();

    await waitPromise;
    setTimeoutSpy.mockRestore();
  });

  it('should resolve after the timer completes', async () => {
    jest.useRealTimers();
    const start = Date.now();

    await wait(100);

    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(100);
  });
});