/**
 * 클릭된 그리드 아이템을 화면 중앙으로 이동시키기 위한 transform 값 계산
 * transformOrigin은 'center center'로 고정하고, scale로 인한 위치 변화를 translate로 보정
 *
 * @param {HTMLElement} clickedElement - 클릭된 ProductCard의 DOM 요소
 * @param {Object} containerRef - GridContainer의 ref
 * @returns {Object} { x, y, scale }
 */
export function calculateTransform(clickedElement, containerRef) {
  // === Phase 1: 좌표 수집 ===
  const itemRect = clickedElement.getBoundingClientRect();
  const containerRect = containerRef?.current?.getBoundingClientRect();
  const headerElement = document.querySelector('header');
  const headerRect = headerElement?.getBoundingClientRect();

  if (!containerRect) {
    // containerRef가 없으면 기본값 반환
    return { x: 0, y: 0, scale: 1 };
  }

  // === Phase 2: 현재 아이템의 중심점 (뷰포트 좌표계) ===
  const itemCenterX = itemRect.left + itemRect.width / 2;
  const itemCenterY = itemRect.top + itemRect.height / 2;

  // === Phase 3: Container의 중심점 ===
  const containerCenterX = containerRect.left + containerRect.width / 2;
  const containerCenterY = containerRect.top + containerRect.height / 2;

  // === Phase 4: 목표 위치 (Header 제외한 뷰포트 중앙) ===
  const headerHeight = headerRect?.height || 0;
  const availableHeight = window.innerHeight - headerHeight;

  const targetX = window.innerWidth / 2;
  const targetY = availableHeight / 2 + headerHeight;

  // === Phase 5: 기본 이동 거리 (scale 없이) ===
  const baseTranslateX = targetX - itemCenterX;
  const baseTranslateY = targetY - itemCenterY;

  // === Phase 6: 확대 비율 계산 (뷰포트의 70% 차지) ===
  const targetWidth = window.innerWidth * 0.7;
  const targetHeight = availableHeight * 0.7;

  const scaleByWidth = targetWidth / itemRect.width;
  const scaleByHeight = targetHeight / itemRect.height;
  const scale = Math.min(scaleByWidth, scaleByHeight); // aspect ratio 유지

  // === Phase 7: Scale Offset 보정 ===
  // transformOrigin이 'center center'일 때,
  // scale 적용 시 아이템이 Container 중심 기준으로 확대됨
  // 아이템의 실제 위치 변화를 계산하여 translate로 보정

  // Container 중심에서 아이템까지의 거리
  const itemOffsetX = itemCenterX - containerCenterX;
  const itemOffsetY = itemCenterY - containerCenterY;

  // scale 적용 시 아이템이 이동하는 거리
  // (scale - 1)을 곱하면 확대로 인한 추가 이동 거리
  const scaleOffsetX = itemOffsetX * (scale - 1);
  const scaleOffsetY = itemOffsetY * (scale - 1);

  // === Phase 8: 최종 translate 계산 (offset 보정 포함) ===
  // 기본 이동 거리에서 scale offset을 빼서 정확한 위치로 이동
  const translateX = baseTranslateX - scaleOffsetX;
  const translateY = baseTranslateY - scaleOffsetY;

  return {
    x: translateX,
    y: translateY,
    scale: scale,
  };
}

/**
 * 줌아웃 시 사용하는 초기 transform 값
 */
export function getInitialTransform() {
  return {
    x: 0,
    y: 0,
    scale: 1,
  };
}
