/**
 * 그리드 레이아웃 계산 유틸리티
 *
 * 순수 함수로 구성되어 DOM 측정 없이 그리드 아이템의 위치를 계산합니다.
 * 모든 함수는 사이드 이펙트가 없으며 테스트 가능합니다.
 */

/**
 * 그리드 레이아웃 기본 정보 계산
 *
 * @param {number} columns - 그리드 컬럼 수
 * @param {number} containerWidth - 컨테이너 전체 너비 (px)
 * @param {number} gap - 아이템 간 간격 (px, 기본값 0)
 * @returns {Object} 레이아웃 정보 { columns, itemWidth, itemHeight, gap }
 */
export function calculateGridLayout(columns, containerWidth, gap = 0) {
  // 아이템 너비 계산: (전체 너비 - 간격 총합) / 컬럼 수
  const totalGap = gap * (columns - 1);
  const itemWidth = (containerWidth - totalGap) / columns;

  // aspect ratio 1:1 유지
  const itemHeight = itemWidth;

  return {
    columns,
    itemWidth,
    itemHeight,
    gap,
  };
}

/**
 * 특정 아이템의 위치 계산
 *
 * @param {string|number} itemId - 아이템 ID (1부터 시작)
 * @param {Object} layout - calculateGridLayout의 반환값
 * @returns {Object} 아이템 위치 정보 { left, top, width, height, centerX, centerY }
 */
export function calculateItemPosition(itemId, layout) {
  // ID를 0-based index로 변환
  const itemIndex = parseInt(itemId) - 1;

  if (itemIndex < 0) {
    throw new Error(`Invalid itemId: ${itemId}. ID must be >= 1`);
  }

  // 그리드 좌표 계산
  const column = itemIndex % layout.columns;
  const row = Math.floor(itemIndex / layout.columns);

  // 픽셀 위치 계산 (container 좌상단 기준)
  const left = column * (layout.itemWidth + layout.gap);
  const top = row * (layout.itemHeight + layout.gap);

  // 중심점 계산
  const centerX = left + layout.itemWidth / 2;
  const centerY = top + layout.itemHeight / 2;

  return {
    left,
    top,
    width: layout.itemWidth,
    height: layout.itemHeight,
    centerX,
    centerY,
    // 추가 정보 (디버깅용)
    column,
    row,
    index: itemIndex,
  };
}

/**
 * 특정 위치(픽셀)에 있는 아이템 ID 계산 (역계산)
 *
 * @param {number} x - X 좌표 (container 기준)
 * @param {number} y - Y 좌표 (container 기준)
 * @param {Object} layout - calculateGridLayout의 반환값
 * @returns {number|null} 아이템 ID (1부터 시작), 범위 밖이면 null
 */
export function getItemIdAtPosition(x, y, layout) {
  const column = Math.floor(x / (layout.itemWidth + layout.gap));
  const row = Math.floor(y / (layout.itemHeight + layout.gap));

  // 범위 체크
  if (column < 0 || column >= layout.columns) {
    return null;
  }

  const itemIndex = row * layout.columns + column;
  return itemIndex + 1; // 1-based ID
}

/**
 * 그리드 전체 높이 계산
 *
 * @param {number} totalItems - 총 아이템 개수
 * @param {Object} layout - calculateGridLayout의 반환값
 * @returns {number} 그리드 전체 높이 (px)
 */
export function calculateGridHeight(totalItems, layout) {
  const totalRows = Math.ceil(totalItems / layout.columns);
  const totalGap = layout.gap * (totalRows - 1);
  return totalRows * layout.itemHeight + totalGap;
}
