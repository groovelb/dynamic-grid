import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * ProductCard 컴포넌트
 *
 * Props:
 * @param {object} product - 제품 데이터 객체 [Required]
 * @param {function} onClick - 카드 클릭 핸들러 [Optional]
 * @param {boolean} usePlaceholder - placeholder 모드 사용 여부 [Optional, 기본값: true]
 *
 * Example usage:
 * <ProductCard product={productData} onClick={handleProductClick} />
 */
function ProductCard({ product, onClick, usePlaceholder = true }) {
  const [imageError, setImageError] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      layout
      className="product-card"
      onClick={ () => onClick && onClick(product) }
      initial={ shouldReduceMotion ? false : { opacity: 0, scale: 0.8 } }
      animate={ { opacity: 1, scale: 1 } }
      exit={ shouldReduceMotion ? false : { opacity: 0, scale: 0.8 } }
      transition={ {
        layout: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      } }
    >
      <div className="product-card__image">
        {imageError || usePlaceholder ? (
          <div className="product-card__placeholder">
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
          </div>
        ) : (
          <img
            src={ product.images[0] }
            alt={ product.name }
            onError={ handleImageError }
          />
        )}
      </div>
      <div className="product-card__info">
        <h3 className="product-card__name">{ product.name }</h3>
        <p className="product-card__price">${ product.price }</p>
      </div>
    </motion.div>
  );
}

export default ProductCard;
