/**
 * 반응형 브레이크포인트 설정
 *
 * 각 해상도별로 최적화된 그리드 레이아웃을 정의합니다.
 * - columns: Zoom level별 컬럼 수 (zoom0: 기본, zoom1: 중간 확대, zoom2: 최대 확대)
 * - gap: 그리드 아이템 간격 (px)
 * - containerPadding: 메인 컨테이너 패딩 (CSS 문법)
 * - headerPadding: 헤더 패딩 (CSS 문법)
 * - headerButtonSize: 헤더 버튼 크기 (px)
 * - detailView*: ProductDetailView 관련 설정
 * - enableZoom: Zoom 기능 활성화 여부
 */

export const RESPONSIVE_BREAKPOINTS = {
  mobile: {
    minWidth: 0,
    maxWidth: 639,
    label: 'Mobile',
    columns: {
      zoom0: 2,
      zoom1: 2,
      zoom2: 1,
    },
    gap: 16,
    containerPadding: '70px 16px 0 16px',
    headerPadding: '12px 12px',
    headerButtonSize: 36,
    detailViewWidth: '90vw',
    detailViewHeight: '60vh',
    detailArrowSize: 32,
    detailArrowPosition: 10,
    detailIndicatorSize: 6,
    enableZoom: false, // Mobile에서는 Zoom 비활성화
  },

  tabletPortrait: {
    minWidth: 640,
    maxWidth: 767,
    label: 'Tablet Portrait',
    columns: {
      zoom0: 3,
      zoom1: 2,
      zoom2: 1,
    },
    gap: 20,
    containerPadding: '70px 20px 0 20px',
    headerPadding: '14px 16px',
    headerButtonSize: 38,
    detailViewWidth: '85vw',
    detailViewHeight: '65vh',
    detailArrowSize: 36,
    detailArrowPosition: 12,
    detailIndicatorSize: 7,
    enableZoom: true,
  },

  tabletLandscape: {
    minWidth: 768,
    maxWidth: 1023,
    label: 'Tablet Landscape',
    columns: {
      zoom0: 4,
      zoom1: 3,
      zoom2: 2,
    },
    gap: 24,
    containerPadding: '80px 24px 0 24px',
    headerPadding: '16px 20px',
    headerButtonSize: 40,
    detailViewWidth: '80vw',
    detailViewHeight: '65vh',
    detailArrowSize: 38,
    detailArrowPosition: 16,
    detailIndicatorSize: 7,
    enableZoom: true,
  },

  smallDesktop: {
    minWidth: 1024,
    maxWidth: 1439,
    label: 'Small Desktop',
    columns: {
      zoom0: 5,
      zoom1: 4,
      zoom2: 3,
    },
    gap: 32,
    containerPadding: '80px 32px 0 32px',
    headerPadding: '16px 24px',
    headerButtonSize: 40,
    detailViewWidth: '75vw',
    detailViewHeight: '70vh',
    detailArrowSize: 40,
    detailArrowPosition: 18,
    detailIndicatorSize: 8,
    enableZoom: true,
  },

  desktop: {
    minWidth: 1440,
    maxWidth: 1919,
    label: 'Desktop',
    columns: {
      zoom0: 7,
      zoom1: 5,
      zoom2: 4,
    },
    gap: 40,
    containerPadding: '100px 48px 0 48px',
    headerPadding: '18px 32px',
    headerButtonSize: 42,
    detailViewWidth: '72vw',
    detailViewHeight: '70vh',
    detailArrowSize: 40,
    detailArrowPosition: 20,
    detailIndicatorSize: 8,
    enableZoom: true,
  },

  fullHD: {
    minWidth: 1920,
    maxWidth: 2559,
    label: 'Full HD',
    columns: {
      zoom0: 9,
      zoom1: 6,
      zoom2: 4,
    },
    gap: 48,
    containerPadding: '120px 64px 0 64px',
    headerPadding: '20px 40px',
    headerButtonSize: 44,
    detailViewWidth: '70vw',
    detailViewHeight: '70vh',
    detailArrowSize: 40,
    detailArrowPosition: 20,
    detailIndicatorSize: 8,
    enableZoom: true,
  },

  qhd: {
    minWidth: 2560,
    maxWidth: 3839,
    label: 'QHD',
    columns: {
      zoom0: 10,
      zoom1: 7,
      zoom2: 5,
    },
    gap: 56,
    containerPadding: '120px 72px 0 72px',
    headerPadding: '22px 50px',
    headerButtonSize: 46,
    detailViewWidth: '68vw',
    detailViewHeight: '72vh',
    detailArrowSize: 44,
    detailArrowPosition: 24,
    detailIndicatorSize: 9,
    enableZoom: true,
  },

  ultraWide: {
    minWidth: 3840,
    maxWidth: Infinity,
    label: '4K+',
    columns: {
      zoom0: 12,
      zoom1: 8,
      zoom2: 6,
    },
    gap: 64,
    containerPadding: '120px 80px 0 80px',
    headerPadding: '24px 60px',
    headerButtonSize: 48,
    detailViewWidth: '65vw',
    detailViewHeight: '75vh',
    detailArrowSize: 48,
    detailArrowPosition: 28,
    detailIndicatorSize: 10,
    enableZoom: true,
  },
};

/**
 * 브레이크포인트 키 배열 (minWidth 순서로 정렬)
 * getBreakpoint 함수에서 순회하기 위해 사용
 */
export const BREAKPOINT_ORDER = [
  'mobile',
  'tabletPortrait',
  'tabletLandscape',
  'smallDesktop',
  'desktop',
  'fullHD',
  'qhd',
  'ultraWide',
];

/**
 * 현재 viewport width에 맞는 breakpoint 키를 반환
 *
 * @param {number} width - 현재 viewport width (px)
 * @returns {string} breakpoint key ('mobile', 'fullHD', etc.)
 *
 * @example
 * const breakpoint = getBreakpoint(1920); // 'fullHD'
 * const breakpoint = getBreakpoint(375);  // 'mobile'
 */
export const getBreakpoint = (width) => {
  for (const key of BREAKPOINT_ORDER) {
    const bp = RESPONSIVE_BREAKPOINTS[key];
    if (width >= bp.minWidth && width <= bp.maxWidth) {
      return key;
    }
  }
  // Fallback: Full HD
  return 'fullHD';
};

/**
 * 특정 breakpoint와 zoom level에 맞는 컬럼 수를 반환
 *
 * @param {string} breakpoint - 브레이크포인트 키
 * @param {number} zoomLevel - Zoom level (0, 1, 2)
 * @returns {number} 컬럼 수
 *
 * @example
 * const columns = getColumnsForZoom('fullHD', 0); // 9
 * const columns = getColumnsForZoom('fullHD', 1); // 6
 * const columns = getColumnsForZoom('mobile', 2); // 1
 */
export const getColumnsForZoom = (breakpoint, zoomLevel) => {
  const bp = RESPONSIVE_BREAKPOINTS[breakpoint];
  if (!bp) {
    console.warn(`Unknown breakpoint: ${breakpoint}, falling back to fullHD`);
    return RESPONSIVE_BREAKPOINTS.fullHD.columns[`zoom${zoomLevel}`] || 9;
  }

  const zoomKey = `zoom${zoomLevel}`;
  return bp.columns[zoomKey] || bp.columns.zoom0;
};

/**
 * 디버그용: 현재 설정 정보 출력
 *
 * @param {string} breakpoint - 브레이크포인트 키
 * @param {number} zoomLevel - Zoom level
 */
export const logBreakpointInfo = (breakpoint, zoomLevel) => {
  const config = RESPONSIVE_BREAKPOINTS[breakpoint];
  const columns = getColumnsForZoom(breakpoint, zoomLevel);

  console.log('📱 Responsive Config:', {
    breakpoint: config.label,
    zoomLevel,
    columns,
    gap: config.gap,
    containerPadding: config.containerPadding,
    enableZoom: config.enableZoom,
  });
};
