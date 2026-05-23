import { PactoBrand } from "@/components/brand/pacto-brand";
import { ROLE_LABELS, ROLES } from "@pacto/types";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <PactoBrand size="lg" priority />
        </div>
        <p className="mb-2 text-center text-lg font-semibold">Admin</p>
        <p className="mb-8 text-center text-sm text-slate-500">
          광고주는 BUSINESS 계정으로 로그인 · 대행사는 데모 Role 선택
        </p>
        <Suspense fallback={<p className="text-sm text-slate-500">로딩 중…</p>}>
          <LoginForm roles={ROLES} labels={ROLE_LABELS} />
        </Suspense>
      </div>
    </div>
  );
}
