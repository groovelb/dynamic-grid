import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import GridContainer from '../GridContainer';
import DynamicGrid from '../DynamicGrid';
import ProductCard from '../ProductCard';
import ProductDetailView from '../ProductDetailView';

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

// 실제 제품 데이터
const sampleProducts = [
  {
    id: 1,
    name: 'Product 1',
    images: ['/src/assets/product/1-motion.mp4', '/src/assets/product/1-1.png'],
    gender: 'male',
    color: 'white',
  },
  {
    id: 2,
    name: 'Product 2',
    images: ['/src/assets/product/2-motion.mp4', '/src/assets/product/2-1.png'],
    gender: 'male',
    color: 'black',
  },
  {
    id: 3,
    name: 'Product 3',
    images: ['/src/assets/product/3-motion.mp4', '/src/assets/product/3-1.png'],
    gender: 'female',
    color: 'white',
  },
  {
    id: 4,
    name: 'Product 4',
    images: ['/src/assets/product/4-motion.mp4', '/src/assets/product/4-1.png'],
    gender: 'female',
    color: 'black',
  },
  {
    id: 5,
    name: 'Product 5',
    images: ['/src/assets/product/5-motion.mp4', '/src/assets/product/5-1.png'],
    gender: 'male',
    color: 'white',
  },
  {
    id: 6,
    name: 'Product 6',
    images: ['/src/assets/product/6-motion.mp4', '/src/assets/product/6-1.png'],
    gender: 'female',
    color: 'black',
  },
];

export const Default = {
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
            filteredProducts={sampleProducts}
            onZoomChange={setIsZoomed}
            showDebug={false}
          >
            <DynamicGrid columns={3} gap={24}>
              {sampleProducts.map(product => (
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
              filteredProducts={sampleProducts}
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
