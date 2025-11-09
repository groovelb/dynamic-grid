import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { MEDIA_FILTERS } from '../constants/animations';

// 비디오 파일인지 확인하는 헬퍼 함수
const isVideo = (src) => {
  if (!src) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return videoExtensions.some(ext => src.toLowerCase().endsWith(ext));
};

/**
 * ProductDetailView 컴포넌트
 *
 * 제품 확대 뷰 - 전체 화면 오버레이로 제품 이미지를 가로 carousel로 탐색
 *
 * Props:
 * @param {string|number} productId - 현재 선택된 제품 ID
 * @param {array} filteredProducts - 필터링된 전체 제품 배열
 * @param {function} onProductChange - 제품 변경 콜백
 * @param {function} onClose - 닫기 콜백
 * @param {object} config - 반응형 설정 객체 [Optional]
 *
 * Example:
 * <ProductDetailView
 *   productId={selectedProductId}
 *   filteredProducts={filteredProducts}
 *   onProductChange={(newId) => setSelectedProductId(newId)}
 *   onClose={() => setSelectedProductId(null)}
 *   config={config}
 * />
 */
function ProductDetailView({ productId, filteredProducts, onProductChange, onClose, config }) {
  // === 반응형 설정 (기본값: Full HD) ===
  const detailViewWidth = config?.detailViewWidth || '70vw';
  const detailViewHeight = config?.detailViewHeight || '70vh';
  const detailArrowSize = config?.detailArrowSize || 40;
  const detailArrowPosition = config?.detailArrowPosition || 20;
  const detailIndicatorSize = config?.detailIndicatorSize || 8;

  // === 2D Carousel Matrix 상태 관리 ===

  // 세로축: 제품 인덱스 (현재 보고 있는 제품의 위치)
  const [productIndex, setProductIndex] = useState(
    filteredProducts.findIndex(p => p.id === productId)
  );

  // 가로축: 각 제품별 이미지 인덱스 저장 (제품 ID를 키로 사용)
  // 예시: { 1: 2, 2: 0, 3: 1 } = 제품1은 3번째 이미지, 제품2는 1번째 이미지 등
  const [imageIndexMap, setImageIndexMap] = useState({});

  // 세로 전환 방향 (1: 아래로, -1: 위로)
  const [verticalDirection, setVerticalDirection] = useState(0);

  // 가로 전환 방향 (1: 오른쪽, -1: 왼쪽)
  const [imageDirection, setImageDirection] = useState(0);

  // 마지막 네비게이션 타입 ('horizontal' | 'vertical')
  const [lastNavigationType, setLastNavigationType] = useState('horizontal');

  // 전환 중 플래그 (빠른 스크롤 방지) - ref로 즉시 동기 차단
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isTransitioningRef = useRef(false); // 동기 차단용

  // 비디오 재생 제어를 위한 ref
  const videoRef = useRef(null);

  // 최초 마운트 여부 추적 (줌인 트랜지션 후 자동 재생을 위해)
  const isInitialMount = useRef(true);

  // 각 제품-이미지 조합별로 재생 완료 여부 추적
  const playedVideosRef = useRef(new Set());

  // === 현재 제품 및 이미지 인덱스 계산 ===
  const currentProduct = filteredProducts[productIndex];
  const currentImageIndex = imageIndexMap[currentProduct?.id] || 0;

  // 현재 미디어 소스 및 타입
  const currentMediaSrc = currentProduct?.images[currentImageIndex];
  const isCurrentMediaVideo = isVideo(currentMediaSrc);

  // 디버깅: productIndex 변경 추적
  useEffect(() => {
    console.log('🔄 productIndex changed:', {
      productIndex,
      currentProduct: currentProduct ? {
        id: currentProduct.id,
        name: currentProduct.name
      } : null,
      imageIndexMap,
      currentImageIndex
    });
  }, [productIndex, currentProduct, imageIndexMap, currentImageIndex]);

  // productIndex 변경 시 부모에게 알림
  useEffect(() => {
    if (currentProduct && onProductChange) {
      onProductChange(currentProduct.id);
    }
  }, [productIndex]); // currentProduct, onProductChange는 의도적으로 제외 (무한 루프 방지)

  // 비디오 재생 제어 - currentImageIndex 변경 시
  useEffect(() => {
    if (isCurrentMediaVideo && videoRef.current && currentProduct) {
      const video = videoRef.current;

      // 재생 속도 설정
      video.playbackRate = 1.3;

      // 캐로셀 이동 시 항상 처음부터 재생
      video.currentTime = 0;
      video.play().catch(err => {
        console.log('Video autoplay prevented:', err);
      });
    }
  }, [currentImageIndex, currentProduct?.id, isCurrentMediaVideo, currentProduct]);

  // === 가로축 네비게이션 (이미지 변경) ===
  const handleNextImage = useCallback(() => {
    if (!currentProduct) return;
    setImageDirection(1);
    setLastNavigationType('horizontal');

    // 가로 네비게이션 시 초기 마운트 플래그 해제 (이후 비디오 재생 허용)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      console.log('✅ First navigation detected, videos will now play');
    }

    const currentIdx = imageIndexMap[currentProduct.id] || 0;
    const nextIdx = (currentIdx + 1) % currentProduct.images.length;

    setImageIndexMap(prev => ({
      ...prev,
      [currentProduct.id]: nextIdx
    }));
  }, [currentProduct, imageIndexMap]);

  const handlePrevImage = useCallback(() => {
    if (!currentProduct) return;
    setImageDirection(-1);
    setLastNavigationType('horizontal');

    // 가로 네비게이션 시 초기 마운트 플래그 해제 (이후 비디오 재생 허용)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      console.log('✅ First navigation detected, videos will now play');
    }

    const currentIdx = imageIndexMap[currentProduct.id] || 0;
    const prevIdx = (currentIdx - 1 + currentProduct.images.length) % currentProduct.images.length;

    setImageIndexMap(prev => ({
      ...prev,
      [currentProduct.id]: prevIdx
    }));
  }, [currentProduct, imageIndexMap]);

  // === 세로축 네비게이션 (제품 변경) ===
  const handleNextProduct = useCallback(() => {
    console.log('📍 handleNextProduct called:', {
      isTransitioning,
      productIndex,
      maxIndex: filteredProducts.length - 1,
      canProceed: !isTransitioning && productIndex < filteredProducts.length - 1
    });

    if (isTransitioning || productIndex >= filteredProducts.length - 1) {
      console.log('⛔ Blocked: isTransitioning or at last product');
      return;
    }

    console.log('✅ Proceeding with next product');
    setVerticalDirection(1);
    setLastNavigationType('vertical');
    setIsTransitioning(true);
    isTransitioningRef.current = true; // 동기 업데이트
    setProductIndex(prev => {
      console.log(`   productIndex: ${prev} → ${prev + 1}`);
      return prev + 1;
    });

    // 전환 완료 후 플래그 해제 (애니메이션 duration과 동기화)
    setTimeout(() => {
      setIsTransitioning(false);
      isTransitioningRef.current = false;
    }, 300);
  }, [isTransitioning, productIndex, filteredProducts.length]);

  const handlePrevProduct = useCallback(() => {
    console.log('📍 handlePrevProduct called:', {
      isTransitioning,
      productIndex,
      minIndex: 0,
      canProceed: !isTransitioning && productIndex > 0
    });

    if (isTransitioning || productIndex <= 0) {
      console.log('⛔ Blocked: isTransitioning or at first product');
      return;
    }

    console.log('✅ Proceeding with prev product');
    setVerticalDirection(-1);
    setLastNavigationType('vertical');
    setIsTransitioning(true);
    isTransitioningRef.current = true; // 동기 업데이트
    setProductIndex(prev => {
      console.log(`   productIndex: ${prev} → ${prev - 1}`);
      return prev - 1;
    });

    // 전환 완료 후 플래그 해제
    setTimeout(() => {
      setIsTransitioning(false);
      isTransitioningRef.current = false;
    }, 300);
  }, [isTransitioning, productIndex]);

  // 키보드 이벤트 핸들러 (ESC, 세로 방향키)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextProduct();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevProduct();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handleNextProduct, handlePrevProduct]);

  // 휠 이벤트 핸들러 (최소 거리 감지 후 즉시 트리거 + duration 동안 무시)
  useEffect(() => {
    const MIN_DISTANCE = 10; // 방향 감지를 위한 최소 거리 (매우 낮음)

    const handleWheel = (e) => {
      e.preventDefault();

      console.log('🔵 Wheel event:', {
        deltaY: e.deltaY,
        isTransitioningRef: isTransitioningRef.current,
      });

      // REF를 체크 (동기적 차단!)
      if (isTransitioningRef.current) {
        console.log('⛔ Ignored: cooldown active (REF blocked synchronously)');
        return;
      }

      // 최소 거리를 넘으면 즉시 방향 감지 후 트리거
      if (Math.abs(e.deltaY) >= MIN_DISTANCE) {
        const direction = e.deltaY > 0 ? 'down' : 'up';
        console.log('🟢 Direction detected:', direction);
        console.log('⏱️  Starting 300ms cooldown (REF immediately set to true)');

        // 즉시 ref를 true로 설정 (동기 차단)
        isTransitioningRef.current = true;

        if (e.deltaY > 0) {
          handleNextProduct();
        } else {
          handlePrevProduct();
        }
        // ref가 이미 true이므로 다음 이벤트는 즉시 차단됨!
      } else {
        console.log('⚪ Delta too small, ignored:', e.deltaY);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleNextProduct, handlePrevProduct]);

  // 제품이 없으면 렌더링하지 않음
  if (!currentProduct) {
    return null;
  }

  // 2D 슬라이드 variants (가로/세로 방향에 따라 다르게 동작)
  const imageSlideVariants = {
    enter: ({ navType, hDirection, vDirection }) => {
      if (navType === 'horizontal') {
        return {
          x: hDirection > 0 ? 1000 : -1000,
          y: 0,
          opacity: 0,
        };
      } else {
        return {
          x: 0,
          y: vDirection > 0 ? 600 : -600,
          opacity: 0,
        };
      }
    },
    center: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    exit: ({ navType, hDirection, vDirection }) => {
      if (navType === 'horizontal') {
        return {
          x: hDirection < 0 ? 1000 : -1000,
          y: 0,
          opacity: 0,
        };
      } else {
        return {
          x: 0,
          y: vDirection < 0 ? 600 : -600,
          opacity: 0,
        };
      }
    },
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.3, delay: 0.1 }} // GridContainer 트랜지션 후 fade in + blur
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 100,
        overflow: 'hidden',
        pointerEvents: 'auto',
        paddingTop: '80px', // 헤더 높이만큼 여백 (padding: 20px * 2 + button height)
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 이미지 컨테이너 (반응형 크기) */}
        <Box
          sx={{
            position: 'relative',
            width: detailViewWidth,
            height: detailViewHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* 좌측 화살표 버튼 - 반응형 */}
          <IconButton
            onClick={handlePrevImage}
            sx={{
              position: 'absolute',
              left: detailArrowPosition,
              zIndex: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: '#000',
              width: detailArrowSize,
              height: detailArrowSize,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            }}
          >
            <Box component="span" sx={{ fontSize: 24, fontWeight: 300 }}>
              ‹
            </Box>
          </IconButton>

          {/* 중앙 이미지 영역 - 2D 슬라이드 애니메이션 */}
          <AnimatePresence
            initial={false}
            custom={{
              navType: lastNavigationType,
              hDirection: imageDirection,
              vDirection: verticalDirection
            }}
            mode="wait"
          >
            {isCurrentMediaVideo ? (
              <motion.video
                ref={videoRef}
                key={`${currentProduct.id}-${currentImageIndex}`}
                src={currentMediaSrc}
                muted
                playsInline
                custom={{
                  navType: lastNavigationType,
                  hDirection: imageDirection,
                  vDirection: verticalDirection
                }}
                variants={imageSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'tween', duration: 0.3, ease: 'easeInOut' },
                  y: { type: 'tween', duration: 0.3, ease: 'easeInOut' },
                  opacity: { duration: 0.3 },
                }}
                onAnimationStart={() => {
                  console.log('🎬 Video Animation START:', currentProduct.id, currentImageIndex, lastNavigationType);
                }}
                onAnimationComplete={() => {
                  console.log('🎬 Video Animation COMPLETE:', currentProduct.id, currentImageIndex);

                  // 비디오 재생
                  if (videoRef.current) {
                    videoRef.current.playbackRate = 1.3;
                    videoRef.current.currentTime = 0;
                    videoRef.current.play().catch(err => {
                      console.log('Video autoplay prevented:', err);
                    });
                  }

                  // 최초 마운트 플래그 해제
                  if (isInitialMount.current) {
                    console.log('✅ Initial mount complete');
                    isInitialMount.current = false;
                  }
                }}
                onEnded={() => {
                  // 비디오 재생 완료 시 기록
                  const videoKey = `${currentProduct.id}-${currentImageIndex}`;
                  playedVideosRef.current.add(videoKey);
                  console.log('✅ Video playback completed:', videoKey);
                }}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  position: 'absolute',
                  filter: MEDIA_FILTERS.BRIGHTNESS,
                }}
              />
            ) : (
              <motion.img
                key={`${currentProduct.id}-${currentImageIndex}`}
                src={currentMediaSrc}
                alt={`${currentProduct.name} - Image ${currentImageIndex + 1}`}
                custom={{
                  navType: lastNavigationType,
                  hDirection: imageDirection,
                  vDirection: verticalDirection
                }}
                variants={imageSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'tween', duration: 0.3, ease: 'easeInOut' },
                  y: { type: 'tween', duration: 0.3, ease: 'easeInOut' },
                  opacity: { duration: 0.3 },
                }}
                onAnimationStart={() => console.log('🎬 Image Animation START:', currentProduct.id, currentImageIndex, lastNavigationType)}
                onAnimationComplete={() => {
                  console.log('🎬 Image Animation COMPLETE:', currentProduct.id, currentImageIndex);
                  // 최초 마운트 플래그 해제
                  if (isInitialMount.current) {
                    isInitialMount.current = false;
                  }
                }}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  position: 'absolute',
                  filter: MEDIA_FILTERS.BRIGHTNESS,
                }}
              />
            )}
          </AnimatePresence>

          {/* 우측 화살표 버튼 - 반응형 */}
          <IconButton
            onClick={handleNextImage}
            sx={{
              position: 'absolute',
              right: detailArrowPosition,
              zIndex: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: '#000',
              width: detailArrowSize,
              height: detailArrowSize,
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

        {/* 인디케이터 - 반응형 */}
        <Box
          sx={{
            display: 'flex',
            gap: '12px',
            marginTop: '24px',
          }}
        >
          {currentProduct.images.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: detailIndicatorSize,
                height: detailIndicatorSize,
                borderRadius: '50%',
                backgroundColor: '#000',
                opacity: index === currentImageIndex ? 1 : 0.3,
                transition: 'opacity 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => {
                if (index > currentImageIndex) {
                  handleNextImage();
                } else if (index < currentImageIndex) {
                  handlePrevImage();
                }
              }}
            />
          ))}
        </Box>

        {/* 제품명 - 고정 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            fontSize: '16px',
            fontWeight: 400,
            color: '#000',
            textAlign: 'center',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {currentProduct.name}
        </Box>
      </Box>
    </Box>
  );
}

export default ProductDetailView;
