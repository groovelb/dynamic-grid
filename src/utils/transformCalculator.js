/**
 * Transform 계산 유틸리티 (완전 재설계)
 *
 * 문제 해결:
 * 1. DOM 측정 최소화 (container, wrapper만)
 * 2. 수학적 계산으로 아이템 위치 도출
 * 3. 동적 transformOrigin으로 복잡한 offset 보정 제거
 * 4. wrapper 기준 좌표로 Header 계산 불필요
 * 5. 순수 함수로 테스트 가능
 */

import { calculateGridLayout, calculateItemPosition } from './gridLayout';

/**
 * Transform 계산 (수학적 계산 기반)
 *
 * @param {string|number} itemId - 선택된 아이템 ID
 * @param {number} columns - 그리드 컬럼 수
 * @param {RefObject} containerRef - GridContainer의 ref
 * @param {RefObject} wrapperRef - Wrapper(main)의 ref
 * @param {Array} filteredProducts - 현재 필터링된 제품 배열
 * @returns {Object} { x, y, scale, transformOrigin }
 */
export function calculateTransform(itemId, columns, containerRef, wrapperRef, filteredProducts) {
  // === 0. 유효성 검사 ===
  if (!itemId || !containerRef?.current || !wrapperRef?.current || !filteredProducts) {
    return getInitialTransform();
  }

  // === 1. DOM 측정 (최소한만) ===
  const containerRect = containerRef.current.getBoundingClientRect();
  const wrapperRect = wrapperRef.current.getBoundingClientRect();

  // === 2. 그리드 레이아웃 계산 (순수 함수) ===
  const layout = calculateGridLayout(columns, containerRect.width, 0);

  // === 3. 필터링된 배열에서 실제 인덱스 찾기 ===
  const actualIndex = filteredProducts.findIndex(p => p.id === itemId);
  if (actualIndex === -1) {
    console.warn(`⚠️  Product ${itemId} not found in filteredProducts`);
    return getInitialTransform();
  }

  // === 4. 아이템 위치 계산 (실제 인덱스 사용) ===
  // calculateItemPosition은 1-based ID를 기대하므로 +1
  const itemPos = calculateItemPosition(actualIndex + 1, layout);

  // === 5. 아이템 중심 (viewport 좌표) ===
  const itemCenterX = containerRect.left + itemPos.centerX;
  const itemCenterY = containerRect.top + itemPos.centerY;

  // === 6. 목표 중심 (wrapper content area 중앙) ===
  // wrapper에 padding: 40px이 있으므로 content area 기준으로 계산
  const WRAPPER_PADDING = 40; // App.jsx의 wrapper padding
  const contentWidth = wrapperRect.width - WRAPPER_PADDING * 2;
  const contentHeight = wrapperRect.height - WRAPPER_PADDING * 2;
  const targetCenterX = wrapperRect.left + WRAPPER_PADDING + contentWidth / 2;
  const targetCenterY = wrapperRect.top + WRAPPER_PADDING + contentHeight / 2;

  // === 7. Scale 계산 (content area 기준) ===
  const targetWidth = contentWidth * 0.7;
  const targetHeight = contentHeight * 0.7;
  const scaleByWidth = targetWidth / itemPos.width;
  const scaleByHeight = targetHeight / itemPos.height;
  const scaleRaw = Math.min(scaleByWidth, scaleByHeight);

  // Scale을 정수로 고정 (서브픽셀 렌더링 오차 제거)
  const scale = Math.floor(scaleRaw);

  // === 8. 동적 transformOrigin (container 기준) ===
  // 아이템의 중심을 origin으로 설정
  const originX = itemPos.centerX;
  const originY = itemPos.centerY;

  // === 9. 단순 translate (viewport 기준) ===
  // transformOrigin이 아이템 중심이므로, 목표까지의 직선 거리만 계산
  const translateX = targetCenterX - itemCenterX;
  const translateY = targetCenterY - itemCenterY;

  // === 디버그 로그 ===
  console.group('🎯 Transform Calculation (Pure Math)');
  console.log('🔍 Product ID:', itemId, '→ Filtered Array Index:', actualIndex);
  console.log('📐 Grid Layout:', layout);
  console.log('📍 Item Position (container relative):', {
    left: itemPos.left.toFixed(2),
    top: itemPos.top.toFixed(2),
    centerX: itemPos.centerX.toFixed(2),
    centerY: itemPos.centerY.toFixed(2),
    column: itemPos.column,
    row: itemPos.row,
  });
  console.log('🎯 Item Center (viewport):', itemCenterX.toFixed(2), itemCenterY.toFixed(2));
  console.log('🎯 Target Center (wrapper):', targetCenterX.toFixed(2), targetCenterY.toFixed(2));
  console.log('📏 Scale:', scale.toFixed(3));
  console.log('🔄 Transform Origin:', `${originX.toFixed(2)}px ${originY.toFixed(2)}px`);
  console.log('➡️  Translate:', translateX.toFixed(2), translateY.toFixed(2));

  // === 검증 ===
  const finalX = itemCenterX + translateX;
  const finalY = itemCenterY + translateY;
  const errorX = Math.abs(finalX - targetCenterX);
  const errorY = Math.abs(finalY - targetCenterY);
  console.log('✅ Final Center:', finalX.toFixed(2), finalY.toFixed(2));
  console.log('✅ Error:', errorX.toFixed(3), errorY.toFixed(3), 'px');

  if (errorX > 1 || errorY > 1) {
    console.warn('⚠️  Error exceeds 1px threshold!');
  }
  console.groupEnd();

  return {
    x: translateX,
    y: translateY,
    scale,
    transformOrigin: `${originX}px ${originY}px`,
  };
}

/**
 * 줌아웃 시 사용하는 초기 transform 값
 *
 * @returns {Object} { x: 0, y: 0, scale: 1, transformOrigin: '50% 50%' }
 */
export function getInitialTransform() {
  return {
    x: 0,
    y: 0,
    scale: 1,
    transformOrigin: '50% 50%',
  };
}
