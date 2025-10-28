import { useEffect, useState } from 'react';

/**
 * DebugCenterLines 컴포넌트
 *
 * 디버깅용 화면 중앙선 표시
 * 줌인 모드에서 아이템이 정확히 중앙에 정렬되는지 확인
 */
function DebugCenterLines() {
  const [centerY, setCenterY] = useState(0);

  useEffect(() => {
    const calculateCenter = () => {
      // transformCalculator와 동일한 방식으로 계산
      const headerElement = document.querySelector('header');
      const headerRect = headerElement?.getBoundingClientRect();
      const headerHeight = headerRect?.height || 0;

      const availableHeight = window.innerHeight - headerHeight;
      const targetY = availableHeight / 2 + headerHeight;

      setCenterY(targetY);
    };

    // 초기 계산
    calculateCenter();

    // Resize 시 재계산
    window.addEventListener('resize', calculateCenter);

    // Header 로드 대기 (DOM 완성 후)
    const timer = setTimeout(calculateCenter, 100);

    return () => {
      window.removeEventListener('resize', calculateCenter);
      clearTimeout(timer);
    };
  }, []);

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
      {/* 세로 중앙선 */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: '2px',
          height: '100%',
          backgroundColor: 'red',
          transform: 'translateX(-50%)',
        }}
      />

      {/* 가로 중앙선 (Header 제외, 동적 계산) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: `${centerY}px`,
          width: '100%',
          height: '2px',
          backgroundColor: 'red',
        }}
      />

      {/* 중심점 표시 */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: `${centerY}px`,
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
          left: '50%',
          top: `${centerY + 30}px`,
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        CENTER Y: {centerY.toFixed(1)}px
      </div>

      {/* 그리드 라인들 (선택적) */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`v-${i}`}
          style={{
            position: 'absolute',
            left: `${(i + 1) * 10}%`,
            top: 0,
            width: '1px',
            height: '100%',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
          }}
        />
      ))}

      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`h-${i}`}
          style={{
            position: 'absolute',
            left: 0,
            top: `${(i + 1) * 10}%`,
            width: '100%',
            height: '1px',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
          }}
        />
      ))}
    </div>
  );
}

export default DebugCenterLines;
