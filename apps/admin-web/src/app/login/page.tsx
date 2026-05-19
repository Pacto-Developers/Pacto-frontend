import { ROLE_LABELS, ROLES } from "@pacto/types";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold">Pacto Admin</h1>
        <p className="mb-8 text-sm text-slate-500">
          개발용 데모 로그인 — Role을 선택하세요
        </p>
        <Suspense fallback={<p className="text-sm text-slate-500">로딩 중…</p>}>
          <LoginForm roles={ROLES} labels={ROLE_LABELS} />
        </Suspense>
      </div>
    </div>
  );
}
