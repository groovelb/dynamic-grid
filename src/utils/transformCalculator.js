/**
 * 클릭된 그리드 아이템을 화면 중앙으로 이동시키기 위한 transform 값 계산
 *
 * @param {HTMLElement} clickedElement - 클릭된 ProductCard의 DOM 요소
 * @param {Object} containerRef - GridContainer의 ref (transformOrigin 계산용)
 * @returns {Object} { x, y, scale, transformOrigin }
 */
export function calculateTransform(clickedElement, containerRef) {
  // === Phase 1: 좌표 수집 ===
  const itemRect = clickedElement.getBoundingClientRect();
  const headerElement = document.querySelector('header');
  const headerRect = headerElement?.getBoundingClientRect();

  // === Phase 2: 현재 아이템의 중심점 (뷰포트 좌표계) ===
  const itemCenterX = itemRect.left + itemRect.width / 2;
  const itemCenterY = itemRect.top + itemRect.height / 2;

  // === Phase 3: 목표 위치 (Header 제외한 뷰포트 중앙) ===
  const headerHeight = headerRect?.height || 0;
  const availableHeight = window.innerHeight - headerHeight;

  const targetX = window.innerWidth / 2;
  const targetY = availableHeight / 2 + headerHeight;

  // === Phase 4: 이동 거리 계산 ===
  const translateX = targetX - itemCenterX;
  const translateY = targetY - itemCenterY;

  // === Phase 5: 확대 비율 계산 (뷰포트의 70% 차지) ===
  const targetWidth = window.innerWidth * 0.7;
  const targetHeight = availableHeight * 0.7;

  const scaleByWidth = targetWidth / itemRect.width;
  const scaleByHeight = targetHeight / itemRect.height;
  const scale = Math.min(scaleByWidth, scaleByHeight); // aspect ratio 유지

  // === Phase 6: Transform Origin 계산 ===
  // 클릭된 아이템을 기준으로 확대하기 위해 origin 설정
  let transformOrigin = 'center center';

  if (containerRef?.current) {
    const containerRect = containerRef.current.getBoundingClientRect();

    // Container 내에서 아이템의 상대 위치 계산
    const itemRelativeX = itemRect.left - containerRect.left + itemRect.width / 2;
    const itemRelativeY = itemRect.top - containerRect.top + itemRect.height / 2;

    // 백분율로 변환 (Container 기준)
    const originX = (itemRelativeX / containerRect.width) * 100;
    const originY = (itemRelativeY / containerRect.height) * 100;

    transformOrigin = `${originX}% ${originY}%`;
  }

  return {
    x: translateX,
    y: translateY,
    scale: scale,
    transformOrigin: transformOrigin,
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
