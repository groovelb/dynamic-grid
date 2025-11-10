import { useState } from 'react';
import { motion } from 'framer-motion';
import DynamicGrid from '../DynamicGrid';
import ProductCard from '../ProductCard';

export default {
  title: '2. Components/Grid/DynamicGrid',
  component: DynamicGrid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
동적 그리드 컴포넌트 - Framer Motion Layout Animation

### 사용자 인터랙션
- **Shuffle 버튼을 클릭하면** 그리드 아이템이 무작위로 섞입니다
- **아이템을 클릭하면** onClick 핸들러가 호출됩니다
- 그리드는 **columns 값에 따라** 동적으로 컬럼 수가 변경됩니다
- **gap 값으로** 아이템 간 간격을 조절할 수 있습니다

### Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| **children** | ReactNode | - | 그리드에 배치할 아이템들 (ProductCard 등) |
| **columns** | number | 8 | 그리드 컬럼 수 |
| **gap** | number | 48 | 그리드 간격 (px) |
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: '그리드에 배치할 아이템들',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    columns: {
      description: '그리드 컬럼 수',
      control: { type: 'number', min: 1, max: 12 },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '8' },
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
  },
};

// 정육면체 컴포넌트 (Framer Motion 적용)
const CubeItem = ({ number }) => (
  <motion.div
    layout
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    style={{
      aspectRatio: '1 / 1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      border: '1px solid #e0e0e0',
      fontSize: '24px',
      fontWeight: '500',
      color: '#666',
      fontFamily: 'system-ui',
    }}
  >
    {number}
  </motion.div>
);

// 정육면체 그리드 아이템 생성
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

// Shuffle 함수
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const Default = {
  render: () => {
    const [items, setItems] = useState(createCubeItems(24));

    return (
      <div>
        {/* Shuffle 버튼 */}
        <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <button
            onClick={() => setItems(shuffleArray(items))}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontFamily: 'system-ui',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '0',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Shuffle
          </button>
        </div>

        {/* 그리드 */}
        <DynamicGrid columns={6} gap={20}>
          {items.map(item => (
            <CubeItem key={item.id} number={item.number} />
          ))}
        </DynamicGrid>

        {/* 안내 */}
        <div style={{
          marginTop: '30px',
          padding: '16px',
          backgroundColor: '#f9f9f9',
          borderRadius: '4px',
          fontFamily: 'system-ui',
          fontSize: '13px',
          color: '#666',
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '500', color: '#000' }}>
            Layout Animation
          </p>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            <li>Shuffle 버튼을 클릭하면 아이템이 무작위로 섞입니다</li>
            <li>Framer Motion의 layout animation으로 부드럽게 위치가 변경됩니다</li>
            <li>각 아이템은 고유한 key 값으로 추적됩니다</li>
          </ul>
        </div>
      </div>
    );
  },
};

export const WithProducts = {
  render: () => {
    const [products, setProducts] = useState(sampleProducts);
    const [clickedId, setClickedId] = useState(null);

    return (
      <div>
        {/* Shuffle 버튼 */}
        <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
        }}>
          <button
            onClick={() => setProducts(shuffleArray(products))}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontFamily: 'system-ui',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '0',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Shuffle
          </button>
        </div>

        {/* 그리드 */}
        <DynamicGrid columns={3} gap={24}>
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={(id) => {
                console.log('Clicked product:', id);
                setClickedId(id);
              }}
            />
          ))}
        </DynamicGrid>

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

        {/* 안내 */}
        <div style={{
          marginTop: '30px',
          padding: '16px',
          backgroundColor: '#f9f9f9',
          borderRadius: '4px',
          fontFamily: 'system-ui',
          fontSize: '13px',
          color: '#666',
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '500', color: '#000' }}>
            실제 제품 카드
          </p>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            <li>카드에 마우스를 올리면 비디오가 재생됩니다</li>
            <li>Shuffle 버튼으로 제품 순서를 섞을 수 있습니다</li>
            <li>카드를 클릭하면 onClick 핸들러가 호출됩니다</li>
          </ul>
        </div>
      </div>
    );
  },
};
