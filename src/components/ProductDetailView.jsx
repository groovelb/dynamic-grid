import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Matrix2DCarousel from './carousel/Matrix2DCarousel';

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
  const matrixConfig = {
    viewWidth: config?.detailViewWidth || '70vw',
    arrowSize: config?.detailArrowSize || 40,
    arrowPosition: config?.detailArrowPosition || 20,
    indicatorSize: config?.detailIndicatorSize || 8,
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.3, delay: 0.1 }}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 100,
        overflow: 'hidden',
        pointerEvents: 'auto',
        paddingTop: '80px',
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
        {/* 2D Matrix Carousel */}
        <Matrix2DCarousel
          items={filteredProducts}
          initialItemId={productId}
          onItemChange={onProductChange}
          onClose={onClose}
          config={matrixConfig}
        />

        {/* 제품명 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 400,
            color: '#000',
            textAlign: 'center',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {filteredProducts.find(p => p.id === productId)?.name}
        </Box>
      </Box>
    </Box>
  );
}

export default ProductDetailView;
