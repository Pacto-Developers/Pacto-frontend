"use client";

import { getHomePathForRole } from "@pacto/auth";
import type { Role } from "@pacto/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  role: z.enum(["agency", "advertiser"]),
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
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "agency" },
  });

  async function onSubmit(values: FormValues) {
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

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
