import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  if (password.length < 6) {
    setError('Password must be at least 6 characters');
    return;
  }

  try {
    await api.post('/auth/register', { email, password });
    navigate('/login');
  } catch (err) {
    console.error(err);
    setError('Registration failed — email may already be in use');
  }
};

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Register;