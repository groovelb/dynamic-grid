import { LayoutGroup, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';

/**
 * DynamicGrid 컴포넌트
 *
 * Props:
 * @param {ReactNode} children - 그리드 아이템들 [Required]
 * @param {number} columns - 그리드 컬럼 수 [Optional, 기본값: 8]
 * @param {number} gap - 그리드 간격 (px) [Optional, 기본값: 48]
 *
 * Example usage:
 * <DynamicGrid columns={8} gap={48}>
 *   {products.map(product => (
 *     <ProductCard key={product.id} product={product} />
 *   ))}
 * </DynamicGrid>
 */
function DynamicGrid({ children, columns = 8, gap = 48 }) {
  return (
    <LayoutGroup>
      <Box
        sx={ {
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
          width: '100%',
        } }
      >
        <AnimatePresence mode="popLayout">
          {children}
        </AnimatePresence>
      </Box>
    </LayoutGroup>
  );
}

export default DynamicGrid;
