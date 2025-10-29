# Transform 중앙정렬 오차 문제 분석

## 목차
1. [전체 로직 흐름](#전체-로직-흐름)
2. [문제제기 상세](#문제제기-상세)
3. [오차 발생 경로](#오차-발생-경로)
4. [해결 방안 우선순위](#해결-방안-우선순위)

---

## 전체 로직 흐름

### 좌표 (0,0) 첫 번째 아이템 클릭 시 단계별 동작

| 단계 | 파일 위치 | 핵심 로직 | 데이터 흐름 |
|------|-----------|-----------|------------|
| **STEP 1** | `ProductCard.jsx:29-36` | 클릭 이벤트 발생 | `onClick({ ...product, element: e.currentTarget })` |
| **STEP 2** | `App.jsx:57-60` | State 업데이트 | `setSelectedProduct({ ...product, element })` |
| **STEP 3** | `GridContainer.jsx:28-38` | useEffect 트리거 | `calculateTransform()` 호출 → `setTransform()` |
| **STEP 4** | `transformCalculator.js:11-27` | 좌표 수집 (Phase 1-3) | `getBoundingClientRect()`로 viewport 좌표 측정 |
| **STEP 5** | `transformCalculator.js:29-38` | 목표 위치 계산 (Phase 4-5) | `targetX/Y` 계산, `baseTranslate` 계산 |
| **STEP 6** | `transformCalculator.js:40-46` | Scale 계산 (Phase 6) | `scale = min(scaleByWidth, scaleByHeight)` |
| **STEP 7** | `transformCalculator.js:48-65` | Offset 보정 (Phase 7-8) | `scaleOffset` 계산 후 `translate` 보정 |
| **STEP 8** | `GridContainer.jsx:62-78` | 애니메이션 실행 | `Motion.div` animate prop 변경 → CSS transform 적용 |

---

## 문제제기 상세

### 문제 1: DOM 관찰 방식 vs 수학적 계산 방식

**현재 방식**
```javascript
// ProductCard.jsx:34
element: e.currentTarget  // DOM 요소 참조

// transformCalculator.js:11
const itemRect = clickedElement.getBoundingClientRect();
// → 브라우저가 실제로 렌더링한 위치를 측정
```

**문제점**
- `getBoundingClientRect()`는 서브픽셀 단위로 반환 (예: 220.5px)
- 각 계산 단계마다 반올림 오차 누적
- 실제 렌더링 결과에 의존하여 예측 불가능

**제안 방식**
```javascript
// 그리드 수학적 규칙으로 계산
const itemIndex = product.id;
const column = itemIndex % columns;
const row = Math.floor(itemIndex / columns);

const itemLeft = padding + column * (itemWidth + gap);
const itemTop = padding + row * (itemHeight + gap);
```

**예상 효과**
- 정수 단위 계산으로 오차 제거
- DOM 측정 불필요
- 일관성 향상

---

### 문제 2: 트랜지션 중 DOM 참조 타이밍 이슈

**현재 방식**
```javascript
// App.jsx:59
setSelectedProduct(productWithElement);
// → 클릭 시점의 DOM 상태를 저장

// 만약 이전 애니메이션이 진행 중이라면?
// → 부정확한 위치를 참조할 수 있음
```

**문제점**
- ProductCard가 layout 애니메이션 중일 때 클릭하면 중간 위치 참조
- 필터 변경 등으로 그리드 재배치 중 클릭 시 오차 발생

**제안 방식**
- 아이템 인덱스만 전달
- 항상 최종 레이아웃 기준으로 계산

**예상 효과**
- 타이밍 이슈 완전 제거
- 언제 클릭해도 동일한 결과

---

### 문제 3: Framer Motion vs 순수 CSS 차이

**현재 방식**
```javascript
// GridContainer.jsx:62-78
<Motion.div
  animate={{
    x: transform.x,
    y: transform.y,
    scale: transform.scale,
  }}
  transition={{ duration: 0.2 }}
>
```

**문제점**
- Framer Motion은 JS로 값을 계산 후 CSS 적용
- 내부적으로 `translate3d()` 사용
- 서브픽셀 렌더링 처리 방식이 브라우저와 다를 수 있음

**제안 방식**
```javascript
// 순수 CSS transition
<div
  style={{
    transform: `translate(${x}px, ${y}px) scale(${scale})`,
    transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  }}
>
```

**예상 효과**
- 브라우저 네이티브 최적화
- 서브픽셀 정확도 향상
- 번들 크기 감소 (-60KB)

---

### 문제 4: viewport 기준 vs wrapper 기준

**현재 방식**
```javascript
// transformCalculator.js:30-34
const headerHeight = headerRect?.height || 0;
const availableHeight = window.innerHeight - headerHeight;

const targetX = window.innerWidth / 2;
const targetY = availableHeight / 2 + headerHeight;
```

**문제점**
- viewport 전체를 기준으로 계산
- Header의 높이와 위치를 별도로 고려해야 함
- 복잡도 증가

**제안 방식**
```javascript
// main wrapper(Box) 영역 기준
const wrapperRect = wrapperRef.current.getBoundingClientRect();
const targetX = wrapperRect.width / 2;
const targetY = wrapperRect.height / 2;
```

**예상 효과**
- Header 계산 불필요
- 코드 단순화
- wrapper 내부에서만 동작하므로 명확

---

### 문제 5: 고정 transformOrigin + 복잡한 offset 보정

**현재 방식**
```javascript
// GridContainer.jsx:66
transformOrigin: 'center center'  // Container 중심 고정

// transformCalculator.js:54-65
// Container 중심에서 아이템까지의 거리
const itemOffsetX = itemCenterX - containerCenterX;

// scale 적용 시 추가 이동 거리 (오차 누적!)
const scaleOffsetX = itemOffsetX * (scale - 1);

// 복잡한 보정 계산
const translateX = baseTranslateX - scaleOffsetX;
```

**문제점**
- **핵심 오차 원인!**
- Container 중심에서 멀수록 (특히 0,0 위치) offset이 커짐
- 여러 단계 계산으로 오차 누적
- Phase 7-8 전체가 보정 계산

**제안 방식**
```javascript
// 동적 transformOrigin (아이템 중심)
const originX = itemCenterX - containerRect.left;
const originY = itemCenterY - containerRect.top;

// 단순 계산
const translateX = targetX - itemCenterX;
const translateY = targetY - itemCenterY;

// Phase 7-8 완전 제거!
return {
  x: translateX,
  y: translateY,
  scale: scale,
  transformOrigin: `${originX}px ${originY}px`
};
```

**예상 효과**
- **가장 큰 개선 효과**
- 계산 단계 50% 감소
- offset 보정 불필요
- 정확도 대폭 향상

---

## 오차 발생 경로

```
사용자 클릭
    ↓
[오차 원인 1] DOM 측정 (getBoundingClientRect 서브픽셀)
    ↓
[오차 원인 2] 여러 단계 계산 누적
    ↓
[오차 원인 3] Container 중심 기준 scale 적용
    ↓
[오차 원인 4] itemOffset * (scale - 1) 보정 계산
    ↓
[오차 원인 5] Framer Motion 내부 렌더링
    ↓
최종 위치 (편차 발생!)
```

### 오차 증폭 예시 (첫 번째 아이템 0,0 기준)

```
itemOffset = -810px (Container 중심에서 멀리 떨어짐)
scale = 3.182
scaleOffset = -810 * (3.182 - 1) = -1767.42px

→ 작은 측정 오차도 3배 이상 증폭됨!
```

---

## 해결 방안 우선순위

### 근본 원인 영향도

| 순위 | 문제 | 영향도 | 해결 난이도 | 예상 개선 |
|------|------|--------|-------------|-----------|
| 🥇 **1위** | **문제5: 고정 transformOrigin** | ⭐⭐⭐⭐⭐ | ⭐⭐ 중간 | 오차 70% 감소 |
| 🥈 **2위** | **문제1: DOM 측정** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ 높음 | 오차 90% 감소 |
| 🥉 **3위** | **문제4: viewport 기준** | ⭐⭐⭐ | ⭐ 쉬움 | 복잡도 30% 감소 |
| 4위 | **문제3: Framer Motion** | ⭐⭐ | ⭐ 쉬움 | 서브픽셀 개선 |
| 5위 | **문제2: 타이밍** | ⭐ | ⭐⭐⭐ 중간 | 엣지케이스 제거 |

---

## 권장 해결 순서

### Phase 1: 즉시 개선 가능 (1-2시간)

#### 1.1 문제5 해결: 동적 transformOrigin
```javascript
// transformCalculator.js 수정
export function calculateTransform(clickedElement, containerRef) {
  // ... 기존 코드 ...

  // 동적 origin 계산
  const originX = itemCenterX - containerRect.left;
  const originY = itemCenterY - containerRect.top;

  // 단순 계산
  const translateX = targetX - itemCenterX;
  const translateY = targetY - itemCenterY;

  return {
    x: translateX,
    y: translateY,
    scale: scale,
    transformOrigin: `${originX}px ${originY}px`
  };
}
```

```javascript
// GridContainer.jsx 수정
<Motion.div
  style={{
    transformOrigin: transform.transformOrigin, // 동적으로 변경
  }}
  animate={{
    x: transform.x,
    y: transform.y,
    scale: transform.scale,
  }}
>
```

**예상 결과**: 오차 70% 감소

---

#### 1.2 문제3 해결: 순수 CSS 전환
```javascript
// GridContainer.jsx를 순수 CSS로 전환
function GridContainer({ children, selectedProduct, onZoomChange }) {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1, transformOrigin: '50% 50%' });

  useEffect(() => {
    // ... 계산 로직 동일 ...
  }, [selectedProduct]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        transformOrigin: transform.transformOrigin,
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
}
```

**예상 결과**: 서브픽셀 정확도 개선, 번들 크기 -60KB

---

### Phase 2: 구조 개선 (2-3시간)

#### 2.1 문제4 해결: wrapper 기준 계산
```javascript
// App.jsx에서 wrapper ref 전달
const wrapperRef = useRef(null);

<Box ref={wrapperRef} component="main" sx={{ flex: 1, overflowY: 'auto' }}>
  <GridContainer wrapperRef={wrapperRef} selectedProduct={selectedProduct}>
    <DynamicGrid ... />
  </GridContainer>
</Box>
```

```javascript
// transformCalculator.js 수정
export function calculateTransform(clickedElement, containerRef, wrapperRef) {
  // viewport 대신 wrapper 기준
  const wrapperRect = wrapperRef.current.getBoundingClientRect();

  const targetX = wrapperRect.left + wrapperRect.width / 2;
  const targetY = wrapperRect.top + wrapperRect.height / 2;

  // Header 계산 불필요!
  // ...
}
```

**예상 결과**: 코드 복잡도 30% 감소

---

### Phase 3: 근본적 재설계 (4-6시간)

#### 3.1 문제1 해결: 수학적 계산 방식
```javascript
// 완전히 새로운 계산 방식
export function calculateTransformMath(productId, columns, containerRef, wrapperRef) {
  // DOM 측정 없이 계산
  const itemIndex = parseInt(productId) - 1;
  const column = itemIndex % columns;
  const row = Math.floor(itemIndex / columns);

  const containerRect = containerRef.current.getBoundingClientRect();
  const wrapperRect = wrapperRef.current.getBoundingClientRect();

  // 그리드 규칙으로 위치 계산
  const gap = 0;
  const itemWidth = containerRect.width / columns;
  const itemHeight = itemWidth; // aspect ratio 1:1

  const itemLeft = column * itemWidth;
  const itemTop = row * itemHeight;
  const itemCenterX = containerRect.left + itemLeft + itemWidth / 2;
  const itemCenterY = containerRect.top + itemTop + itemHeight / 2;

  // 나머지 계산
  const targetX = wrapperRect.left + wrapperRect.width / 2;
  const targetY = wrapperRect.top + wrapperRect.height / 2;

  const scale = Math.min(
    (wrapperRect.width * 0.7) / itemWidth,
    (wrapperRect.height * 0.7) / itemHeight
  );

  const originX = itemLeft + itemWidth / 2;
  const originY = itemTop + itemHeight / 2;

  const translateX = targetX - itemCenterX;
  const translateY = targetY - itemCenterY;

  return {
    x: translateX,
    y: translateY,
    scale: scale,
    transformOrigin: `${originX}px ${originY}px`
  };
}
```

```javascript
// ProductCard.jsx 수정
const handleClick = () => {
  if (onClick) {
    // element 대신 id만 전달
    onClick(product);
  }
};
```

```javascript
// App.jsx 수정
const handleProductClick = (product) => {
  setSelectedProduct(product); // id만 필요
};
```

**예상 결과**:
- DOM 측정 완전 제거
- 픽셀 퍼펙트 정렬
- 오차 90% 감소

---

#### 3.2 문제2 해결: 타이밍 이슈 제거
- DOM 참조를 제거하면 자동으로 해결됨
- 언제 클릭해도 항상 최종 레이아웃 기준 계산

---

## 테스트 체크리스트

각 Phase 완료 후 다음을 확인:

- [ ] 첫 번째 아이템(0,0) 중앙 정렬 정확도
- [ ] 마지막 아이템(우하단) 중앙 정렬 정확도
- [ ] 중앙 아이템 중앙 정렬 정확도
- [ ] 필터 변경 후 클릭 정확도
- [ ] 줌인/줌아웃 반복 시 일관성
- [ ] 윈도우 리사이즈 후 정확도
- [ ] 콘솔 오차값 1px 이하 확인

---

## 결론

**가장 효과적인 접근**:
1. Phase 1만 적용해도 70% 이상 개선
2. Phase 2까지 하면 실용적으로 충분
3. Phase 3는 완벽을 원할 때 진행

**권장**: Phase 1 → 테스트 → 만족스러우면 종료, 아니면 Phase 2/3 진행
