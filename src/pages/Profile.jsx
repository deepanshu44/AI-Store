// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import AIRecommendations from '../components/ai/AIRecommendations';
import { User, Package, Heart, Settings, CheckCircle } from 'lucide-react';

const Profile = () => {
 const { user } = useAuth();
 const [searchParams] = useSearchParams();
 const [activeTab, setActiveTab] = useState('orders');
 const [showOrderSuccess, setShowOrderSuccess] = useState(false);

 useEffect(() => {
   if (searchParams.get('orderPlaced')) {
     setShowOrderSuccess(true);
     setTimeout(() => setShowOrderSuccess(false), 5000);
   }
 }, [searchParams]);

 // Mock order data
 const mockOrders = [
   {
     id: 1,
     date: '2025-05-25',
     status: 'Delivered',
     total: 149.98,
     items: [
       { name: 'Wireless Bluetooth Headphones', quantity: 1, price: 99.99 },
       { name: 'Premium Coffee Beans', quantity: 2, price: 24.99 }
     ]
   },
   {
     id: 2,
     date: '2025-05-20',
     status: 'Shipped',
     total: 299.99,
     items: [
       { name: 'Smart Fitness Watch', quantity: 1, price: 249.99 },
       { name: 'Wireless Phone Charger', quantity: 1, price: 39.99 }
     ]
   }
 ];

 const tabs = [
   { id: 'orders', label: 'Orders', icon: Package },
   { id: 'profile', label: 'Profile', icon: User },
   { id: 'wishlist', label: 'Wishlist', icon: Heart },
   { id: 'settings', label: 'Settings', icon: Settings }
 ];

 if (!user) {
   return (
     <div className="profile-page">
       <div className="container">
         <div className="auth-required">
           <h2>Please log in to view your profile</h2>
         </div>
       </div>
     </div>
   );
 }

 return (
   <div className="profile-page">
     <div className="container">
       {showOrderSuccess && (
         <div className="success-banner">
           <CheckCircle size={20} />
           <span>Order placed successfully! You will receive a confirmation email shortly.</span>
         </div>
       )}

       <div className="profile-header">
         <div className="user-info">
           <div className="user-avatar">
             {user.firstName.charAt(0)}{user.lastName.charAt(0)}
           </div>
           <div className="user-details">
             <h1>{user.firstName} {user.lastName}</h1>
             <p>{user.email}</p>
           </div>
         </div>
       </div>

       <div className="profile-content">
         <div className="profile-sidebar">
           <nav className="profile-nav">
             {tabs.map(tab => {
               const Icon = tab.icon;
               return (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                 >
                   <Icon size={20} />
                   {tab.label}
                 </button>
               );
             })}
           </nav>
         </div>

         <div className="profile-main">
           {activeTab === 'orders' && (
             <div className="tab-content">
               <h2>Your Orders</h2>
               
               {mockOrders.length > 0 ? (
                 <div className="orders-list">
                   {mockOrders.map(order => (
                     <div key={order.id} className="order-card">
                       <div className="order-header">
                         <div className="order-info">
                           <span className="order-id">Order #{order.id}</span>
                           <span className="order-date">{order.date}</span>
                         </div>
                         <span className={`order-status ${order.status.toLowerCase()}`}>
                           {order.status}
                         </span>
                       </div>
                       
                       <div className="order-items">
                         {order.items.map((item, index) => (
                           <div key={index} className="order-item">
                             <span>{item.name}</span>
                             <span>Qty: {item.quantity}</span>
                             <span>${item.price}</span>
                           </div>
                         ))}
                       </div>
                       
                       <div className="order-footer">
                         <span className="order-total">Total: ${order.total}</span>
                         <div className="order-actions">
                           <button className="order-btn">View Details</button>
                           {order.status === 'Delivered' && (
                             <button className="order-btn">Reorder</button>
                           )}
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="empty-state">
                   <Package size={48} />
                   <h3>No orders yet</h3>
                   <p>Start shopping to see your orders here!</p>
                 </div>
               )}
             </div>
           )}

           {activeTab === 'profile' && (
             <div className="tab-content">
               <h2>Profile Information</h2>
               
               <form className="profile-form">
                 <div className="form-row">
                   <div className="form-group">
                     <label>First Name</label>
                     <input
                       type="text"
                       value={user.firstName}
                       className="form-input"
                       readOnly
                     />
                   </div>
                   
                   <div className="form-group">
                     <label>Last Name</label>
                     <input
                       type="text"
                       value={user.lastName}
                       className="form-input"
                       readOnly
                     />
                   </div>
                 </div>

                 <div className="form-group">
                   <label>Email</label>
                   <input
                     type="email"
                     value={user.email}
                     className="form-input"
                     readOnly
                   />
                 </div>

                 <div className="form-group">
                   <label>Shopping Preferences</label>
                   <div className="preferences-list">
                     {user.preferences.length > 0 ? (
                       user.preferences.map(pref => (
                         <span key={pref} className="preference-tag">
                           {pref}
                         </span>
                       ))
                     ) : (
                       <p>No preferences set</p>
                     )}
                   </div>
                 </div>

                 <button type="button" className="edit-profile-btn">
                   Edit Profile
                 </button>
               </form>
             </div>
           )}

           {activeTab === 'wishlist' && (
             <div className="tab-content">
               <h2>Your Wishlist</h2>
               
               <div className="empty-state">
                 <Heart size={48} />
                 <h3>Your wishlist is empty</h3>
                 <p>Add products to your wishlist to see them here!</p>
               </div>
             </div>
           )}

           {activeTab === 'settings' && (
             <div className="tab-content">
               <h2>Account Settings</h2>
               
               <div className="settings-sections">
                 <div className="settings-section">
                   <h3>Notifications</h3>
                   <div className="setting-item">
                     <label className="checkbox-label">
                       <input type="checkbox" defaultChecked />
                       <span>Email notifications for orders</span>
                     </label>
                   </div>
                   <div className="setting-item">
                     <label className="checkbox-label">
                       <input type="checkbox" defaultChecked />
                       <span>AI recommendations</span>
                     </label>
                   </div>
                   <div className="setting-item">
                     <label className="checkbox-label">
                       <input type="checkbox" />
                       <span>Marketing emails</span>
                     </label>
                   </div>
                 </div>

                 <div className="settings-section">
                   <h3>Privacy</h3>
                   <div className="setting-item">
                     <label className="checkbox-label">
                       <input type="checkbox" defaultChecked />
                       <span>Allow AI to analyze browsing behavior</span>
                     </label>
                   </div>
                   <div className="setting-item">
                     <label className="checkbox-label">
                       <input type="checkbox" defaultChecked />
                       <span>Personalized product recommendations</span>
                     </label>
                   </div>
                 </div>

                 <div className="settings-section">
                   <h3>Account</h3>
                   <button className="settings-btn">Change Password</button>
                   <button className="settings-btn danger">Delete Account</button>
                 </div>
               </div>
             </div>
           )}
         </div>
       </div>

       {/* AI Recommendations based on user's order history */}
       <div className="profile-recommendations">
         <AIRecommendations title="Based on your purchase history" />
       </div>
     </div>
   </div>
 );
};

export default Profile;
