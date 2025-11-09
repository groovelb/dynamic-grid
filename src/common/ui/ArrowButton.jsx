import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

/**
 * ArrowButton 컴포넌트
 *
 * 범용 화살표 버튼 - 캐로셀, 네비게이션 등 다양한 곳에서 사용 가능
 *
 * Props:
 * @param {function} onClick - 클릭 핸들러
 * @param {'left' | 'right' | 'up' | 'down'} direction - 화살표 방향
 * @param {number} size - 버튼 크기 (px, 기본값: 40)
 * @param {number|string} position - 버튼 위치 (px 또는 vw/vh 등, 기본값: 20)
 * @param {'top' | 'bottom' | 'left' | 'right'} positionSide - 위치 기준 (기본값: direction에 따라 자동)
 * @param {number} zIndex - z-index (기본값: 10)
 * @param {object} sx - 추가 MUI sx props
 *
 * Example:
 * <ArrowButton onClick={handleNext} direction="right" size={50} position={30} />
 */
function ArrowButton({
  onClick,
  direction = 'right',
  size = 40,
  position = 20,
  positionSide,
  zIndex = 10,
  sx = {},
}) {
  // 방향별 화살표 심볼
  const arrows = {
    left: '‹',
    right: '›',
    up: '︿',
    down: '﹀',
  };

  // 기본 위치 설정 (direction에 따라 자동)
  const defaultPositionSide = direction === 'left' ? 'left'
    : direction === 'right' ? 'right'
    : direction === 'up' ? 'top'
    : 'bottom';

  const finalPositionSide = positionSide || defaultPositionSide;

  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        [finalPositionSide]: position,
        zIndex,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: '#000',
        width: size,
        height: size,
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 1)',
        },
        ...sx,
      }}
    >
      <Box component="span" sx={{ fontSize: 24, fontWeight: 300 }}>
        {arrows[direction]}
      </Box>
    </IconButton>
  );
}

export default ArrowButton;
