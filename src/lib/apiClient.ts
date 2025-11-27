import { HttpMethod, ApiErrorPayload } from "@/types/api";

export class ApiError extends Error {
  status: number;
  statusText: string;
  payload?: ApiErrorPayload | unknown;

  constructor(
    status: number,
    statusText: string,
    message: string,
    payload?: ApiErrorPayload | unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.payload = payload;
  }
}

/**
 * Extra options for apiClient beyond standard RequestInit.
 * We override `body` to allow arbitrary JS objects, and `headers` to
 * be a simple record for easy merging.
 */
export interface ApiRequestOptions
  extends Omit<RequestInit, "body" | "headers"> {
  body?: unknown;
  headers?: Record<string, string>;
  /**
   * Optional query params object, e.g. { page: 1, search: "foo" }.
   */
  query?: Record<string, string | number | boolean | null | undefined>;
}

/**
 * Build a URL with query string parameters.
 */
function buildUrl(
  url: string,
  query?: ApiRequestOptions["query"],
): string {
  if (!query || Object.keys(query).length === 0) return url;

  const base =
    typeof window !== "undefined" ? window.location.origin : "http://localhost";

  const urlObj = new URL(url, base);
  const params = urlObj.searchParams;

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    params.set(key, String(value));
  }

  return urlObj.pathname + "?" + params.toString();
}

/**
 * Safely try to parse JSON from a response.
 */
async function tryParseJson(res: Response): Promise<unknown | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Core request helper. All other helpers (GET, POST, etc.) use this.
 */
export async function apiRequest<TResponse = unknown>(
  url: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const { method = "GET", query, headers, body, ...rest } = options;

  const finalUrl = buildUrl(url, query);

  // Normalize headers to a simple string record so we can index safely.
  const finalHeaders: Record<string, string> = {
    ...(headers ?? {}),
  };

  let finalBody: BodyInit | null | undefined = undefined;

  if (body instanceof FormData) {
    // Let browser set Content-Type for FormData (boundary, etc.)
    finalBody = body;
  } else if (body !== undefined && body !== null) {
    // Treat everything else as JSON
    finalHeaders["Content-Type"] = "application/json";
    finalBody = JSON.stringify(body);
  }

  const response = await fetch(finalUrl, {
    method,
    headers: finalHeaders,
    body: finalBody,
    // credentials: "include", // uncomment if you need cookies
    ...rest,
  });

  const parsed = await tryParseJson(response);

  if (!response.ok) {
    const payload = parsed as ApiErrorPayload | unknown;

    // Extract a nice error message from payload if present.
    let message: string = response.statusText || "Request failed";

    if (
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      (payload as any).message
    ) {
      message = String((payload as any).message);
    }

    throw new ApiError(response.status, response.statusText, message, payload);
  }

  // For 204 No Content or empty body, just return undefined
  if (response.status === 204 || parsed === null) {
    return undefined as TResponse;
  }

  return parsed as TResponse;
}

/**
 * Typed helpers for common HTTP verbs.
 */

export function apiGet<TResponse = unknown>(
  url: string,
  options?: Omit<ApiRequestOptions, "method" | "body">,
): Promise<TResponse> {
  return apiRequest<TResponse>(url, { ...options, method: "GET" });
}

export function apiPost<TResponse = unknown, TBody = unknown>(
  url: string,
  body?: TBody,
  options?: Omit<ApiRequestOptions, "method" | "body">,
): Promise<TResponse> {
  return apiRequest<TResponse>(url, { ...options, method: "POST", body });
}

export function apiPut<TResponse = unknown, TBody = unknown>(
  url: string,
  body?: TBody,
  options?: Omit<ApiRequestOptions, "method" | "body">,
): Promise<TResponse> {
  return apiRequest<TResponse>(url, { ...options, method: "PUT", body });
}

export function apiPatch<TResponse = unknown, TBody = unknown>(
  url: string,
  body?: TBody,
  options?: Omit<ApiRequestOptions, "method" | "body">,
): Promise<TResponse> {
  return apiRequest<TResponse>(url, { ...options, method: "PATCH", body });
}

export function apiDelete<TResponse = unknown>(
  url: string,
  options?: Omit<ApiRequestOptions, "method" | "body">,
): Promise<TResponse> {
  return apiRequest<TResponse>(url, { ...options, method: "DELETE" });
}
