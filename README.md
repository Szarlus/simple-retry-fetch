# Simple Retry Fetch

A lightweight, dead simple TypeScript utility for making HTTP requests with automatic retries using exponential backoff.

## API

### retryFetch(url, options?)

- `url` (string): The URL to fetch
- `options` (RetryFetchOptions): Configuration object extending RequestInit with:
  - `retries` (number): Maximum number of retry attempts (default: 3)
  - `retryDelay` (function): Function to calculate delay between retries in milliseconds (default: exponential backoff)
  - ...all standard fetch options

Returns: `Promise<Response>`

Default retry delay uses exponential backoff: `attempt => Math.pow(2, attempt) * 1000`

## Installation

```bash
npm install simple-retry-fetch
```