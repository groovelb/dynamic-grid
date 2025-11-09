import ArrowButton from './ArrowButton';

export default {
  title: 'Common/UI/ArrowButton',
  component: ArrowButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['left', 'right', 'up', 'down'],
      description: '화살표 방향',
    },
    size: {
      control: { type: 'range', min: 20, max: 100, step: 5 },
      description: '버튼 크기 (px)',
    },
    position: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: '버튼 위치 (px)',
    },
    positionSide: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: '위치 기준',
    },
    zIndex: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'z-index',
    },
    onClick: { action: 'clicked' },
  },
};

// 기본 스토리
export const Default = {
  args: {
    direction: 'right',
    size: 40,
    position: 20,
    zIndex: 10,
  },
};

// 방향별 스토리
export const LeftArrow = {
  args: {
    direction: 'left',
    size: 40,
  },
};

export const RightArrow = {
  args: {
    direction: 'right',
    size: 40,
  },
};

export const UpArrow = {
  args: {
    direction: 'up',
    size: 40,
  },
};

export const DownArrow = {
  args: {
    direction: 'down',
    size: 40,
  },
};

// 크기별 스토리
export const SmallSize = {
  args: {
    direction: 'right',
    size: 24,
  },
};

export const MediumSize = {
  args: {
    direction: 'right',
    size: 40,
  },
};

export const LargeSize = {
  args: {
    direction: 'right',
    size: 64,
  },
};

// 커스텀 스타일 예시
export const CustomStyle = {
  args: {
    direction: 'right',
    size: 50,
    sx: {
      backgroundColor: 'rgba(0, 0, 255, 0.2)',
      color: 'blue',
      borderRadius: '8px',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 255, 0.4)',
      },
    },
  },
};

// 캐로셀 네비게이션 시뮬레이션
export const CarouselNavigation = {
  render: () => (
    <div style={{ position: 'relative', width: '400px', height: '300px', border: '2px dashed #ccc' }}>
      <ArrowButton direction="left" size={40} position={10} onClick={() => console.log('Previous')} />
      <ArrowButton direction="right" size={40} position={10} positionSide="right" onClick={() => console.log('Next')} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p>캐로셀 콘텐츠 영역</p>
      </div>
    </div>
  ),
};
