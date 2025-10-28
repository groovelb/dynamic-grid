/**
 * 애니메이션 관련 상수
 * 프로젝트 전체에서 일관된 애니메이션 타이밍을 유지하기 위한 설정
 */

// === Duration (지속 시간) ===
export const DURATION = {
  // Grid Container Transform
  ZOOM_IN: 0.6,
  ZOOM_OUT: 0.6,

  // ProductCard Layout Animation
  LAYOUT: 0.4,
  OPACITY: 0.3,
  SCALE: 0.3,

  // Resize debounce
  RESIZE_DEBOUNCE: 100, // milliseconds
};

// === Easing Functions ===
export const EASING = {
  // Material Design Standard Easing
  MATERIAL: [0.4, 0, 0.2, 1], // cubic-bezier

  // ProductCard Easing
  EASE_IN_OUT: 'easeInOut',
};

// === Transition Presets ===
export const TRANSITION = {
  // GridContainer Zoom
  GRID_ZOOM: {
    duration: DURATION.ZOOM_IN,
    ease: EASING.MATERIAL,
  },

  // ProductCard Layout
  PRODUCT_CARD_LAYOUT: {
    layout: {
      duration: DURATION.LAYOUT,
      ease: EASING.EASE_IN_OUT,
    },
    opacity: {
      duration: DURATION.OPACITY,
    },
    scale: {
      duration: DURATION.SCALE,
    },
  },
};

// === Initial/Exit States ===
export const ANIMATION_STATES = {
  INITIAL: {
    opacity: 0,
    scale: 0.9,
  },
  ANIMATE: {
    opacity: 1,
    scale: 1,
  },
  EXIT: {
    opacity: 0,
    scale: 0.9,
  },
};

// === Reduced Motion ===
export const REDUCED_MOTION = {
  duration: 0,
};
