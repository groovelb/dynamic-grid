import { useState } from 'react';
import MediaRenderer from './MediaRenderer';
import { AnimatePresence } from 'framer-motion';

export default {
  title: 'Common/Media/MediaRenderer',
  component: MediaRenderer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: '미디어 소스 URL',
    },
    alt: {
      control: 'text',
      description: '이미지 alt 텍스트',
    },
    playbackRate: {
      control: { type: 'range', min: 0.5, max: 3, step: 0.1 },
      description: '비디오 재생 속도',
    },
    autoPlay: {
      control: 'boolean',
      description: '비디오 자동 재생',
    },
    onVideoEnded: { action: 'video ended' },
    onAnimationStart: { action: 'animation started' },
    onAnimationComplete: { action: 'animation completed' },
  },
};

// 이미지 렌더링
export const ImageExample = {
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
    alt: '샘플 이미지',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px', height: '500px', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};

// 다른 이미지 예시
export const ImageExample2 = {
  args: {
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=800&fit=crop',
    alt: '풍경 이미지',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px', height: '500px', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};

// 비디오 렌더링 (샘플 비디오)
export const VideoExample = {
  args: {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    alt: '샘플 비디오',
    playbackRate: 1.3,
    autoPlay: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px', height: '500px', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};

// 비디오 재생 속도 제어
export const VideoPlaybackSpeed = {
  render: (args) => {
    const [speed, setSpeed] = useState(1.0);

    return (
      <div>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <label>
            재생 속도: {speed.toFixed(1)}x
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              style={{ marginLeft: '10px', width: '200px' }}
            />
          </label>
        </div>
        <div style={{ width: '500px', height: '500px', position: 'relative' }}>
          <MediaRenderer
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
            playbackRate={speed}
            autoPlay={true}
          />
        </div>
      </div>
    );
  },
};

// Framer Motion 애니메이션 포함
export const WithAnimation = {
  render: () => {
    const [isVisible, setIsVisible] = useState(true);

    const slideVariants = {
      enter: { x: 1000, opacity: 0 },
      center: { x: 0, opacity: 1 },
      exit: { x: -1000, opacity: 0 },
    };

    return (
      <div>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <button onClick={() => setIsVisible(!isVisible)}>
            {isVisible ? '숨기기' : '표시하기'} (애니메이션)
          </button>
        </div>
        <div style={{ width: '500px', height: '500px', position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            {isVisible && (
              <MediaRenderer
                key="animated-image"
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop"
                alt="애니메이션 이미지"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  },
};

// 이미지 캐로셀 시뮬레이션
export const ImageCarouselSimulation = {
  render: () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);

    const images = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=800&fit=crop',
    ];

    const slideVariants = {
      enter: (dir) => ({ x: dir > 0 ? 1000 : -1000, opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (dir) => ({ x: dir < 0 ? 1000 : -1000, opacity: 0 }),
    };

    const handleNext = () => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
      setDirection(-1);
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
      <div>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <button onClick={handlePrev} style={{ marginRight: '10px' }}>◀ 이전</button>
          <span>{currentIndex + 1} / {images.length}</span>
          <button onClick={handleNext} style={{ marginLeft: '10px' }}>다음 ▶</button>
        </div>
        <div style={{ width: '600px', height: '600px', position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <MediaRenderer
              key={currentIndex}
              src={images[currentIndex]}
              alt={`이미지 ${currentIndex + 1}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'tween', duration: 0.3, ease: 'easeInOut' },
                opacity: { duration: 0.3 },
              }}
            />
          </AnimatePresence>
        </div>
      </div>
    );
  },
};

// 커스텀 스타일
export const CustomStyle = {
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
    alt: '커스텀 스타일 이미지',
    style: {
      borderRadius: '20px',
      filter: 'brightness(1.1) contrast(1.05)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px', height: '500px', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};
