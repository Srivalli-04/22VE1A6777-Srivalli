import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

function App() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: null,
  });
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(`${API}/items`).then(res => setItems(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('image', formData.image);

    await axios.post(`${API}/upload`, data);
    const res = await axios.get(`${API}/items`);
    setItems(res.data);
    setFormData({ title: '', description: '', price: '', image: null });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required /><br /><br />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} /><br /><br />
        <input name="price" placeholder="Price" value={formData.price} onChange={handleChange} required /><br /><br />
        <input type="file" name="image" onChange={handleChange} accept="image/*" required /><br /><br />
        <button type="submit">Upload</button>
      </form>
      <hr />

      <h3>Uploaded Items</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {items.map(item => (
          <div key={item.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10, width: 200 }}>
            <img src={`${API}/uploads/${item.image}`}  alt={item.title} style={{ width: '100%', height:'80%' }} />
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <p><strong>₹{item.price}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;