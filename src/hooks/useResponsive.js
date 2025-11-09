import { useState, useEffect } from 'react';
import { RESPONSIVE_BREAKPOINTS, getBreakpoint, getColumnsForZoom } from '../constants/responsive';

/**
 * Debounce 유틸리티 함수
 * 연속된 이벤트를 지연시켜 마지막 호출만 실행
 *
 * @param {Function} fn - 실행할 함수
 * @param {number} delay - 지연 시간 (ms)
 * @returns {Function} debounced 함수
 */
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * 반응형 브레이크포인트 Hook
 *
 * Window resize 이벤트를 감지하여 현재 브레이크포인트와 설정을 반환합니다.
 * - Debounce 적용 (150ms)
 * - SSR 안전 (window 체크)
 * - 성능 최적화 (필요할 때만 리렌더)
 *
 * @returns {Object} Responsive state
 * @returns {number} state.width - 현재 viewport 너비
 * @returns {string} state.breakpoint - 현재 브레이크포인트 키
 * @returns {Object} state.config - 현재 브레이크포인트 설정
 *
 * @example
 * const { width, breakpoint, config } = useResponsive();
 * console.log(config.gap); // 48 (Full HD 기준)
 * console.log(config.columns.zoom0); // 9
 */
export const useResponsive = () => {
  const [state, setState] = useState(() => {
    // SSR 안전: window가 없으면 Full HD 기본값 사용
    if (typeof window === 'undefined') {
      return {
        width: 1920,
        breakpoint: 'fullHD',
        config: RESPONSIVE_BREAKPOINTS.fullHD,
      };
    }

    const width = window.innerWidth;
    const breakpoint = getBreakpoint(width);
    return {
      width,
      breakpoint,
      config: RESPONSIVE_BREAKPOINTS[breakpoint],
    };
  });

  useEffect(() => {
    // SSR 체크
    if (typeof window === 'undefined') return;

    const handleResize = debounce(() => {
      const width = window.innerWidth;
      const breakpoint = getBreakpoint(width);
      const config = RESPONSIVE_BREAKPOINTS[breakpoint];

      // 브레이크포인트가 실제로 변경되었을 때만 업데이트
      setState((prev) => {
        if (prev.breakpoint === breakpoint) {
          // 브레이크포인트는 같지만 width는 업데이트
          return { ...prev, width };
        }
        // 브레이크포인트 변경됨
        console.log('📱 Breakpoint changed:', {
          from: prev.breakpoint,
          to: breakpoint,
          width,
          label: config.label,
        });
        return { width, breakpoint, config };
      });
    }, 150); // 150ms debounce

    window.addEventListener('resize', handleResize);

    // Initial call (마운트 시 정확한 크기 반영)
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return state;
};

/**
 * Zoom level을 고려한 반응형 컬럼 Hook
 *
 * useResponsive에 zoom level 계산을 추가한 버전
 *
 * @param {number} zoomLevel - 현재 Zoom level (0, 1, 2)
 * @returns {Object} Responsive state with columns
 * @returns {number} state.columns - 현재 zoom level에 맞는 컬럼 수
 * @returns {number} state.gap - 그리드 간격 (px)
 * @returns {string} state.breakpoint - 브레이크포인트 키
 * @returns {Object} state.config - 전체 설정 객체
 *
 * @example
 * const { columns, gap, config } = useResponsiveColumns(zoomLevel);
 * <DynamicGrid columns={columns} gap={gap} />
 */
export const useResponsiveColumns = (zoomLevel = 0) => {
  const { width, breakpoint, config } = useResponsive();

  const columns = getColumnsForZoom(breakpoint, zoomLevel);

  return {
    width,
    columns,
    gap: config.gap,
    breakpoint,
    config,
  };
};

/**
 * 디버그용: 현재 반응형 상태를 콘솔에 출력
 *
 * @param {string} breakpoint - 브레이크포인트 키
 * @param {Object} config - 설정 객체
 * @param {number} zoomLevel - Zoom level (선택)
 */
export const logResponsiveState = (breakpoint, config, zoomLevel = 0) => {
  const columns = getColumnsForZoom(breakpoint, zoomLevel);

  console.log('🔍 Current Responsive State:', {
    breakpoint: config.label,
    zoomLevel,
    columns,
    gap: config.gap,
    containerPadding: config.containerPadding,
    headerPadding: config.headerPadding,
    enableZoom: config.enableZoom,
  });
};

export default useResponsive;
