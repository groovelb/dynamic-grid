import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {
  GridFour,
  TShirt,
  Dress,
  CaretLeft,
  Plus,
  ShoppingCart,
  Circle
} from '@phosphor-icons/react';

/**
 * Header 컴포넌트
 *
 * Props:
 * @param {function} onNavigate - 네비게이션 버튼 클릭 핸들러 [Optional]
 * @param {function} onFilterChange - 필터 변경 핸들러 [Optional]
 * @param {function} onColorFilterChange - 색상 필터 변경 핸들러 [Optional]
 * @param {function} onCartClick - 장바구니 버튼 클릭 핸들러 [Optional]
 * @param {string} currentFilter - 현재 선택된 필터 [Optional, 기본값: 'all']
 * @param {string} currentColorFilter - 현재 선택된 색상 필터 [Optional, 기본값: 'all']
 * @param {boolean} isZoomedIn - 그리드 확대 상태 여부 [Optional, 기본값: false]
 * @param {boolean} isZoomEnabled - Zoom 기능 활성화 여부 [Optional, 기본값: true]
 * @param {string} headerPadding - 헤더 패딩 (CSS 문법) [Optional, 기본값: '20px 40px']
 * @param {number} buttonSize - 버튼 크기 (px) [Optional, 기본값: 44]
 *
 * Example usage:
 * <Header onFilterChange={handleFilter} currentFilter="male" currentColorFilter="white" isZoomedIn={false} isZoomEnabled={true} headerPadding="20px 40px" buttonSize={44} />
 */
function Header({ onNavigate, onFilterChange, onColorFilterChange, onCartClick, currentFilter = 'all', currentColorFilter = 'all', isZoomedIn = false, isZoomEnabled = true, headerPadding = '20px 40px', buttonSize = 48 }) {
  
  const IconSize = 32;
  
  return (
    <Box
      component="header"
      sx={ {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: headerPadding,
        backgroundColor: '#ffffff',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
      } }
    >
      <Box>
        <IconButton
          onClick={ onNavigate }
          sx={ {
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
            borderRadius: 0,
            color: '#000000',
            // Mobile에서 zoom 비활성화 시 + 버튼만 숨김 (< 버튼은 유지)
            display: (!isZoomEnabled && !isZoomedIn) ? 'none' : 'flex',
            '&:hover': {
              backgroundColor: '#000000',
              color: '#ffffff',
            },
          } }
        >
          { isZoomedIn ? <CaretLeft size={IconSize} weight="light" /> : <Plus size={IconSize} weight="light" /> }
        </IconButton>
      </Box>

      <Box sx={ { display: isZoomedIn ? 'none' : 'flex', gap: '20px' } }>
        {/* 성별 필터 */}
        <Box sx={ { display: 'flex', gap: '8px' } }>
          <IconButton
            onClick={ () => onFilterChange && onFilterChange('all') }
            sx={ {
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              borderRadius: 0,
              backgroundColor: '#ffffff',
              color: '#000000',
              opacity: currentFilter === 'all' ? 1 : 0.7,
              '&:hover': {
                opacity: 1,
                backgroundColor: '#ffffff',
              },
            } }
          >
            <GridFour size={IconSize} weight="light" />
          </IconButton>
          <IconButton
            onClick={ () => onFilterChange && onFilterChange('male') }
            sx={ {
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              borderRadius: 0,
              backgroundColor: '#ffffff',
              color: '#000000',
              opacity: currentFilter === 'male' ? 1 : 0.7,
              '&:hover': {
                opacity: 1,
                backgroundColor: '#ffffff',
              },
            } }
          >
            <TShirt size={IconSize} weight="light" />
          </IconButton>
          <IconButton
            onClick={ () => onFilterChange && onFilterChange('female') }
            sx={ {
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              borderRadius: 0,
              backgroundColor: '#ffffff',
              color: '#000000',
              opacity: currentFilter === 'female' ? 1 : 0.7,
              '&:hover': {
                opacity: 1,
                backgroundColor: '#ffffff',
              },
            } }
          >
            <Dress size={IconSize} weight="light" />
          </IconButton>
        </Box>

        {/* 색상 필터 */}
        <Box sx={ { display: 'flex', gap: '8px' } }>
          <Button
            onClick={ () => onColorFilterChange && onColorFilterChange('all') }
            sx={ {
              minWidth: `${buttonSize}px`,
              height: `${buttonSize}px`,
              borderRadius: 0,
              fontSize: '12px',
              backgroundColor: '#ffffff',
              color: '#000000',
              opacity: currentColorFilter === 'all' ? 1 : 0.7,
              '&:hover': {
                opacity: 1,
                backgroundColor: '#ffffff',
              },
            } }
          >
            all
          </Button>
          <IconButton
            onClick={ () => onColorFilterChange && onColorFilterChange('white') }
            sx={ {
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              borderRadius: 0,
              backgroundColor: '#ffffff',
              color: '#000000',
              opacity: currentColorFilter === 'white' ? 1 : 0.7,
              '&:hover': {
                opacity: 1,
                backgroundColor: '#ffffff',
              },
            } }
          >
            <Circle size={IconSize} weight="light" />
          </IconButton>
          <IconButton
            onClick={ () => onColorFilterChange && onColorFilterChange('black') }
            sx={ {
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              borderRadius: 0,
              backgroundColor: '#ffffff',
              color: '#000000',
              opacity: currentColorFilter === 'black' ? 1 : 0.7,
              '&:hover': {
                opacity: 1,
                backgroundColor: '#ffffff',
              },
            } }
          >
            <Circle size={IconSize} weight="fill" />
          </IconButton>
        </Box>
      </Box>

      <Box>
        <IconButton
          onClick={ onCartClick }
          sx={ {
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
            borderRadius: 0,
            backgroundColor: '#ffffff',
            color: '#000000',
            border: 'none',
            '&:hover': {
              border: '2px solid #000000',
              backgroundColor: '#ffffff',
            },
          } }
        >
          <ShoppingCart size={IconSize} weight="light" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Header;
