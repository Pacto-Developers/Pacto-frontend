"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    email: z.string().email("올바른 이메일을 입력해 주세요"),
    password: z.string().min(4, "비밀번호는 4자 이상이어야 합니다"),
    passwordConfirm: z.string().min(4, "비밀번호 확인을 입력해 주세요"),
    nickname: z.string().min(1, "닉네임을 입력해 주세요"),
    blogUrl: z
      .string()
      .min(1, "블로그 URL을 입력해 주세요")
      .url("올바른 URL을 입력해 주세요 (https://…)"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type FormValues = z.infer<typeof schema>;

export function SignupForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      nickname: "",
      blogUrl: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        nickname: values.nickname,
        blogUrl: values.blogUrl,
      }),
    });

    const data = (await res.json()) as {
      message?: string;
      redirect?: string;
    };

    if (!res.ok) {
      setError("root", {
        message: data.message ?? "회원가입에 실패했습니다.",
      });
      if (res.status === 403 && data.redirect) {
        router.push(data.redirect);
      }
      return;
    }

    router.push(data.redirect ?? "/explore?welcome=1");
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
        {errors.email ? (
          <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="nickname" className="mb-1.5 block text-sm font-medium">
          닉네임
        </label>
        <Input
          id="nickname"
          placeholder="활동명"
          autoComplete="nickname"
          className="h-12 rounded-xl bg-white"
          {...register("nickname")}
        />
        {errors.nickname ? (
          <p className="mt-1 text-xs text-destructive">
            {errors.nickname.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="blogUrl" className="mb-1.5 block text-sm font-medium">
          블로그 URL
        </label>
        <Input
          id="blogUrl"
          type="url"
          placeholder="https://blog.example.com"
          autoComplete="url"
          className="h-12 rounded-xl bg-white"
          {...register("blogUrl")}
        />
        {errors.blogUrl ? (
          <p className="mt-1 text-xs text-destructive">
            {errors.blogUrl.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          비밀번호
        </label>
        <Input
          id="password"
          type="password"
          placeholder="4자 이상"
          autoComplete="new-password"
          className="h-12 rounded-xl bg-white"
          {...register("password")}
        />
        {errors.password ? (
          <p className="mt-1 text-xs text-destructive">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="passwordConfirm"
          className="mb-1.5 block text-sm font-medium"
        >
          비밀번호 확인
        </label>
        <Input
          id="passwordConfirm"
          type="password"
          placeholder="비밀번호 재입력"
          autoComplete="new-password"
          className="h-12 rounded-xl bg-white"
          {...register("passwordConfirm")}
        />
        {errors.passwordConfirm ? (
          <p className="mt-1 text-xs text-destructive">
            {errors.passwordConfirm.message}
          </p>
        ) : null}
      </div>

      {errors.root ? (
        <p className="text-center text-sm text-destructive">
          {errors.root.message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl text-base font-semibold"
        size="lg"
      >
        {isSubmitting ? "가입 중…" : "회원가입"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          로그인
        </Link>
      </p>

      {process.env.NODE_ENV === "development" ? (
        <p className="text-center text-xs text-muted-foreground">
          개발 모드: 블로거(BLOGGER) 전용 · 데모 가입
        </p>
      ) : null}
    </form>
  );
}
