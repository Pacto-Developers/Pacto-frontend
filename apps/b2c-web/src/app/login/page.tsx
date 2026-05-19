import { PactoBrand } from "@/components/brand/pacto-brand";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col bg-[#f2f4f6] px-5 py-10">
      <div className="mb-8 flex justify-center pt-4">
        <PactoBrand size="lg" priority />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-foreground/5">
        <Suspense
          fallback={
            <p className="py-8 text-center text-sm text-muted-foreground">
              로딩 중…
            </p>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
