import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';

/**
 * 디버그 패널 - 실시간 transform 및 그리드 정보 표시
 *
 * Props:
 * @param {Object} transform - 현재 transform 값 { x, y, scale, transformOrigin }
 * @param {number} columns - 그리드 컬럼 수
 * @param {RefObject} containerRef - GridContainer ref
 */
function DebugPanel({ transform, columns, containerRef }) {
  const [gridItemSize, setGridItemSize] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef?.current) return;

    const updateSizes = () => {
      const rect = containerRef.current.getBoundingClientRect();
      const itemWidth = rect.width / columns;

      setGridItemSize(itemWidth);
      setContainerSize({
        width: rect.width,
        height: rect.height,
      });
    };

    // 초기 계산
    updateSizes();

    // resize 시 재계산
    window.addEventListener('resize', updateSizes);

    // 주기적으로 업데이트 (transform 애니메이션 중)
    const interval = setInterval(updateSizes, 100);

    return () => {
      window.removeEventListener('resize', updateSizes);
      clearInterval(interval);
    };
  }, [containerRef, columns]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80, // Header 아래
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: '#00ff00',
        padding: '16px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 9999,
        minWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box sx={{ marginBottom: '12px', color: '#00ff00', fontWeight: 'bold', fontSize: '14px' }}>
        🔍 DEBUG PANEL
      </Box>

      {/* 그리드 정보 */}
      <Box sx={{ marginBottom: '16px' }}>
        <Box sx={{ color: '#ffaa00', fontWeight: 'bold', marginBottom: '8px' }}>
          📐 Grid Info
        </Box>
        <Box sx={{ paddingLeft: '8px' }}>
          <Box>Columns: <span style={{ color: '#fff' }}>{columns}</span></Box>
          <Box>Grid Item Size: <span style={{ color: '#fff' }}>{gridItemSize.toFixed(2)}px</span></Box>
          <Box>Container Width: <span style={{ color: '#fff' }}>{containerSize.width.toFixed(2)}px</span></Box>
          <Box>Container Height: <span style={{ color: '#fff' }}>{containerSize.height.toFixed(2)}px</span></Box>
        </Box>
      </Box>

      {/* Transform 정보 */}
      <Box>
        <Box sx={{ color: '#ffaa00', fontWeight: 'bold', marginBottom: '8px' }}>
          🎯 Transform
        </Box>
        <Box sx={{ paddingLeft: '8px' }}>
          <Box>
            translateX: <span style={{ color: '#fff' }}>{transform.x.toFixed(2)}px</span>
          </Box>
          <Box>
            translateY: <span style={{ color: '#fff' }}>{transform.y.toFixed(2)}px</span>
          </Box>
          <Box>
            scale: <span style={{ color: '#fff' }}>{transform.scale.toFixed(3)}</span>
          </Box>
          <Box sx={{ marginTop: '4px' }}>
            origin: <span style={{ color: '#fff' }}>{transform.transformOrigin}</span>
          </Box>
        </Box>
      </Box>

      {/* 계산된 최종 크기 */}
      <Box sx={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255, 170, 0, 0.3)' }}>
        <Box sx={{ color: '#ffaa00', fontWeight: 'bold', marginBottom: '8px' }}>
          📏 Scaled Size
        </Box>
        <Box sx={{ paddingLeft: '8px' }}>
          <Box>
            Item × Scale: <span style={{ color: '#fff' }}>{(gridItemSize * transform.scale).toFixed(2)}px</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default DebugPanel;
