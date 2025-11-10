import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Header from './components/Header';
import DynamicGrid from './components/DynamicGrid';
import ProductCard from './components/ProductCard';
import GridContainer from './components/GridContainer';
import DebugCenterLines from './components/DebugCenterLines';
import ProductDetailView from './components/ProductDetailView';
import products from './data/products';
import { useResponsive } from './hooks/useResponsive';
import { getColumnsForZoom } from './constants/responsive';

function App() {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentColorFilter, setCurrentColorFilter] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(0);

  // === Item Zoom 상태 ===
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isItemZoomed, setIsItemZoomed] = useState(false);

  // === Toggle 상태 ===
  const [showGrid, setShowGrid] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // === Wrapper ref (transform 계산용) ===
  const wrapperRef = useRef(null);

  // === 반응형 설정 ===
  const { width, breakpoint, config } = useResponsive();
  const columns = getColumnsForZoom(breakpoint, zoomLevel);
  const isZoomEnabled = config.enableZoom;

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleColorFilterChange = (color) => {
    setCurrentColorFilter(color);
  };

  const handleNavigate = () => {
    // Mobile 등에서 Zoom이 비활성화된 경우 무시
    if (!isZoomEnabled && !isItemZoomed) return;

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

  const filteredProducts = products
    .filter((product) => {
      // 성별 필터
      const categoryMatch = currentFilter === 'all' || product.category === currentFilter;
      // 색상 필터
      const colorMatch = currentColorFilter === 'all' || product.color === currentColorFilter;
      return categoryMatch && colorMatch;
    });

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
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: config.containerPadding,
          backgroundColor: '#ffffff',
        } }
      >
        <Header
          onNavigate={ handleNavigate }
          onFilterChange={ handleFilterChange }
          onColorFilterChange={ handleColorFilterChange }
          onCartClick={ handleCartClick }
          currentFilter={ currentFilter }
          currentColorFilter={ currentColorFilter }
          isZoomedIn={ isItemZoomed || zoomLevel === 2 }
          isZoomEnabled={ isZoomEnabled }
          headerPadding={ config.headerPadding }
          buttonSize={ config.headerButtonSize }
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
          columns={ columns }
          gap={ config.gap }
          wrapperRef={ wrapperRef }
          filteredProducts={ filteredProducts }
          onZoomChange={ handleZoomChange }
          showGrid={ showGrid }
          showDebug={ showDebug }
        >
          <DynamicGrid columns={ columns } gap={ config.gap }>
            {filteredProducts.map((product) => (
              <ProductCard
                key={ product.id }
                product={ product }
                onClick={ handleProductClick }
                isItemZoomed={ isItemZoomed }
                isSelected={ selectedProductId === product.id }
                showDebug={ showDebug }
              />
            ))}
          </DynamicGrid>
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
        config={ config }
      />
    )}
    </>
  );
}

export default App;
