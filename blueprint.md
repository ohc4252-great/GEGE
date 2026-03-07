# Blueprint: 현명한 소비하기 (가계부 웹 애플리케이션) - 완료

## 1. 개요 (Overview)
- **앱 이름**: 현명한 소비하기
- **목적**: 사용자가 자신의 지출을 기록하고 점수화하여 스스로 반성하고, 예산 내에서 합리적인 소비를 할 수 있도록 돕는 서비스.
- **주요 기능**: 지출 내역 기록, 월별 예산 및 달성률, 월 평균 소비 점수(온도탑), 카테고리별 지출 비율, 달력을 통한 일별 소비 점검.

## 2. 기술 스택 (Tech Stack)
- **프론트엔드 프레임워크**: React (Vite 기반, TypeScript)
- **스타일링**: Tailwind CSS v4
- **상태 관리 및 스토리지**: 브라우저 `localStorage`, React Context API
- **차트**: Recharts
- **아이콘**: Lucide-react
- **유틸리티**: date-fns (날짜 처리), clsx & tailwind-merge (클래스 병합)

## 3. 구현 상세 (Implementation Details)

### 3.1. 전역 상태 관리 (ExpenseContext)
- `expenses`: 지출 목록 (id, date, category, title, detail, amount, score)
- `evaluations`: 날짜별 한 줄 소비 평가 (date, comment)
- `budget`: 이번 달 목표 예산 (기본값: 0)
- `selectedDate`: 캘린더에서 선택된 활성 날짜 (YYYY-MM-DD)
- **로직**: `localStorage` 자동 동기화 및 JSON Export/Import 기능 포함.

### 3.2. 화면 및 컴포넌트 구성
1. **App.tsx**: 상단 헤더(스티키), 반응형 그리드 레이아웃(L: 대시보드+캘린더, R: 상세 패널).
2. **Dashboard.tsx**: 
   - 예산 대비 지출 프로그레스 바.
   - 소비 평균 점수 게이지 바(온도탑).
   - 카테고리별 지출 도넛 차트(Recharts).
   - 데이터 백업/복구 버튼.
3. **Calendar.tsx**: 
   - 반응형 일일 그리드 달력.
   - 일별 총 지출액 표시.
   - 평균 소비 점수 도트 및 색상 인디케이터.
4. **DailyPanel.tsx**: 
   - 선택된 날짜의 소비 내역 리스트(분류, 제목, 금액, 점수).
   - 개별 항목 수정/삭제 기능.
   - '오늘의 한 줄 평가' 작성 및 수정.
5. **ExpenseModal.tsx**: 
   - 지출 추가/수정 폼.
   - 원 단위 콤마 자동 포맷팅.
   - 1~10점 소비 가치 평가 슬라이더.

## 4. 디자인 시스템 (Design System)
- **색상**: `#fdfbf7`(배경), `#86efac`(안정), `#fef08a`(주의), `#fca5a5`(경고), `#3b82f6`(포인트).
- **스타일**: 파스텔 톤 테마, 부드러운 그림자(soft-shadow), 둥근 모서리(rounded-2xl) 적용.
- **폰트**: Pretendard 등 시스템 샌드세리프 폰트 계열.

## 5. 현재 변경 진행 사항 (Current Tasks)
- [x] 요구사항 분석 및 `blueprint.md` 생성
- [x] 기존 프로젝트 파일 정리 및 Vite React 스캐폴딩
- [x] Tailwind CSS v4 및 필요 라이브러리 설치
- [x] 컴포넌트 개발 및 UI 구성 (Dashboard, Calendar, Panel, Modal)
- [x] 상태 관리 연동 및 최종 테스트
- [x] 개발 서버 실행 및 결과 확인
