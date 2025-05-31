// src/components/ai/AIRecommendations.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/aiServices';
import ProductCard from '../products/ProductCard';
import { Sparkles } from 'lucide-react';

const AIRecommendations = ({ currentProduct = null, title = "Recommended for You" }) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const userPreferences = user?.preferences || [];
        const recs = await aiService.getPersonalizedRecommendations(
          user?.id, 
          userPreferences, 
          currentProduct
        );
        setRecommendations(recs);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
    window.scrollTo(0,0)
  }, [user, currentProduct]);

  if (loading) {
    return (
      <div className="ai-recommendations">
        <div className="section-header">
          <Sparkles className="ai-icon" />
          <h2>{title}</h2>
        </div>
        <div className="loading-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="product-card-skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="ai-recommendations">
      <div className="section-header">
        <Sparkles className="ai-icon" />
        <h2>{title}</h2>
        <span className="ai-badge">AI Powered</span>
      </div>
      
      <div className="products-grid">
        {recommendations.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
