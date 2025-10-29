import { LayoutGroup, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import ProductCard from './ProductCard';

/**
 * DynamicGrid 컴포넌트
 *
 * Props:
 * @param {array} products - 제품 데이터 배열 [Required]
 * @param {function} onProductClick - 제품 클릭 핸들러 [Optional]
 * @param {number} columns - 그리드 컬럼 수 [Optional, 기본값: 8]
 * @param {string|null} selectedProductId - 선택된 제품 ID [Optional]
 * @param {boolean} isItemZoomed - Item Zoom 상태 [Optional]
 *
 * Example usage:
 * <DynamicGrid products={productList} onProductClick={handleClick} columns={8} />
 */
function DynamicGrid({ products, onProductClick, columns = 8, selectedProductId = null, isItemZoomed = false }) {
  return (
    <LayoutGroup>
      <Box
        sx={ {
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '0px',
          width: '100%',
        } }
      >
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <ProductCard
              key={ product.id }
              product={ product }
              onClick={ onProductClick }
              isItemZoomed={ isItemZoomed }
              isSelected={ selectedProductId === product.id }
            />
          ))}
        </AnimatePresence>
      </Box>
    </LayoutGroup>
  );
}

export default DynamicGrid;
