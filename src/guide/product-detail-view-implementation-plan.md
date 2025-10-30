# 제품 상세 뷰 구현 계획

## 📋 개요

선택된 제품이 확대되었을 때 보여지는 제품 탐색 뷰 컴포넌트를 구현합니다.

### 주요 기능
- **가로 네비게이션**: 제품의 여러 이미지를 carousel loop로 탐색
- **세로 네비게이션**: 스크롤로 그리드 상의 다음/이전 제품으로 이동
- **스크롤 트랜지션**: 일반 스크롤이 아닌 carousel 방식의 discrete 전환

---

## 🎯 핵심 전략

### 1. 컴포넌트 아키텍처

```
ProductDetailView (메인 컨테이너)
├── ImageCarousel (가로 캐러셀)
│   ├── 좌우 화살표 버튼
│   ├── motion.img (현재 이미지)
│   └── 이미지 인디케이터 (점 표시)
└── 세로 스크롤 핸들러 (wheel 이벤트)
```

### 2. 데이터 구조

**현재 제품 데이터 구조:**
```javascript
{
  id: number,
  name: string,
  images: string[], // 3개의 이미지 배열
  date: string,
  category: 'male' | 'female',
  price: number
}
```

### 3. Shared Layout Animation (layoutId)

**목적:** ProductCard에서 ProductDetailView로의 seamless 트랜지션 보장

**문제점:**
- GridContainer의 transform으로 ProductCard가 화면 중앙으로 이동
- ProductDetailView는 별도 fixed layer로 overlay
- 두 이미지가 별개로 존재하면 **위치 불일치** 발생

**해결책:**
```javascript
// ProductCard.jsx
<MotionBox
  layoutId={isSelected && isItemZoomed ? `product-image-${product.id}` : undefined}
  ...
>
  <Box component="img" src={product.images[0]} ... />
</MotionBox>

// ImageCarousel.jsx (첫 번째 이미지만 layoutId 공유)
<motion.img
  key={currentImageIndex}
  layoutId={currentImageIndex === 0 ? `product-image-${productId}` : undefined}
  src={images[currentImageIndex]}
  ...
/>
```

**효과:**
- framer-motion이 자동으로 두 위치 간 morph 애니메이션 생성
- 100% 위치 연속성 보장
- ProductCard → ProductDetailView 전환 시 끊김 없음

**주의사항:**
- ProductCard는 `isItemZoomed`일 때 완전히 숨김 (opacity: 0)
- 첫 번째 이미지만 layoutId를 유지하여 carousel 전환 시 혼란 방지

---

## 🔧 기술 스택

### 사용할 라이브러리
- **framer-motion**: 이미 설치됨, 모든 트랜지션 처리
- **React Hooks**: useState, useEffect, useCallback
- **@mui/material**: 일관된 스타일링

### 추가 설치 불필요
기존 dependencies로 모든 기능 구현 가능

---

## 📦 구현할 컴포넌트

### 1. ImageCarousel.jsx

**경로:** `/src/components/ImageCarousel.jsx`

**Props:**
```javascript
{
  images: string[],           // 이미지 배열
  currentIndex: number,        // 현재 이미지 인덱스
  onNext: () => void,          // 다음 이미지
  onPrev: () => void,          // 이전 이미지
  productName: string,         // alt 텍스트용
  productId: string | number   // layoutId 생성용 [필수]
}
```

**주요 기능:**
- AnimatePresence로 이미지 슬라이드 트랜지션
- 좌우 화살표 버튼 (미니멀 디자인)
- 하단 인디케이터 (점 3개, 현재 활성화)
- Loop 네비게이션 지원
- 키보드 이벤트 (← →)

**트랜지션 설정:**
```javascript
// 이미지 슬라이드 애니메이션
variants={{
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
}}
transition={{ duration: 0.3, ease: 'easeInOut' }}

// layoutId 설정 (첫 번째 이미지만)
<motion.img
  key={currentImageIndex}
  layoutId={currentImageIndex === 0 ? `product-image-${productId}` : undefined}
  ...
/>
```

---

### 2. ProductDetailView.jsx

**경로:** `/src/components/ProductDetailView.jsx`

**Props:**
```javascript
{
  productId: string | number,              // 현재 제품 ID
  filteredProducts: array,                 // 필터링된 전체 제품 배열
  onProductChange: (newProductId) => void, // 제품 변경 콜백
  onClose: () => void                      // 닫기 콜백
}
```

**내부 상태:**
```javascript
const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [isTransitioning, setIsTransitioning] = useState(false);
const [scrollDirection, setScrollDirection] = useState(0); // 세로
const [imageDirection, setImageDirection] = useState(0);   // 가로
```

**주요 기능:**
- 전체 화면 오버레이 (position: fixed, z-index: 1000)
- ImageCarousel 통합
- 세로 스크롤 핸들러 (wheel 이벤트)
- 제품 간 네비게이션 (↑ ↓)
- 키보드 이벤트 통합 (ESC, ↑, ↓)
- 경계 체크 (첫/마지막 제품)

---

## 🎨 UI/UX 디자인

### 레이아웃 구조

```
┌─────────────────────────────────────┐
│  [Header - 기존 헤더 유지]           │
├─────────────────────────────────────┤
│                                     │
│                                     │
│         ◄    [이미지]    ►          │  ← 좌우 화살표
│                                     │
│              ● ○ ○                  │  ← 인디케이터
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### 스타일 가이드

**컨테이너:**
- position: fixed
- width: 100vw
- height: 100vh
- backgroundColor: white
- zIndex: 1000
- 상단에 헤더 공간 확보 (padding-top)

**이미지 영역:**
- 중앙 정렬 (flexbox)
- max-width: 70vw
- max-height: 70vh
- object-fit: contain
- aspect-ratio 유지

**화살표 버튼:**
- 위치: 이미지 좌우
- 디자인: 미니멀 `<` / `>` 기호
- 색상: 검정 (#000)
- 배경: 투명 또는 반투명 흰색
- hover: opacity 변화
- 크기: 40px × 40px

**인디케이터:**
- 위치: 이미지 하단 중앙
- 디자인: 원형 점 (border-radius: 50%)
- 크기: 8px
- 간격: 12px
- 활성: opacity 1, backgroundColor: #000
- 비활성: opacity 0.3, backgroundColor: #000

---

## ⌨️ 키보드 네비게이션

```javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    if (isTransitioning) return; // 트랜지션 중 무시

    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        handlePrevImage();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleNextImage();
        break;
      case 'ArrowUp':
        e.preventDefault();
        handlePrevProduct();
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleNextProduct();
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [isTransitioning, currentImageIndex, productId]);
```

---

## 🔄 핵심 로직

### 1. 가로 이미지 네비게이션 (Loop)

```javascript
// 다음 이미지
const handleNextImage = () => {
  setImageDirection(1);
  setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
};

// 이전 이미지
const handlePrevImage = () => {
  setImageDirection(-1);
  setCurrentImageIndex((prev) =>
    (prev - 1 + product.images.length) % product.images.length
  );
};
```

**특징:**
- Modulo 연산으로 loop 구현
- direction 상태로 슬라이드 방향 제어
- 즉시 반응 (트랜지션 동안 입력 허용 가능)

---

### 2. 세로 제품 네비게이션

```javascript
// Wheel 이벤트 핸들러
const handleWheel = useCallback((e) => {
  e.preventDefault();

  // 트랜지션 중이면 무시
  if (isTransitioning) return;

  const direction = e.deltaY > 0 ? 1 : -1;

  // 현재 제품 인덱스
  const currentIndex = filteredProducts.findIndex(p => p.id === productId);

  // 다음 인덱스 계산
  const nextIndex = currentIndex + direction;

  // 경계 체크
  if (nextIndex < 0 || nextIndex >= filteredProducts.length) return;

  // 트랜지션 시작
  setIsTransitioning(true);
  setScrollDirection(direction);

  // 제품 변경
  const nextProduct = filteredProducts[nextIndex];
  onProductChange(nextProduct.id);

  // 이미지 인덱스 초기화
  setCurrentImageIndex(0);

  // 트랜지션 완료 후 플래그 해제
  setTimeout(() => setIsTransitioning(false), 500);
}, [isTransitioning, productId, filteredProducts, onProductChange]);

// 이벤트 리스너 등록
useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  // passive: false로 preventDefault 활성화
  container.addEventListener('wheel', handleWheel, { passive: false });

  return () => {
    container.removeEventListener('wheel', handleWheel);
  };
}, [handleWheel]);
```

**주요 포인트:**
- `isTransitioning` 플래그로 중복 방지
- 경계 체크로 첫/마지막 제품에서 무시
- 500ms 트랜지션과 동기화
- `passive: false`로 기본 스크롤 방지

---

### 3. 제품 전환 트랜지션

```javascript
<AnimatePresence mode="wait" custom={scrollDirection}>
  <motion.div
    key={productId}
    custom={scrollDirection}
    initial={{
      y: scrollDirection > 0 ? 100 : -100,
      opacity: 0
    }}
    animate={{
      y: 0,
      opacity: 1
    }}
    exit={{
      y: scrollDirection > 0 ? -100 : 100,
      opacity: 0
    }}
    transition={{
      duration: 0.5,
      ease: 'easeInOut'
    }}
  >
    <ImageCarousel ... />
  </motion.div>
</AnimatePresence>
```

**특징:**
- mode="wait": 이전 제품 exit 완료 후 다음 제품 enter
- custom으로 스크롤 방향 전달
- 세로 슬라이드 + fade 효과

---

## 📝 App.jsx 통합

### 필요한 수정사항

**1. ProductDetailView import 및 렌더링:**

```javascript
import ProductDetailView from './components/ProductDetailView';

// ... 기존 코드 ...

return (
  <>
    {showDebug && <DebugCenterLines wrapperRef={wrapperRef} />}
    <Box sx={{ ... }}>
      <Header ... />
      <Box ref={wrapperRef} component="main" sx={{ ... }}>
        <GridContainer ...>
          <DynamicGrid ... />
        </GridContainer>
      </Box>
    </Box>

    {/* 제품 상세 뷰 오버레이 */}
    {isItemZoomed && (
      <ProductDetailView
        productId={selectedProductId}
        filteredProducts={filteredProducts}
        onProductChange={(newId) => setSelectedProductId(newId)}
        onClose={() => setSelectedProductId(null)}
      />
    )}
  </>
);
```

**2. 추가 상태 (필요한 경우):**
- 기존 `selectedProductId`, `isItemZoomed`로 충분
- 추가 상태 불필요

---

## 🚀 구현 순서

### Phase 1: ImageCarousel (30분)
1. 컴포넌트 파일 생성
2. 기본 레이아웃 구성
3. AnimatePresence 슬라이드 구현
4. 좌우 버튼 + 키보드 이벤트
5. 인디케이터 추가

### Phase 2: ProductDetailView 기본 구조 (20분)
1. 컴포넌트 파일 생성
2. 전체 화면 오버레이 레이아웃
3. ImageCarousel 통합
4. ESC 키로 닫기 기능

### Phase 3: 세로 스크롤 네비게이션 (30분)
1. wheel 이벤트 핸들러 구현
2. 제품 변경 로직
3. 트랜지션 효과 추가
4. 경계 체크

### Phase 4: App.jsx 통합 (10분)
1. ProductDetailView import
2. 조건부 렌더링 추가
3. Props 연결

### Phase 5: ProductCard 수정 (layoutId) (15분)
1. layoutId prop 추가
2. opacity 로직 수정 (isItemZoomed일 때 완전 숨김)
3. MotionBox에 layoutId 적용
4. 트랜지션 테스트

### Phase 6: 테스트 & 최적화 (20분)
1. 모든 키보드 단축키 테스트
2. 빠른 스크롤 처리 확인
3. 첫/마지막 제품 경계 테스트
4. 필터 변경 시 동작 확인
5. layoutId 트랜지션 확인
6. 성능 체크 (60fps 유지)

**총 예상 시간: 약 2시간 15분**

---

## 🔍 예상 이슈 및 해결책

| 이슈 | 원인 | 해결책 |
|------|------|--------|
| **위치 불일치 (가장 중요)** | ProductCard와 ProductDetailView 별개 레이어 | **layoutId 사용으로 seamless morph** |
| ProductCard와 이미지 중복 표시 | opacity 로직 미흡 | isItemZoomed일 때 모든 카드 opacity: 0 |
| 빠른 스크롤로 여러 제품 건너뜀 | wheel 이벤트 중복 발생 | `isTransitioning` 플래그로 방지 |
| 첫/마지막 제품에서 에러 | 배열 경계 초과 | nextIndex 경계 체크 후 early return |
| 메인 페이지 스크롤과 충돌 | 이벤트 전파 | `isItemZoomed`일 때만 핸들러 등록 |
| 이미지 로딩 지연 | 네트워크 지연 | placeholder 또는 loading skeleton |
| 키보드 이벤트 충돌 | 다른 컴포넌트 리스너 | `e.stopPropagation()` 추가 |
| 애니메이션 끊김 | 과도한 리렌더링 | useCallback, useMemo 최적화 |
| 필터 변경 시 제품 사라짐 | filteredProducts 변경 | useEffect로 감지 및 닫기 |

---

## 🎯 성능 최적화

### 1. 메모이제이션
```javascript
const handleWheel = useCallback((e) => { ... }, [deps]);
const handleKeyDown = useCallback((e) => { ... }, [deps]);
```

### 2. 이미지 프리로딩
```javascript
useEffect(() => {
  // 다음 제품 이미지 미리 로드
  const nextIndex = currentIndex + 1;
  if (nextIndex < filteredProducts.length) {
    const img = new Image();
    img.src = filteredProducts[nextIndex].images[0];
  }
}, [currentIndex, filteredProducts]);
```

### 3. GPU 가속
```css
.image-carousel {
  will-change: transform;
  transform: translateZ(0);
}
```

---

## ✅ 완료 체크리스트

### ImageCarousel
- [ ] 컴포넌트 파일 생성
- [ ] 슬라이드 트랜지션 구현
- [ ] layoutId 적용 (첫 번째 이미지만)
- [ ] 좌우 버튼 UI
- [ ] 인디케이터 UI
- [ ] Loop 로직
- [ ] 키보드 이벤트 (← →)
- [ ] 반응형 디자인

### ProductDetailView
- [ ] 컴포넌트 파일 생성
- [ ] 전체 화면 레이아웃
- [ ] ImageCarousel 통합 (productId 전달)
- [ ] wheel 이벤트 핸들러
- [ ] 제품 전환 트랜지션
- [ ] 키보드 이벤트 (ESC, ↑, ↓)
- [ ] 경계 체크 로직
- [ ] isTransitioning 방지 로직

### ProductCard 수정
- [ ] layoutId prop 추가 (isSelected && isItemZoomed)
- [ ] opacity 로직 수정 (isItemZoomed → 0)
- [ ] MotionBox에 layoutId 적용
- [ ] 트랜지션 테스트

### 통합
- [ ] App.jsx에 추가
- [ ] Props 연결
- [ ] 상태 동기화
- [ ] 전체 플로우 테스트

### 테스트
- [ ] layoutId seamless 트랜지션
- [ ] 가로 네비게이션 (버튼, 키보드)
- [ ] 세로 네비게이션 (스크롤, 키보드)
- [ ] 경계 케이스 (첫/마지막)
- [ ] 빠른 입력 처리
- [ ] 필터 변경 시 동작
- [ ] ESC로 닫기
- [ ] 성능 확인 (60fps)

---

## 📚 참고 자료

### Framer Motion 문서
- AnimatePresence: https://www.framer.com/motion/animate-presence/
- Custom variants: https://www.framer.com/motion/animation/#custom
- Gestures: https://www.framer.com/motion/gestures/

### 스크롤 이벤트
- Wheel event: https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
- Passive listeners: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scroll_performance_with_passive_listeners

---

## 🎉 기대 효과

1. **부드러운 UX**: 모든 전환에 트랜지션 적용
2. **직관적 네비게이션**: 키보드/스크롤/클릭 모두 지원
3. **높은 성능**: 60fps 유지
4. **미니멀 디자인**: 프로젝트 컨셉에 부합
5. **확장 가능**: 제품 정보 추가 등 추후 확장 용이
