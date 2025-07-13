import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddProductForm = ({ onProductAdded }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name || !price || !quantity) return alert('Please fill all fields');

    axios.post('https://pos-backend-m1qe.onrender.com/api/products', {
      name,
      price: parseInt(price),
      quantity: parseInt(quantity)
    })
      .then(() => {
        alert('✅ Product added!');
        setName('');
        setPrice('');
        setQuantity('');
        onProductAdded();
      })
      .catch(() => alert('❌ Error adding product'));
  };

  return (
    <div className="card mb-4 p-3">
      <h3>Add Product</h3>
      <form onSubmit={handleAddProduct} className="row g-3">
        <div className="col-md-4"><input className="form-control" placeholder="Name" value={name} onChange={e => setName(e.target.value)} /></div>
        <div className="col-md-3"><input type="number" className="form-control" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} /></div>
        <div className="col-md-3"><input type="number" className="form-control" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} /></div>
        <div className="col-md-2"><button type="submit" className="btn btn-success w-100">Add</button></div>
      </form>
    </div>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');

  const fetchProducts = () => {
    axios.get('https://pos-backend-m1qe.onrender.com/api/products')
      .then(res => setProducts(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this product?')) return;
    axios.delete(`https://pos-backend-m1qe.onrender.com/api/products/${id}`)
      .then(() => fetchProducts())
      .catch(() => alert('Error deleting'));
  };

  const handleEdit = (product) => {
    const newName = prompt('Enter new name', product.name);
    const newPrice = prompt('Enter new price', product.price);
    const newQuantity = prompt('Enter new quantity', product.quantity);
    if (!newName || !newPrice || !newQuantity) return;

    axios.put(`https://pos-backend-m1qe.onrender.com/api/products/${product.id}`, {
      name: newName,
      price: parseInt(newPrice),
      quantity: parseInt(newQuantity)
    }).then(fetchProducts).catch(() => alert('Error editing product'));
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert('Cart is empty');

    axios.post('https://pos-backend-m1qe.onrender.com/api/checkout', {
      cart,
      payment_mode: paymentMode
    })
      .then(() => {
        alert('✅ Checkout complete!');
        setCart([]);
        fetchProducts();
      })
      .catch(() => alert('❌ Checkout failed'));
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Point of Sale System</h2>

      <AddProductForm onProductAdded={fetchProducts} />

      <div className="mb-3 d-flex justify-content-between">
        <input
          className="form-control me-2"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <div className="d-flex align-items-center">
          <label className="me-2 fw-bold">Payment:</label>
          <select className="form-select" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
            <option value="cash">Cash</option>
            <option value="mpesa">M-Pesa</option>
          </select>
        </div>
      </div>

      <div className="card p-3 mb-4">
        <h3>Available Products</h3>
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price (Ksh)</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                  <th>Add</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(prod => (
                  <tr key={prod.id} className={prod.quantity <= 5 ? 'table-danger' : ''}>
                    <td>{prod.name}</td>
                    <td>{prod.price}</td>
                    <td>{prod.quantity}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(prod)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(prod.id)}>Delete</button>
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => addToCart(prod)}>Add</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card p-3">
        <h3>Cart</h3>
        {cart.length === 0 ? (
          <p>Cart is empty.</p>
        ) : (
          <>
            <ul className="list-group mb-3">
              {cart.map(item => (
                <li className="list-group-item d-flex justify-content-between" key={item.id}>
                  <span>{item.name} x {item.quantity}</span>
                  <strong>Ksh {item.price * item.quantity}</strong>
                </li>
              ))}
            </ul>
            <h5>Total: Ksh {cart.reduce((total, item) => total + item.price * item.quantity, 0)}</h5>
            <button className="btn btn-success mt-2" onClick={handleCheckout}>Checkout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
