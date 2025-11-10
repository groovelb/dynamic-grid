import { useState } from 'react';
import ProductCard from '../ProductCard';
import products from '../../data/products';

export default {
  title: '2. Components/Card/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
제품 카드 - 호버 프리뷰 및 클릭 확대

**호버 인터랙션**으로 제품의 착용 영상을 미리 확인하고, **클릭**하면 상세 페이지로 부드럽게 전환됩니다.

---

### 1. 제품 프리뷰 - 호버 인터랙션

사용자가 제품에 관심을 가질 때 즉각적인 피드백을 제공합니다.

#### 🎬 비디오 재생
- 카드에 **마우스를 올리면** 착용 영상이 자동 재생 (1.3배속)
- 정적인 이미지보다 실제 착용감을 빠르게 파악
- **MediaRenderer**가 비디오 재생 상태 관리

#### ⏪ 자동 되감기
- 마우스를 **떼면** 비디오가 역방향으로 재생
- 이미지로 부드럽게 복귀하여 시각적 연속성 유지
- 비디오를 처음부터 다시 재생할 필요 없음

---

### 2. 상세 페이지 전환 - 클릭 인터랙션

#### 🎯 즉시 반응
- 카드 **클릭** 시 onClick 핸들러로 부모(**MainPage**)에게 알림
- **MainPage**가 selectedProductId 설정
- **GridContainer**가 해당 카드를 화면 중앙으로 확대 애니메이션

#### ✨ 부드러운 전환
- Framer Motion의 **layoutId**로 카드와 상세 뷰 연결
- 카드가 확대되며 **ProductDetailView**로 변형
- isSelected가 true일 때 layout animation 활성화

#### 👻 Fade Out 효과
- isItemZoomed가 true일 때 다른 카드들은 페이드아웃
- 선택된 카드에만 집중하도록 시각적 유도
- opacity 전환으로 부드러운 효과

---

### Props 인터페이스

| Prop | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| **product** | object | ✅ | - | 제품 데이터 (id, name, images[], gender, color) |
| **onClick** | function | ✅ | - | 클릭 시 (productId) => void |
| **isItemZoomed** | boolean | ❌ | false | 다른 제품 상세 뷰 진입 시 페이드아웃 |
| **isSelected** | boolean | ❌ | false | 현재 카드가 선택되어 확대 중 |
| **usePlaceholder** | boolean | ❌ | false | 이미지 로드 전 placeholder 표시 |

### 컴포넌트 구조

\`\`\`
ProductCard
└── motion.div (Framer Motion)
    └── MediaRenderer
        ├── <video> (호버 시)
        └── <img> (기본 상태)
\`\`\`

### 상태 흐름

**호버 시**
1. onMouseEnter → MediaRenderer에 isHovered=true 전달
2. MediaRenderer가 video.play() 및 playbackRate=1.3 설정
3. 비디오 재생 시작

**호버 해제 시**
1. onMouseLeave → MediaRenderer에 isHovered=false 전달
2. MediaRenderer가 playbackRate=-1.3 설정 (역재생)
3. 비디오가 처음으로 돌아가면 이미지로 전환

**클릭 시**
1. onClick(product.id) 호출
2. MainPage가 setSelectedProductId(id)
3. GridContainer zoom in + ProductDetailView 렌더링
4. isSelected=true, isItemZoomed=true로 재렌더링

---

### AI 프롬프트 - 컴포넌트 재생성

\`\`\`
ProductCard 컴포넌트를 만들어주세요.

컴포넌트 역할:
- 제품 그리드에 표시되는 개별 카드
- 사용자가 제품을 탐색하고 선택할 수 있는 인터랙티브 요소
- 정사각형 비율(aspect ratio 1:1)로 표시되며 부모 그리드 레이아웃에 맞춰 크기 조정

사용자 인터랙션:

1. 호버 시 비디오 프리뷰
   - 마우스를 카드 위에 올리면 제품의 착용 영상이 자동 재생
   - 1.3배속으로 빠르게 재생하여 착용감을 짧은 시간에 확인
   - 마우스를 떼면 비디오가 역방향으로 재생되며 원래 이미지로 부드럽게 복귀
   - 무음 상태로 재생 (autoplay 정책 준수)

2. 클릭하여 상세 보기
   - 카드 클릭 시 onClick 콜백으로 부모(MainPage)에게 제품 ID 전달
   - GridContainer가 해당 카드를 화면 중앙으로 확대 애니메이션
   - ProductDetailView가 전체 화면 오버레이로 나타남

3. 선택 상태 표시
   - isSelected가 true일 때: 현재 카드가 확대 중임을 표시
   - isItemZoomed가 true일 때: 다른 제품이 선택되어 이 카드는 페이드아웃
   - 시각적 피드백으로 사용자에게 현재 상태 전달

필요한 Props:

필수 Props:
- product: 제품 데이터 객체
  - id: 제품 고유 식별자
  - name: 제품명
  - images: 이미지/비디오 URL 배열 (첫 번째는 비디오, 나머지는 이미지)
  - gender, color 등 부가 정보

- onClick: 클릭 시 호출되는 함수
  - 인자로 제품 ID를 받음
  - 부모가 이를 받아 상세 뷰 진입 처리

선택적 Props:
- isItemZoomed: 다른 제품이 상세 뷰에 진입했을 때 true
  - 이 카드를 페이드아웃 처리 (opacity 0.3)
  - 선택된 제품에만 시각적 집중

- isSelected: 현재 카드가 선택되어 확대 중일 때 true
  - Framer Motion의 layoutId로 확대 애니메이션 연결
  - GridContainer의 zoom과 연계

- usePlaceholder: 이미지 로딩 전 placeholder 표시 여부
  - 네트워크 지연 시 빈 화면 대신 회색 박스 표시

부모 컴포넌트와의 관계:

- MainPage: onClick으로 선택된 제품 ID 전달받아 상태 관리
- DynamicGrid: 이 컴포넌트를 children으로 받아 그리드 셀에 배치
- GridContainer: isSelected 상태에 따라 이 카드 위치 계산 후 zoom 애니메이션
- MediaRenderer: 이 컴포넌트 내부에서 비디오/이미지 전환 처리

구현 포인트:

1. 정사각형 비율 유지
   - aspect-ratio: 1 / 1 속성 사용
   - 부모의 너비에 맞춰 높이 자동 조정
   - 반응형 그리드에서 일관된 비율 유지

2. 호버 인터랙션
   - onMouseEnter: MediaRenderer에 isHovered=true 전달
   - MediaRenderer가 비디오 재생 속도와 방향 제어
   - onMouseLeave: 역재생 후 이미지로 복귀

3. 클릭 핸들러
   - 카드 전체 영역 클릭 가능
   - onClick(product.id) 호출하여 부모에게 전달
   - 접근성: 키보드 포커스 지원 (tabIndex, onKeyDown)

4. 조건부 스타일링
   - isItemZoomed일 때: opacity 감소, pointer-events 유지
   - isSelected일 때: z-index 상승, Framer Motion layout animation

5. 성능 최적화
   - 비디오는 호버 시에만 로드 (preload="none")
   - 이미지는 lazy loading
   - 불필요한 리렌더링 방지 (React.memo 고려)

엣지 케이스:
- product.images가 빈 배열: placeholder 이미지 표시
- 비디오 로드 실패: 자동으로 이미지로 fallback
- 동시에 여러 카드 호버: 각 카드 독립적으로 동작
- 빠른 호버/언호버 반복: 비디오 상태 충돌 방지
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => {
    const [clickedId, setClickedId] = useState(null);

    return (
      <div>
        <div style={{
          width: '300px',
        }}>
          <ProductCard
            product={products[0]}
            onClick={(id) => {
              console.log('Clicked product:', id);
              setClickedId(id);
            }}
          />
        </div>

        {/* 클릭 피드백 */}
        {clickedId && (
          <div style={{
            marginTop: '20px',
            padding: '12px 20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            fontFamily: 'system-ui',
            fontSize: '14px',
            color: '#666',
            textAlign: 'center',
          }}>
            제품 {clickedId} 클릭됨
          </div>
        )}

        {/* 사용 안내 */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f9f9f9',
          borderRadius: '4px',
          fontFamily: 'system-ui',
          fontSize: '13px',
          color: '#666',
          maxWidth: '300px',
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '500', color: '#000' }}>
            인터랙션 테스트
          </p>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            <li>카드에 호버하면 비디오가 정방향 재생됩니다</li>
            <li>마우스를 떼면 비디오가 역방향 재생 후 이미지로 전환됩니다</li>
            <li>카드를 클릭하면 onClick 핸들러가 호출됩니다</li>
          </ul>
        </div>
      </div>
    );
  },
};
