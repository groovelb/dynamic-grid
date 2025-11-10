import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import GridContainer from '../GridContainer';
import DynamicGrid from '../DynamicGrid';
import ProductCard from '../ProductCard';
import ProductDetailView from '../ProductDetailView';
import products from '../../data/products';

export default {
  title: '2. Components/Container/GridContainer',
  component: GridContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
그리드 컨테이너 컴포넌트 - Transform 기반 줌 애니메이션

### 사용자 인터랙션
- **아이템을 클릭하면** 해당 아이템이 화면 중앙으로 확대됩니다
- **ESC 키를 누르면** 줌아웃되어 그리드 뷰로 돌아갑니다
- 확대 시 **동적 transformOrigin**으로 클릭한 아이템을 중심으로 확대됩니다
- **순수 CSS transition**으로 부드러운 애니메이션을 제공합니다

### Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| **children** | ReactNode | - | DynamicGrid 컴포넌트 |
| **selectedProductId** | string\|null | null | 선택된 제품 ID (줌 활성화) |
| **columns** | number | - | 그리드 컬럼 수 |
| **gap** | number | 48 | 그리드 간격 (px) |
| **wrapperRef** | RefObject | - | Wrapper(main) ref (transform 계산용) |
| **filteredProducts** | array | - | 현재 필터링된 제품 배열 |
| **onZoomChange** | function | - | 줌 상태 변경 콜백 |
| **showGrid** | boolean | false | true면 그리드 라인을 표시합니다 |
| **showDebug** | boolean | false | true면 디버그 패널을 표시합니다 |

---

### AI 프롬프트 - 컴포넌트 재생성

\`\`\`
GridContainer 컴포넌트를 만들어주세요.

컴포넌트 역할:
- 그리드 전체에 Transform 기반 줌 애니메이션 제공
- 제품 카드 클릭 시 해당 카드를 화면 중앙으로 확대
- DynamicGrid를 감싸서 zoom in/out 효과 적용

사용자 인터랙션:

1. 제품 선택 시 줌 인
   - ProductCard 클릭 → selectedProductId 업데이트
   - 선택된 카드의 위치 계산 (행, 열 인덱스)
   - Transform(scale, translate)으로 화면 중앙 배치
   - transformOrigin을 선택된 카드 위치로 설정
   - CSS transition으로 부드러운 확대 (duration: 0.6s)

2. 그리드 뷰로 복귀
   - ESC 키 또는 닫기 버튼 → selectedProductId null로 설정
   - Transform을 초기값으로 복원
   - 역방향 애니메이션으로 줌아웃

필요한 Props:

필수 Props:
- children: DynamicGrid 컴포넌트
  - 그리드로 배치된 제품 카드들

- selectedProductId: 선택된 제품 ID (null이면 줌아웃 상태)
  - 부모(MainPage)가 관리

- columns: 그리드 컬럼 수
  - 선택된 카드의 열 위치 계산에 사용

- gap: 그리드 간격 (px)
  - Transform 계산 시 간격 보정에 사용

- wrapperRef: 부모 컨테이너의 ref
  - 화면 중앙 위치 계산에 필요
  - wrapperRef.current.getBoundingClientRect()로 뷰포트 정보 획득

- filteredProducts: 현재 표시 중인 제품 배열
  - 선택된 제품의 인덱스 찾기

- onZoomChange: 줌 상태 변경 콜백
  - 줌 인/아웃 시 부모에게 알림
  - 오버레이 표시/숨김 제어용

선택적 Props:
- showGrid: 그리드 라인 표시 여부 (개발용)
- showDebug: 디버그 정보 표시 여부 (개발용)

부모 컴포넌트와의 관계:

- MainPage: selectedProductId 상태 관리 및 전달
- DynamicGrid: children으로 감싸서 zoom transform 적용
- ProductDetailView: 줌 인 시 함께 표시되는 오버레이 뷰

구현 핵심 로직:

1. 선택된 카드 위치 계산
   - 카드의 행 인덱스: Math.floor(productIndex / columns)
   - 카드의 열 인덱스: productIndex % columns

2. Transform 계산
   - 카드의 중심 좌표 계산 (카드 크기, gap 고려)
   - 뷰포트 중심 좌표 계산 (wrapperRef 사용)
   - 필요한 translate 거리 계산
   - scale 값 설정 (확대 배율)

3. TransformOrigin 설정
   - 선택된 카드의 위치를 기준으로 확대
   - 픽셀 단위로 정확한 위치 지정

4. 애니메이션
   - CSS transition 사용 (transform 0.6s ease)
   - 부드러운 가속/감속 곡선

엣지 케이스:
- selectedProductId가 filteredProducts에 없는 경우: 줌아웃 처리
- wrapperRef가 없는 경우: transform 적용 안 함
- 첫 번째 카드 선택: 좌상단에서 확대
- 마지막 카드 선택: 우하단에서 확대
- 필터 변경으로 선택된 제품 사라짐: 자동 줌아웃

성능 고려사항:
- Transform 사용으로 GPU 가속
- Reflow 없이 Repaint만 발생
- CSS transition으로 JavaScript 개입 최소화
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'DynamicGrid 컴포넌트',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    selectedProductId: {
      description: '선택된 제품 ID',
      table: {
        type: { summary: 'string | null' },
        defaultValue: { summary: 'null' },
      },
    },
    columns: {
      description: '그리드 컬럼 수',
      control: { type: 'number', min: 1, max: 12 },
      table: {
        type: { summary: 'number' },
      },
    },
    gap: {
      description: '그리드 간격 (px)',
      control: { type: 'number', min: 0, max: 100, step: 4 },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '48' },
      },
    },
    wrapperRef: {
      description: 'Wrapper ref',
      table: {
        type: { summary: 'RefObject' },
      },
    },
    filteredProducts: {
      description: '필터링된 제품 배열',
      table: {
        type: { summary: 'array' },
      },
    },
    onZoomChange: {
      description: '줌 상태 변경 콜백',
      table: {
        type: { summary: 'function' },
        defaultValue: { summary: 'undefined' },
      },
    },
    showGrid: {
      description: '그리드 라인 표시',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showDebug: {
      description: '디버그 패널 표시',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

// 정육면체 컴포넌트
const CubeItem = ({ id, number, isSelected, onClick }) => (
  <motion.div
    layout
    onClick={() => onClick(id)}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    style={{
      aspectRatio: '1 / 1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isSelected ? '#000' : '#f5f5f5',
      color: isSelected ? '#fff' : '#666',
      border: '1px solid #e0e0e0',
      fontSize: '24px',
      fontWeight: '500',
      fontFamily: 'system-ui',
      cursor: 'pointer',
      transition: 'background-color 0.2s, color 0.2s',
    }}
  >
    {number}
  </motion.div>
);

// 정육면체 데이터 생성
const createCubeItems = (count = 24) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `cube-${i + 1}`,
    number: i + 1,
  }));
};

export const Default = {
  parameters: {
    docs: {
      disable: true,
    },
  },
  render: () => {
    const wrapperRef = useRef(null);
    const [selectedId, setSelectedId] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const items = createCubeItems(24);

    // ESC 키로 줌아웃
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedId) {
        setSelectedId(null);
      }
    };

    return (
      <div
        ref={wrapperRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{
          width: '100%',
          height: '100vh',
          padding: '40px',
          backgroundColor: '#fff',
          overflow: isZoomed ? 'hidden' : 'auto',
          outline: 'none',
          position: 'relative',
        }}
      >
        {/* 상단 안내 */}
        <div style={{
          marginBottom: '30px',
          padding: '16px',
          backgroundColor: '#f9f9f9',
          borderRadius: '4px',
          fontFamily: 'system-ui',
          fontSize: '13px',
          color: '#666',
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '500', color: '#000' }}>
            Transform 기반 줌 애니메이션 + Overlay
          </p>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            <li>아이템을 클릭하면 화면 중앙으로 확대됩니다</li>
            <li>Fullscreen overlay가 나타납니다</li>
            <li>ESC 키 또는 닫기 버튼으로 줌아웃됩니다</li>
            <li>동적 transformOrigin으로 클릭한 위치를 기준으로 확대됩니다</li>
          </ul>
        </div>

        <GridContainer
          selectedProductId={selectedId}
          columns={6}
          gap={20}
          wrapperRef={wrapperRef}
          filteredProducts={items}
          onZoomChange={setIsZoomed}
          showDebug={false}
        >
          <DynamicGrid columns={6} gap={20}>
            {items.map(item => (
              <CubeItem
                key={item.id}
                id={item.id}
                number={item.number}
                isSelected={selectedId === item.id}
                onClick={setSelectedId}
              />
            ))}
          </DynamicGrid>
        </GridContainer>

        {/* Fullscreen Overlay */}
        {isZoomed && selectedId && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto',
              paddingTop: '80px',
            }}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedId(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '48px',
                height: '48px',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '0',
                cursor: 'pointer',
                fontSize: '24px',
                fontFamily: 'system-ui',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.2s',
                zIndex: 101,
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              ×
            </button>

            {/* 상세 콘텐츠 */}
            <div style={{
              width: '70vw',
              aspectRatio: '1 / 1',
              backgroundColor: '#f5f5f5',
              border: '2px solid #000',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'system-ui',
            }}>
              <div style={{
                fontSize: '80px',
                fontWeight: '600',
                color: '#000',
                marginBottom: '20px',
              }}>
                {selectedId?.replace('cube-', '')}
              </div>
              <div style={{
                fontSize: '18px',
                color: '#666',
              }}>
                Detail View Placeholder
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  },
};

export const WithProducts = {
  parameters: {
    docs: {
      disable: true,
    },
  },
  render: () => {
    const wrapperRef = useRef(null);
    const [selectedId, setSelectedId] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);

    // ESC 키로 줌아웃
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedId) {
        setSelectedId(null);
      }
    };

    // 반응형 config (기본값)
    const config = {
      detailViewWidth: '70vw',
      detailArrowSize: 40,
      detailArrowPosition: 20,
      detailIndicatorSize: 8,
    };

    return (
      <>
        <div
          ref={wrapperRef}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          style={{
            width: '100%',
            height: '100vh',
            padding: '40px',
            backgroundColor: '#fff',
            overflow: isZoomed ? 'hidden' : 'auto',
            outline: 'none',
          }}
        >
          {/* 상단 안내 */}
          <div style={{
            marginBottom: '30px',
            padding: '16px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            fontFamily: 'system-ui',
            fontSize: '13px',
            color: '#666',
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '500', color: '#000' }}>
              실제 제품 카드 + Transform 줌 + Detail Overlay
            </p>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              <li>카드에 마우스를 올리면 비디오가 재생됩니다</li>
              <li>카드를 클릭하면 화면 중앙으로 확대됩니다</li>
              <li>Detail View가 fullscreen overlay로 나타납니다</li>
              <li>ESC 키 또는 닫기 버튼으로 줌아웃됩니다</li>
            </ul>
          </div>

          <GridContainer
            selectedProductId={selectedId}
            columns={3}
            gap={24}
            wrapperRef={wrapperRef}
            filteredProducts={products.slice(0, 6)}
            onZoomChange={setIsZoomed}
            showDebug={false}
          >
            <DynamicGrid columns={3} gap={24}>
              {products.slice(0, 6).map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={setSelectedId}
                  isItemZoomed={isZoomed}
                  isSelected={selectedId === product.id}
                />
              ))}
            </DynamicGrid>
          </GridContainer>
        </div>

        {/* Product Detail View Overlay */}
        {isZoomed && selectedId && (
          <>
            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedId(null)}
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                width: '48px',
                height: '48px',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '0',
                cursor: 'pointer',
                fontSize: '24px',
                fontFamily: 'system-ui',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.2s',
                zIndex: 102,
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              ×
            </button>

            <ProductDetailView
              productId={selectedId}
              filteredProducts={products.slice(0, 6)}
              onProductChange={setSelectedId}
              onClose={() => setSelectedId(null)}
              config={config}
            />
          </>
        )}
      </>
    );
  },
};
