import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

/**
 * Header 컴포넌트
 *
 * Props:
 * @param {function} onNavigate - 네비게이션 버튼 클릭 핸들러 [Optional]
 * @param {function} onFilterChange - 필터 변경 핸들러 [Optional]
 * @param {function} onCartClick - 장바구니 버튼 클릭 핸들러 [Optional]
 * @param {string} currentFilter - 현재 선택된 필터 [Optional, 기본값: 'all']
 * @param {boolean} isZoomedIn - 그리드 확대 상태 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <Header onFilterChange={handleFilter} currentFilter="male" isZoomedIn={false} />
 */
function Header({ onNavigate, onFilterChange, onCartClick, currentFilter = 'all', isZoomedIn = false }) {
  return (
    <Box
      component="header"
      sx={ {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: '#ffffff',
        position: 'relative',
        zIndex: 9999,
      } }
    >
      <Box>
        <Button
          onClick={ onNavigate }
          sx={ {
            padding: '10px 20px',
            fontSize: '16px',
            minWidth: '60px',
            color: '#000000',
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
        <Button
          onClick={ () => onFilterChange && onFilterChange('all') }
          sx={ {
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: currentFilter === 'all' ? '#000000' : '#ffffff',
            color: currentFilter === 'all' ? '#ffffff' : '#000000',
            '&:hover': {
              backgroundColor: '#000000',
              color: '#ffffff',
            },
          } }
        >
          All
        </Button>
        <Button
          onClick={ () => onFilterChange && onFilterChange('male') }
          sx={ {
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: currentFilter === 'male' ? '#000000' : '#ffffff',
            color: currentFilter === 'male' ? '#ffffff' : '#000000',
            '&:hover': {
              backgroundColor: '#000000',
              color: '#ffffff',
            },
          } }
        >
          Male
        </Button>
        <Button
          onClick={ () => onFilterChange && onFilterChange('female') }
          sx={ {
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: currentFilter === 'female' ? '#000000' : '#ffffff',
            color: currentFilter === 'female' ? '#ffffff' : '#000000',
            '&:hover': {
              backgroundColor: '#000000',
              color: '#ffffff',
            },
          } }
        >
          Female
        </Button>
      </Box>

      <Box>
        <Button
          onClick={ onCartClick }
          sx={ {
            padding: '10px 20px',
            fontSize: '16px',
            minWidth: '60px',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#000000',
              color: '#ffffff',
            },
          } }
        >
          Cart
        </Button>
      </Box>
    </Box>
  );
}

export default Header;
