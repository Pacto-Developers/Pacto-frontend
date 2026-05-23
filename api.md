# Pacto API Reference

> **출처:** `API_INFOMATION/개인 페이지 & 공유된 페이지` (Notion export — md + Request/Response CSV)  
> **Base path:** `/api/v1`  
> **테스트:** 전 엔드포인트 Local / Dev **시작 전**

---

## 목차

1. [공통 규약](#공통-규약)
2. [API 목록](#api-목록)
3. [Auth](#auth)
4. [Campaign](#campaign)
5. [Mission](#mission)
6. [Wallet](#wallet)
7. [Escrow](#escrow)
8. [Payment](#payment)
9. [Dashboard](#dashboard)
10. [상태·열거값](#상태열거값)
11. [포트원 결제 흐름](#포트원-결제-흐름)
12. [프론트 화면 매핑](#프론트-화면-매핑)

---

## 공통 규약

### 응답 래퍼

```json
{
  "success": true,
  "message": "성공 메시지",
  "data": {},
  "timestamp": "2026-05-19T16:00:00"
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `success` | Boolean | 요청 성공 여부 |
| `message` | String | 응답 메시지 |
| `data` | Object \| null | payload |
| `timestamp` | String | 응답 시각 (일부 Wallet API는 생략 가능) |

### 인증 헤더

| 헤더 | 값 | 비고 |
|------|-----|------|
| `Authorization` | `Bearer {JWT_TOKEN}` | 인증 필요 API (CSV 기준 대부분 **필수**) |

### 역할

| Role | 설명 |
|------|------|
| `BUSINESS` | 광고주 (회원가입·로그인 응답) |
| `BLOGGER` | 블로거 |

> Campaign/Mission 설명문에는 `ROLE_ADVERTISER` / `ROLE_BLOGGER` 표기 — BE enum과 매핑 확인.

### 페이지네이션 주의

API마다 **page 기본값이 다름** (CSV 기준).

| API | page 기본값 | size 기본값 |
|-----|-------------|-------------|
| `GET /campaigns` | `0` | `20` |
| `GET /missions/me` | `0` | `10` |
| `GET /escrows` | `1` | — |
| `GET /wallets/me/histories` | `1` | — |

---

## API 목록

| 이름 | 도메인 | Method | URL | 담당 |
|------|--------|--------|-----|------|
| 회원가입 | Auth | POST | `/auth/signup` | 지원 황 |
| 로그인 | Auth | POST | `/auth/login` | 지원 황 |
| 유저 정보 조회 | Auth | GET | `/users/me` | 지원 황 |
| 캠페인 목록 조회 | Campaign | GET | `/campaigns` | 장지연 |
| 캠페인 상세 조회 | Campaign | GET | `/campaigns/{campaignId}` | 장지연 |
| 캠페인 등록 | Campaign | POST | `/campaigns` | 장지연 |
| 캠페인 상태 변경 | Campaign | PATCH | `/campaigns/{campaignId}/status` | 장지연 |
| 미션 수락 | Mission | POST | `/campaigns/{campaignId}/missions` | 장지연 |
| 내 미션 목록 | Mission | GET | `/missions/me` | 장지연 |
| URL 제출 | Mission | PATCH | `/missions/{escrowId}/submit` | 장지연 |
| 미션 승인 | Mission | PATCH | `/missions/{escrowId}/approve` | 장지연 |
| 미션 취소 | Mission | PATCH | `/missions/{escrowId}/cancel` | 장지연 |
| 내 지갑 잔액 조회 | Wallet | GET | `/wallets/me` | 승환 양 |
| 포인트 변동 내역 조회 | Wallet | GET | `/wallets/me/histories` | 승환 양 |
| 출금 신청(환전) | Wallet | POST | `/wallets/withdraw` | 승환 양 |
| 내 에스크로 잠금 내역 조회 | Escrow | GET | `/escrows` | 승환 양 |
| 에스크로 정산 실행 | Escrow | POST | `/escrows/{escrowId}/release` | 승환 양 |
| 에스크로 환불/취소 실행 | Escrow | POST | `/escrows/{escrowId}/cancel` | 승환 양 |
| 결제 준비 | Payment | POST | `/payments/prepare` | 지원 황 |
| 결제 내역 조회 | Payment | GET | `/payments/{paymentId}` | 지원 황 |
| 포트원 연결 (웹훅) | Payment | POST | `/payments/webhook` | 지원 황 |
| 대시보드 요약 조회 | Dashboard | GET | `/dashboard/summary` | 지원 황 |

---

## Auth

### POST `/auth/signup` — 회원가입

**Request — BUSINESS**

| 필드 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| `email` | Body | String | ✅ | |
| `password` | Body | String | ✅ | |
| `role` | Body | String | ✅ | `BUSINESS` |
| `companyName` | Body | String | ✅ | |
| `businessNumber` | Body | String | ✅ | |
| `contactName` | Body | String | ✅ | |
| `contactPhone` | Body | String | ✅ | |

**Request — BLOGGER**

| 필드 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| `email` | Body | String | ✅ | |
| `password` | Body | String | ✅ | |
| `role` | Body | String | ✅ | `BLOGGER` |
| `nickname` | Body | String | ✅ | |
| `blogUrl` | Body | String | ✅ | |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `userId` | Number | |
| `role` | String | |

**에러:** `이미 존재하는 이메일입니다.`

---

### POST `/auth/login` — 로그인

**Request**

| 필드 | 위치 | 타입 | 필수 |
|------|------|------|------|
| `email` | Body | String | ✅ |
| `password` | Body | String | ✅ |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `accessToken` | String | JWT |
| `refreshToken` | String | JWT |
| `role` | String | `BUSINESS` \| `BLOGGER` |

**에러:** `이메일 또는 비밀번호가 올바르지 않습니다.`

---

### GET `/users/me` — 유저 정보 조회

**Request**

| 필드 | 위치 | 타입 | 필수 |
|------|------|------|------|
| `Authorization` | Header | String | ✅ |

**Response `data` — BUSINESS**

| 필드 | 타입 |
|------|------|
| `id` | Number |
| `email` | String |
| `role` | String |
| `companyName` | String |

**Response `data` — BLOGGER**

| 필드 | 타입 |
|------|------|
| `id` | Number |
| `email` | String |
| `role` | String |
| `nickname` | String |
| `blogUrl` | String |

---

## Campaign

### GET `/campaigns` — 캠페인 목록 조회

- **Public** (로그인 불필요)
- B2C 캠페인 탐색·무한 스크롤

**Request (Query)**

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `status` | String | | — | `OPEN` / `CLOSED` / `CANCELED` |
| `page` | Number | | `0` | 페이지 번호 |
| `size` | Number | | `20` | 페이지 크기 |
| `sort` | String | | `createdAt,desc` | 정렬 기준 |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `content[]` | Array | 캠페인 목록 |
| `content[].campaign_id` | Number | 캠페인 ID |
| `content[].title` | String | 제목 |
| `content[].category` | String | 카테고리 |
| `content[].reward_point` | Number | 보상 포인트 |
| `content[].total_slots` | Number | 전체 모집 인원 |
| `content[].remaining_slots` | Number | 잔여 모집 인원 |
| `content[].deadline` | String | 마감 일시 |
| `content[].status` | String | `OPEN` / `CLOSED` / `CANCELED` |
| `content[].d_day` | Number | 마감까지 남은 일수 |
| `page` | Number | 현재 페이지 |
| `size` | Number | 페이지 크기 |
| `total_elements` | Number | 전체 건수 |
| `total_pages` | Number | 전체 페이지 |

---

### GET `/campaigns/{campaignId}` — 캠페인 상세 조회

- **Public**
- 없는 ID → **404** `존재하지 않는 캠페인입니다.`

**Request**

| 필드 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| `campaignId` | Path | Number | ✅ | 캠페인 ID |
| `Authorization` | Header | String | | 선택 (public) |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `campaign_id` | Number | |
| `advertiser_id` | Number | 광고주 ID |
| `title` | String | |
| `description` | String | 상세 설명 |
| `category` | String | |
| `reward_point` | Number | |
| `total_slots` | Number | |
| `remaining_slots` | Number | |
| `deadline` | String | |
| `status` | String | |
| `requirements` | Array | 미션 요구사항 목록 |
| `created_at` | String | 등록 일시 |

---

### POST `/campaigns` — 캠페인 등록

- **광고주 전용** — 블로거 호출 시 **403**
- 등록 시 `total_slots × reward_point` → `balance`에서 `locked_balance`로 이동 (BE1 원장)
- 잔액 부족 → **400** `잔액이 부족합니다.`

**Request**

| 필드 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| `Authorization` | Header | String | ✅ | |
| `title` | Body | String | ✅ | 캠페인 제목 |
| `description` | Body | String | ✅ | 상세 설명 |
| `category` | Body | String | ✅ | 카테고리 |
| `reward_point` | Body | Number | ✅ | 미션 완료 보상 포인트 |
| `total_slots` | Body | Number | ✅ | 전체 모집 인원 |
| `deadline` | Body | String | ✅ | 미션 마감 일시 |
| `requirements` | Body | Array | | 미션 요구사항 목록 |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `campaign_id` | Number | 생성된 ID |
| `status` | String | `OPEN` |
| `created_at` | String | |

---

### PATCH `/campaigns/{campaignId}/status` — 캠페인 상태 변경

- **본인 캠페인만** — 타인 **403**
- 모집 중단·전체 취소 등 (핵심 필드는 PATCH로만 변경)

**Request**

| 필드 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| `Authorization` | Header | String | ✅ | |
| `campaignId` | Path | Number | ✅ | |
| `status` | Body | String | ✅ | `OPEN` / `CLOSED` / `CANCELED` |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `campaign_id` | Number | |
| `status` | String | 변경된 상태 |
| `updated_at` | String | |

**에러:** `유효하지 않은 상태 값입니다.` (400) / `본인 캠페인만 수정할 수 있습니다.` (403)

---

## Mission

> 미션 1건 = 에스크로 1건 (`escrow_id`)

### POST `/campaigns/{campaignId}/missions` — 미션 수락

- **블로거 전용**
- Redis 분산 락 — 선착순 슬롯
- 수락 시 BE1 `escrow_ledger` 생성

**Request**

| 필드 | 위치 | 타입 | 필수 |
|------|------|------|------|
| `Authorization` | Header | String | ✅ |
| `campaignId` | Path | Number | ✅ |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `escrow_id` | Number | 생성된 에스크로 ID |
| `campaign_id` | Number | |
| `blogger_id` | Number | |
| `reward_point` | Number | 묶인 보상 포인트 |
| `status` | String | `LOCKED` |
| `deadline` | String | |
| `created_at` | String | |

**에러**

| HTTP | 메시지 |
|------|--------|
| 409 | `선착순 마감되었습니다.` |
| 409 | `이미 수락한 캠페인입니다.` |
| 503 | `잠시 후 다시 시도해주세요.` (락 실패) |

---

### GET `/missions/me` — 내 미션 목록

- **블로거 전용**
- `status` 쿼리로 탭 분리

**Request (Query + Header)**

| 필드 | 위치 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|------|--------|------|
| `Authorization` | Header | String | ✅ | | |
| `status` | Query | String | | — | `LOCKED` / `SUBMITTED` / `RELEASED` / `CANCELED` |
| `page` | Query | Number | | `0` | |
| `size` | Query | Number | | `10` | |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `content[]` | Array | |
| `content[].escrow_id` | Number | |
| `content[].campaign_title` | String | |
| `content[].reward_point` | Number | |
| `content[].status` | String | |
| `content[].deadline` | String | |
| `content[].submitted_url` | String \| null | 미제출 시 null |
| `page` | Number | |
| `total_elements` | Number | |

---

### PATCH `/missions/{escrowId}/submit` — URL 제출

- `LOCKED` → `SUBMITTED`
- 제출 후 URL 수정 불가 → **확인 모달 권장**
- 본인 미션만

**Request**

| 필드 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| `Authorization` | Header | String | ✅ | |
| `escrowId` | Path | Number | ✅ | |
| `submitted_url` | Body | String | ✅ | 블로그 URL |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `escrow_id` | Number | |
| `status` | String | `SUBMITTED` |
| `submitted_url` | String | |
| `updated_at` | String | |

**에러:** `유효하지 않은 URL 형식입니다.` (409) / `본인 미션만 제출할 수 있습니다.` (403)

---

### PATCH `/missions/{escrowId}/approve` — 미션 승인

- **광고주** — 본인 캠페인 미션만
- `SUBMITTED`만 승인 가능 → BE1 정산 → `RELEASED`

**Request**

| 필드 | 위치 | 타입 | 필수 |
|------|------|------|------|
| `Authorization` | Header | String | ✅ |
| `escrowId` | Path | Number | ✅ |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `escrow_id` | Number | |
| `status` | String | `RELEASED` |
| `released_at` | String | 정산 완료 시각 |

---

### PATCH `/missions/{escrowId}/cancel` — 미션 취소

**Request**

| 필드 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| `Authorization` | Header | String | ✅ | |
| `escrowId` | Path | Number | ✅ | |
| `reason` | Body | String | ✅ | `DEADLINE_EXCEEDED` / `BLOGGER_REQUEST` / `ADVERTISER_REJECT` |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `escrow_id` | Number | |
| `status` | String | `CANCELED` |
| `refunded_point` | Number | 환불 포인트 |
| `canceled_at` | String | |

**에러:** `이미 완료된 미션은 취소할 수 없습니다.` (400)

---

## Wallet

### GET `/wallets/me` — 내 지갑 잔액 조회

**Request**

| 필드 | 위치 | 타입 | 필수 |
|------|------|------|------|
| `Authorization` | Header | String | ✅ |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `wallet_id` | Number | |
| `balance` | Number | 가용 잔액 |
| `locked_balance` | Number | 에스크로 묶인 잔액 |
| `updated_at` | String | |

---

### GET `/wallets/me/histories` — 포인트 변동 내역 조회

**Request**

| 필드 | 위치 | 타입 | 필수 | 기본값 |
|------|------|------|------|--------|
| `Authorization` | Header | String | ✅ | |
| `page` | Query | Number | | `1` |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `content[]` | Array | |
| `content[].history_id` | Number | |
| `content[].type` | String | `CHARGE` / `LOCK` / `RELEASE` / `REFUND` |
| `content[].amount` | Number | 변동 금액 (+/-) |
| `content[].description` | String | (예시 JSON 기준) |
| `content[].created_at` | String | (예시 JSON 기준) |
| `total_pages` | Number | |
| `current_page` | Number | |

---

### POST `/wallets/withdraw` — 출금 신청(환전)

- **블로거 전용**
- 즉시 `balance` 차감, 상태 `PENDING`
- MVP: 관리자 수동 송금 (매주 수요일 일괄)

**Request**

| 필드 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| `Authorization` | Header | String | ✅ | 블로거 |
| `amount` | Body | Number | ✅ | 최소 10,000원 |
| `bank_name` | Body | String | | 입금 은행 |
| `account_number` | Body | String | | 계좌번호 |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `withdraw_id` | Number | |
| `requested_amount` | Number | |
| `remaining_balance` | Number | 신청 후 잔액 |
| `status` | String | `PENDING` |

**에러:** 최소 금액 400 / 잔액 부족 409

---

## Escrow

### GET `/escrows` — 내 에스크로 잠금 내역 조회

- **광고주 전용**

**Request**

| 필드 | 위치 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|------|--------|------|
| `Authorization` | Header | String | ✅ | | 광고주 |
| `page` | Query | Number | | `1` | |
| `status` | Query | String | | — | `LOCKED` / `RELEASED` / `CANCELED` (미입력 시 전체) |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `content[]` | Array | |
| `content[].escrow_id` | Number | |
| `content[].campaign_id` | Number | |
| `content[].campaign_title` | String | |
| `content[].blogger_name` | String | 블로거 닉네임 |
| `content[].amount` | Number | 묶인 금액 |
| `content[].status` | String | |
| `content[].created_at` | String | (예시 JSON) |
| `total_pages` | Number | |
| `current_page` | Number | |

---

### POST `/escrows/{escrowId}/release` — 에스크로 정산 실행

- 광고주/관리자
- `locked_balance` 차감 → 블로거 `balance` 증가

**Request**

| 필드 | 위치 | 타입 | 필수 |
|------|------|------|------|
| `Authorization` | Header | String | ✅ |
| `escrowId` | Path | Number | ✅ |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `escrow_id` | Number | |
| `status` | String | `RELEASED` |
| `settlement_info.blogger_id` | Number | |
| `settlement_info.released_amount` | Number | |
| `settlement_info.released_at` | String | (예시 JSON) |

---

### POST `/escrows/{escrowId}/cancel` — 에스크로 환불/취소 실행

**Request**

| 필드 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| `Authorization` | Header | String | ✅ | 광고주/관리자 |
| `escrowId` | Path | Number | ✅ | |
| `reason` | Body | String | | 환불/취소 사유 (선택) |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `escrow_id` | Number | |
| `status` | String | `CANCELED` |
| `refund_info.advertiser_id` | Number | |
| `refund_info.refunded_amount` | Number | |
| `refund_info.refunded_at` | String | (예시 JSON) |

---

## Payment

### POST `/payments/prepare` — 결제 준비

**Request**

| 필드 | 위치 | 타입 | 필수 |
|------|------|------|------|
| `amount` | Body | Number | ✅ |

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `paymentId` | Number | |
| `merchantUid` | String | PortOne 주문 ID |
| `amount` | Number | |

---

### GET `/payments/{paymentId}` — 결제 내역 조회

**Response `data`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `paymentId` | Number | |
| `merchantUid` | String | |
| `amount` | Number | |
| `status` | String | 예: `PAID` |
| `paidAt` | String | |

---

### POST `/payments/webhook` — 포트원 웹훅

- **프론트 호출 금지** — PortOne → BE2
- 서버에서 PortOne API 재검증 → payment 저장 → BE1 Ledger → 예치금 생성

---

## Dashboard

### GET `/dashboard/summary` — 대시보드 요약 조회

> ⚠️ **스펙 미정** — Notion: "정확한 대시보드 구성 데이터 정의 필요"  
> Request/Response CSV 없음.

---

## 상태·열거값

### 캠페인 `status`

`OPEN` · `CLOSED` · `CANCELED`

### 미션 / 에스크로 `status`

`LOCKED` · `SUBMITTED` · `RELEASED` · `CANCELED`

### 미션 취소 `reason`

| 값 | 설명 |
|----|------|
| `DEADLINE_EXCEEDED` | 기한 초과 (스케줄러) |
| `BLOGGER_REQUEST` | 블로거 자진 취소 |
| `ADVERTISER_REJECT` | 광고주 반려 |

### 포인트 내역 `type`

`CHARGE` · `LOCK` · `RELEASE` · `REFUND`

### 출금 `status`

`PENDING` — 수동 지급 대기

---

## 포트원 결제 흐름

```
광고주 → Frontend
         ↓
       BE2  POST /payments/prepare  → merchantUid
         ↓
       PortOne 결제창 → 카드 결제
         ↓
       (A) Frontend success callback
       (B) PortOne → POST /payments/webhook
             → PortOne API 재검증
             → payment 저장 → BE1 Ledger → 예치금
```

---

## 프론트 화면 매핑

| 화면 (`structure.md`) | API |
|----------------------|-----|
| B2C 캠페인 탐색 | `GET /campaigns` |
| B2C 캠페인 상세 | `GET /campaigns/{id}` |
| 미션 수락 CTA | `POST /campaigns/{id}/missions` |
| 내 미션 | `GET /missions/me`, `PATCH .../submit` |
| 내 지갑 | `GET /wallets/me`, `GET /wallets/me/histories`, `POST /wallets/withdraw` |
| B2B 충전 | `POST /payments/prepare` + PortOne |
| B2B 캠페인 관리 | `POST /campaigns`, `PATCH .../status`, `PATCH .../approve` |
| B2B 에스크로 | `GET /escrows` |
| B2B 대시보드 | `GET /dashboard/summary` (미정) |

---

*마지막 정리: 2026-05-19 — `API_INFOMATION` CSV 필드 스펙 반영*
