export class BffError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "BffError";
  }
}

export async function bffRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = (await res.json().catch(() => null)) as {
    message?: string;
    data?: T;
  } | null;

  if (!res.ok) {
    throw new BffError(res.status, body?.message ?? "요청에 실패했습니다.");
  }

  return body?.data as T;
}
