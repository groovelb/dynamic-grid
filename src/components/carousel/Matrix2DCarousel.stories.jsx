import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Matrix2DCarousel from './Matrix2DCarousel';

export default {
  title: '2. Components/Carousel/Matrix2DCarousel',
  component: Matrix2DCarousel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
2D 매트릭스 캐로셀

세로 방향에서 제품을 변경하고, 가로 방향에서 제품의 착용샷(이미지/비디오)을 변경하기 위한 2차원 캐로셀 컴포넌트입니다.

### 사용자 인터랙션
- **좌우 화살표**: 현재 제품의 착용샷을 좌우로 전환합니다 (가로 네비게이션)
- **휠 스크롤 (위/아래)**: 다른 제품으로 전환합니다 (세로 네비게이션)
- **키보드 화살표 (↑↓)**: 제품을 전환할 수 있습니다
- **인디케이터 클릭**: 해당 착용샷으로 이동합니다
- **ESC 키**: 캐로셀을 닫습니다

### Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| **items** | array | - | 아이템 배열 (id, name, images 필드 필요) |
| **initialItemId** | string\|number | - | 초기 선택된 아이템 ID |
| **onItemChange** | function | - | 아이템 변경 콜백 (itemId를 인자로 받음) |
| **onClose** | function | - | 닫기 콜백 (ESC 키) |
| **config** | object | {} | 반응형 설정 객체 |
| **config.viewWidth** | string | '70vw' | 뷰 너비 |
| **config.arrowSize** | number | 40 | 화살표 버튼 크기 |
| **config.arrowPosition** | number | 20 | 화살표 위치 |
| **config.indicatorSize** | number | 8 | 인디케이터 크기 |
        `,
      },
    },
  },
  tags: ['autodocs'],
};

// 실제 제품 데이터
const sampleProducts = [
  {
    id: 1,
    name: 'Product 1',
    images: ['/src/assets/product/1-motion.mp4', '/src/assets/product/1-1.png', '/src/assets/product/1-2.png'],
  },
  {
    id: 2,
    name: 'Product 2',
    images: ['/src/assets/product/2-motion.mp4', '/src/assets/product/2-1.png', '/src/assets/product/2-2.png'],
  },
  {
    id: 3,
    name: 'Product 3',
    images: ['/src/assets/product/3-motion.mp4', '/src/assets/product/3-1.png', '/src/assets/product/3-2.png'],
  },
  {
    id: 4,
    name: 'Product 4',
    images: ['/src/assets/product/4-motion.mp4', '/src/assets/product/4-1.png', '/src/assets/product/4-2.png'],
  },
  {
    id: 5,
    name: 'Product 5',
    images: ['/src/assets/product/5-motion.mp4', '/src/assets/product/5-1.png'],
  },
  {
    id: 6,
    name: 'Product 6',
    images: ['/src/assets/product/6-motion.mp4', '/src/assets/product/6-1.png', '/src/assets/product/6-2.png'],
  },
];

const WithProductsComponent = () => {
  const [selectedId, setSelectedId] = useState(1);
  const [isClosed, setIsClosed] = useState(false);

  const handleItemChange = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const handleClose = useCallback(() => {
    setIsClosed(true);
  }, []);

  if (isClosed) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui',
        fontSize: '18px',
        color: '#666',
      }}>
        캐로셀이 닫혔습니다. (ESC 키로 닫힘)
        <button
          onClick={() => setIsClosed(false)}
          style={{
            marginLeft: '20px',
            padding: '10px 20px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'system-ui',
          }}
        >
          다시 열기
        </button>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      position: 'relative',
    }}>
      {/* 상단 안내 */}
      <div style={{
        padding: '20px 40px',
        backgroundColor: '#f9f9f9',
        borderBottom: '1px solid #e0e0e0',
        fontFamily: 'system-ui',
        fontSize: '13px',
        color: '#666',
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: '500', color: '#000' }}>
          2D 매트릭스 캐로셀
        </p>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          <li>좌우 화살표: 제품의 착용샷 전환 (가로 네비게이션)</li>
          <li>휠 또는 키보드 ↑↓: 제품 전환 (세로 네비게이션)</li>
          <li>비디오는 자동 재생됩니다</li>
          <li>ESC 키로 닫기</li>
        </ul>
      </div>

      {/* 현재 상태 표시 */}
      <div style={{
        position: 'fixed',
        top: '120px',
        right: '20px',
        padding: '12px 20px',
        backgroundColor: '#000',
        color: '#fff',
        borderRadius: '4px',
        fontFamily: 'system-ui',
        fontSize: '14px',
        zIndex: 1000,
      }}>
        현재: Product {selectedId}
      </div>

      {/* 캐로셀 */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '80px',
      }}>
        <Matrix2DCarousel
          items={sampleProducts}
          initialItemId={selectedId}
          onItemChange={handleItemChange}
          onClose={handleClose}
          config={{
            viewWidth: '70vw',
            arrowSize: 40,
            arrowPosition: 20,
            indicatorSize: 8,
          }}
        />
      </div>
    </div>
  );
};

export const WithProducts = {
  render: () => <WithProductsComponent />,
};
