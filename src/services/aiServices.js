// src/services/aiServices.js (Updated chatbot methods)
import { mockProducts } from '../data/mockData';

class AIService {
  // ... (previous methods remain the same)
    delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }
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
  // Enhanced chatbot with context awareness
  async getChatbotResponse(message, context = {}) {
    await this.delay(500);
    
    const lowerMessage = message.toLowerCase();
    const { user, cartItems = [], cartTotal = 0, hasItems = false } = context;

    // Intent detection with more sophisticated logic
    const intent = this.detectIntent(lowerMessage);
    
    switch (intent) {
      case 'greeting':
        return this.getGreetingResponse(user);
      
      case 'cart_help':
        return this.getCartHelpResponse(cartItems, cartTotal, hasItems);
      
      case 'recommendations':
        return this.getRecommendationResponse(user);
      
      case 'order_tracking':
        return this.getOrderTrackingResponse(user);
      
      case 'shipping':
        return this.getShippingResponse();
      
      case 'returns':
        return this.getReturnsResponse();
      
      case 'product_search':
        return this.getProductSearchResponse(message);
      
      case 'pricing':
        return this.getPricingResponse();
      
      case 'support':
        return this.getSupportResponse();
      
      case 'checkout':
        return this.getCheckoutResponse(hasItems);
      
      default:
        return this.getDefaultResponse();
    }
  }

  detectIntent(message) {
    const intents = {
      greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
      cart_help: ['cart', 'basket', 'items', 'checkout', 'purchase'],
      recommendations: ['recommend', 'suggest', 'similar', 'like this', 'show me'],
      order_tracking: ['order', 'track', 'shipping', 'delivery', 'status'],
      shipping: ['ship', 'deliver', 'freight', 'send'],
      returns: ['return', 'refund', 'exchange', 'money back'],
      product_search: ['find', 'search', 'look for', 'where is'],
      pricing: ['price', 'cost', 'expensive', 'cheap', 'discount', 'sale'],
      support: ['help', 'support', 'problem', 'issue'],
      checkout: ['buy', 'purchase', 'complete order', 'pay']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }

  getGreetingResponse(user) {
    const responses = user 
      ? [
          `Hello ${user.firstName}! How can I help you with your shopping today?`,
          `Hi there! I see you're back. What can I assist you with?`,
          `Welcome back! Ready to find some great products?`
        ]
      : [
          "Hello! I'm here to help you find the perfect products. What are you looking for?",
          "Hi! I can help you with product recommendations, orders, and more. How can I assist?",
          "Welcome to AI Store! I'm your personal shopping assistant. What can I help you with?"
        ];

    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      quickReplies: ["Show recommendations", "Browse products", "Help with cart", "Track order"]
    };
  }

  getCartHelpResponse(cartItems, cartTotal, hasItems) {
    if (!hasItems) {
      return {
        message: "Your cart is currently empty. Would you like me to recommend some products or help you find something specific?",
        actions: [
          { label: "Get Recommendations", text: "Show me recommendations" },
          { label: "Browse Products", text: "Show me products" }
        ],
        quickReplies: ["Electronics", "Food & Beverages", "Furniture", "Popular items"]
      };
    }

    const itemCount = cartItems.length;
    const itemText = itemCount === 1 ? 'item' : 'items';
    
    return {
      message: `You have ${itemCount} ${itemText} in your cart totaling $${cartTotal.toFixed(2)}. Would you like to proceed to checkout, modify your cart, or need help with anything else?`,
      actions: [
        { label: "Proceed to Checkout", text: "Take me to checkout" },
        { label: "View Cart", text: "Show me my cart" }
      ],
      quickReplies: ["Checkout now", "Add more items", "Remove items", "Apply coupon"]
    };
  }

  getRecommendationResponse(user) {
    const preferences = user?.preferences || [];
    const hasPreferences = preferences.length > 0;
    
    return {
      message: hasPreferences 
        ? `Based on your interests in ${preferences.join(', ')}, I can show you some great products! What type of recommendations would you like?`
        : "I'd love to recommend some products for you! What categories interest you most, or would you like to see our popular items?",
      actions: [
        { label: "Popular Items", text: "Show popular products" },
        { label: "New Arrivals", text: "Show new products" }
      ],
      quickReplies: ["Electronics", "Home & Garden", "Fashion", "Books", "Sports"]
    };
  }

  getOrderTrackingResponse(user) {
    if (!user) {
      return {
        message: "To track your orders, please sign in to your account first. Once logged in, you can view all your order history and tracking information.",
        actions: [
          { label: "Sign In", text: "Take me to login" }
        ]
      };
    }

    // In a real app, you would fetch actual order data
    return {
      message: "I can help you track your orders! You can find detailed tracking information in your profile under 'Order History'. Would you like me to guide you there or help with something specific?",
      actions: [
        { label: "View Orders", text: "Show my orders" }
      ],
      quickReplies: ["Recent orders", "Delivery status", "Return an item"]
    };
  }

  getShippingResponse() {
    return {
      message: "We offer free shipping on orders over $50! Standard shipping takes 2-3 business days, and express shipping is available for next-day delivery. All orders are trackable once shipped.",
      quickReplies: ["Shipping costs", "Express delivery", "International shipping", "Track package"]
    };
  }

  getReturnsResponse() {
    return {
      message: "We have a hassle-free 30-day return policy! Items can be returned in original condition for a full refund. Electronics have a 15-day return window. Would you like help with a return?",
      actions: [
        { label: "Start Return", text: "I want to return an item" }
      ],
      quickReplies: ["Return process", "Refund timeline", "Exchange item", "Return shipping"]
    };
  }

  getProductSearchResponse(message) {
    // Extract potential product keywords
    const searchTerms = message.replace(/find|search|look for|where is/gi, '').trim();
    
    return {
      message: searchTerms 
        ? `I can help you find products related to "${searchTerms}". Let me search our catalog for you!`
        : "What specific product are you looking for? I can search our entire catalog to find exactly what you need.",
      actions: [
        { label: "Search Products", text: `Search for ${searchTerms}` }
      ],
      quickReplies: ["Electronics", "Home goods", "Fashion", "Books"]
    };
  }

  getPricingResponse() {
    return {
      message: "We offer competitive prices with regular sales and discounts! Sign up for our newsletter to get exclusive deals. We also have a price-match policy for identical products.",
      quickReplies: ["Current sales", "Price match", "Newsletter signup", "Bulk discounts"]
    };
  }

  getSupportResponse() {
    return {
      message: "I'm here to help! I can assist with orders, products, shipping, returns, and account questions. What specific issue can I help you resolve?",
      quickReplies: ["Order issues", "Product questions", "Account help", "Technical support"]
    };
  }

  getCheckoutResponse(hasItems) {
    if (!hasItems) {
      return {
        message: "You don't have any items in your cart yet. Would you like me to help you find some products first?",
        actions: [
          { label: "Browse Products", text: "Show me products" }
        ]
      };
    }

    return {
      message: "Great! I can help you complete your purchase. Make sure to review your items and apply any discount codes before checkout.",
      actions: [
        { label: "Go to Checkout", text: "Take me to checkout" }
      ],
      quickReplies: ["Apply coupon", "Check shipping", "Payment options", "Review cart"]
    };
  }

  getDefaultResponse() {
    const responses = [
      "I'd be happy to help! Can you tell me more about what you're looking for?",
      "I'm here to assist with your shopping needs. Could you be more specific about how I can help?",
      "Let me help you with that! What specific information do you need?",
      "I can help with products, orders, shipping, and more. What would you like to know?"
    ];

    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      quickReplies: ["Product recommendations", "Order help", "Shipping info", "Return policy"]
    };
  }
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
// // src/services/aiServices.js
// import { mockProducts } from '../data/mockData';

// class AIService {
//   // Simulate API delay
//   async delay(ms = 800) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

//   // Mock personalized recommendations
//   async getPersonalizedRecommendations(userId, userPreferences = [], currentProduct = null) {
//     await this.delay();
    
//     let recommendations = [...mockProducts];
    
//     // Filter out current product if viewing product detail
//     if (currentProduct) {
//       recommendations = recommendations.filter(p => p.id !== currentProduct.id);
//     }
    
//     // Simple recommendation logic based on preferences and categories
//     if (userPreferences.length > 0) {
//       recommendations.sort((a, b) => {
//         const aScore = userPreferences.some(pref => 
//           a.category.includes(pref) || a.tags.some(tag => tag.includes(pref))
//         ) ? 1 : 0;
//         const bScore = userPreferences.some(pref => 
//           b.category.includes(pref) || b.tags.some(tag => tag.includes(pref))
//         ) ? 1 : 0;
//         return bScore - aScore;
//       });
//     }
    
//     return recommendations.slice(0, 4);
//   }

//   // Mock AI-powered search
//   async intelligentSearch(query, filters = {}) {
//     await this.delay(300);
    
//     if (!query && Object.keys(filters).length === 0) {
//       return mockProducts;
//     }
    
//     let results = mockProducts.filter(product => {
//       // Text search in name, description, and tags
//       const searchText = query.toLowerCase();
//       const matchesQuery = !query || 
//         product.name.toLowerCase().includes(searchText) ||
//         product.description.toLowerCase().includes(searchText) ||
//         product.tags.some(tag => tag.toLowerCase().includes(searchText)) ||
//         product.category.toLowerCase().includes(searchText);
      
//       // Category filter
//       const matchesCategory = !filters.category || product.category === filters.category;
      
//       // Price range filter
//       const matchesPrice = (!filters.minPrice || product.price >= filters.minPrice) &&
//                           (!filters.maxPrice || product.price <= filters.maxPrice);
      
//       return matchesQuery && matchesCategory && matchesPrice;
//     });
    
//     // Sort by relevance (simple scoring)
//     if (query) {
//       results.sort((a, b) => {
//         const aScore = this.calculateRelevanceScore(a, query);
//         const bScore = this.calculateRelevanceScore(b, query);
//         return bScore - aScore;
//       });
//     }
    
//     return results;
//   }

//   calculateRelevanceScore(product, query) {
//     const searchText = query.toLowerCase();
//     let score = 0;
    
//     // Name match gets highest score
//     if (product.name.toLowerCase().includes(searchText)) score += 10;
    
//     // Category match
//     if (product.category.toLowerCase().includes(searchText)) score += 5;
    
//     // Tag matches
//     product.tags.forEach(tag => {
//       if (tag.toLowerCase().includes(searchText)) score += 3;
//     });
    
//     // Description match
//     if (product.description.toLowerCase().includes(searchText)) score += 1;
    
//     return score;
//   }

//   // Mock chatbot responses
//   async getChatbotResponse(message) {
//     await this.delay(500);
    
//     const lowerMessage = message.toLowerCase();
    
//     if (lowerMessage.includes('order') || lowerMessage.includes('shipping')) {
//       return "I can help you with order information! Orders typically ship within 2-3 business days. You can track your order in your profile page once it's shipped.";
//     }
    
//     if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
//       return "We offer a 30-day return policy for all items. You can initiate a return from your order history or contact our support team.";
//     }
    
//     if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
//       return "I'd be happy to recommend products! Based on popular items, I suggest checking out our wireless headphones or fitness watches. What category interests you most?";
//     }
    
//     if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
//       return "Our prices are competitive and we often have special deals! Check out our current promotions on the homepage or sign up for our newsletter for exclusive discounts.";
//     }
    
//     return "Thanks for your question! I'm here to help with orders, returns, product recommendations, and general shopping assistance. How can I help you today?";
//   }

//   // Mock frequently bought together
//   getFrequentlyBoughtTogether(productId) {
//     const currentProduct = mockProducts.find(p => p.id === productId);
//     if (!currentProduct) return [];
    
//     // Simple logic: return products from same category
//     return mockProducts
//       .filter(p => p.id !== productId && p.category === currentProduct.category)
//       .slice(0, 2);
//   }
// }

// // export const aiService = new AIService();
