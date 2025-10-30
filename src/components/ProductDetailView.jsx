import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import ImageCarousel from './ImageCarousel';

/**
 * ProductDetailView 컴포넌트
 *
 * 제품 확대 뷰 - 전체 화면 오버레이로 제품 이미지를 가로 carousel로 탐색
 *
 * Props:
 * @param {string|number} productId - 현재 선택된 제품 ID
 * @param {array} filteredProducts - 필터링된 전체 제품 배열
 * @param {function} onClose - 닫기 콜백
 *
 * Example:
 * <ProductDetailView
 *   productId={selectedProductId}
 *   filteredProducts={filteredProducts}
 *   onClose={() => setSelectedProductId(null)}
 * />
 */
function ProductDetailView({ productId, filteredProducts, onClose }) {
  // 현재 제품 찾기
  const currentProduct = filteredProducts.find(p => p.id === productId);

  // 상태 관리
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageDirection, setImageDirection] = useState(0);   // 가로 방향
  const [isInitialRender, setIsInitialRender] = useState(true); // 초기 렌더링 여부

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

  // 키보드 이벤트 핸들러 (ESC만)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 제품이 없으면 렌더링하지 않음
  if (!currentProduct) {
    return null;
  }

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

        {/* 제품명 */}
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
