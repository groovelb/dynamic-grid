import { useState } from 'react';
import Indicator from './Indicator';

export default {
  title: 'Common/UI/Indicator',
  component: Indicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    total: {
      control: { type: 'range', min: 1, max: 20, step: 1 },
      description: '전체 아이템 개수',
    },
    current: {
      control: { type: 'range', min: 0, max: 19, step: 1 },
      description: '현재 활성화된 인덱스',
    },
    size: {
      control: { type: 'range', min: 4, max: 20, step: 1 },
      description: '인디케이터 크기 (px)',
    },
    gap: {
      control: 'text',
      description: '인디케이터 간격',
    },
    activeColor: {
      control: 'color',
      description: '활성 색상',
    },
    inactiveOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: '비활성 투명도',
    },
    marginTop: {
      control: 'text',
      description: '상단 여백',
    },
    onSelect: { action: 'selected' },
  },
};

// 기본 스토리
export const Default = {
  args: {
    total: 5,
    current: 2,
    size: 8,
    gap: '12px',
    activeColor: '#000',
    inactiveOpacity: 0.3,
    marginTop: '24px',
  },
};

// 개수별 스토리
export const Few = {
  args: {
    total: 3,
    current: 0,
  },
};

export const Many = {
  args: {
    total: 10,
    current: 5,
  },
};

// 크기별 스토리
export const SmallSize = {
  args: {
    total: 5,
    current: 2,
    size: 4,
    gap: '8px',
  },
};

export const LargeSize = {
  args: {
    total: 5,
    current: 2,
    size: 16,
    gap: '20px',
  },
};

// 색상 변형
export const BlueTheme = {
  args: {
    total: 5,
    current: 2,
    activeColor: '#2196F3',
    inactiveOpacity: 0.3,
  },
};

export const RedTheme = {
  args: {
    total: 5,
    current: 2,
    activeColor: '#f44336',
    inactiveOpacity: 0.2,
  },
};

export const GreenTheme = {
  args: {
    total: 5,
    current: 2,
    activeColor: '#4caf50',
    inactiveOpacity: 0.25,
  },
};

// 인터랙티브 예시
export const Interactive = {
  render: (args) => {
    const [current, setCurrent] = useState(0);

    return (
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '20px' }}>현재 페이지: {current + 1} / {args.total}</p>
        <Indicator
          {...args}
          current={current}
          onSelect={(index) => {
            setCurrent(index);
            console.log('Selected:', index);
          }}
        />
        <div style={{ marginTop: '30px' }}>
          <button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            style={{ marginRight: '10px' }}
          >
            이전
          </button>
          <button
            onClick={() => setCurrent(Math.min(args.total - 1, current + 1))}
            disabled={current === args.total - 1}
          >
            다음
          </button>
        </div>
      </div>
    );
  },
  args: {
    total: 5,
    size: 12,
    gap: '16px',
    activeColor: '#000',
  },
};

// 캐로셀 페이지네이션 시뮬레이션
export const CarouselPagination = {
  render: () => {
    const [current, setCurrent] = useState(0);
    const images = [
      '이미지 1',
      '이미지 2',
      '이미지 3',
      '이미지 4',
    ];

    return (
      <div style={{
        width: '400px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          height: '200px',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          <h3>{images[current]}</h3>
        </div>

        <Indicator
          total={images.length}
          current={current}
          onSelect={setCurrent}
          size={10}
          gap='14px'
        />

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setCurrent((current - 1 + images.length) % images.length)}
            style={{ marginRight: '10px' }}
          >
            ◀ 이전
          </button>
          <button
            onClick={() => setCurrent((current + 1) % images.length)}
          >
            다음 ▶
          </button>
        </div>
      </div>
    );
  },
};

// 비활성 인디케이터 (클릭 불가)
export const NonInteractive = {
  args: {
    total: 5,
    current: 2,
    onSelect: undefined, // 클릭 핸들러 없음
  },
};
