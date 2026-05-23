import { envelopeMessage, unwrapEnvelope } from "./envelope";
import { ApiClientError } from "./errors";

export { ApiClientError } from "./errors";
export type { ApiError } from "./errors";

export function getApiBaseUrl(): string {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    ""
  ).replace(/\/$/, "");
}

export function isApiConfigured(): boolean {
  return Boolean(getApiBaseUrl());
}

export function getServerApiBaseUrl(): string {
  return getApiBaseUrl();
}

/** 브라우저에서는 Next rewrite 프록시 경유 */
export function resolveApiUrl(path: string): string {
  const base = getApiBaseUrl();
  if (typeof window === "undefined") {
    return base ? `${base}${path}` : path;
  }
  return path;
}

export type ApiFetchOptions = RequestInit & {
  token?: string;
};

export async function apiFetch<T>(
  path: string,
  init?: ApiFetchOptions,
): Promise<T> {
  if (!isApiConfigured()) {
    throw new ApiClientError(0, "API URL is not configured");
  }

  const { token, headers, ...rest } = init ?? {};

  const res = await fetch(resolveApiUrl(path), {
    credentials: "include",
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const body = (await res.json().catch(() => null)) as unknown;

  if (!res.ok) {
    const message =
      envelopeMessage(body) ?? res.statusText ?? "Request failed";
    throw new ApiClientError(res.status, message);
  }

  if (res.status === 204) return undefined as T;

  return unwrapEnvelope<T>(body, res.status);
}

/** 페이지네이션·목록 payload를 배열로 정규화 */
export function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of [
      "content",
      "data",
      "items",
      "campaigns",
      "missions",
      "histories",
    ]) {
      if (Array.isArray(record[key])) return record[key] as T[];
    }
  }
  return [];
}
