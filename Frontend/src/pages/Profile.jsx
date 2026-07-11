import { useState, useEffect } from 'react';
import api from '../api/axios';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load profile');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-detail-info" style={{ maxWidth: '400px' }}>
      <h2>My Profile</h2>
      <div className="detail-row">
        <span>Email</span>
        <span>{profile.email}</span>
      </div>
      <div className="detail-row">
        <span>Role</span>
        <span>{profile.role}</span>
      </div>
      <div className="detail-row">
        <span>Joined</span>
        <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default Profile;