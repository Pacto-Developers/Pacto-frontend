import { AuthCard } from "@/components/auth/auth-card";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <AuthScreenLayout
      heroTitle="블로거로 시작하기"
      heroDescription="가입 후 바로 캠페인을 탐색할 수 있어요"
    >
      <AuthCard title="회원가입">
        <SignupForm />
      </AuthCard>
    </AuthScreenLayout>
  );
}
