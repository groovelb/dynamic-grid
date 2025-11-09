import { useState } from 'react';
import ProductCard from '../ProductCard';

export default {
  title: '2. Components/Card/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
제품 카드 컴포넌트 - 이미지/비디오 전환 및 호버 인터랙션

### 사용자 인터랙션
- 카드에 **마우스를 올리면** 비디오가 정방향으로 재생됩니다 (1.3x 속도)
- 마우스를 **떼면** 비디오가 역방향으로 재생되고 이미지로 돌아갑니다
- 카드를 **클릭하면** onClick 핸들러가 호출되고 제품 상세 페이지로 이동합니다
- 카드가 **선택되면** Framer Motion의 layoutId로 ProductDetailView와 부드럽게 연결됩니다

### Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| **product** | object | - | 제품 데이터 (id, name, images, gender, color) |
| **onClick** | function | - | 카드 클릭 시 호출되는 함수 |
| **usePlaceholder** | boolean | false | true면 이미지 대신 placeholder 아이콘을 표시합니다 |
| **isItemZoomed** | boolean | false | true면 카드가 페이드아웃됩니다 (상세 페이지 진입 시) |
| **isSelected** | boolean | false | true면 layout animation이 활성화되어 상세 페이지로 부드럽게 전환됩니다 |
| **showDebug** | boolean | false | true면 카드 중앙에 파란 십자선과 중심점이 표시됩니다 |
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    product: {
      description: '제품 데이터 객체 (id, name, images, gender, color)',
      table: {
        type: { summary: 'object' },
      },
    },
    onClick: {
      description: '카드 클릭 핸들러',
      table: {
        type: { summary: 'function' },
        defaultValue: { summary: 'undefined' },
      },
    },
    usePlaceholder: {
      description: 'Placeholder 표시 모드',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isItemZoomed: {
      description: 'Item Zoom 상태 (fade out 효과)',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isSelected: {
      description: '선택된 아이템 여부 (layout animation)',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showDebug: {
      description: '디버그 모드 (중앙선 표시)',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

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
];

export const Default = {
  render: () => {
    const [clickedId, setClickedId] = useState(null);

    return (
      <div>
        <div style={{
          width: '300px',
        }}>
          <ProductCard
            product={sampleProducts[0]}
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

