// src/services/aiServices.js
import { mockProducts } from '../data/mockData';

class AIService {
  // Simulate API delay
  async delay(ms = 800) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock personalized recommendations
  async getPersonalizedRecommendations(userId, userPreferences = [], currentProduct = null) {
    await this.delay();
    
    let recommendations = [...mockProducts];
    
    // Filter out current product if viewing product detail
    if (currentProduct) {
      recommendations = recommendations.filter(p => p.id !== currentProduct.id);
    }
    
    // Simple recommendation logic based on preferences and categories
    if (userPreferences.length > 0) {
      recommendations.sort((a, b) => {
        const aScore = userPreferences.some(pref => 
          a.category.includes(pref) || a.tags.some(tag => tag.includes(pref))
        ) ? 1 : 0;
        const bScore = userPreferences.some(pref => 
          b.category.includes(pref) || b.tags.some(tag => tag.includes(pref))
        ) ? 1 : 0;
        return bScore - aScore;
      });
    }
    
    return recommendations.slice(0, 4);
  }

  // Mock AI-powered search
  async intelligentSearch(query, filters = {}) {
    await this.delay(300);
    
    if (!query && Object.keys(filters).length === 0) {
      return mockProducts;
    }
    
    let results = mockProducts.filter(product => {
      // Text search in name, description, and tags
      const searchText = query.toLowerCase();
      const matchesQuery = !query || 
        product.name.toLowerCase().includes(searchText) ||
        product.description.toLowerCase().includes(searchText) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchText)) ||
        product.category.toLowerCase().includes(searchText);
      
      // Category filter
      const matchesCategory = !filters.category || product.category === filters.category;
      
      // Price range filter
      const matchesPrice = (!filters.minPrice || product.price >= filters.minPrice) &&
                          (!filters.maxPrice || product.price <= filters.maxPrice);
      
      return matchesQuery && matchesCategory && matchesPrice;
    });
    
    // Sort by relevance (simple scoring)
    if (query) {
      results.sort((a, b) => {
        const aScore = this.calculateRelevanceScore(a, query);
        const bScore = this.calculateRelevanceScore(b, query);
        return bScore - aScore;
      });
    }
    
    return results;
  }

  calculateRelevanceScore(product, query) {
    const searchText = query.toLowerCase();
    let score = 0;
    
    // Name match gets highest score
    if (product.name.toLowerCase().includes(searchText)) score += 10;
    
    // Category match
    if (product.category.toLowerCase().includes(searchText)) score += 5;
    
    // Tag matches
    product.tags.forEach(tag => {
      if (tag.toLowerCase().includes(searchText)) score += 3;
    });
    
    // Description match
    if (product.description.toLowerCase().includes(searchText)) score += 1;
    
    return score;
  }

  // Mock chatbot responses
  async getChatbotResponse(message) {
    await this.delay(500);
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('order') || lowerMessage.includes('shipping')) {
      return "I can help you with order information! Orders typically ship within 2-3 business days. You can track your order in your profile page once it's shipped.";
    }
    
    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return "We offer a 30-day return policy for all items. You can initiate a return from your order history or contact our support team.";
    }
    
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      return "I'd be happy to recommend products! Based on popular items, I suggest checking out our wireless headphones or fitness watches. What category interests you most?";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "Our prices are competitive and we often have special deals! Check out our current promotions on the homepage or sign up for our newsletter for exclusive discounts.";
    }
    
    return "Thanks for your question! I'm here to help with orders, returns, product recommendations, and general shopping assistance. How can I help you today?";
  }

  // Mock frequently bought together
  getFrequentlyBoughtTogether(productId) {
    const currentProduct = mockProducts.find(p => p.id === productId);
    if (!currentProduct) return [];
    
    // Simple logic: return products from same category
    return mockProducts
      .filter(p => p.id !== productId && p.category === currentProduct.category)
      .slice(0, 2);
  }
}

export const aiService = new AIService();
