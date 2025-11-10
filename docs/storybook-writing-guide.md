# Storybook 컴포넌트 문서 작성 가이드

## 목적

컴포넌트 문서는 **사용자 시나리오**를 중심으로 작성하여, 독자가 실제 사용 흐름을 머릿속으로 그릴 수 있어야 합니다.

---

## 문서 구조

### 1. 최상단 요약 (Component Description)

**형식:**
```markdown
[컴포넌트명] - [한 줄 설명]

**[핵심 기능1]**과 **[핵심 기능2]**를 통해 [사용자가 얻는 가치]를 제공합니다.
```

**좋은 예시:**
```markdown
제품 브라우징 및 상세 탐색 페이지

**Header**의 **그리드 확대 기능**과 **필터 기능**을 통해 제품들을 역동적으로 탐색하고,
그리드 안의 각 상품을 선택하면 **Zoom-in 모드**로 돌입하여 상품의 디테일한 정보를 확인할 수 있습니다.
```

**나쁜 예시:**
```markdown
메인 페이지 - 제품 그리드 및 상세 뷰

### 주요 기능
- 필터링
- Grid Zoom
- Item Zoom
```

---

### 2. 기능 섹션 (Feature Sections)

각 섹션은 **사용자 관점의 기능**으로 시작하고, **어떤 컴포넌트가 어떻게 구현하는지** 설명합니다.

**형식:**
```markdown
### [N]. [사용자 관점의 기능명]

**[담당 컴포넌트]**가 제공하는 기능:

#### 🎯 [세부 기능 1]
- 사용자 액션 설명
- **컴포넌트명**이 어떻게 처리하는지 설명
- 결과 또는 효과

#### 📦 [세부 기능 2]
...
```

**좋은 예시:**
```markdown
### 1. 제품 탐색 - 그리드 뷰

**Header 컴포넌트**가 제공하는 두 가지 탐색 방식:

#### 📊 그리드 확대 기능 (Grid Zoom)
- 네비게이션 버튼 클릭 시 그리드가 3단계로 확대/축소
- **GridContainer**가 Transform 기반 애니메이션으로 부드러운 줌 효과 제공
- 화면에 보이는 제품 수를 조절하여 집중도 향상

#### 🔍 필터 기능
- 성별(Men/Women) 및 색상(Black/White) 필터 제공
- **MainPage**가 필터 조건에 맞는 제품만 계산하여 **DynamicGrid**에 전달
- 필터 변경 시 그리드가 즉시 재배열되어 원하는 제품만 표시
```

**나쁜 예시:**
```markdown
### GridContainer

Transform 기반 줌 애니메이션을 관리합니다.

Props:
- selectedProductId
- columns
- gap
```

---

### 3. 컴포넌트 계층구조 (Component Hierarchy)

ASCII 트리로 시각화하여 전체 구조를 한눈에 파악할 수 있게 합니다.

**형식:**
```markdown
### 컴포넌트 계층구조

\`\`\`
ParentComponent
├── ChildComponent1
│   └── GrandchildComponent
├── ChildComponent2
└── ConditionalComponent (조건부)
\`\`\`
```

**좋은 예시:**
```markdown
### 컴포넌트 계층구조

\`\`\`
MainPage
└── Box (Container)
    ├── Header
    └── Box (Main Wrapper)
        └── GridContainer
            └── DynamicGrid
                └── ProductCard[] (반복)
└── ProductDetailView (조건부 - Overlay)
    └── Matrix2DCarousel
\`\`\`
```

---

### 4. 컴포넌트별 역할 테이블 (Component Roles)

각 컴포넌트가 **무엇을 담당**하고, **어떻게 구현**하는지 명확히 정리합니다.

**형식:**
```markdown
### 컴포넌트별 역할

| 컴포넌트 | 담당 기능 | 구현 방식 |
|---------|----------|----------|
| **ComponentName** | 사용자 관점의 기능 | 기술적 구현 방법 |
```

**좋은 예시:**
```markdown
### 컴포넌트별 역할

| 컴포넌트 | 담당 기능 | 구현 방식 |
|---------|----------|----------|
| **MainPage** | 전체 상태 관리 및 조율 | 필터링 로직, 선택 상태, 이벤트 핸들러 통합 |
| **Header** | 탐색 도구 제공 | 그리드 확대 버튼, 필터 UI, 카트 버튼 |
| **GridContainer** | Zoom 애니메이션 | Transform 계산 및 부드러운 전환 효과 |
| **Matrix2DCarousel** | 2D 이미지 네비게이션 | 가로(이미지), 세로(제품) 독립 탐색 |
```

**나쁜 예시:**
```markdown
| 컴포넌트 | 역할 |
|---------|------|
| MainPage | 페이지 컨테이너 |
| Header | 헤더 |
| GridContainer | 컨테이너 |
```

---

## 작성 원칙

### ✅ DO

1. **사용자 시나리오부터 시작**
   - "사용자가 X를 하면 Y가 일어난다"
   - 기술 용어보다 경험 중심 표현 사용

2. **기능과 컴포넌트 연결**
   - 각 기능을 설명할 때 담당 컴포넌트 명시
   - 컴포넌트 이름은 **볼드** 처리

3. **구체적인 예시 제공**
   - 추상적: "필터 기능 제공"
   - 구체적: "성별(Men/Women) 및 색상(Black/White) 필터 제공"

4. **시각적 구분 활용**
   - 이모지로 섹션 구분 (📊 🔍 🎬 🎯 등)
   - 수평선(`---`)으로 섹션 분리
   - 코드 블록으로 계층구조 표현

5. **흐름 중심 작성**
   - 사용자의 자연스러운 탐색 순서대로 설명
   - 단계별로 어떤 컴포넌트가 개입하는지 설명

### ❌ DON'T

1. **기술 명세서처럼 작성하지 않기**
   - Props 리스트만 나열
   - 구현 세부사항만 설명
   - 사용자 관점 없이 컴포넌트 관점만 설명

2. **너무 짧거나 모호한 설명**
   - "상태 관리" → "전체 상태 관리 및 조율"
   - "버튼" → "그리드 확대 버튼, 필터 UI, 카트 버튼"

3. **순환 참조 설명**
   - "X는 Y를 사용하고, Y는 X를 사용한다"
   - 명확한 흐름을 제시

4. **예제 코드 포함하지 않기**
   - Docs는 **개념과 흐름** 설명
   - 예제는 **Stories**로 제공

---

## 실전 예시

### Before (기술 중심)

```markdown
# DynamicGrid

CSS Grid 기반 레이아웃 컴포넌트

## Props
- columns: number
- gap: number
- children: ReactNode

## 사용법
columns와 gap을 전달하여 그리드를 생성합니다.
```

### After (사용자 중심)

```markdown
# DynamicGrid - 반응형 제품 그리드

**columns** 값에 따라 자동으로 제품 카드를 배치하는 반응형 그리드입니다.

## 동작 방식

1. **MainPage**가 화면 크기와 줌 레벨에 따라 최적의 columns 값 계산
2. **DynamicGrid**가 CSS Grid로 해당 컬럼 수만큼 제품 카드 배치
3. 필터 변경 시 자동으로 재배열하여 원하는 제품만 표시

## 컴포넌트 역할

| 담당 기능 | 구현 방식 |
|----------|----------|
| 반응형 그리드 레이아웃 | CSS Grid로 제품 카드 배치 및 컬럼 조정 |
| 자동 간격 조정 | gap prop으로 카드 간 여백 통일 |
| 필터 대응 | children 변경 시 자동 리렌더링 |
```

---

## 템플릿

```markdown
# [컴포넌트명] - [한 줄 설명]

[핵심 기능들]을 통해 [사용자 가치]를 제공합니다.

---

### 1. [첫 번째 사용자 시나리오]

**[담당 컴포넌트]**가 제공하는 기능:

#### 🎯 [세부 기능 1]
- 사용자 액션
- **컴포넌트**의 처리 방식
- 결과

#### 📦 [세부 기능 2]
...

---

### 2. [두 번째 사용자 시나리오]

...

---

### 컴포넌트 계층구조

\`\`\`
ParentComponent
└── ChildComponent
    └── GrandchildComponent
\`\`\`

### 컴포넌트별 역할

| 컴포넌트 | 담당 기능 | 구현 방식 |
|---------|----------|----------|
| **Component1** | ... | ... |
| **Component2** | ... | ... |
```

---

## 체크리스트

문서 작성 후 다음을 확인하세요:

- [ ] 사용자가 컴포넌트를 **왜** 사용하는지 명확한가?
- [ ] 사용자가 컴포넌트를 **어떻게** 사용하는지 시나리오로 설명했는가?
- [ ] 각 기능마다 **담당 컴포넌트**를 명시했는가?
- [ ] 기술 용어보다 **사용자 경험** 중심으로 작성했는가?
- [ ] 계층구조와 역할 테이블이 **일관성** 있는가?
- [ ] 독자가 **전체 흐름**을 머릿속으로 그릴 수 있는가?

---

## AI 프롬프트 작성 요령

디자이너가 프롬프트만으로 이 디자인 시스템을 재생성할 수 있도록, 컴포넌트 설계를 역추적하여 작성합니다.

### 프롬프트 구조

```
[컴포넌트명] 컴포넌트 생성

## 역할
[사용자 관점에서 이 컴포넌트가 해결하는 문제]

## 핵심 기능
1. [기능1]: [어떻게 작동하는지]
2. [기능2]: [어떻게 작동하는지]

## Props 인터페이스
- [propName]: {type} - [목적 및 사용 방식]
- [propName]: {type} [Optional/Required] - [기본값], [목적]

## 구현 요구사항
### UI/UX
- [구체적인 UI 동작]
- [애니메이션/트랜지션 세부사항]
- [반응형 동작]

### 상태 관리
- [내부 상태]
- [부모와의 상호작용]

### 이벤트 처리
- [이벤트명]: [발생 조건] → [결과]

## 의존 컴포넌트
- [ChildComponent]: [사용 목적]

## 스타일링 방침
- [레이아웃 방식]
- [주요 CSS 속성]
- [반응형 breakpoint]
```

---

### 실전 예시: Matrix2DCarousel

```markdown
Matrix2DCarousel 컴포넌트 생성

## 역할
사용자가 제품(세로축)과 착용샷(가로축)을 독립적으로 탐색할 수 있는 2D 네비게이션 캐로셀

## 핵심 기능
1. **가로 네비게이션**: 좌우 화살표로 현재 제품의 이미지를 전환
2. **세로 네비게이션**: 휠 스크롤/키보드(↑↓)로 다른 제품으로 전환
3. **인디케이터**: 현재 이미지 위치 표시 및 직접 선택 가능
4. **ESC 닫기**: ESC 키로 캐로셀 종료

## Props 인터페이스
- items: Array<{id, name, images[]}> [Required] - 제품 배열
- initialItemId: string|number [Required] - 초기 선택된 제품 ID
- onItemChange: (itemId) => void [Required] - 제품 변경 시 부모에게 알림
- onClose: () => void [Required] - ESC 키 누를 때 호출
- config: Object [Optional] - 반응형 설정
  - viewWidth: string - 캐로셀 너비 (기본값: '70vw')
  - arrowSize: number - 화살표 버튼 크기 (기본값: 40)
  - arrowPosition: number - 화살표 위치 (기본값: 20)
  - indicatorSize: number - 인디케이터 크기 (기본값: 8)

## 구현 요구사항

### UI/UX
- 중앙에 현재 이미지/비디오 표시 (aspectRatio: 1/1)
- 좌우 화살표 버튼은 양쪽 끝에 절대 위치
- 하단 중앙에 인디케이터 배치 (bottom: -48px)
- 이미지 전환 시 가로 슬라이드 애니메이션 (duration: 0.3s)
- 제품 전환 시 세로 슬라이드 애니메이션 (duration: 0.3s)
- 비디오는 자동 재생 (playbackRate: 1.3, muted, loop)

### 상태 관리
- itemIndex: 현재 제품 인덱스 (세로축)
- imageIndexMap: {[itemId]: imageIndex} - 각 제품별 현재 이미지 인덱스 (가로축)
- verticalDirection: 1 | -1 - 세로 애니메이션 방향
- imageDirection: 1 | -1 - 가로 애니메이션 방향
- lastNavigationType: 'horizontal' | 'vertical' - 마지막 네비게이션 타입
- isTransitioningRef: useRef(false) - 빠른 스크롤 방지

### 이벤트 처리
- 좌우 화살표 클릭: imageIndexMap 업데이트, 순환 처리
- 휠 스크롤: deltaY > 0 → 다음 제품, deltaY < 0 → 이전 제품
  - 전환 중이면 무시 (isTransitioningRef)
  - 300ms 후 다시 활성화
- 키보드 ↑↓: 제품 전환
- ESC: onClose() 호출
- 인디케이터 클릭: 해당 인덱스로 이미지 전환

### 애니메이션 variants
```javascript
imageSlideVariants = {
  enter: ({ navType, hDirection, vDirection }) => {
    if (navType === 'horizontal') {
      return { x: hDirection > 0 ? 1000 : -1000, y: 0, opacity: 0 };
    } else {
      return { x: 0, y: vDirection > 0 ? 600 : -600, opacity: 0 };
    }
  },
  center: { x: 0, y: 0, opacity: 1 },
  exit: ({ navType, hDirection, vDirection }) => {
    if (navType === 'horizontal') {
      return { x: hDirection < 0 ? 1000 : -1000, y: 0, opacity: 0 };
    } else {
      return { x: 0, y: vDirection < 0 ? 600 : -600, opacity: 0 };
    }
  }
}
```

## 의존 컴포넌트
- ArrowButton: 좌우 화살표 버튼
- Indicator: 하단 인디케이터
- MediaRenderer: 이미지/비디오 렌더링 (AnimatePresence로 감싸기)

## 스타일링 방침
- MUI Box 사용
- position: relative (전체 컨테이너)
- aspectRatio: '1/1' 유지
- overflow: hidden
- Framer Motion의 AnimatePresence로 enter/exit 애니메이션
- Custom variants로 2D 방향 제어

## 주의사항
- initialItemId는 마운트 시에만 사용 (이후 내부 상태로 관리)
- onItemChange를 ref로 관리하여 dependency 이슈 방지
- window 이벤트 리스너는 cleanup 필수
- 휠 이벤트는 preventDefault로 기본 스크롤 차단
```

---

### 프롬프트 작성 원칙

#### 1. **역할 먼저, 구현 나중**
```
❌ "CSS Grid를 사용하는 컴포넌트"
✅ "반응형으로 제품 카드를 배치하는 그리드 레이아웃"
```

#### 2. **Props는 목적과 함께**
```
❌ columns: number
✅ columns: number [Required] - 화면 크기와 줌 레벨에 따라 MainPage가 계산한 최적 컬럼 수
```

#### 3. **구체적인 값 명시**
```
❌ "부드러운 애니메이션"
✅ "duration: 0.3s, ease: 'easeInOut'"
```

#### 4. **상호작용 시나리오 작성**
```
사용자가 좌측 화살표 클릭
→ handlePrevImage() 호출
→ imageIndexMap[currentItem.id] - 1 (순환)
→ imageDirection = -1 설정
→ AnimatePresence가 exit → enter 애니메이션 실행
→ 새 이미지가 우→좌로 슬라이드
```

#### 5. **엣지 케이스 포함**
```
- 마지막 제품에서 다음 버튼: 순환하여 첫 제품으로
- 첫 제품에서 이전 버튼: 순환하여 마지막 제품으로
- 전환 중 추가 스크롤: isTransitioningRef로 무시
- 필터 변경으로 현재 제품 사라짐: 부모에서 null로 설정
```

#### 6. **의존성 명시**
```
## 부모 컴포넌트 책임
- filteredProducts 계산 및 전달
- selectedProductId 상태 관리
- 필터 변경 시 유효성 검증

## 자식 컴포넌트 사용
- MediaRenderer에 videoRef 전달하여 재생 제어
- ArrowButton에 onClick, direction, size, position 전달
```

---

### 프롬프트 템플릿

```markdown
[ComponentName] 컴포넌트 생성

## 역할
[1-2문장으로 사용자 관점의 목적]

## 핵심 기능
1. [기능명]: [동작 방식]
2. [기능명]: [동작 방식]

## Props 인터페이스
```typescript
interface [ComponentName]Props {
  // Required
  [propName]: [type]; // [목적 및 사용 방식]

  // Optional
  [propName]?: [type]; // 기본값: [value], [목적]
}
```

## 구현 요구사항

### UI/UX
- [레이아웃]: [구체적인 CSS]
- [애니메이션]: [duration, easing, property]
- [인터랙션]: [이벤트] → [반응]

### 상태 관리
- [stateName]: [type] - [목적]
- [refName]: useRef([initialValue]) - [목적]

### 이벤트 처리
[이벤트명]
→ [조건 체크]
→ [상태 업데이트]
→ [부모 콜백 호출]
→ [애니메이션 트리거]

### 생명주기
- Mount: [초기화 로직]
- Update: [조건] 시 [처리]
- Unmount: [cleanup 로직]

## 의존 컴포넌트
- [Component]: [props 전달 내용]

## 스타일링
- 사용 라이브러리: [MUI/Styled-components/CSS]
- 주요 속성: [구체적인 CSS]
- 반응형: [breakpoint별 변경사항]

## 엣지 케이스
- [상황]: [처리 방법]

## 성능 최적화
- [기법]: [적용 이유]
```

---

### 체크리스트: 프롬프트 작성 후

- [ ] 역할이 **사용자 관점**으로 명확한가?
- [ ] Props마다 **목적과 사용 방식**을 설명했는가?
- [ ] **구체적인 값**(duration, size, color 등)을 명시했는가?
- [ ] **인터랙션 시나리오**가 단계별로 설명되었는가?
- [ ] **엣지 케이스**를 포함했는가?
- [ ] 부모/자식 컴포넌트와의 **의존성**이 명확한가?
- [ ] AI가 이 프롬프트만으로 **동일한 컴포넌트를 재생성**할 수 있는가?

---

## 참고 자료

- 실제 적용 예시: `src/pages/MainPage.stories.jsx`
- 프롬프트 예시: 위 Matrix2DCarousel 섹션 참고
