export type FetchOptions = {
  url: string;
  body?: Record<string, unknown>;
  method?: 'GET' | 'POST' | 'PUT';
};

export async function fetchJson<JSON = unknown>(options: string | FetchOptions): Promise<JSON> {
  const { url, body, method } = buildOptions(options);

  const response = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await getResponseData(response);

  if (response.ok) {
    return data;
  }

  throw new FetchError(response, data);
}

function buildOptions(options: string | FetchOptions): FetchOptions {
  if (typeof options === 'string') {
    return { url: options, method: 'GET' };
  }
  return options;
}

/**
 * A wrapper around accessing the json of a response so we don't have to explicitly handle responses
 * that have no content.
 */
async function getResponseData(response: Response): Promise<any | undefined> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

export class FetchError extends Error {
  constructor(public response: Response, public data?: any) {
    // If there is no message in the data it's probably an unhandled server error. Better to show
    // something slightly friendly here than that statusText or something
    const message = data?.message ?? "Something's gone wrong. Please try again later!";

    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }

    this.name = 'FetchError';
  }

  get isAuthorisationError(): boolean {
    return this.response.status === 401;
  }
}
