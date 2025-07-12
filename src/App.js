import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import SalesReport from './SalesReport';
import Login from './Login';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('main');

  // Load user session from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div>
      <div style={{ background: '#222', color: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between' }}>
        <h2>Point of Sale System</h2>
        <div>
          <button onClick={handleLogout} style={{ background: 'crimson', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer' }}>
            Logout ({user.username})
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <button onClick={() => setView('main')} style={{ marginRight: 10 }}>🛒 POS</button>
        <button onClick={() => setView('sales')}>📊 Sales Report</button>
      </div>

      {view === 'main' ? (
        <ProductList />
      ) : (
        <SalesReport onBack={() => setView('main')} />
      )}
    </div>
  );
}

export default App;
