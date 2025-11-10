import { useState } from 'react';
import ProductDetailView from './ProductDetailView';
import products from '../data/products';

export default {
  title: '2. Components/DetailView/ProductDetailView',
  component: ProductDetailView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
제품 상세 탐색 오버레이

그리드에서 제품을 선택하면 **전체 화면 오버레이**로 제품의 디테일을 집중해서 볼 수 있습니다. **좌우 화살표**로 현재 제품의 다양한 이미지를 탐색하고, **휠 스크롤**로 다른 제품으로 빠르게 이동할 수 있습니다.

---

### 1. 제품 이미지 탐색 (가로축)

#### 🖼️ 이미지 슬라이드
- 좌우 화살표 버튼으로 현재 제품의 여러 이미지 전환
- **Matrix2DCarousel**이 착용샷, 상세샷 등을 순환 슬라이드로 제공
- 하단 인디케이터로 현재 위치 확인 및 직접 선택 가능
- 비디오는 자동 재생되어 착용감 확인

#### 📍 제품 정보
- 하단 중앙에 제품명 표시
- 제품 전환 시 자동으로 업데이트

---

### 2. 제품 전환 (세로축)

#### ⬆️⬇️ 연속 비교
- 휠 스크롤(또는 키보드 ↑↓)로 다음/이전 제품으로 즉시 전환
- **ProductDetailView**가 새로운 제품 ID를 받아 **Matrix2DCarousel** 업데이트
- 그리드로 돌아가지 않고도 여러 제품을 연속으로 비교 가능
- 필터링된 제품만 순회

---

### 3. 종료 및 복귀

#### 🚪 닫기
- ESC 키 또는 우측 상단 닫기 버튼으로 그리드 뷰로 복귀
- **ProductDetailView**가 \`onClose\` 콜백 호출
- **MainPage**가 선택 상태 초기화하여 그리드로 줌아웃

---

### 컴포넌트 계층구조

\`\`\`
ProductDetailView (Fullscreen Overlay)
└── Box (Container)
    ├── Matrix2DCarousel
    │   ├── MediaRenderer (이미지/비디오)
    │   ├── ArrowButton (좌우)
    │   └── Indicator (하단)
    └── Box (제품명 표시)
\`\`\`

### 컴포넌트별 역할

| 컴포넌트 | 하는 일 |
|---------|---------|
| **ProductDetailView** | 전체 화면 오버레이로 제품 상세 표시 |
| **Matrix2DCarousel** | 이미지(가로)와 제품(세로)을 2D로 탐색 |
| **MediaRenderer** | 이미지/비디오를 화면에 표시 |
| **ArrowButton** | 좌우 이미지 전환 버튼 제공 |
| **Indicator** | 현재 이미지 위치 표시 및 직접 선택 |

---

### Props

| Prop | Type | 설명 |
|------|------|------|
| **productId** | string \\| number | 현재 선택된 제품 ID |
| **filteredProducts** | array | 필터링된 전체 제품 배열 |
| **onProductChange** | function | 제품 전환 시 호출되는 콜백 |
| **onClose** | function | 닫기 버튼/ESC 키 누를 때 호출 |
| **config** | object | 반응형 설정 (선택) |

---

### 사용 흐름

1. **진입**: 그리드에서 제품 카드 클릭
2. **이미지 탐색**: 좌우 화살표로 다양한 각도 확인
3. **제품 비교**: 휠 스크롤로 다른 제품 빠르게 비교
4. **복귀**: ESC 키로 그리드 뷰로 돌아가기

---

### 기술적 특징

- **Framer Motion**: 부드러운 페이드인/블러 효과
- **Fixed Overlay**: z-index 100으로 최상단 표시
- **반응형 설정**: config prop으로 화면 크기별 최적화
- **키보드 접근성**: ESC, ↑↓ 키 지원

---

### AI 프롬프트 - 컴포넌트 재생성

\`\`\`
ProductDetailView 컴포넌트를 만들어주세요.

컴포넌트 역할:
- 제품 상세 정보를 전체 화면 오버레이로 표시
- Matrix2DCarousel을 포함하여 이미지 탐색 및 제품 전환 제공
- 그리드 위에 overlay로 떠서 집중된 탐색 경험 제공

사용자 인터랙션:

1. 오버레이 표시
   - 제품 선택 시 fixed overlay로 전체 화면 덮기
   - Framer Motion으로 페이드인 + 블러 효과
   - z-index 100으로 최상단 배치

2. 이미지 탐색 (Matrix2DCarousel 위임)
   - 좌우 화살표로 현재 제품의 이미지 슬라이드
   - 하단 인디케이터로 현재 위치 표시 및 직접 선택
   - 첫 이미지는 비디오 자동 재생

3. 제품 전환 (Matrix2DCarousel 위임)
   - 휠 스크롤 또는 키보드 ↑↓로 다른 제품 전환
   - onProductChange 콜백으로 부모(MainPage)에 새 ID 전달
   - 필터링된 제품 배열 내에서만 순환

4. 닫기
   - ESC 키 또는 우측 상단 닫기 버튼
   - onClose 콜백 호출하여 부모가 overlay 숨김

필요한 Props:

필수 Props:
- productId: 현재 선택된 제품 ID
  - Matrix2DCarousel의 initialItemId로 전달

- filteredProducts: 필터링된 제품 배열
  - Matrix2DCarousel의 items로 전달
  - 제품 전환 시 이 배열 내에서만 이동

- onProductChange: 제품 변경 콜백
  - Matrix2DCarousel의 onItemChange로 전달
  - 새 제품 ID를 인자로 받아 부모(MainPage)에 전달

- onClose: 닫기 콜백
  - Matrix2DCarousel의 onClose로 전달
  - ESC 키 또는 닫기 버튼 클릭 시 호출

선택적 Props:
- config: 반응형 설정 객체
  - detailViewWidth: 캐로셀 너비 (기본값: '70vw')
  - detailArrowSize: 화살표 버튼 크기
  - detailArrowPosition: 화살표 위치
  - detailIndicatorSize: 인디케이터 크기

부모 컴포넌트와의 관계:

- MainPage: productId와 isItemZoomed 상태 관리
- GridContainer: zoom 애니메이션 후 이 overlay 표시
- Matrix2DCarousel: 이 컴포넌트 안에서 2D 네비게이션 처리

구현 포인트:

1. 레이아웃
   - position: fixed, top: 0, left: 0
   - width: 100vw, height: 100vh
   - background: rgba(255, 255, 255, 0.95) (반투명 흰색)
   - display: flex, alignItems: center, justifyContent: center

2. 애니메이션
   - Framer Motion의 motion.div 사용
   - initial: opacity 0, filter blur(10px)
   - animate: opacity 1, filter blur(0px)
   - transition: duration 0.3s, delay 0.1s

3. 제품 정보 표시
   - 하단 중앙에 제품명 표시
   - productId로 filteredProducts에서 제품 찾기
   - 제품명을 MUI Typography로 렌더링

4. 키보드 접근성
   - 오버레이가 표시되는 동안 ESC 키 리스닝
   - Matrix2DCarousel이 ↑↓ 키 처리

엣지 케이스:
- productId가 filteredProducts에 없는 경우: 첫 제품 표시
- filteredProducts가 빈 배열: 오버레이 표시 안 함
- config가 없는 경우: 기본값 사용

성능 고려사항:
- 조건부 렌더링으로 필요할 때만 마운트
- Matrix2DCarousel의 비디오는 lazy load
- 오버레이 언마운트 시 메모리 정리
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
};

// 스토리북 전용 Wrapper
const StorybookWrapper = ({ children }) => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#ffffff',
      }}
    >
      {children}
    </div>
  );
};

export const Default = {
  parameters: {
    docs: {
      disable: true,
    },
  },
  render: () => {
    const [selectedProductId, setSelectedProductId] = useState(products[0].id);
    const filteredProducts = products.slice(0, 5); // 5개만 샘플로 사용

    return (
      <StorybookWrapper>
        <ProductDetailView
          productId={selectedProductId}
          filteredProducts={filteredProducts}
          onProductChange={(newId) => setSelectedProductId(newId)}
          onClose={() => console.log('Close clicked')}
        />
      </StorybookWrapper>
    );
  },
};
