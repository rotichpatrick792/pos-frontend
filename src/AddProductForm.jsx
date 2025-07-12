import React, { useState } from 'react';
import axios from 'axios';

const AddProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, price, quantity } = formData;

    if (!name || !price || !quantity) {
      alert("Please fill in all fields.");
      return;
    }

    axios.post('https://pos-backend-m1qe.onrender.com/api/products', {
      name,
      price: parseInt(price),
      quantity: parseInt(quantity)
    })
    .then(() => {
      alert("✅ Product added successfully!");
      setFormData({ name: '', price: '', quantity: '' });
      if (onProductAdded) onProductAdded(); // Refresh product list
    })
    .catch(err => {
      console.error("Error adding product:", err);
      alert("❌ Failed to add product.");
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Add New Product</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (Ksh)"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
        <button type="submit">➕ Add</button>
      </div>
    </form>
  );
};

export default AddProductForm;
