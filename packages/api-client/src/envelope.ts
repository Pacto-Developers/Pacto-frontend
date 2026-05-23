import { ApiClientError } from "./errors";
import type { ApiEnvelope } from "./types";

export function isApiEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    "message" in value &&
    "data" in value
  );
}

export function unwrapEnvelope<T>(body: unknown, status: number): T {
  if (!isApiEnvelope(body)) {
    return body as T;
  }

  if (!body.success) {
    throw new ApiClientError(status, body.message || "Request failed");
  }

  if (body.data === null) {
    throw new ApiClientError(status, body.message || "Empty response data");
  }

  return body.data as T;
}

export function envelopeMessage(body: unknown): string | undefined {
  if (isApiEnvelope(body) && body.message) {
    return body.message;
  }
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message?: unknown }).message;
    return typeof message === "string" ? message : undefined;
  }
  return undefined;
}
