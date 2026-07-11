import { useState, useEffect } from 'react';
import api from '../api/axios';


function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [address, setAddress] = useState('');

  const fetchCart = () => {
    setLoading(true);
    api.get('/cart')
      .then((res) => {
        setCart(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load cart — are you logged in?');
        setLoading(false);
      });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put(`/cart/${itemId}`, { quantity });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    if (!address.trim()) {
      setMessage('Please enter a delivery address');
      return;
    }
    try {
      const res = await api.post('/cart/checkout', { address });
      setMessage(res.data.message);
      setAddress('');
      fetchCart();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Checkout failed');
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>{error}</p>;

  const total = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.items.map((item) => (
              <li key={item.id}>
                {item.product.name} — ${item.product.price} x{' '}
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                />
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Total: ${total.toFixed(2)} you pay on delivery</h3>
          <input
            type="text"
            placeholder="Delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button onClick={handleCheckout}>Checkout</button>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Cart;