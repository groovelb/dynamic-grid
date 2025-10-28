import { useState } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import products from './data/products';
import './App.css';

function App() {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [columns, setColumns] = useState(3);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleNavigate = () => {
    /** TODO: 네비게이션 기능 구현 (그리드 컬럼 수 조절 / 백버튼) */
    console.log('Navigation clicked');
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
    <div className="app">
      <Header
        onNavigate={ handleNavigate }
        onFilterChange={ handleFilterChange }
        onCartClick={ handleCartClick }
        currentFilter={ currentFilter }
      />
      <main className="main">
        <ProductGrid
          products={ filteredProducts }
          onProductClick={ handleProductClick }
          columns={ columns }
        />
      </main>
    </div>
  );
}

export default App;
