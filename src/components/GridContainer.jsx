import { useRef, useEffect, useState } from 'react';
import { calculateTransform, getInitialTransform } from '../utils/transformCalculator';
import DebugPanel from './DebugPanel';

/**
 * GridContainer 컴포넌트 (완전 재설계)
 *
 * 변경사항:
 * - Framer Motion 제거 → 순수 CSS transition
 * - DOM 측정 최소화 → 수학적 계산
 * - 동적 transformOrigin
 * - wrapper 기준 좌표
 *
 * Props:
 * @param {ReactNode} children - DynamicGrid 컴포넌트 [Required]
 * @param {string|null} selectedProductId - 선택된 제품 ID [Optional]
 * @param {number} columns - 그리드 컬럼 수 [Required]
 * @param {RefObject} wrapperRef - Wrapper(main) ref [Required]
 * @param {function} onZoomChange - 줌 상태 변경 콜백 [Optional]
 *
 * Example usage:
 * <GridContainer
 *   selectedProductId="1"
 *   columns={8}
 *   wrapperRef={wrapperRef}
 *   onZoomChange={handleZoomChange}
 * >
 *   <DynamicGrid ... />
 * </GridContainer>
 */
function GridContainer({ children, selectedProductId, columns, wrapperRef, onZoomChange }) {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState(getInitialTransform());
  const prevTransformRef = useRef(getInitialTransform()); // 이전 transform 저장

  // === 선택된 아이템 변경 시 transform 계산 ===
  useEffect(() => {
    if (selectedProductId) {
      const calculated = calculateTransform(
        selectedProductId,
        columns,
        containerRef,
        wrapperRef
      );
      setTransform(calculated);
      prevTransformRef.current = calculated; // 저장
      onZoomChange?.(true);
    } else {
      // 줌아웃 - 이전 origin 유지하면서 위치만 초기화
      setTransform({
        x: 0,
        y: 0,
        scale: 1,
        transformOrigin: prevTransformRef.current.transformOrigin, // 이전 origin 유지!
      });
      onZoomChange?.(false);

      // 애니메이션 완료 후 origin을 center로 변경
      setTimeout(() => {
        if (!selectedProductId) { // 여전히 줌아웃 상태라면
          setTransform(getInitialTransform());
        }
      }, 200); // transition duration과 동일
    }
  }, [selectedProductId, columns, wrapperRef, onZoomChange]);

  // === Window resize 시 transform 재계산 ===
  useEffect(() => {
    if (!selectedProductId) return;

    let timeoutId;
    const handleResize = () => {
      // Debounce: 100ms 후에 재계산
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const recalculated = calculateTransform(
          selectedProductId,
          columns,
          containerRef,
          wrapperRef
        );
        setTransform(recalculated);
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [selectedProductId, columns, wrapperRef]);

  return (
    <>
      <DebugPanel transform={transform} columns={columns} containerRef={containerRef} />
      <div
        ref={containerRef}
        style={{
          width: '100%',
          // CSS transform 직접 제어
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: transform.transformOrigin,
          // 순수 CSS transition
          transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          // GPU 가속 힌트
          willChange: selectedProductId ? 'transform' : 'auto',
        }}
      >
        {children}
      </div>
    </>
  );
}

export default GridContainer;
