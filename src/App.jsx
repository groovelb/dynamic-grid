import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Header from './components/Header';
import DynamicGrid from './components/DynamicGrid';
import GridContainer from './components/GridContainer';
import DebugCenterLines from './components/DebugCenterLines';
import products from './data/products';

function App() {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(0);

  // === Item Zoom 상태 (신규) ===
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isItemZoomed, setIsItemZoomed] = useState(false);

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
    // 우선순위 1: Item Zoom 해제
    if (isItemZoomed) {
      setSelectedProduct(null);
      return;
    }

    // 우선순위 2: Grid Zoom 리셋
    if (zoomLevel === 2) {
      setZoomLevel(0);
      return;
    }

    // 우선순위 3: Grid Zoom 증가
    setZoomLevel((prev) => Math.min(prev + 1, 2));
  };

  const handleCartClick = () => {
    /** TODO: 장바구니 기능 구현 */
    console.log('Cart clicked');
  };

  const handleProductClick = (productWithElement) => {
    // ProductCard에서 전달된 { ...product, element } 객체
    setSelectedProduct(productWithElement);
  };

  const handleZoomChange = (isZoomed) => {
    setIsItemZoomed(isZoomed);
  };

  const filteredProducts = currentFilter === 'all'
    ? products
    : products.filter((product) => product.category === currentFilter);

  // === 필터 변경 시 선택된 아이템이 사라지면 자동 줌아웃 ===
  useEffect(() => {
    if (selectedProduct && !filteredProducts.find(p => p.id === selectedProduct.id)) {
      setSelectedProduct(null);
    }
  }, [filteredProducts, selectedProduct]);

  return (
    <>
      <DebugCenterLines />
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
          isZoomedIn={ isItemZoomed || zoomLevel === 2 }
        />
      <Box
        component="main"
        sx={ {
          flex: 1,
          overflowY: 'auto',
          padding: '40px',
        } }
      >
        <GridContainer
          selectedProduct={ selectedProduct }
          onZoomChange={ handleZoomChange }
        >
          <DynamicGrid
            products={ filteredProducts }
            onProductClick={ handleProductClick }
            columns={ getColumns() }
            selectedProduct={ selectedProduct }
            isItemZoomed={ isItemZoomed }
          />
        </GridContainer>
      </Box>
    </Box>
    </>
  );
}

export default App;
