// src/components/common/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          AI Store
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="search-form desktop-only">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <Search size={20} />
          </button>
        </form>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-only">
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/cart" className="nav-link cart-link">
            <ShoppingCart size={20} />
            {getCartItemsCount() > 0 && (
              <span className="cart-badge">{getCartItemsCount()}</span>
            )}
          </Link>
          
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="nav-link">
                <User size={20} />
                {user.firstName}
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn mobile-only"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <form onSubmit={handleSearch} className="search-form mobile-search">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <Search size={20} />
            </button>
          </form>
          
          <Link to="/products" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
            Products
          </Link>
          
          <Link to="/cart" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
            Cart ({getCartItemsCount()})
          </Link>
          
          {user ? (
            <>
              <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                Profile
              </Link>
              <button onClick={handleLogout} className="mobile-nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
