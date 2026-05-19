# Pacto

B2C(모바일 웹) + B2B(관리자 대시보드) 모노레포.

## 구조

```
pacto/
├── apps/
│   ├── b2c-web/      # Mobile-First PWA (포트 3000)
│   └── admin-web/    # PC-First RBAC 대시보드 (포트 3001)
└── packages/
    ├── types/        # 공통 타입, Role enum
    ├── auth/         # 권한·메뉴 헬퍼
    ├── api-client/   # API 클라이언트 스켈레톤
    └── config/       # 공유 TS 설정
```

## 시작하기

```bash
npm install
npm run dev          # 두 앱 동시 실행
npm run dev:b2c      # B2C만 (localhost:3000)
npm run dev:admin    # Admin만 (localhost:3001)
```

## Admin RBAC (데모)

미들웨어에서 `role` 쿠키로 Role을 읽습니다. 개발용 로그인:

- `/login` — Role 선택 후 대시보드로 이동
- `/agency/*` — `agency` Role만 접근
- `/advertiser/*` — `advertiser` Role만 접근

## 스택

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- TanStack Query, react-hook-form, zod (앱별 설치)
- Turborepo + npm workspaces
