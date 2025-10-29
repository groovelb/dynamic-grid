import { useEffect, useState } from 'react';

/**
 * DebugCenterLines 컴포넌트
 *
 * 디버깅용 wrapper content area 중앙선 표시
 * 줌인 모드에서 아이템이 정확히 중앙에 정렬되는지 확인
 *
 * Props:
 * @param {RefObject} wrapperRef - Wrapper(main) ref
 */
function DebugCenterLines({ wrapperRef }) {
  const [center, setCenter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const calculateCenter = () => {
      if (!wrapperRef?.current) return;

      const wrapperRect = wrapperRef.current.getBoundingClientRect();

      // wrapper padding 고려 (transformCalculator와 동일)
      const WRAPPER_PADDING = 40;
      const contentWidth = wrapperRect.width - WRAPPER_PADDING * 2;
      const contentHeight = wrapperRect.height - WRAPPER_PADDING * 2;

      const targetCenterX = wrapperRect.left + WRAPPER_PADDING + contentWidth / 2;
      const targetCenterY = wrapperRect.top + WRAPPER_PADDING + contentHeight / 2;

      setCenter({ x: targetCenterX, y: targetCenterY });
    };

    // 초기 계산
    calculateCenter();

    // Resize 시 재계산
    window.addEventListener('resize', calculateCenter);

    // Wrapper 로드 대기
    const timer = setTimeout(calculateCenter, 100);

    return () => {
      window.removeEventListener('resize', calculateCenter);
      clearTimeout(timer);
    };
  }, [wrapperRef]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none', // 클릭 이벤트 통과
        zIndex: 9999,
      }}
    >
      {/* 세로 중앙선 (wrapper content area) */}
      <div
        style={{
          position: 'absolute',
          left: `${center.x}px`,
          top: 0,
          width: '2px',
          height: '100%',
          backgroundColor: 'red',
        }}
      />

      {/* 가로 중앙선 (wrapper content area) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: `${center.y}px`,
          width: '100%',
          height: '2px',
          backgroundColor: 'red',
        }}
      />

      {/* 중심점 표시 */}
      <div
        style={{
          position: 'absolute',
          left: `${center.x}px`,
          top: `${center.y}px`,
          width: '20px',
          height: '20px',
          border: '3px solid red',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
        }}
      />

      {/* 라벨 */}
      <div
        style={{
          position: 'absolute',
          left: `${center.x}px`,
          top: `${center.y + 30}px`,
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        TARGET: ({center.x.toFixed(1)}, {center.y.toFixed(1)})
      </div>
    </div>
  );
}

export default DebugCenterLines;
