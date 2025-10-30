import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import ImageCarousel from './ImageCarousel';

/**
 * ProductDetailView 컴포넌트
 *
 * 제품 확대 뷰 - 전체 화면 오버레이로 제품 이미지를 탐색
 *
 * Props:
 * @param {string|number} productId - 현재 선택된 제품 ID
 * @param {array} filteredProducts - 필터링된 전체 제품 배열
 * @param {function} onProductChange - 제품 변경 콜백
 * @param {function} onClose - 닫기 콜백
 *
 * Example:
 * <ProductDetailView
 *   productId={selectedProductId}
 *   filteredProducts={filteredProducts}
 *   onProductChange={(newId) => setSelectedProductId(newId)}
 *   onClose={() => setSelectedProductId(null)}
 * />
 */
function ProductDetailView({ productId, filteredProducts, onProductChange, onClose }) {
  // 현재 제품 찾기
  const currentProduct = filteredProducts.find(p => p.id === productId);
  const currentIndex = filteredProducts.findIndex(p => p.id === productId);

  // 상태 관리
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(0); // 세로 방향
  const [imageDirection, setImageDirection] = useState(0);   // 가로 방향
  const [isInitialRender, setIsInitialRender] = useState(true); // 초기 렌더링 여부

  const containerRef = useRef(null);

  // 컴포넌트 마운트 시 초기 렌더링 플래그 해제
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialRender(false), 500); // delay + duration
    return () => clearTimeout(timer);
  }, []);

  // 제품 변경 시 이미지 인덱스 초기화 및 초기 렌더링 플래그 재설정
  useEffect(() => {
    setCurrentImageIndex(0);
    setIsInitialRender(true);
    const timer = setTimeout(() => setIsInitialRender(false), 500);
    return () => clearTimeout(timer);
  }, [productId]);

  // 이미지 네비게이션 핸들러
  const handleNextImage = useCallback(() => {
    if (!currentProduct) return;
    setImageDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % currentProduct.images.length);
  }, [currentProduct]);

  const handlePrevImage = useCallback(() => {
    if (!currentProduct) return;
    setImageDirection(-1);
    setCurrentImageIndex((prev) =>
      (prev - 1 + currentProduct.images.length) % currentProduct.images.length
    );
  }, [currentProduct]);

  // 제품 네비게이션 핸들러
  const handleNextProduct = useCallback(() => {
    if (isTransitioning) return;
    if (currentIndex >= filteredProducts.length - 1) return; // 마지막 제품

    setIsTransitioning(true);
    setScrollDirection(1);

    const nextProduct = filteredProducts[currentIndex + 1];
    onProductChange(nextProduct.id);

    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, currentIndex, filteredProducts, onProductChange]);

  const handlePrevProduct = useCallback(() => {
    if (isTransitioning) return;
    if (currentIndex <= 0) return; // 첫 번째 제품

    setIsTransitioning(true);
    setScrollDirection(-1);

    const prevProduct = filteredProducts[currentIndex - 1];
    onProductChange(prevProduct.id);

    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, currentIndex, filteredProducts, onProductChange]);

  // Wheel 이벤트 핸들러 (세로 스크롤)
  const handleWheel = useCallback((e) => {
    e.preventDefault();

    if (isTransitioning) return;

    const direction = e.deltaY > 0 ? 1 : -1; // 아래: 다음, 위: 이전

    if (direction > 0) {
      handleNextProduct();
    } else {
      handlePrevProduct();
    }
  }, [isTransitioning, handleNextProduct, handlePrevProduct]);

  // Wheel 이벤트 리스너 등록
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // passive: false로 preventDefault 활성화
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTransitioning) return;

      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handlePrevProduct();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleNextProduct();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning, handlePrevProduct, handleNextProduct, onClose]);

  // 제품이 없으면 렌더링하지 않음
  if (!currentProduct) {
    return null;
  }

  return (
    <Box
      component={motion.div}
      ref={containerRef}
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
      {/* 제품 전환 트랜지션 */}
      <AnimatePresence mode="wait" custom={scrollDirection}>
        <Box
          key={productId}
          sx={{
            width: '100%',
            height: '100%',
          }}
        >
          <ImageCarousel
            images={currentProduct.images}
            currentIndex={currentImageIndex}
            onNext={handleNextImage}
            onPrev={handlePrevImage}
            productName={currentProduct.name}
            productId={productId}
            direction={imageDirection}
            isInitialRender={isInitialRender}
          />
        </Box>
      </AnimatePresence>
    </Box>
  );
}

export default ProductDetailView;
