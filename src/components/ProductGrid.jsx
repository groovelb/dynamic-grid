import ProductCard from './ProductCard';

/**
 * ProductGrid 컴포넌트
 *
 * Props:
 * @param {array} products - 제품 데이터 배열 [Required]
 * @param {function} onProductClick - 제품 클릭 핸들러 [Optional]
 * @param {number} columns - 그리드 컬럼 수 [Optional, 기본값: 3]
 *
 * Example usage:
 * <ProductGrid products={productList} onProductClick={handleClick} columns={3} />
 */
function ProductGrid({ products, onProductClick, columns = 3 }) {
  return (
    <div className="product-grid" style={ { gridTemplateColumns: `repeat(${columns}, 1fr)` } }>
      {products.map((product) => (
        <ProductCard
          key={ product.id }
          product={ product }
          onClick={ onProductClick }
        />
      ))}
    </div>
  );
}

export default ProductGrid;
