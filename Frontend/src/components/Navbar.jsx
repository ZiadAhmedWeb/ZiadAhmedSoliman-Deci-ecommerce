import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">ZeeCrumb</Link>
      <div className="nav-links">
        <Link to="/products">Products</Link>
        {user && <Link to="/cart">Cart</Link>}
        {user && <Link to="/profile">Profile</Link>}
        {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;