/**
 * Header 컴포넌트
 *
 * Props:
 * @param {function} onNavigate - 네비게이션 버튼 클릭 핸들러 [Optional]
 * @param {function} onFilterChange - 필터 변경 핸들러 [Optional]
 * @param {function} onCartClick - 장바구니 버튼 클릭 핸들러 [Optional]
 * @param {string} currentFilter - 현재 선택된 필터 [Optional, 기본값: 'all']
 *
 * Example usage:
 * <Header onFilterChange={handleFilter} currentFilter="male" />
 */
function Header({ onNavigate, onFilterChange, onCartClick, currentFilter = 'all' }) {
  return (
    <header className="header">
      <div className="header__nav">
        <button className="header__nav-btn" onClick={ onNavigate }>
          +
        </button>
      </div>

      <div className="header__filter">
        <button
          className={ currentFilter === 'all' ? 'filter-btn filter-btn--active' : 'filter-btn' }
          onClick={ () => onFilterChange && onFilterChange('all') }
        >
          All
        </button>
        <button
          className={ currentFilter === 'male' ? 'filter-btn filter-btn--active' : 'filter-btn' }
          onClick={ () => onFilterChange && onFilterChange('male') }
        >
          Male
        </button>
        <button
          className={ currentFilter === 'female' ? 'filter-btn filter-btn--active' : 'filter-btn' }
          onClick={ () => onFilterChange && onFilterChange('female') }
        >
          Female
        </button>
      </div>

      <div className="header__cart">
        <button className="header__cart-btn" onClick={ onCartClick }>
          Cart
        </button>
      </div>
    </header>
  );
}

export default Header;
