import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { LayoutGrid, Shirt, PersonStanding, Circle, ShoppingBag } from 'lucide-react';

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
function Header({ onNavigate, onFilterChange, onColorFilterChange, onCartClick, currentFilter = 'all', currentColorFilter = 'all', isZoomedIn = false, isZoomEnabled = true, headerPadding = '20px 40px', buttonSize = 44 }) {
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
        <Button
          onClick={ onNavigate }
          sx={ {
            padding: '12px',
            minWidth: `${buttonSize}px`,
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
            fontSize: '16px',
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
          { isZoomedIn ? '<' : '+' }
        </Button>
      </Box>

      <Box sx={ { display: 'flex', gap: '20px' } }>
        {/* 성별 필터 */}
        <Box sx={ { display: 'flex', gap: '8px' } }>
          <Button
            onClick={ () => onFilterChange && onFilterChange('all') }
            sx={ {
              padding: '12px',
              minWidth: `${buttonSize}px`,
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              borderRadius: 0,
              backgroundColor: '#ffffff',
              color: '#000000',
              border: currentFilter === 'all' ? '0.5px solid #000000' : 'none',
              '&:hover': {
                border: '0.5px solid #000000',
              },
            } }
          >
            <LayoutGrid size={20} strokeWidth={1.5} />
          </Button>
          <Button
            onClick={ () => onFilterChange && onFilterChange('male') }
            sx={ {
              padding: '12px',
              minWidth: `${buttonSize}px`,
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              borderRadius: 0,
              backgroundColor: '#ffffff',
              color: '#000000',
              border: currentFilter === 'male' ? '0.5px solid #000000' : 'none',
              '&:hover': {
                border: '0.5px solid #000000',
              },
            } }
          >
            <Shirt size={20} strokeWidth={1.5} />
          </Button>
          <Button
            onClick={ () => onFilterChange && onFilterChange('female') }
            sx={ {
              padding: '12px',
              minWidth: `${buttonSize}px`,
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              borderRadius: 0,
              backgroundColor: '#ffffff',
              color: '#000000',
              border: currentFilter === 'female' ? '0.5px solid #000000' : 'none',
              '&:hover': {
                border: '0.5px solid #000000',
              },
            } }
          >
            <PersonStanding size={20} strokeWidth={1.5} />
          </Button>
        </Box>

        {/* 색상 필터 */}
        <Box sx={ { display: 'flex', gap: '8px' } }>
          <Button
            onClick={ () => onColorFilterChange && onColorFilterChange('all') }
            sx={ {
              padding: '12px',
              minWidth: `${buttonSize}px`,
              height: `${buttonSize}px`,
              borderRadius: 0,
              fontSize: '12px',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: currentColorFilter === 'all' ? '0.5px solid #000000' : 'none',
              '&:hover': {
                border: '0.5px solid #000000',
              },
            } }
          >
            all
          </Button>
          <Button
            onClick={ () => onColorFilterChange && onColorFilterChange('white') }
            sx={ {
              padding: '12px',
              minWidth: `${buttonSize}px`,
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              borderRadius: 0,
              backgroundColor: '#ffffff',
              color: '#000000',
              border: currentColorFilter === 'white' ? '0.5px solid #000000' : 'none',
              '&:hover': {
                border: '0.5px solid #000000',
              },
            } }
          >
            <Circle
              size={20}
              strokeWidth={2}
              stroke="#000000"
              fill="none"
            />
          </Button>
          <Button
            onClick={ () => onColorFilterChange && onColorFilterChange('black') }
            sx={ {
              padding: '12px',
              minWidth: `${buttonSize}px`,
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              borderRadius: 0,
              backgroundColor: '#ffffff',
              color: '#000000',
              border: currentColorFilter === 'black' ? '0.5px solid #000000' : 'none',
              '&:hover': {
                border: '0.5px solid #000000',
              },
            } }
          >
            <Circle
              size={20}
              strokeWidth={2}
              stroke="#000000"
              fill="#000000"
            />
          </Button>
        </Box>
      </Box>

      <Box>
        <Button
          onClick={ onCartClick }
          sx={ {
            padding: '12px',
            minWidth: `${buttonSize}px`,
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
            borderRadius: 0,
            backgroundColor: '#ffffff',
            color: '#000000',
            border: 'none',
            '&:hover': {
              border: '2px solid #000000',
            },
          } }
        >
          <ShoppingBag size={20} strokeWidth={1.5} />
        </Button>
      </Box>
    </Box>
  );
}

export default Header;
