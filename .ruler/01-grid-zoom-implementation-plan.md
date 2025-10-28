# Grid Item Zoom-In/Out 구현 계획

## 1. 개요

### 1.1 목표
- 그리드 아이템 클릭 시 해당 아이템이 화면 정중앙에 위치하도록 전체 그리드를 변환(transform)
- 부드러운 transition 효과로 줌인/줌아웃 구현
- LayoutGroup의 내부 애니메이션과 충돌하지 않는 구조 설계
- Header의 좌측 버튼을 통한 줌아웃 기능 추가

### 1.2 현재 상황 분석
- **기존 Zoom 기능**: Grid columns 수 조절 (8→6→4)
  - App.jsx의 `zoomLevel` state로 관리
  - 네비게이션 버튼(+/\<)으로 제어
- **신규 Zoom 기능**: 개별 아이템을 화면 중앙으로 확대
  - 전체 Grid를 transform으로 이동 및 확대
  - 기존 zoomLevel과 독립적으로 작동해야 함

### 1.3 구분되는 두 가지 Zoom 개념
1. **Grid Zoom** (기존): Grid 밀도 조절 (columns 수 변경)
2. **Item Zoom** (신규): 특정 아이템 확대 (transform 적용)

---

## 2. 좌표계 및 변환 계산

### 2.1 좌표 계산 프로세스

```
[Phase 1] 클릭된 아이템의 현재 위치 파악
  ↓
[Phase 2] 뷰포트 중심 좌표 계산
  ↓
[Phase 3] 이동 거리(translate) 및 확대 비율(scale) 계산
  ↓
[Phase 4] Transform 적용 및 애니메이션
```

### 2.2 상세 계산 공식

#### Phase 1: 아이템 현재 위치
```javascript
const itemElement = event.currentTarget; // 클릭된 ProductCard의 DOM 요소
const rect = itemElement.getBoundingClientRect();

// 아이템의 중심점 계산
const itemCenterX = rect.left + rect.width / 2;
const itemCenterY = rect.top + rect.height / 2;
const itemWidth = rect.width;
const itemHeight = rect.height;
```

#### Phase 2: 뷰포트 중심
```javascript
// Header를 제외한 Main 영역의 중심
const header = document.querySelector('header');
const headerHeight = header?.getBoundingClientRect().height || 0;

const viewportCenterX = window.innerWidth / 2;
const viewportCenterY = (window.innerHeight - headerHeight) / 2 + headerHeight;
```

#### Phase 3: 변환 값 계산
```javascript
// 이동 거리 (아이템 중심 → 뷰포트 중심)
const translateX = viewportCenterX - itemCenterX;
const translateY = viewportCenterY - itemCenterY;

// 확대 비율 (뷰포트의 70%를 차지하도록)
const targetWidth = window.innerWidth * 0.7;
const targetHeight = (window.innerHeight - headerHeight) * 0.7;
const scaleByWidth = targetWidth / itemWidth;
const scaleByHeight = targetHeight / itemHeight;
const scale = Math.min(scaleByWidth, scaleByHeight); // aspect ratio 유지
```

#### Phase 4: Transform 적용
```javascript
const transform = {
  x: translateX,
  y: translateY,
  scale: scale
};

// framer-motion animate prop
animate={{
  x: transform.x,
  y: transform.y,
  scale: transform.scale
}}
```

### 2.3 줌아웃 시 Reverse Transform
```javascript
// 원래 위치로 복귀
animate={{
  x: 0,
  y: 0,
  scale: 1
}}
```

---

## 3. 컴포넌트 아키텍처

### 3.1 계층 구조 설계

```
App.jsx
  └─ Header.jsx
  └─ GridContainer (신규 wrapper)  ← Transform 레이어
      └─ DynamicGrid.jsx
          └─ LayoutGroup              ← Layout Animation 레이어
              └─ AnimatePresence
                  └─ ProductCard[]
```

**핵심 원칙**: Transform 레이어와 Layout Animation 레이어 분리
- **GridContainer**: 전체 그리드의 위치/크기 제어 (Item Zoom)
- **LayoutGroup**: 내부 아이템들의 재배치 애니메이션 (Grid Zoom, Filter)

### 3.2 신규 컴포넌트: GridContainer

#### 역할
1. DynamicGrid를 감싸는 wrapper
2. Item Zoom 상태에 따라 transform 적용
3. 클릭 이벤트 처리 및 좌표 계산 수행

#### Props
```typescript
interface GridContainerProps {
  children: React.ReactNode;
  selectedProduct: Product | null;
  onZoomChange: (isZoomed: boolean) => void;
}
```

#### 구현 스켈레톤
```jsx
import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function GridContainer({ children, selectedProduct, onZoomChange }) {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  useEffect(() => {
    if (selectedProduct) {
      // 좌표 계산 및 transform 설정
      const calculated = calculateTransform(selectedProduct.element);
      setTransform(calculated);
      onZoomChange(true);
    } else {
      // 줌아웃
      setTransform({ x: 0, y: 0, scale: 1 });
      onZoomChange(false);
    }
  }, [selectedProduct]);

  return (
    <motion.div
      ref={containerRef}
      animate={transform}
      transition={{
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] // Material Design easing
      }}
      style={{
        transformOrigin: 'center center',
        width: '100%'
      }}
    >
      {children}
    </motion.div>
  );
}
```

### 3.3 기존 컴포넌트 수정

#### App.jsx 상태 관리 추가
```javascript
const [selectedProduct, setSelectedProduct] = useState(null);
const [isItemZoomed, setIsItemZoomed] = useState(false);

// 기존 zoomLevel은 Grid Zoom 전용으로 유지
// isItemZoomed는 Item Zoom 전용
```

#### ProductCard.jsx 수정
```javascript
// onClick에서 DOM element를 함께 전달
const handleClick = (e) => {
  onClick && onClick({
    ...product,
    element: e.currentTarget // DOM reference 추가
  });
};
```

#### Header.jsx 네비게이션 버튼 로직 수정
```javascript
// 우선순위: Item Zoom > Grid Zoom
if (isItemZoomed) {
  // Item Zoom 해제
  onItemZoomOut();
} else if (zoomLevel === 2) {
  // Grid Zoom 리셋
  setZoomLevel(0);
} else {
  // Grid Zoom 증가
  setZoomLevel(prev => prev + 1);
}

// 버튼 표시 로직
const buttonLabel = isItemZoomed || zoomLevel === 2 ? '<' : '+';
```

---

## 4. 상태 관리 전략

### 4.1 State 구조
```javascript
// App.jsx
const [zoomLevel, setZoomLevel] = useState(0);           // Grid Zoom (0~2)
const [selectedProduct, setSelectedProduct] = useState(null); // Item Zoom
const [isItemZoomed, setIsItemZoomed] = useState(false); // Item Zoom 상태

const [currentFilter, setCurrentFilter] = useState('all');
```

### 4.2 State Flow
```
사용자 액션
  ├─ 아이템 클릭
  │   └─> setSelectedProduct(product)
  │        └─> GridContainer가 transform 계산 및 적용
  │             └─> setIsItemZoomed(true)
  │
  └─ 백버튼 클릭 (isItemZoomed === true)
      └─> setSelectedProduct(null)
           └─> GridContainer가 transform 리셋
                └─> setIsItemZoomed(false)
```

### 4.3 조건부 동작
```javascript
// 네비게이션 버튼 클릭 시
const handleNavigate = () => {
  if (isItemZoomed) {
    // 우선순위 1: Item Zoom 해제
    setSelectedProduct(null);
  } else if (zoomLevel === 2) {
    // 우선순위 2: Grid Zoom 리셋
    setZoomLevel(0);
  } else {
    // 우선순위 3: Grid Zoom 증가
    setZoomLevel(prev => prev + 1);
  }
};
```

---

## 5. 애니메이션 타이밍 및 Easing

### 5.1 Transition 설정
```javascript
// GridContainer transform
{
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1] // cubic-bezier, Material Design standard
}

// 기존 ProductCard (유지)
{
  layout: { duration: 0.4, ease: 'easeInOut' },
  opacity: { duration: 0.3 },
  scale: { duration: 0.3 }
}
```

### 5.2 애니메이션 충돌 방지
- **GridContainer**: `animate={{ x, y, scale }}` - 전체 이동
- **LayoutGroup**: `layout` prop - 내부 재배치
- 두 레이어가 독립적으로 작동하므로 충돌 없음

---

## 6. 추가 기능 고려사항

### 6.1 다른 아이템 Fade Out (프로젝트 요구사항)
```javascript
// ProductCard.jsx에서 조건부 opacity
<MotionBox
  animate={{
    opacity: isItemZoomed && selectedProduct.id !== product.id ? 0 : 1
  }}
  // ...
>
```

### 6.2 이미지 슬라이드 (확대 화면에서)
- 좌우 화살표로 product.images 배열 순회
- 별도 ImageSlider 컴포넌트 구현 필요
- 줌 상태일 때만 표시

### 6.3 스크롤로 다음 아이템 이동 (확대 화면에서)
- wheel 이벤트 감지
- 다음/이전 아이템으로 selectedProduct 변경
- 세로 트랜지션 효과 추가

---

## 7. 구현 단계별 체크리스트

### Phase 1: 기본 줌인/줌아웃
- [ ] GridContainer 컴포넌트 생성
- [ ] 좌표 계산 함수 구현 (calculateTransform)
- [ ] App.jsx에 selectedProduct, isItemZoomed state 추가
- [ ] ProductCard onClick에서 element reference 전달
- [ ] Header 네비게이션 버튼 로직 수정
- [ ] 테스트: 아이템 클릭 → 중앙 확대 → 백버튼 → 원위치

### Phase 2: 시각적 개선
- [ ] 다른 아이템 fade out 구현
- [ ] 애니메이션 타이밍 미세 조정
- [ ] 반응형 뷰포트 대응 (resize 이벤트)
- [ ] Reduced motion 지원

### Phase 3: 확장 기능
- [ ] 이미지 슬라이드 기능
- [ ] 스크롤로 다음/이전 아이템 이동
- [ ] 제품 정보 표시 UI
- [ ] ESC 키로 줌아웃

---

## 8. 기술적 고려사항 및 Edge Cases

### 8.1 LayoutGroup과의 독립성 보장
- **문제**: LayoutGroup의 layout animation이 GridContainer transform과 충돌 가능
- **해결**:
  - GridContainer는 LayoutGroup 외부에 위치
  - transform 레이어 분리로 각각 독립적 작동
  - LayoutGroup은 내부 아이템 재배치만 담당

### 8.2 Filter 변경 시 동작
- **시나리오**: 줌 상태에서 필터 변경 → 선택된 아이템이 필터링되어 사라짐
- **해결**:
  ```javascript
  useEffect(() => {
    if (selectedProduct && !filteredProducts.find(p => p.id === selectedProduct.id)) {
      setSelectedProduct(null); // 자동 줌아웃
    }
  }, [filteredProducts, selectedProduct]);
  ```

### 8.3 Window Resize 대응
- **문제**: 줌 상태에서 창 크기 변경 시 위치 틀어짐
- **해결**:
  ```javascript
  useEffect(() => {
    const handleResize = () => {
      if (selectedProduct) {
        // transform 재계산
        const recalculated = calculateTransform(selectedProduct.element);
        setTransform(recalculated);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedProduct]);
  ```

### 8.4 Transform Origin
- **설정**: `transformOrigin: 'center center'`
- **이유**: 아이템이 자신의 중심을 기준으로 확대되도록

### 8.5 성능 최적화
- **will-change**: `will-change: 'transform'` 추가로 GPU 가속
- **layout thrashing 방지**: getBoundingClientRect 호출 최소화
- **RAF 사용**: 좌표 계산을 requestAnimationFrame에서 수행

---

## 9. 코드 흐름 다이어그램

```
[사용자가 ProductCard 클릭]
         ↓
App.handleProductClick(product + element)
         ↓
setSelectedProduct({ ...product, element })
         ↓
GridContainer useEffect 감지
         ↓
calculateTransform(element) 호출
  ├─ getBoundingClientRect()
  ├─ 뷰포트 중심 계산
  ├─ translate 값 계산
  └─ scale 값 계산
         ↓
setTransform({ x, y, scale })
         ↓
motion.div animate 트리거
         ↓
[600ms transition 후 줌 완료]
         ↓
onZoomChange(true) → setIsItemZoomed(true)
         ↓
Header의 버튼 '<'로 변경

========================================

[사용자가 백버튼 클릭]
         ↓
App.handleNavigate() (isItemZoomed === true)
         ↓
setSelectedProduct(null)
         ↓
GridContainer useEffect 감지
         ↓
setTransform({ x: 0, y: 0, scale: 1 })
         ↓
motion.div animate 트리거
         ↓
[600ms transition 후 줌아웃 완료]
         ↓
onZoomChange(false) → setIsItemZoomed(false)
         ↓
Header의 버튼 '+' 또는 '<'로 변경 (zoomLevel에 따라)
```

---

## 10. 예상 파일 구조

```
src/
├── components/
│   ├── DynamicGrid.jsx         (기존, 수정 없음)
│   ├── ProductCard.jsx         (수정: onClick에 element 전달)
│   ├── Header.jsx              (수정: 네비게이션 로직 업데이트)
│   └── GridContainer.jsx       (신규: Transform wrapper)
│
├── utils/
│   └── transformCalculator.js  (신규: 좌표 계산 함수)
│
├── App.jsx                      (수정: state 추가 및 로직 업데이트)
└── data/
    └── products.js              (기존, 수정 없음)
```

---

## 11. 구현 시 주의사항

1. **DOM Reference 관리**
   - ProductCard에서 전달하는 element는 클릭 순간의 snapshot
   - useRef로 저장하여 계산 시 사용

2. **Animation Frame Timing**
   - getBoundingClientRect는 reflow 발생
   - 가능한 한 번만 호출하고 값 캐싱

3. **Accessibility**
   - 키보드 네비게이션 지원 (ESC, Tab)
   - ARIA 레이블 추가
   - Focus 관리 (줌인 시 선택된 아이템에 focus)

4. **Reduced Motion**
   - useReducedMotion 훅 활용
   - prefers-reduced-motion 설정 시 transition duration 단축

5. **TypeScript 타입**
   - Product 타입에 element?: HTMLElement 추가
   - Transform 타입 정의: `{ x: number, y: number, scale: number }`

---

## 12. 테스트 시나리오

### 기본 동작
- [ ] 아이템 클릭 시 화면 중앙으로 이동 및 확대
- [ ] 백버튼 클릭 시 원위치 복귀
- [ ] 애니메이션이 부드럽게 작동

### Edge Cases
- [ ] 화면 모서리의 아이템 클릭 시 정확한 중앙 정렬
- [ ] 필터 변경 시 선택된 아이템이 사라지면 자동 줌아웃
- [ ] 창 크기 변경 시 줌 상태 유지 및 위치 재조정
- [ ] Grid Zoom과 Item Zoom의 독립적 작동

### 성능
- [ ] 60fps 유지 확인 (Chrome DevTools Performance)
- [ ] 메모리 누수 없음 (cleanup 함수 확인)
- [ ] 다수 아이템에서도 빠른 계산 (30개 제품 기준)

---

## 13. 결론

본 구현 계획은 다음 원칙을 기반으로 설계되었습니다:

1. **레이어 분리**: Transform 레이어와 Layout Animation 레이어를 명확히 구분하여 충돌 방지
2. **정확한 좌표 계산**: 수학적으로 정밀한 중앙 정렬 보장
3. **상태 독립성**: Grid Zoom과 Item Zoom을 독립적으로 관리하여 유연성 확보
4. **확장 가능성**: 이미지 슬라이드, 스크롤 네비게이션 등 추가 기능 대응 가능한 구조
5. **성능 최적화**: GPU 가속 및 최소한의 reflow로 부드러운 애니메이션 달성

이 계획을 단계별로 구현하면 프로젝트 요구사항을 충족하는 우아하고 성능 좋은 그리드 줌 기능을 완성할 수 있습니다.
