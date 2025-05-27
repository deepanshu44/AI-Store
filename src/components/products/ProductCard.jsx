// src/components/products/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ product, showAddToCart = true }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.name}
            className="product-image"
          />
          {product.stock < 5 && (
            <span className="stock-badge">Only {product.stock} left!</span>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          
          <div className="product-rating">
            <Star size={16} className="star-icon filled" />
            <span>{product.rating}</span>
          </div>
          
          <div className="product-footer">
            <span className="product-price">${product.price}</span>
            {showAddToCart && (
              <button 
                onClick={handleAddToCart}
                className="add-to-cart-btn"
                disabled={product.stock === 0}
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
