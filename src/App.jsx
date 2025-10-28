import { useState } from 'react';
import Box from '@mui/material/Box';
import Header from './components/Header';
import DynamicGrid from './components/DynamicGrid';
import products from './data/products';

function App() {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(0);

  /** 확대 레벨에 따른 컬럼 수 계산 */
  const getColumns = () => {
    switch (zoomLevel) {
      case 0:
        return 8;
      case 1:
        return 6;
      case 2:
        return 4;
      default:
        return 8;
    }
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleNavigate = () => {
    if (zoomLevel === 2) {
      /** 최대 확대 상태에서 클릭 시 초기 상태로 리셋 */
      setZoomLevel(0);
    } else {
      /** + 버튼 클릭 시 확대 (최대 2번) */
      setZoomLevel((prev) => Math.min(prev + 1, 2));
    }
  };

  const handleCartClick = () => {
    /** TODO: 장바구니 기능 구현 */
    console.log('Cart clicked');
  };

  const handleProductClick = (product) => {
    /** TODO: 제품 확대 화면 기능 구현 */
    console.log('Product clicked:', product);
  };

  const filteredProducts = currentFilter === 'all'
    ? products
    : products.filter((product) => product.category === currentFilter);

  return (
    <Box
      sx={ {
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      } }
    >
      <Header
        onNavigate={ handleNavigate }
        onFilterChange={ handleFilterChange }
        onCartClick={ handleCartClick }
        currentFilter={ currentFilter }
        isZoomedIn={ zoomLevel === 2 }
      />
      <Box
        component="main"
        sx={ {
          flex: 1,
          overflowY: 'auto',
          padding: '40px',
        } }
      >
        <DynamicGrid
          products={ filteredProducts }
          onProductClick={ handleProductClick }
          columns={ getColumns() }
        />
      </Box>
    </Box>
  );
}

export default App;
