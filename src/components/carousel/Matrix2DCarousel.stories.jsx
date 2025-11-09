import { useState } from 'react';
import Matrix2DCarousel from './Matrix2DCarousel';

// 샘플 데이터
const sampleProducts = [
  {
    id: 1,
    name: '제품 A - 산악 풍경',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop',
    ],
  },
  {
    id: 2,
    name: '제품 B - 해변 풍경',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=800&fit=crop',
    ],
  },
  {
    id: 3,
    name: '제품 C - 도시 풍경',
    images: [
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=800&fit=crop',
    ],
  },
  {
    id: 4,
    name: '제품 D - 자연 풍경',
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=800&fit=crop',
    ],
  },
];

export default {
  title: 'Components/Carousel/Matrix2DCarousel',
  component: Matrix2DCarousel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '2D 매트릭스 캐로셀 - 제품(세로)과 이미지(가로)를 독립적으로 탐색합니다. 키보드(↑↓), 휠, 터치 제스처를 지원합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: '표시할 아이템 배열 (각 아이템은 id, name, images 필드 필요)',
    },
    initialItemId: {
      description: '초기 선택된 아이템 ID',
    },
    onItemChange: {
      action: 'item changed',
      description: '아이템 변경 콜백',
    },
    onClose: {
      action: 'closed',
      description: '닫기 콜백 (ESC 키)',
    },
    config: {
      description: '반응형 설정 객체',
    },
  },
};

// 기본 스토리
export const Default = {
  args: {
    items: sampleProducts,
    initialItemId: 1,
  },
  decorators: [
    (Story) => (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}>
        <Story />
      </div>
    ),
  ],
};

// 커스텀 크기 설정
export const CustomSize = {
  args: {
    items: sampleProducts,
    initialItemId: 2,
    config: {
      viewWidth: '80vw',
      arrowSize: 50,
      arrowPosition: 30,
      indicatorSize: 12,
    },
  },
  decorators: [
    (Story) => (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e0e0',
      }}>
        <Story />
      </div>
    ),
  ],
};

// 작은 크기
export const CompactSize = {
  args: {
    items: sampleProducts,
    initialItemId: 1,
    config: {
      viewWidth: '50vw',
      arrowSize: 32,
      arrowPosition: 10,
      indicatorSize: 6,
    },
  },
  decorators: [
    (Story) => (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
      }}>
        <Story />
      </div>
    ),
  ],
};

// 많은 이미지가 있는 제품
export const ManyImages = {
  args: {
    items: [
      {
        id: 1,
        name: '갤러리 제품',
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=800&fit=crop',
        ],
      },
    ],
    initialItemId: 1,
  },
  decorators: [
    (Story) => (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
      }}>
        <Story />
      </div>
    ),
  ],
};

// 상태 제어 예시
export const ControlledState = {
  render: () => {
    const [currentItemId, setCurrentItemId] = useState(1);

    return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        {/* 상단 컨트롤 패널 */}
        <div style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 200,
          backgroundColor: 'white',
          padding: '15px 30px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
        }}>
          <span>현재 제품 ID: <strong>{currentItemId}</strong></span>
          <select
            value={currentItemId}
            onChange={(e) => setCurrentItemId(Number(e.target.value))}
            style={{ padding: '5px 10px' }}
          >
            {sampleProducts.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* 캐로셀 */}
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}>
          <Matrix2DCarousel
            items={sampleProducts}
            initialItemId={currentItemId}
            onItemChange={setCurrentItemId}
            onClose={() => alert('닫기 버튼 클릭됨')}
          />
        </div>
      </div>
    );
  },
};

// 완전한 통합 예시 (제품명 표시 포함)
export const FullIntegration = {
  render: () => {
    const [selectedId, setSelectedId] = useState(1);
    const [isOpen, setIsOpen] = useState(true);

    const currentProduct = sampleProducts.find(p => p.id === selectedId);

    if (!isOpen) {
      return (
        <div style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2>캐로셀이 닫혔습니다</h2>
            <button
              onClick={() => setIsOpen(true)}
              style={{
                marginTop: '20px',
                padding: '10px 30px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              다시 열기
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#fff' }}>
        {/* 캐로셀 컨테이너 */}
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '80px',
        }}>
          <Matrix2DCarousel
            items={sampleProducts}
            initialItemId={selectedId}
            onItemChange={setSelectedId}
            onClose={() => setIsOpen(false)}
            config={{
              viewWidth: '70vw',
              arrowSize: 40,
              arrowPosition: 20,
              indicatorSize: 8,
            }}
          />

          {/* 제품명 표시 */}
          <div style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 400,
            color: '#000',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}>
            {currentProduct?.name}
          </div>

          {/* 도움말 */}
          <div style={{
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '14px',
            lineHeight: '1.6',
          }}>
            <strong>사용법:</strong><br />
            ↑↓ 키: 제품 변경<br />
            마우스 휠: 제품 변경<br />
            ←→ 화살표: 이미지 변경<br />
            ESC: 닫기
          </div>
        </div>
      </div>
    );
  },
};
