// src/pages/Checkout.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, MapPin, User } from 'lucide-react';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Billing Info
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    
    // Shipping Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    
    // Payment Info
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clear cart and redirect
    clearCart();
    navigate('/profile?orderPlaced=true');
    setLoading(false);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const steps = [
    { number: 1, title: 'Shipping', icon: MapPin },
    { number: 2, title: 'Payment', icon: CreditCard },
    { number: 3, title: 'Review', icon: User }
  ];

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          
          <div className="checkout-steps">
            {steps.map(step => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.number}
                  className={`step ${currentStep >= step.number ? 'active' : ''}`}
                >
                  <div className="step-icon">
                    <Icon size={16} />
                  </div>
                  <span>{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="form-section">
                  <h2>Shipping Information</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>ZIP Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="next-btn"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <div className="form-section">
                  <h2>Payment Information</h2>
                  
                  <div className="form-group">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>CVV *</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-buttons">
                    <button 
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="back-btn"
                    >
                      Back to Shipping
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="next-btn"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <div className="form-section">
                  <h2>Review Your Order</h2>
                  
                  <div className="order-review">
                    <div className="review-section">
                      <h3>Shipping Address</h3>
                      <p>
                        {formData.firstName} {formData.lastName}<br/>
                        {formData.address}<br/>
                        {formData.city}, {formData.state} {formData.zipCode}
                      </p>
                    </div>

                    <div className="review-section">
                      <h3>Payment Method</h3>
                      <p>**** **** **** {formData.cardNumber.slice(-4)}</p>
                    </div>

                    <div className="review-section">
                      <h3>Order Items</h3>
                      <div className="review-items">
                        {cartItems.map(item => (
                          <div key={item.id} className="review-item">
                            <img src={item.image} alt={item.name} />
                            <div className="item-details">
                              <span className="item-name">{item.name}</span>
                              <span className="item-quantity">Qty: {item.quantity}</span>
                            </div>
                            <span className="item-price">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="form-buttons">
                    <button 
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="back-btn"
                    >
                      Back to Payment
                    </button>
                    
                    <button 
                      type="submit"
                      disabled={loading}
                      className="place-order-btn"
                    >
                      {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
