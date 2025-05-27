// src/pages/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { mockProducts } from '../data/mockData';
import { aiService } from '../services/aiServices';
import AIRecommendations from '../components/ai/AIRecommendations';
import ProductCard from '../components/products/ProductCard';
import { ShoppingCart, Star, Plus, Minus, Heart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [frequentlyBought, setFrequentlyBought] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productId = parseInt(id);
    const foundProduct = mockProducts.find(p => p.id === productId);
    setProduct(foundProduct);
    
    if (foundProduct) {
      const related = aiService.getFrequentlyBoughtTogether(productId);
      setFrequentlyBought(related);
    }
    
    setLoading(false);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const adjustQuantity = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return <div className="loading-page">Loading...</div>;
  }

  if (!product) {
    return <div className="error-page">Product not found</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail">
          <div className="product-image-section">
            <img 
              src={product.image} 
              alt={product.name}
              className="product-detail-image"
            />
          </div>

          <div className="product-info-section">
            <h1>{product.name}</h1>
            
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'} 
                  />
                ))}
              </div>
              <span className="rating-text">({product.rating}/5)</span>
            </div>

            <p className="product-description">{product.description}</p>

            <div className="product-tags">
              {product.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            <div className="product-price">
              <span className="price">${product.price}</span>
            </div>

            <div className="stock-info">
              {product.stock > 5 ? (
                <span className="in-stock">In Stock ({product.stock} available)</span>
              ) : product.stock > 0 ? (
                <span className="low-stock">Only {product.stock} left in stock!</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => adjustQuantity(-1)}
                  disabled={quantity <= 1}
                  className="quantity-btn"
                >
                  <Minus size={16} />
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  onClick={() => adjustQuantity(1)}
                  disabled={quantity >= product.stock}
                  className="quantity-btn"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="add-to-cart-btn primary"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              
              <button className="wishlist-btn">
                <Heart size={20} />
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together */}
        {frequentlyBought.length > 0 && (
          <section className="frequently-bought">
            <h2>Frequently Bought Together</h2>
            <div className="products-grid small">
              {frequentlyBought.map(item => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}

        {/* AI Recommendations */}
        <AIRecommendations 
          currentProduct={product}
          title="You might also like"
        />
      </div>
    </div>
  );
};

export default ProductDetail;
