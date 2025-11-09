import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Box from '@mui/material/Box';
import { ANIMATION_STATES, TRANSITION, MEDIA_FILTERS, VIDEO_JOG } from '../constants/animations';

const MotionBox = motion(Box);

/**
 * ProductCard 컴포넌트
 *
 * Props:
 * @param {object} product - 제품 데이터 객체 [Required]
 * @param {function} onClick - 카드 클릭 핸들러 [Optional]
 * @param {boolean} usePlaceholder - placeholder 모드 사용 여부 [Optional, 기본값: false]
 * @param {boolean} isItemZoomed - Item Zoom 상태 [Optional, 기본값: false]
 * @param {boolean} isSelected - 선택된 아이템 여부 [Optional, 기본값: false]
 * @param {boolean} showDebug - 디버그 모드 표시 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <ProductCard product={productData} onClick={handleProductClick} showDebug={true} />
 */
function ProductCard({ product, onClick, usePlaceholder = false, isItemZoomed = false, isSelected = false, showDebug = false }) {
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // 비디오 재생 중 여부
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef(null);
  const jogIntervalRef = useRef(null); // 조그 인터벌 ref

  const handleImageError = () => {
    setImageError(true);
  };

  const handleVideoError = () => {
    console.warn('Video load failed for product:', product.id);
    setVideoError(true);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // 비디오 조그 함수: direction (1: 정방향, -1: 역방향)
  const jogVideo = useCallback((direction, onComplete) => {
    const video = videoRef.current;
    if (!video) return;

    // 기존 조그 중지
    if (jogIntervalRef.current) {
      cancelAnimationFrame(jogIntervalRef.current);
      jogIntervalRef.current = null;
    }

    // 메타데이터 로드 확인
    if (!video.duration || isNaN(video.duration)) {
      const handleMetadata = () => {
        jogVideo(direction, onComplete);
      };
      video.addEventListener('loadedmetadata', handleMetadata, { once: true });
      video.load();
      return;
    }

    // 정방향: requestAnimationFrame으로 수동 제어
    if (direction > 0) {
      video.pause();
      video.currentTime = 0;

      console.log(`🎬 Starting forward jog at ${VIDEO_JOG.PLAYBACK_SPEED}x speed`);

      const frameTime = 1000 / VIDEO_JOG.FPS;
      const step = (video.duration / VIDEO_JOG.FPS) * VIDEO_JOG.PLAYBACK_SPEED;

      let lastFrameTime = performance.now();

      const forwardFrame = () => {
        if (!video) {
          cancelAnimationFrame(jogIntervalRef.current);
          jogIntervalRef.current = null;
          return;
        }

        const now = performance.now();
        const delta = now - lastFrameTime;

        if (delta >= frameTime) {
          lastFrameTime = now - (delta % frameTime);

          video.currentTime += step;

          if (video.currentTime >= video.duration) {
            video.currentTime = video.duration;
            console.log('✅ Forward jog complete');
            if (onComplete) onComplete();
            return;
          }
        }

        jogIntervalRef.current = requestAnimationFrame(forwardFrame);
      };

      jogIntervalRef.current = requestAnimationFrame(forwardFrame);
      return;
    }

    // 역방향: 고정 간격으로 역재생 (더 안정적)
    video.pause();

    // 역재생 시작 위치 설정: currentTime이 너무 작으면 duration에서 시작
    const startTime = video.currentTime < 0.1 ? video.duration : video.currentTime;
    video.currentTime = startTime;

    console.log('🔄 Starting reverse from:', startTime, '/ duration:', video.duration);

    const frameTime = 1000 / VIDEO_JOG.FPS;
    const step = (video.duration / VIDEO_JOG.FPS) * VIDEO_JOG.PLAYBACK_SPEED;

    let lastFrameTime = performance.now();

    const reverseFrame = () => {
      const now = performance.now();
      const delta = now - lastFrameTime;

      // 프레임 간격 조절 (프레임 드롭 방지)
      if (delta >= frameTime) {
        lastFrameTime = now - (delta % frameTime);

        video.currentTime -= step;

        if (video.currentTime <= 0) {
          video.currentTime = 0;
          console.log('✅ Reverse play complete');
          if (onComplete) onComplete();
          return;
        }
      }

      jogIntervalRef.current = requestAnimationFrame(reverseFrame);
    };

    jogIntervalRef.current = requestAnimationFrame(reverseFrame);
  }, []);

  // cleanup: 컴포넌트 언마운트 시 조그 정리
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (jogIntervalRef.current) {
        cancelAnimationFrame(jogIntervalRef.current);
        jogIntervalRef.current = null;
      }
      // 비디오 정리
      if (video) {
        video.pause();
      }
    };
  }, []);

  // hover 시 비디오 재생/정지 제어
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHovered) {
      // hover: 이미 재생 중이거나 끝까지 재생된 경우 재생하지 않음
      if (isPlaying || video.currentTime >= video.duration - 0.1) {
        console.log('🚫 Already playing or completed, skip forward jog');
        return;
      }

      // hover: 정방향 조그 재생
      console.log('🖱️ Hover: starting forward jog');
      setIsPlaying(true);
      jogVideo(1, () => {
        console.log('✅ Forward jog complete (hover)');
        setIsPlaying(false);
      });
    } else {
      // unhover: 역방향 조그 재생 후 이미지로 전환
      if (isPlaying || video.currentTime > 0.1) {
        console.log('🖱️ Unhover: starting reverse jog');
        setIsReversing(true);
        jogVideo(-1, () => {
          console.log('✅ Reverse jog complete (unhover), switching to image');
          setIsReversing(false);
          setIsPlaying(false);
        });
      }
    }
  }, [isHovered, isPlaying, jogVideo]);

  const handleClick = () => {
    if (onClick) {
      // ID만 전달 (DOM 참조 제거)
      onClick(product.id);
    }
  };

  // === Fade out 효과: 줌 상태에서 모든 아이템 숨김 (ProductDetailView가 대신 표시) ===
  const targetOpacity = isItemZoomed ? 0 : 1;

  // === 선택된 아이템의 opacity 트랜지션을 빠르게 (GridContainer와 동기화) ===
  const opacityTransition = isSelected && isItemZoomed
    ? { opacity: { duration: 0.15, ease: 'easeOut' } } // 선택된 아이템만 빠르게 fade out
    : TRANSITION.PRODUCT_CARD_LAYOUT;

  // === 비디오 표시 여부 결정 ===
  const showVideo = !videoError && (
    isPlaying ||
    isReversing ||
    isHovered
  );

  return (
    <MotionBox
      layout="position"
      layoutId={ isSelected && isItemZoomed ? `product-image-${product.id}` : undefined }
      onClick={ handleClick }
      onMouseEnter={ handleMouseEnter }
      onMouseLeave={ handleMouseLeave }
      initial={ shouldReduceMotion ? false : ANIMATION_STATES.INITIAL }
      animate={ { opacity: targetOpacity, scale: ANIMATION_STATES.ANIMATE.scale } }
      exit={ shouldReduceMotion ? false : ANIMATION_STATES.EXIT }
      transition={ opacityTransition }
      sx={ {
        cursor: 'pointer',
        willChange: 'transform, opacity',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          opacity: 0.8,
          transition: 'opacity 0.2s ease',
        },
      } }
    >
      {/* 이미지 영역 (1:1 비율) */}
      <Box
        sx={ {
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          width: '100%',
          position: 'relative',
        } }
      >
        {imageError || usePlaceholder ? (
          <Box
            sx={ {
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg': {
                opacity: 0.3,
              },
            } }
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="5" y="10" width="50" height="40" stroke="#000000" strokeWidth="2" fill="none" />
              <circle cx="20" cy="25" r="5" fill="#000000" />
              <polyline points="5,45 20,30 35,40 55,25" stroke="#000000" strokeWidth="2" fill="none" />
            </svg>
          </Box>
        ) : (
          <>
            {/* 비디오 (model 모드 또는 hover 시 표시) */}
            <Box
              component="video"
              ref={ videoRef }
              src={ product.images[0] }
              muted
              playsInline
              preload="auto"
              onError={ handleVideoError }
              sx={ {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: showVideo ? 'block' : 'none',
                filter: MEDIA_FILTERS.BRIGHTNESS,
              } }
            />
            {/* 이미지 (product 모드 기본 표시) */}
            <Box
              component="img"
              src={ product.images[1] }
              alt={ product.name }
              onError={ handleImageError }
              sx={ {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: showVideo ? 'none' : 'block',
                filter: MEDIA_FILTERS.BRIGHTNESS,
              } }
            />
          </>
        )}

        {/* 디버그: 카드 중앙선 */}
        {showDebug && (
          <Box
            sx={ {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 10,
            } }
          >
            {/* 세로 중앙선 */}
            <Box
              sx={ {
                position: 'absolute',
                left: '50%',
                top: 0,
                width: '1px',
                height: '100%',
                backgroundColor: 'blue',
                opacity: 0.5,
              } }
            />
            {/* 가로 중앙선 */}
            <Box
              sx={ {
                position: 'absolute',
                left: 0,
                top: '50%',
                width: '100%',
                height: '1px',
                backgroundColor: 'blue',
                opacity: 0.5,
              } }
            />
            {/* 중심점 */}
            <Box
              sx={ {
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '8px',
                height: '8px',
                backgroundColor: 'blue',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.7,
              } }
            />
          </Box>
        )}
      </Box>

      {/* 제품명 - 이미지 영역 외부 하단 */}
      <Box
        sx={ {
          width: '100%',
          padding: '8px',
          // backgroundColor: 'rgba(255, 255, 255, 0.9)',
          fontSize: '12px',
          fontWeight: 400,
          color: '#000',
          textAlign: 'center',
          pointerEvents: 'none',
        } }
      >
        { product.name }
      </Box>
    </MotionBox>
  );
}

export default ProductCard;
