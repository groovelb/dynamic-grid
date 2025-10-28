import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

/**
 * DynamicGrid 컴포넌트
 *
 * Props:
 * @param {array} products - 제품 데이터 배열 [Required]
 * @param {function} onProductClick - 제품 클릭 핸들러 [Optional]
 * @param {number} columns - 그리드 컬럼 수 [Optional, 기본값: 8]
 *
 * Example usage:
 * <DynamicGrid products={productList} onProductClick={handleClick} columns={8} />
 */
function DynamicGrid({ products, onProductClick, columns = 8 }) {
  return (
    <LayoutGroup>
      <motion.div
        className="dynamic-grid"
        layout
        style={ { gridTemplateColumns: `repeat(${columns}, 1fr)` } }
      >
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <ProductCard
              key={ product.id }
              product={ product }
              onClick={ onProductClick }
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}

export default DynamicGrid;
