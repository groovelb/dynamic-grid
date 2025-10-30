import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Header from './components/Header';
import DynamicGrid from './components/DynamicGrid';
import GridContainer from './components/GridContainer';
import DebugCenterLines from './components/DebugCenterLines';
import ProductDetailView from './components/ProductDetailView';
import products from './data/products';

function App() {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(0);

  // === Item Zoom 상태 ===
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isItemZoomed, setIsItemZoomed] = useState(false);

  // === Toggle 상태 ===
  const [showGrid, setShowGrid] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // === Wrapper ref (transform 계산용) ===
  const wrapperRef = useRef(null);

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
      setSelectedProductId(null);
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

  const handleProductClick = (productId) => {
    // ProductCard에서 전달된 id
    setSelectedProductId(productId);
  };

  const handleZoomChange = (isZoomed) => {
    setIsItemZoomed(isZoomed);
  };

  const filteredProducts = currentFilter === 'all'
    ? products
    : products.filter((product) => product.category === currentFilter);

  // === 필터 변경 시 선택된 아이템이 사라지면 자동 줌아웃 ===
  useEffect(() => {
    if (selectedProductId && !filteredProducts.find(p => p.id === selectedProductId)) {
      setSelectedProductId(null);
    }
  }, [filteredProducts, selectedProductId]);

  return (
    <>
      {showDebug && <DebugCenterLines wrapperRef={wrapperRef} />}
      <Box
        sx={ {
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '40px',
        } }
      >
        <Header
          onNavigate={ handleNavigate }
          onFilterChange={ handleFilterChange }
          onCartClick={ handleCartClick }
          currentFilter={ currentFilter }
          isZoomedIn={ isItemZoomed || zoomLevel === 2 }
          onToggleGrid={ () => setShowGrid(prev => !prev) }
          onToggleDebug={ () => setShowDebug(prev => !prev) }
          showGrid={ showGrid }
          showDebug={ showDebug }
        />
      <Box
        ref={ wrapperRef }
        component="main"
        sx={ {
          flex: 1,
          overflowY: isItemZoomed ? 'hidden' : 'auto', // 줌인 시 스크롤 비활성화
          // backgroundColor: 'red',
          // padding: '40px',
        } }
      >
        <GridContainer
          selectedProductId={ selectedProductId }
          columns={ getColumns() }
          wrapperRef={ wrapperRef }
          filteredProducts={ filteredProducts }
          onZoomChange={ handleZoomChange }
          showGrid={ showGrid }
          showDebug={ showDebug }
        >
          <DynamicGrid
            products={ filteredProducts }
            onProductClick={ handleProductClick }
            columns={ getColumns() }
            selectedProductId={ selectedProductId }
            isItemZoomed={ isItemZoomed }
            showDebug={ showDebug }
          />
        </GridContainer>
      </Box>
    </Box>

    {/* 제품 상세 뷰 오버레이 */}
    {isItemZoomed && selectedProductId && (
      <ProductDetailView
        productId={ selectedProductId }
        filteredProducts={ filteredProducts }
        onProductChange={ (newId) => setSelectedProductId(newId) }
        onClose={ () => setSelectedProductId(null) }
      />
    )}
    </>
  );
}

export default App;
