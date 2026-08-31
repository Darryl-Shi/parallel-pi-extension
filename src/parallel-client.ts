declare const __PACKAGE_VERSION__: string;

import Parallel from 'parallel-web';

export interface ParallelSearchInput {
  objective: string;
  search_queries: string[];
  client_model?: string;
  session_id?: string;
}

export interface ParallelExtractInput {
  urls: string[];
  objective?: string;
  search_queries?: string[];
  client_model?: string;
  session_id?: string;
}

type ParallelSearchMode = 'turbo' | 'fast' | 'advanced';

const SEARCH_MODES = new Set<ParallelSearchMode>(['turbo', 'fast', 'advanced']);

export function resolveParallelSearchMode(): ParallelSearchMode {
  const configured = process.env.PARALLEL_SEARCH_MODE?.trim().toLowerCase();
  if (!configured) {
    return 'fast';
  }

  if (!SEARCH_MODES.has(configured as ParallelSearchMode)) {
    throw new Error(
      `Invalid PARALLEL_SEARCH_MODE=${JSON.stringify(configured)}. Expected turbo, fast, or advanced.`
    );
  }

  return configured as ParallelSearchMode;
}

function createParallelClient(apiKey: string) {
  return new Parallel({
    apiKey,
    defaultHeaders: {
      'X-Tool-Calling-Package': `github:Darryl-Shi/parallel-pi-extension/v${__PACKAGE_VERSION__ ?? '0.0.0'}`,
    },
  });
}

export async function runParallelSearch(
  apiKey: string,
  input: ParallelSearchInput,
  signal?: AbortSignal
) {
  const client = createParallelClient(apiKey);
  return await client.search(
    {
      objective: input.objective,
      search_queries: input.search_queries,
      mode: resolveParallelSearchMode(),
      client_model: input.client_model,
      session_id: input.session_id,
    },
    { signal }
  );
}

export async function runParallelExtract(
  apiKey: string,
  input: ParallelExtractInput,
  signal?: AbortSignal
) {
  const client = createParallelClient(apiKey);
  return await client.extract(
    {
      urls: input.urls,
      objective: input.objective,
      search_queries: input.search_queries,
      client_model: input.client_model,
      session_id: input.session_id,
    },
    { signal }
  );
}

export function isParallelAuthenticationError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const status =
    typeof error === 'object' && error !== null && 'status' in error
      ? (error as { status?: number }).status
      : undefined;

  return (
    status === 401 ||
    error.name === 'AuthenticationError' ||
    /unauthorized|authentication|api key/i.test(error.message)
  );
}
