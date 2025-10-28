import { useRef, useEffect, useState } from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { calculateTransform, getInitialTransform } from '../utils/transformCalculator';
import { TRANSITION, DURATION, REDUCED_MOTION } from '../constants/animations';

/**
 * GridContainer 컴포넌트
 *
 * DynamicGrid를 감싸는 Transform Wrapper
 * 선택된 아이템을 화면 중앙으로 확대/축소하는 역할
 *
 * Props:
 * @param {ReactNode} children - DynamicGrid 컴포넌트 [Required]
 * @param {Object|null} selectedProduct - 선택된 제품 (element 포함) [Optional]
 * @param {function} onZoomChange - 줌 상태 변경 콜백 [Optional]
 *
 * Example usage:
 * <GridContainer selectedProduct={selected} onZoomChange={handleZoomChange}>
 *   <DynamicGrid ... />
 * </GridContainer>
 */
function GridContainer({ children, selectedProduct, onZoomChange }) {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [transform, setTransform] = useState(getInitialTransform());
  const [transformOrigin, setTransformOrigin] = useState('center center');

  // === 선택된 아이템 변경 시 transform 계산 ===
  useEffect(() => {
    if (selectedProduct?.element) {
      // RAF 제거 - useEffect는 이미 Paint 후 실행되므로 불필요
      const calculated = calculateTransform(selectedProduct.element, containerRef);

      setTransform({
        x: calculated.x,
        y: calculated.y,
        scale: calculated.scale,
      });
      // transformOrigin 업데이트 (클릭된 아이템 위치)
      setTransformOrigin(calculated.transformOrigin);
      onZoomChange?.(true);
    } else {
      // 줌아웃 - 초기 상태로 복귀
      setTransform(getInitialTransform());
      // transformOrigin은 유지! (변경하지 않음)
      // 이렇게 하면 줌아웃 시 origin이 바뀌지 않아 튐 현상 없음
      onZoomChange?.(false);
    }
  }, [selectedProduct, onZoomChange]);

  // === Window resize 시 transform 재계산 ===
  useEffect(() => {
    if (!selectedProduct?.element) return;

    let timeoutId;
    const handleResize = () => {
      // Debounce: 상수로 정의된 시간 후에 재계산
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const recalculated = calculateTransform(selectedProduct.element, containerRef);
        setTransform({
          x: recalculated.x,
          y: recalculated.y,
          scale: recalculated.scale,
        });
        setTransformOrigin(recalculated.transformOrigin);
      }, DURATION.RESIZE_DEBOUNCE);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [selectedProduct]);

  return (
    <Motion.div
      ref={containerRef}
      style={{
        // transformOrigin을 동적으로 설정 (클릭된 아이템 위치)
        // 줌아웃 시에도 origin 유지하여 튐 방지
        transformOrigin: transformOrigin,
        width: '100%',
        willChange: selectedProduct ? 'transform' : 'auto', // GPU 가속 힌트
      }}
      animate={{
        x: transform.x,
        y: transform.y,
        scale: transform.scale,
      }}
      transition={shouldReduceMotion ? REDUCED_MOTION : TRANSITION.GRID_ZOOM}
    >
      {children}
    </Motion.div>
  );
}

export default GridContainer;
