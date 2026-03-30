const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '';
const DEFAULT_TIMEOUT_MS = 12000;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const buildUrl = (path: string, query?: Record<string, string | number | undefined>) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`, window.location.origin);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === '') return;
      url.searchParams.set(key, String(value));
    });
  }

  return API_BASE_URL ? url.toString() : `${url.pathname}${url.search}`;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = (payload && typeof payload === 'object' && 'message' in payload ? String(payload.message) : response.statusText) || 'Request failed';
    throw new ApiError(message, response.status);
  }

  return payload as T;
};

const request = async <T>(method: string, path: string, body?: unknown, query?: Record<string, string | number | undefined>, init?: RequestInit): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(buildUrl(path, query), {
      method,
      headers: { Accept: 'application/json', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...(init?.headers ?? {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
      ...init,
    });

    return parseResponse<T>(response);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timed out', 408);
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export const apiClient = {
  get<T>(path: string, query?: Record<string, string | number | undefined>, init?: RequestInit): Promise<T> {
    return request<T>('GET', path, undefined, query, init);
  },
  post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return request<T>('POST', path, body, undefined, init);
  },
  put<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return request<T>('PUT', path, body, undefined, init);
  },
  patch<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return request<T>('PATCH', path, body, undefined, init);
  },
  delete(path: string, init?: RequestInit): Promise<void> {
    return request<void>('DELETE', path, undefined, undefined, init);
  },
};
