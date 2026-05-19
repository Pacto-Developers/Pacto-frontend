"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("올바른 이메일을 입력해 주세요"),
  password: z.string().min(4, "비밀번호는 4자 이상이어야 합니다"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = (await res.json()) as { message?: string };
      setError("root", {
        message: data.message ?? "로그인에 실패했습니다.",
      });
      return;
    }

    const from = searchParams.get("from");
    router.push(from && from !== "/login" ? from : "/explore");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          이메일
        </label>
        <Input
          id="email"
          type="email"
          placeholder="blogger@example.com"
          autoComplete="email"
          className="h-12 rounded-xl bg-white"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          비밀번호
        </label>
        <Input
          id="password"
          type="password"
          placeholder="4자 이상"
          autoComplete="current-password"
          className="h-12 rounded-xl bg-white"
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p className="text-center text-sm text-destructive">
          {errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl text-base font-semibold"
        size="lg"
      >
        {isSubmitting ? "로그인 중…" : "시작하기"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        데모: 아무 이메일 + 비밀번호 4자 이상
      </p>
    </form>
  );
}
