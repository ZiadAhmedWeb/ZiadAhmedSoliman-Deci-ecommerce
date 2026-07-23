import { useState, useEffect } from 'react';
import api from '../api/axios';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => {
        setProfile(res.data);
        setEmail(res.data.email);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load profile');
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (password && password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    try {
      const payload = { email };
      if (password) payload.password = password;

      const res = await api.put('/auth/me', payload);
      setProfile(res.data);
      setPassword('');
      setMessage('Profile updated successfully');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Failed to update profile');
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-detail-info" style={{ maxWidth: '400px' }}>
      <h2>My Profile</h2>
      <div className="detail-row">
        <span>Role</span>
        <span>{profile.role}</span>
      </div>
      <div className="detail-row">
        <span>Joined</span>
        <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '1.2rem', boxShadow: 'none', border: 'none', padding: 0 }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password (leave blank to keep current)"
        />
        <button type="submit">Update Profile</button>
      </form>
      {message && <p style={{ marginTop: '0.8rem', color: 'var(--seagreen)' }}>{message}</p>}
    </div>
  );
}

export default Profile;