import React, { useState } from 'react';
import ProductList from './ProductList';
import Dashboard from './Dashboard';

function App() {
  const [view, setView] = useState('products');

  return (
    <>
      <nav className="navbar bg-light p-2">
        <button className="btn btn-link" onClick={() => setView('products')}>Products</button>
        <button className="btn btn-link" onClick={() => setView('dashboard')}>Dashboard</button>
      </nav>
      {view === 'products' ? <ProductList /> : <Dashboard />}
    </>
  );
}

export default App;
