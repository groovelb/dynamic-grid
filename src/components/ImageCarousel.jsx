import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

/**
 * ImageCarousel 컴포넌트
 *
 * 제품 이미지를 가로로 슬라이드하며 탐색하는 캐러셀
 *
 * Props:
 * @param {string[]} images - 이미지 배열
 * @param {number} currentIndex - 현재 이미지 인덱스
 * @param {function} onNext - 다음 이미지 핸들러
 * @param {function} onPrev - 이전 이미지 핸들러
 * @param {string} productName - 제품명 (alt 텍스트)
 * @param {string|number} productId - 제품 ID (layoutId 생성용)
 * @param {number} direction - 슬라이드 방향 (1: 오른쪽, -1: 왼쪽)
 * @param {boolean} isInitialRender - 초기 렌더링 여부 (delay 적용용)
 *
 * Example:
 * <ImageCarousel
 *   images={product.images}
 *   currentIndex={0}
 *   onNext={() => {}}
 *   onPrev={() => {}}
 *   productName="Product Name"
 *   productId={1}
 *   direction={1}
 *   isInitialRender={true}
 * />
 */
function ImageCarousel({ images, currentIndex, onNext, onPrev, productName, productId, direction = 0, isInitialRender = false }) {
  // 키보드 네비게이션 (← →)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev]);

  // 슬라이드 variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  // 트랜지션 설정 (초기 렌더링 시 delay 적용)
  const transitionConfig = isInitialRender && currentIndex === 0
    ? {
        x: { type: 'tween', duration: 0.3, ease: 'easeInOut', delay: 0.2 }, // GridContainer 트랜지션 시간
        opacity: { duration: 0.3, delay: 0.2 },
      }
    : {
        x: { type: 'tween', duration: 0.3, ease: 'easeInOut' },
        opacity: { duration: 0.3 },
      };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* 이미지 컨테이너 */}
      <Box
        sx={{
          position: 'relative',
          width: '70vw',
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* 좌측 화살표 버튼 */}
        <IconButton
          onClick={onPrev}
          sx={{
            position: 'absolute',
            left: 20,
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            color: '#000',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          <Box component="span" sx={{ fontSize: 24, fontWeight: 300 }}>
            ‹
          </Box>
        </IconButton>

        {/* 이미지 슬라이드 */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${productName} - Image ${currentIndex + 1}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transitionConfig}
            // layoutId: 첫 번째 이미지만 ProductCard와 공유
            layoutId={currentIndex === 0 ? `product-image-${productId}` : undefined}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              position: 'absolute',
            }}
          />
        </AnimatePresence>

        {/* 우측 화살표 버튼 */}
        <IconButton
          onClick={onNext}
          sx={{
            position: 'absolute',
            right: 20,
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            color: '#000',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          <Box component="span" sx={{ fontSize: 24, fontWeight: 300 }}>
            ›
          </Box>
        </IconButton>
      </Box>

      {/* 인디케이터 */}
      <Box
        sx={{
          display: 'flex',
          gap: '12px',
          marginTop: '24px',
        }}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#000',
              opacity: index === currentIndex ? 1 : 0.3,
              transition: 'opacity 0.3s ease',
              cursor: 'pointer',
            }}
            onClick={() => {
              if (index > currentIndex) {
                onNext();
              } else if (index < currentIndex) {
                onPrev();
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default ImageCarousel;
