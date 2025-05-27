// src/pages/Cart.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    clearCart 
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <ShoppingBag size={64} className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button onClick={clearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="cart-item-image"
                />
                
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">${item.price}</p>
                </div>

                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping:</span>
                <span>{getCartTotal() > 50 ? 'Free' : '$5.99'}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax:</span>
                <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
              </div>
              
              <div className="summary-row total">
                <span>Total:</span>
                <span>
                  ${(getCartTotal() + (getCartTotal() > 50 ? 0 : 5.99) + (getCartTotal() * 0.08)).toFixed(2)}
                </span>
              </div>

              <Link to="/checkout" className="checkout-btn">
                Proceed to Checkout
              </Link>
              
              <Link to="/products" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

