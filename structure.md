너는 토스(Toss) 앱의 핵심 UI/UX 철학을 완벽하게 이해하고 있는 10년 차 수석 프론트엔드 개발자이자 프로덕트 디자이너야. 
지금부터 B2C 블로거들을 위한 모바일 웹(Mobile-First) '캠페인 탐색 및 상세 화면' 컴포넌트를 만들 거야. 아래 요구사항에 맞춰 React와 Tailwind CSS를 사용해 깔끔하고 모던한 코드를 작성해 줘. 모바일 화면(최대 너비 480px, 중앙 정렬)을 기준으로 스타일링해 줘.

[디자인 시스템 가이드 : Toss 스타일 모바일]
- 메인 컬러: Toss Blue (`#3182F6`)
- 배경 컬러: 앱 전체 배경은 연한 회색(`#F2F4F6`)으로 깔고, 각 캠페인 리스트 카드와 상세 내용은 순백색(`#FFFFFF`) 컨테이너로 분리해 줘.
- 타이포그래피: 가격(보상 금액)과 숫자는 크고 굵게(Bold), 부가 설명은 연한 회색 텍스트로 시각적 위계를 확실히 잡아줘.
- 모서리: 모바일 환경에 맞게 카드 UI의 모서리를 부드럽게(`rounded-2xl`) 처리해 줘.


📱 1. B2C 블로거용 마켓플레이스 (Mobile-First)
A. 캠페인 탐색 홈 (Aggregator)

```js
<MobileLayout>
  <Header title="캠페인 탐색" />
  <CategoryTabs categories={['전체', '맛집', '뷰티', 'IT/테크']} />
  <FilterDropdown options={['최신순', '마감임박순']} />
  
  <CampaignList> {/* 무한 스크롤 적용 영역 */}
    <CampaignCard> {/* ♻️ 공통 컴포넌트 후보 */}
      <ThumbnailImage src="..." />
      <TitleArea title="..." reward="..." />
      <ProgressBar current={23} total={50} />
    </CampaignCard>
    {/* ... 더 많은 카드들 ... */}
  </CampaignList>
</MobileLayout>
```


B. 캠페인 상세 화면
```js
<MobileLayout>
  <Header showBackButton />
  <HeroImage src="..." />
  <CampaignInfo title="..." reward="..." />
  
  <MissionGuideline>
    <ChecklistItem text="필수 키워드 3개 포함" />
    <ChecklistItem text="사진 5장 이상 첨부" />
  </MissionGuideline>
  
  <ProgressBadge current={23} total={50} />
  
  <FixedBottomCTA text="미션 수락하기" onClick={...} /> {/* ♻️ 하단 고정 공통 CTA */}
</MobileLayout>
```


C. 내 미션 관리 화면
```js
<MobileLayout>
  <Header title="내 미션" />
  <MissionTabs activeTab="진행 중" />
  
  <MissionList>
    {/* 데이터가 없을 때 */}
    <EmptyState message="아직 진행 중인 미션이 없어요" actionText="캠페인 찾기" />
    
    {/* 데이터가 있을 때 */}
    <MissionCard status="LOCKED"> 
      <CampaignSummary />
      <Accordion> {/* ♻️ 클릭 시 부드럽게 열리는 래퍼 */}
        <UrlSubmitForm>
          <Input placeholder="작성한 블로그 URL 입력" />
          <SubmitButton text="제출" />
        </UrlSubmitForm>
      </Accordion>
    </MissionCard>
  </MissionList>
</MobileLayout>
```


D. 통합 에스크로 지갑 화면
```js
<MobileLayout>
  <Header title="내 지갑" />
  <WalletHero balance={120000}>
    <WithdrawButton text="출금 신청하기" />
  </WalletHero>
  
  <SectionTitle title="포인트 내역" />
  <HistoryFilter options={['전체', '입금', '출금']} />
  
  <HistoryList>
    <HistoryItem date="05.19" title="강남 맛집 뷰티 체험" amount={+50000} type="deposit" />
    <Divider /> {/* ♻️ 리스트 구분선 */}
    <HistoryItem date="05.18" title="출금 완료" amount={-50000} type="withdraw" />
  </HistoryList>
</MobileLayout>
```


💻 2. B2B 통합 관리자 대시보드 (PC-First)


A. 자영업자(광고주) 예치금 충전 화면
```js
<DashboardLayout>
  <Sidebar role="ADVERTISER" /> {/* ♻️ 권한에 따라 메뉴 변경 */}
  <ContentArea>
    <PageTitle title="얼마를 충전할까요?" />
    <WalletStatusWidget balance={...} lockedBalance={...} />
    
    <ChargeSection>
      <AmountInput value={chargeAmount} onChange={...} />
      <PresetButtonGroup>
        <PresetButton value={100000} label="+10만 원" /> {/* ♻️ 공통 버튼 활용 */}
        <PresetButton value={500000} label="+50만 원" />
      </PresetButtonGroup>
    </ChargeSection>
    
    <ChargeCTA disabled={chargeAmount === 0} loading={isPaymentPending} />
  </ContentArea>
</DashboardLayout>
```


B. 대행사 캠페인 관리 화면 (MVP)
```js
<DashboardLayout>
  <Sidebar role="AGENCY" />
  <ContentArea>
    <PageTitle title="캠페인 관리" />
    <CampaignActionRow>
      <CreateCampaignButton onClick={openModal} />
    </CampaignActionRow>
    
    <CampaignDataTable> {/* ♻️ 공통 데이터 테이블 */}
      <TableRow>
        <TableCell>강남역 팝업스토어 리뷰</TableCell>
        <TableCell><ApplicantBadge pending={5} approved={10} /></TableCell>
        <TableCell>
          <ApplicantManageModal> {/* 지원자 관리용 팝업 */}
            <ApplicantList>
              <ApplicantItem name="..." url="...">
                <ApproveButton />
                <RejectButton />
              </ApplicantItem>
            </ApplicantList>
          </ApplicantManageModal>
        </TableCell>
      </TableRow>
    </CampaignDataTable>
  </ContentArea>
</DashboardLayout>
```