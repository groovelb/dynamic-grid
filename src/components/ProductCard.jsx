import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Box from '@mui/material/Box';

const MotionBox = motion(Box);

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
function ProductCard({ product, onClick, usePlaceholder = false }) {
  const [imageError, setImageError] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <MotionBox
      layout="position"
      onClick={ () => onClick && onClick(product) }
      initial={ shouldReduceMotion ? false : { opacity: 0, scale: 0.9 } }
      animate={ { opacity: 1, scale: 1 } }
      exit={ shouldReduceMotion ? false : { opacity: 0, scale: 0.9 } }
      transition={ {
        layout: { duration: 0.4, ease: 'easeInOut' },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      } }
      sx={ {
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        willChange: 'transform, opacity',
        aspectRatio: '1 / 1',
        overflow: 'hidden',
        width: '100%',
        height: 'auto',
        display: 'block',
        '&:hover': {
          opacity: 0.8,
          transition: 'opacity 0.2s ease',
        },
      } }
    >
      {imageError || usePlaceholder ? (
        <Box
          sx={ {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            '& svg': {
              opacity: 0.3,
            },
          } }
        >
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
        </Box>
      ) : (
        <Box
          component="img"
          src={ product.images[0] }
          alt={ product.name }
          onError={ handleImageError }
          sx={ {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          } }
        />
      )}
    </MotionBox>
  );
}

export default ProductCard;
