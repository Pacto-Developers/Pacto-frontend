"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
          className="h-12 rounded-xl border-0 bg-[#f2f4f6] shadow-none ring-1 ring-foreground/8 focus-visible:ring-primary/40"
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
          className="h-12 rounded-xl border-0 bg-[#f2f4f6] shadow-none ring-1 ring-foreground/8 focus-visible:ring-primary/40"
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
        className="h-12 w-full rounded-xl bg-primary text-base font-semibold shadow-[0_4px_14px_rgba(49,130,246,0.35)] hover:bg-primary/90"
        size="lg"
      >
        {isSubmitting ? "로그인 중…" : "로그인"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        계정이 없으신가요?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          회원가입
        </Link>
      </p>

      {process.env.NODE_ENV === "development" ? (
        <p className="text-center text-xs text-muted-foreground">
          개발 모드: API 미설정 시 데모 로그인
        </p>
      ) : null}
    </form>
  );
}
