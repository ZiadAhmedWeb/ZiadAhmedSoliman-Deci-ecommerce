import { useState, useEffect } from 'react';
import api from '../api/axios';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [newCategory, setNewCategory] = useState('');

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get('/products'), api.get('/categories')])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data.products);
        setCategories(categoriesRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load admin data');
        setLoading(false);
      });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', stock: '', categoryId: '' });
    setImageFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      categoryId: form.categoryId ? parseInt(form.categoryId) : null,
    };

    try {
      let productId;
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        productId = editingId;
        setMessage('Product updated');
      } else {
        const res = await api.post('/products', payload);
        productId = res.data.id;
        setMessage('Product created');
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        await api.post(`/products/${productId}/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      setMessage('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId || '',
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      setMessage('Failed to delete product');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await api.post('/categories', { name: newCategory });
      setNewCategory('');
      fetchData();
    } catch (err) {
      console.error(err);
      setMessage('Failed to add category — it may already exist');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      setMessage('Failed to delete category');
    }
  };

  if (loading) return <p>Loading admin dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <h3>Categories</h3>
      <form onSubmit={handleAddCategory}>
        <input
          type="text"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="submit">Add Category</button>
      </form>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            {cat.name}
            <button onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>{editingId ? 'Edit Product' : 'Create Product'}</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <select name="categoryId" value={form.categoryId} onChange={handleChange}>
          <option value="">No category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>
      {message && <p>{message}</p>}

      <h3>Products</h3>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} — ${product.price} (stock: {product.stock})
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;