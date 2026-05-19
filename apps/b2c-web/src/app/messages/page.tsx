import { getAppPageHeaderOffset } from "@/components/mobile/app-page-header.constants";
import { MobileHeader } from "@/components/mobile/mobile-header";

export default function MessagesPage() {
  return (
    <div className="min-h-full bg-[#f2f4f6]">
      <MobileHeader
        title="알림"
        variant="sub"
        showBackButton
        backHref="/explore"
        showNotification={false}
      />
      <div
        className="px-4 pb-6"
        style={{ paddingTop: getAppPageHeaderOffset() + 24 }}
      >
        <p className="text-muted-foreground">
          브랜드·대행사와의 대화 및 알림이 여기에 표시됩니다.
        </p>
        <ul className="mt-4 space-y-2">
          {[
            { title: "새 캠페인 매칭", time: "방금", unread: true },
            { title: "미션 검수 완료", time: "1시간 전", unread: true },
            { title: "정산 입금 안내", time: "어제", unread: false },
          ].map((item) => (
            <li
              key={item.title}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-foreground/5"
            >
              <span
                className={`size-2 shrink-0 rounded-full ${item.unread ? "bg-primary" : "bg-transparent"}`}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
