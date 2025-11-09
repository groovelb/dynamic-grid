import Box from '@mui/material/Box';

/**
 * Indicator 컴포넌트
 *
 * 범용 인디케이터 - 페이지네이션, 캐로셀 진행 상태 등 다양한 곳에서 사용 가능
 *
 * Props:
 * @param {number} total - 전체 아이템 개수
 * @param {number} current - 현재 활성화된 인덱스
 * @param {function} onSelect - 인디케이터 클릭 핸들러 (index를 인자로 받음)
 * @param {number} size - 인디케이터 크기 (px, 기본값: 8)
 * @param {string} gap - 인디케이터 간격 (기본값: '12px')
 * @param {string} activeColor - 활성 색상 (기본값: '#000')
 * @param {number} inactiveOpacity - 비활성 투명도 (기본값: 0.3)
 * @param {string} marginTop - 상단 여백 (기본값: '24px')
 * @param {object} sx - 추가 MUI sx props (컨테이너)
 * @param {object} dotSx - 추가 MUI sx props (개별 dot)
 *
 * Example:
 * <Indicator
 *   total={5}
 *   current={2}
 *   onSelect={(index) => setCurrentIndex(index)}
 *   size={10}
 *   gap="16px"
 * />
 */
function Indicator({
  total,
  current,
  onSelect,
  size = 8,
  gap = '12px',
  activeColor = '#000',
  inactiveOpacity = 0.3,
  marginTop = '24px',
  sx = {},
  dotSx = {},
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap,
        marginTop,
        ...sx,
      }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <Box
          key={index}
          sx={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: activeColor,
            opacity: index === current ? 1 : inactiveOpacity,
            transition: 'opacity 0.3s ease',
            cursor: onSelect ? 'pointer' : 'default',
            ...dotSx,
          }}
          onClick={() => onSelect?.(index)}
        />
      ))}
    </Box>
  );
}

export default Indicator;
