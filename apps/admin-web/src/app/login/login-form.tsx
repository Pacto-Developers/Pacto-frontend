"use client";

import { getHomePathForRole } from "@pacto/auth";
import type { Role } from "@pacto/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    role: z.enum(["agency", "advertiser"]),
    email: z.string().optional(),
    password: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.role !== "advertiser") return;

    const email = values.email?.trim() ?? "";
    const password = values.password ?? "";

    if (!email || !z.string().email().safeParse(email).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "광고주 로그인에는 올바른 이메일이 필요합니다.",
        path: ["email"],
      });
    }
    if (password.length < 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "비밀번호는 4자 이상이어야 합니다.",
        path: ["password"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

type LoginFormProps = {
  roles: readonly Role[];
  labels: Record<Role, string>;
};

export function LoginForm({ roles, labels }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "agency", email: "", password: "" },
  });

  const selectedRole = watch("role");

  async function onSubmit(values: FormValues) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: values.role,
        email: values.email?.trim(),
        password: values.password,
      }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { message?: string };
      setError("root", {
        message: data.message ?? "로그인에 실패했습니다.",
      });
      return;
    }

    const from = searchParams.get("from");
    const home = getHomePathForRole(values.role);
    router.push(from && from.startsWith(`/${values.role}`) ? from : home);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-700">Role</legend>
        {roles.map((role) => (
          <label
            key={role}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50"
          >
            <input
              type="radio"
              value={role}
              {...register("role")}
              className="text-indigo-600"
            />
            <span className="font-medium">{labels[role]}</span>
          </label>
        ))}
      </fieldset>

      {selectedRole === "advertiser" && (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs text-slate-600">
            광고주는 API 계정(BUSINESS)으로 로그인합니다.
          </p>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
      )}

      {selectedRole === "agency" && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          대행사(agency)는 API Role이 없어 Role 선택만으로 데모 입장합니다.
        </p>
      )}

      {errors.root && (
        <p className="text-center text-sm text-red-600">{errors.root.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {isSubmitting ? "로그인 중…" : "대시보드 입장"}
      </button>
    </form>
  );
}
