# 제품 상세 뷰 2D Carousel Matrix 구현 계획

## 📋 개요

제품 상세 뷰를 **2차원 Carousel Matrix**로 구현합니다.
- **가로 축**: 동일 제품의 여러 이미지 (착용샷 등)
- **세로 축**: 전체 그리드의 제품들

### 핵심 개념
> "ImageCarousel을 재사용하여 Nested Carousel 구조를 만든다"
> - 외부: Vertical Product Carousel (세로 스크롤)
> - 내부: Horizontal Image Carousel (좌우 버튼)

---

## 🎯 요구사항

1. ✅ **2차원 이동**: 좌우 버튼 (이미지), 세로 스크롤 (제품)
2. ✅ **가로 인덱스 유지**: 제품 3의 2번째 이미지 → 제품 4로 이동 → 제품 4의 2번째 이미지
3. ✅ **제품별 인덱스 기억**: 제품 1(이미지 2) → 제품 2(이미지 0) → 다시 제품 1 → 이미지 2 복원
4. ✅ **ImageCarousel 재사용**: 기존 컴포넌트 수정 없이 내부에 중첩
5. ✅ **ProductDetailView 고정**: 레이아웃 이동 없이 내용만 carousel

---

## 📊 데이터 구조

### 2D Matrix 개념
```javascript
// 제품 배열 (세로 축)
filteredProducts = [
  { id: 1, images: [img1_0, img1_1, img1_2] }, // 행 0
  { id: 2, images: [img2_0, img2_1, img2_2] }, // 행 1
  { id: 3, images: [img3_0, img3_1, img3_2] }, // 행 2
  // ...
]

// 2D Matrix 시각화
[
  [product1_img0, product1_img1, product1_img2], // 행 0: 제품 1
  [product2_img0, product2_img1, product2_img2], // 행 1: 제품 2
  [product3_img0, product3_img1, product3_img2], // 행 2: 제품 3
]

// 현재 위치: (row, col) = (productIndex, imageIndex)
```

### 상태 관리
```javascript
// ProductDetailView.jsx
const [productIndex, setProductIndex] = useState(0);     // 세로 축 (제품)
const [imageIndexMap, setImageIndexMap] = useState({});  // 가로 축 (각 제품의 이미지 인덱스)
const [verticalDirection, setVerticalDirection] = useState(0); // 세로 트랜지션 방향

// imageIndexMap 예시
{
  1: 2,  // 제품 ID 1은 3번째 이미지(index 2)
  2: 0,  // 제품 ID 2는 1번째 이미지(index 0)
  3: 1,  // 제품 ID 3은 2번째 이미지(index 1)
}

// 현재 제품
const currentProduct = filteredProducts[productIndex];

// 현재 제품의 이미지 인덱스 (없으면 0)
const currentImageIndex = imageIndexMap[currentProduct.id] || 0;
```

---

## 🏗️ 컴포넌트 구조 (Nested Carousel)

```
ProductDetailView (외부 컨테이너)
├─ 상태: productIndex, imageIndexMap, verticalDirection
├─ 세로 스크롤 핸들러 (wheel 이벤트)
├─ 키보드 핸들러 (↑↓ ESC)
└─ AnimatePresence (세로 트랜지션)
    └─ motion.div (key: productId)
        ├─ ImageCarousel (내부 - 가로 carousel)
        │   ├─ 현재 제품의 images 배열
        │   ├─ currentImageIndex (imageIndexMap에서 가져옴)
        │   └─ onIndexChange → imageIndexMap 업데이트
        └─ 제품명 표시
```

**핵심:**
- ImageCarousel은 수정 없이 그대로 사용
- ProductDetailView가 productIndex와 imageIndexMap을 관리
- AnimatePresence로 제품 전환 시 세로 슬라이드 트랜지션

---

## 🔄 동작 시나리오

### 시나리오 1: 가로 인덱스 유지 (기본 동작)

```
초기 상태: 제품 1, 이미지 인덱스 0

1. 좌우 버튼 클릭 (→ →)
   → 제품 1, 이미지 인덱스 2 (3번째 이미지)
   → imageIndexMap = { 1: 2 }

2. 세로 스크롤 (아래)
   → productIndex: 0 → 1
   → 제품 2, 이미지 인덱스 2 (3번째 이미지) ✅ 유지!
   → imageIndexMap = { 1: 2 } (제품 2는 아직 없음 → 기본값 2 사용)

3. 세로 스크롤 (아래)
   → productIndex: 1 → 2
   → 제품 3, 이미지 인덱스 2 (3번째 이미지) ✅ 계속 유지!
```

### 시나리오 2: 제품별 독립적 인덱스 기억

```
1. 제품 1, 이미지 2
   → imageIndexMap = { 1: 2 }

2. 세로 스크롤 (아래) → 제품 2
   → 제품 2는 처음 방문 → 이미지 0 (기본값)

3. 좌우 버튼 (→) → 제품 2, 이미지 1
   → imageIndexMap = { 1: 2, 2: 1 }

4. 세로 스크롤 (아래) → 제품 3
   → 제품 3은 처음 방문 → 이미지 0 (기본값)

5. 세로 스크롤 (위) → 제품 2
   → 제품 2, 이미지 1 ✅ 기억함!
   → imageIndexMap에서 { 2: 1 } 복원

6. 세로 스크롤 (위) → 제품 1
   → 제품 1, 이미지 2 ✅ 기억함!
   → imageIndexMap에서 { 1: 2 } 복원
```

---

## 💻 핵심 구현 로직

### 1. 상태 초기화

```javascript
function ProductDetailView({ productId, filteredProducts, onClose }) {
  // 초기 productIndex 찾기
  const initialIndex = filteredProducts.findIndex(p => p.id === productId);

  const [productIndex, setProductIndex] = useState(initialIndex);
  const [imageIndexMap, setImageIndexMap] = useState({});
  const [verticalDirection, setVerticalDirection] = useState(0);
  const [imageDirection, setImageDirection] = useState(0);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const currentProduct = filteredProducts[productIndex];
  const currentImageIndex = imageIndexMap[currentProduct.id] || 0;

  // ...
}
```

---

### 2. 세로 스크롤 핸들러 (제품 전환)

```javascript
// fullpage.js 스타일 스크롤
const lastScrollTime = useRef(0);
const accumulatedDelta = useRef(0);
const [isTransitioning, setIsTransitioning] = useState(false);

const handleWheel = useCallback((e) => {
  e.preventDefault();

  if (isTransitioning) return;

  const now = Date.now();
  const timeSinceLastScroll = now - lastScrollTime.current;

  // deltaY 누적
  accumulatedDelta.current += e.deltaY;

  // 임계값: 최소 50px 이상 스크롤해야 전환
  const THRESHOLD = 50;

  // 짧은 시간 내 스크롤이 계속되면 누적
  if (timeSinceLastScroll < 150) {
    lastScrollTime.current = now;

    // 임계값 도달하면 전환
    if (Math.abs(accumulatedDelta.current) >= THRESHOLD) {
      const direction = accumulatedDelta.current > 0 ? 1 : -1;
      const newIndex = productIndex + direction;

      // 경계 체크
      if (newIndex >= 0 && newIndex < filteredProducts.length) {
        setVerticalDirection(direction);
        setProductIndex(newIndex);
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 500);
      }

      // 초기화
      accumulatedDelta.current = 0;
      lastScrollTime.current = now;
    }
    return;
  }

  // 새로운 스크롤 시작
  accumulatedDelta.current = e.deltaY;
  lastScrollTime.current = now;

  // 즉시 임계값 도달하면 전환
  if (Math.abs(accumulatedDelta.current) >= THRESHOLD) {
    const direction = accumulatedDelta.current > 0 ? 1 : -1;
    const newIndex = productIndex + direction;

    if (newIndex >= 0 && newIndex < filteredProducts.length) {
      setVerticalDirection(direction);
      setProductIndex(newIndex);
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 500);
    }

    accumulatedDelta.current = 0;
  }
}, [isTransitioning, productIndex, filteredProducts.length]);

// 이벤트 리스너 등록
useEffect(() => {
  window.addEventListener('wheel', handleWheel, { passive: false });
  return () => window.removeEventListener('wheel', handleWheel);
}, [handleWheel]);
```

---

### 3. 가로 이미지 핸들러 (이미지 전환)

```javascript
// 다음 이미지
const handleNextImage = useCallback(() => {
  if (!currentProduct) return;

  const newIndex = (currentImageIndex + 1) % currentProduct.images.length;

  setImageDirection(1);
  setImageIndexMap(prev => ({
    ...prev,
    [currentProduct.id]: newIndex
  }));
}, [currentProduct, currentImageIndex]);

// 이전 이미지
const handlePrevImage = useCallback(() => {
  if (!currentProduct) return;

  const newIndex = (currentImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length;

  setImageDirection(-1);
  setImageIndexMap(prev => ({
    ...prev,
    [currentProduct.id]: newIndex
  }));
}, [currentProduct, currentImageIndex]);
```

---

### 4. 키보드 네비게이션

```javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    if (isTransitioning) return;

    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (productIndex > 0) {
          setVerticalDirection(-1);
          setProductIndex(prev => prev - 1);
          setIsTransitioning(true);
          setTimeout(() => setIsTransitioning(false), 500);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (productIndex < filteredProducts.length - 1) {
          setVerticalDirection(1);
          setProductIndex(prev => prev + 1);
          setIsTransitioning(true);
          setTimeout(() => setIsTransitioning(false), 500);
        }
        break;

      case 'Escape':
        e.preventDefault();
        onClose();
        break;

      default:
        break;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [isTransitioning, productIndex, filteredProducts.length, onClose]);
```

---

### 5. 렌더링 (Nested Carousel)

```javascript
return (
  <Box
    component={motion.div}
    initial={{ opacity: 0, filter: 'blur(10px)' }}
    animate={{ opacity: 1, filter: 'blur(0px)' }}
    transition={{ duration: 0.3, delay: 0.1 }}
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 100,
      overflow: 'hidden',
      pointerEvents: 'auto',
      paddingTop: '80px',
    }}
  >
    {/* 세로 트랜지션 (제품 전환) */}
    <AnimatePresence mode="wait" custom={verticalDirection}>
      <Box
        component={motion.div}
        key={currentProduct.id}
        custom={verticalDirection}
        initial={{
          y: verticalDirection > 0 ? '100%' : verticalDirection < 0 ? '-100%' : 0,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        exit={{
          y: verticalDirection > 0 ? '-100%' : verticalDirection < 0 ? '100%' : 0,
          opacity: 0,
        }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
        }}
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* 가로 캐러셀 (이미지 전환) */}
        <ImageCarousel
          images={currentProduct.images}
          currentIndex={currentImageIndex}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
          productName={currentProduct.name}
          productId={currentProduct.id}
          direction={imageDirection}
          isInitialRender={isInitialRender}
        />

        {/* 제품명 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            fontSize: '16px',
            fontWeight: 400,
            color: '#000',
            textAlign: 'center',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {currentProduct.name}
        </Box>
      </Box>
    </AnimatePresence>
  </Box>
);
```

---

## 🎨 트랜지션 상세

### 세로 트랜지션 (제품 전환)
```javascript
// 아래로 스크롤 (다음 제품)
initial: { y: '100%', opacity: 0 }  // 화면 아래에서 시작
animate: { y: 0, opacity: 1 }        // 중앙으로 이동
exit: { y: '-100%', opacity: 0 }    // 화면 위로 사라짐

// 위로 스크롤 (이전 제품)
initial: { y: '-100%', opacity: 0 } // 화면 위에서 시작
animate: { y: 0, opacity: 1 }        // 중앙으로 이동
exit: { y: '100%', opacity: 0 }     // 화면 아래로 사라짐

// Duration: 0.5s, easeInOut
```

### 가로 트랜지션 (이미지 전환)
- ImageCarousel 내부에서 처리 (기존 로직 유지)
- 좌우 슬라이드 + fade

---

## 🚀 구현 순서

### Phase 1: 상태 추가 (10분)
- [ ] productIndex state
- [ ] imageIndexMap state
- [ ] verticalDirection state
- [ ] isTransitioning state
- [ ] lastScrollTime, accumulatedDelta refs

### Phase 2: 세로 스크롤 핸들러 (20분)
- [ ] handleWheel 함수 구현
- [ ] fullpage.js 스타일 누적 로직
- [ ] 경계 체크
- [ ] 이벤트 리스너 등록

### Phase 3: 가로 이미지 핸들러 수정 (15분)
- [ ] handleNextImage → imageIndexMap 업데이트
- [ ] handlePrevImage → imageIndexMap 업데이트
- [ ] currentImageIndex 계산 로직

### Phase 4: 세로 트랜지션 추가 (15분)
- [ ] AnimatePresence 추가
- [ ] motion.div로 Box 래핑
- [ ] initial/animate/exit variants
- [ ] key={currentProduct.id}

### Phase 5: 키보드 네비게이션 (10분)
- [ ] ArrowUp/Down 추가
- [ ] 경계 체크
- [ ] ESC 유지

### Phase 6: 테스트 (20분)
- [ ] 가로 이동 → 세로 이동 → 인덱스 유지 확인
- [ ] 제품별 인덱스 기억 확인
- [ ] 경계 케이스 (첫/마지막 제품)
- [ ] 빠른 스크롤 처리
- [ ] 키보드 네비게이션

**총 예상 시간: 약 1시간 30분**

---

## ⚠️ 주의사항

### 1. ImageCarousel Props 변경 없음
- 기존 props 그대로 사용
- `currentIndex`만 동적으로 계산해서 전달

### 2. productId vs productIndex
- productId: 제품의 고유 ID (1, 2, 3...)
- productIndex: filteredProducts 배열에서의 인덱스 (0, 1, 2...)
- 혼동 주의!

### 3. imageIndexMap 키
- 키는 productId (숫자)
- 값은 imageIndex (숫자)

### 4. 초기 렌더링
- 첫 진입 시 verticalDirection = 0 (트랜지션 없음)
- 이후 스크롤부터 트랜지션 적용

### 5. 필터 변경 시
- App.jsx에서 이미 처리중 (useEffect)
- 선택된 제품이 사라지면 자동 닫기

---

## 🎯 기대 효과

1. ✅ **직관적인 2D 네비게이션**
   - 좌우: 같은 제품의 다른 각도
   - 상하: 다른 제품으로 이동

2. ✅ **부드러운 UX**
   - fullpage.js 스타일 스크롤
   - 세로/가로 모두 트랜지션 적용

3. ✅ **상태 기억**
   - 제품 1의 이미지 2 → 제품 2 → 다시 제품 1 → 이미지 2 복원

4. ✅ **코드 재사용**
   - ImageCarousel 수정 없이 활용
   - 명확한 계층 구조

5. ✅ **확장 가능**
   - 제품 정보 추가 용이
   - 다른 인터랙션 추가 가능

---

## 📚 참고 자료

### Framer Motion
- AnimatePresence: https://www.framer.com/motion/animate-presence/
- Custom variants: https://www.framer.com/motion/animation/#custom
- Nested animations: https://www.framer.com/motion/animation/#animating-children

### Wheel Event
- MDN Wheel: https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
- Passive listeners: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scroll_performance_with_passive_listeners

### Patterns
- Nested Swiper: https://swiperjs.com/demos#nested
- 2D Carousel: https://www.framer.com/motion/examples/#drag-to-reorder
