import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const campaigns = [
  {
    id: "1",
    brand: "뷰티랩",
    title: "스킨케어 루틴 리뷰",
    reward: "50,000원",
    deadline: "D-3",
  },
  {
    id: "2",
    brand: "카페모아",
    title: "신메뉴 방문 후기",
    reward: "제품 제공",
    deadline: "D-7",
  },
  {
    id: "3",
    brand: "핏웨어",
    title: "홈트 챌린지 인증",
    reward: "80,000원",
    deadline: "D-5",
  },
];

export default function HomePage() {
  return (
    <div className="px-4 py-6">
      <header className="mb-6">
        <p className="text-sm text-slate-500">안녕하세요 👋</p>
        <h1 className="text-2xl font-bold tracking-tight">오늘의 캠페인</h1>
      </header>

      <section className="mb-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-lg">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-100">
          <Sparkles className="h-4 w-4" />
          추천 매칭
        </div>
        <p className="mb-4 text-lg font-semibold leading-snug">
          프로필에 맞는 캠페인 3건이 도착했어요
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-700"
        >
          보러 가기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-500">
          신규 캠페인
        </h2>
        <ul className="space-y-3">
          {campaigns.map((c) => (
            <li key={c.id}>
              <article className="rounded-xl border border-slate-200 p-4 transition-shadow hover:shadow-md">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-indigo-600">
                    {c.brand}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {c.deadline}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold">{c.title}</h3>
                <p className="text-sm text-slate-600">보상 · {c.reward}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
