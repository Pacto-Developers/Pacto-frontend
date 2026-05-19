import { isApiConfigured } from "@pacto/api-client";
import type { DataSource, WithSource } from "./types";

export async function fetchWithFallback<T>(
  fetcher: () => Promise<T>,
  fallback: T,
): Promise<WithSource<T>> {
  if (!isApiConfigured()) {
    return { data: fallback, source: "mock" };
  }

  try {
    const data = await fetcher();
    return { data, source: "api" };
  } catch {
    return { data: fallback, source: "mock" };
  }
}

export function isMockSource(source: DataSource): boolean {
  return source === "mock";
}
