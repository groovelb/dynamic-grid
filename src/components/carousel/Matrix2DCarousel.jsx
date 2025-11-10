import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import ArrowButton from '../../common/ui/ArrowButton';
import Indicator from '../../common/ui/Indicator';
import MediaRenderer from '../../common/media/MediaRenderer';

/**
 * Matrix2DCarousel 컴포넌트
 *
 * 2D 매트릭스 캐로셀 - 제품(세로축)과 이미지(가로축)를 독립적으로 탐색
 *
 * Props:
 * @param {array} items - 아이템 배열 (각 아이템은 id, name, images 필드 필요)
 * @param {string|number} initialItemId - 초기 선택된 아이템 ID
 * @param {function} onItemChange - 아이템 변경 콜백 (itemId를 인자로 받음)
 * @param {function} onClose - 닫기 콜백 (ESC 키)
 * @param {object} config - 반응형 설정 객체
 *   - viewWidth: 뷰 너비 (기본값: '70vw')
 *   - arrowSize: 화살표 버튼 크기 (기본값: 40)
 *   - arrowPosition: 화살표 위치 (기본값: 20)
 *   - indicatorSize: 인디케이터 크기 (기본값: 8)
 */
function Matrix2DCarousel({
  items,
  initialItemId,
  onItemChange,
  onClose,
  config = {},
}) {
  // === 반응형 설정 ===
  const viewWidth = config.viewWidth || '70vw';
  const arrowSize = config.arrowSize || 40;
  const arrowPosition = config.arrowPosition || 20;
  const indicatorSize = config.indicatorSize || 8;

  // === 2D 매트릭스 상태 관리 ===
  // 세로축: 아이템 인덱스
  const [itemIndex, setItemIndex] = useState(() => {
    const index = items.findIndex(item => item.id === initialItemId);
    console.log('[useState init] itemIndex:', index, 'for initialItemId:', initialItemId);
    return index;
  });

  // 가로축: 각 아이템별 이미지 인덱스 저장 (아이템 ID를 키로 사용)
  const [imageIndexMap, setImageIndexMap] = useState({});

  // 방향 추적
  const [verticalDirection, setVerticalDirection] = useState(0);
  const [imageDirection, setImageDirection] = useState(0);
  const [lastNavigationType, setLastNavigationType] = useState('horizontal');

  // 전환 중 플래그 (빠른 스크롤 방지) - ref만 사용
  const isTransitioningRef = useRef(false);

  // 비디오 재생 제어
  const videoRef = useRef(null);
  const isInitialMount = useRef(true);

  // itemIndex를 ref로도 추적 (useCallback에서 최신 값 참조용)
  const itemIndexRef = useRef(itemIndex);
  useEffect(() => {
    console.log('[useEffect:itemIndexRef] Updating ref:', itemIndex);
    itemIndexRef.current = itemIndex;
  }, [itemIndex]);

  // onItemChange를 ref로 관리 (dependency 이슈 방지)
  const onItemChangeRef = useRef(onItemChange);
  useEffect(() => {
    onItemChangeRef.current = onItemChange;
  }, [onItemChange]);

  // === 현재 아이템 및 이미지 인덱스 계산 ===
  const currentItem = items[itemIndex];
  const currentImageIndex = imageIndexMap[currentItem?.id] || 0;
  const currentMediaSrc = currentItem?.images[currentImageIndex];

  console.log('[render] currentItem:', currentItem?.id, 'itemIndex:', itemIndex);

  // itemIndex 변경 시 부모에게 알림
  useEffect(() => {
    const item = items[itemIndex];
    console.log('[useEffect:notify] itemIndex changed:', {
      itemIndex,
      itemId: item?.id,
      hasCallback: !!onItemChangeRef.current
    });

    if (item && onItemChangeRef.current) {
      console.log('[useEffect:notify] Calling onItemChange with:', item.id);
      onItemChangeRef.current(item.id);
    }
  }, [itemIndex, items]);

  // === 가로축 네비게이션 (이미지 변경) ===
  const handleNextImage = useCallback(() => {
    if (!currentItem) return;
    setImageDirection(1);
    setLastNavigationType('horizontal');

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    const currentIdx = imageIndexMap[currentItem.id] || 0;
    const nextIdx = (currentIdx + 1) % currentItem.images.length;

    setImageIndexMap(prev => ({
      ...prev,
      [currentItem.id]: nextIdx
    }));
  }, [currentItem, imageIndexMap]);

  const handlePrevImage = useCallback(() => {
    if (!currentItem) return;
    setImageDirection(-1);
    setLastNavigationType('horizontal');

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    const currentIdx = imageIndexMap[currentItem.id] || 0;
    const prevIdx = (currentIdx - 1 + currentItem.images.length) % currentItem.images.length;

    setImageIndexMap(prev => ({
      ...prev,
      [currentItem.id]: prevIdx
    }));
  }, [currentItem, imageIndexMap]);

  // === 세로축 네비게이션 (아이템 변경) ===
  const handleNextItem = useCallback(() => {
    console.log('[handleNextItem] Called:', {
      isTransitioning: isTransitioningRef.current,
      currentIndex: itemIndexRef.current,
      maxIndex: items.length - 1
    });

    if (isTransitioningRef.current || itemIndexRef.current >= items.length - 1) {
      console.log('[handleNextItem] Blocked');
      return;
    }

    console.log('[handleNextItem] Executing');
    setVerticalDirection(1);
    setLastNavigationType('vertical');
    isTransitioningRef.current = true;
    setItemIndex(prev => prev + 1);

    setTimeout(() => {
      console.log('[handleNextItem] Transition complete');
      isTransitioningRef.current = false;
    }, 300);
  }, [items.length]);

  const handlePrevItem = useCallback(() => {
    console.log('[handlePrevItem] Called:', {
      isTransitioning: isTransitioningRef.current,
      currentIndex: itemIndexRef.current,
      minIndex: 0
    });

    if (isTransitioningRef.current || itemIndexRef.current <= 0) {
      console.log('[handlePrevItem] Blocked');
      return;
    }

    console.log('[handlePrevItem] Executing');
    setVerticalDirection(-1);
    setLastNavigationType('vertical');
    isTransitioningRef.current = true;
    setItemIndex(prev => prev - 1);

    setTimeout(() => {
      console.log('[handlePrevItem] Transition complete');
      isTransitioningRef.current = false;
    }, 300);
  }, []);

  // === 키보드 이벤트 핸들러 ===
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextItem();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevItem();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handleNextItem, handlePrevItem]);

  // === 휠 이벤트 핸들러 (데스크톱 전용) ===
  useEffect(() => {
    const MIN_DISTANCE = 10;

    const handleWheel = (e) => {
      if (e.type === 'touchmove' || e.type === 'touchstart' || e.type === 'touchend') {
        return;
      }

      e.preventDefault();

      console.log('[Matrix2DCarousel] Wheel event:', {
        deltaY: e.deltaY,
        isTransitioning: isTransitioningRef.current,
        currentIndex: itemIndexRef.current,
        itemsLength: items.length
      });

      if (isTransitioningRef.current) {
        console.log('[Matrix2DCarousel] Blocked: transitioning');
        return;
      }

      if (Math.abs(e.deltaY) >= MIN_DISTANCE) {
        if (e.deltaY > 0) {
          // 다음 아이템으로 (아래로 스크롤)
          console.log('[Matrix2DCarousel] Calling handleNextItem');
          handleNextItem();
        } else {
          // 이전 아이템으로 (위로 스크롤)
          console.log('[Matrix2DCarousel] Calling handlePrevItem');
          handlePrevItem();
        }
      }
    };

    console.log('[Matrix2DCarousel] Adding wheel listener');
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      console.log('[Matrix2DCarousel] Removing wheel listener');
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleNextItem, handlePrevItem, items.length]);

  // === 터치 스와이프 핸들러 (모바일 전용) ===
  useEffect(() => {
    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e) => {
      if (isTransitioningRef.current) {
        return;
      }

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      const deltaY = touchStartY - touchEndY;
      const deltaTime = touchEndTime - touchStartTime;

      if (Math.abs(deltaY) > 50 && deltaTime < 300) {
        if (deltaY > 0) {
          handleNextItem();
        } else {
          handlePrevItem();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleNextItem, handlePrevItem]);

  // 아이템이 없으면 렌더링하지 않음
  if (!currentItem) {
    return null;
  }

  // === 2D 슬라이드 variants ===
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

  // 인디케이터 클릭 핸들러
  const handleIndicatorClick = (index) => {
    if (index > currentImageIndex) {
      handleNextImage();
    } else if (index < currentImageIndex) {
      handlePrevImage();
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: viewWidth,
        mt: '-80px',
        aspectRatio: '1/1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* 좌측 화살표 */}
      <ArrowButton
        onClick={handlePrevImage}
        direction="left"
        size={arrowSize}
        position={arrowPosition}
      />

      {/* 중앙 미디어 영역 - 2D 슬라이드 애니메이션 */}
      <AnimatePresence
        initial={false}
        custom={{
          navType: lastNavigationType,
          hDirection: imageDirection,
          vDirection: verticalDirection
        }}
        mode="wait"
      >
        <MediaRenderer
          key={`${currentItem.id}-${currentImageIndex}`}
          src={currentMediaSrc}
          alt={`${currentItem.name} - Image ${currentImageIndex + 1}`}
          videoRef={videoRef}
          variants={imageSlideVariants}
          custom={{
            navType: lastNavigationType,
            hDirection: imageDirection,
            vDirection: verticalDirection
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'tween', duration: 0.3, ease: 'easeInOut' },
            y: { type: 'tween', duration: 0.3, ease: 'easeInOut' },
            opacity: { duration: 0.3 },
          }}
          onAnimationComplete={() => {
            if (isInitialMount.current) {
              isInitialMount.current = false;
            }
          }}
        />
      </AnimatePresence>

      {/* 우측 화살표 */}
      <ArrowButton
        onClick={handleNextImage}
        direction="right"
        size={arrowSize}
        position={arrowPosition}
      />

      {/* 인디케이터 */}
      <Indicator
        total={currentItem.images.length}
        current={currentImageIndex}
        onSelect={handleIndicatorClick}
        size={indicatorSize}
        sx={{
          position: 'absolute',
          bottom: '-48px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
    </Box>
  );
}

export default Matrix2DCarousel;
export { Matrix2DCarousel };
