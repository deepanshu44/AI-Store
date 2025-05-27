// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AIRecommendations from '../components/ai/AIRecommendations';
import ProductCard from '../components/products/ProductCard';
import { mockProducts } from '../data/mockData';
import { ShoppingBag, Zap, Shield, Truck } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const featuredProducts = mockProducts.slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to AI Store</h1>
          <p>Experience the future of shopping with AI-powered recommendations</p>
          <Link to="/products" className="cta-button">
            <ShoppingBag size={20} />
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose AI Store?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <Zap className="feature-icon" />
              <h3>AI Recommendations</h3>
              <p>Get personalized product suggestions powered by advanced AI</p>
            </div>
            <div className="feature-card">
              <Shield className="feature-icon" />
              <h3>Secure Shopping</h3>
              <p>Your data and payments are protected with enterprise-grade security</p>
            </div>
            <div className="feature-card">
              <Truck className="feature-icon" />
              <h3>Fast Shipping</h3>
              <p>Free shipping on orders over $50 with 2-3 day delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      {user && (
        <section className="recommendations-section">
          <div className="container">
            <AIRecommendations title={`Hi ${user.firstName}, here's what we recommend for you`} />
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="section-footer">
            <Link to="/products" className="view-all-link">
              View All Products →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
