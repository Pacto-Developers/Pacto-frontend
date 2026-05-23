import type { UserMe } from "@pacto/api-client";

export type MeResponse = {
  user: UserMe | null;
  source: "api" | "mock";
};

export async function fetchMe(): Promise<MeResponse> {
  const res = await fetch("/api/auth/me", { credentials: "include" });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "프로필을 불러오지 못했습니다.");
  }

  return res.json() as Promise<MeResponse>;
}

export function isBloggerUser(
  user: UserMe | null,
): user is Extract<UserMe, { role: "BLOGGER" }> {
  return user?.role === "BLOGGER";
}
