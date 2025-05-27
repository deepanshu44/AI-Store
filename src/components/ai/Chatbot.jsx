// src/components/ai/Chatbot.js
import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../../services/aiServices';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

const Chatbot = () => {
  const { user } = useAuth();
  const { cartItems, getCartTotal } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI shopping assistant. I can help you with product recommendations, order information, and answer any questions you have. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'greeting'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState([
    "Show me recommendations",
    "Help with my cart",
    "Track my order",
    "Return policy"
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && user && messages.length === 1) {
      // Personalized greeting for logged-in users
      const welcomeMessage = {
        id: Date.now(),
        text: `Welcome back, ${user.firstName}! I can see you have ${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} in your cart. Would you like to complete your purchase or need help finding something else?`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'personalized'
      };
      setMessages(prev => [...prev, welcomeMessage]);
    }
  }, [isOpen, user, cartItems.length]);

  const sendMessage = async (messageText = inputMessage, isQuickReply = false) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!isQuickReply) {
      setInputMessage('');
    }
    setIsTyping(true);

    try {
      const context = {
        user,
        cartItems,
        cartTotal: getCartTotal(),
        hasItems: cartItems.length > 0
      };

      const response = await aiService.getChatbotResponse(messageText, context);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.message,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: response.suggestions || [],
        actions: response.actions || []
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Update quick replies based on context
      if (response.quickReplies) {
        setQuickReplies(response.quickReplies);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply) => {
    sendMessage(reply, true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (message) => (
    <div key={message.id} className={`message ${message.sender}`}>
      <div className="message-avatar">
        {message.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
      </div>
      <div className="message-content">
        <div className="message-bubble">
          <p>{message.text}</p>
        </div>
        
        {/* Action buttons for bot messages */}
        {message.actions && message.actions.length > 0 && (
          <div className="message-actions">
            {message.actions.map((action, index) => (
              <button 
                key={index}
                className="action-btn"
                onClick={() => handleQuickReply(action.text)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
        
        <span className="message-time">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="chatbot-container">
      {/* Chat Toggle Button with notification */}
      <button 
        className={`chat-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && messages.length > 1 && (
          <span className="chat-notification"></span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`chat-window ${isMinimized ? 'minimized' : ''}`}>
          <div className="chat-header">
            <div className="chat-header-info">
              <Bot size={20} />
              <div>
                <span className="chat-title">AI Assistant</span>
                <span className="chat-status">Online</span>
              </div>
            </div>
            <div className="chat-header-controls">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="minimize-btn"
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="close-chat">
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="chat-messages">
                {messages.map(renderMessage)}
                
                {isTyping && (
                  <div className="message bot">
                    <div className="message-avatar">
                      <Bot size={16} />
                    </div>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {quickReplies.length > 0 && (
                <div className="quick-replies">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      className="quick-reply-btn"
                      onClick={() => handleQuickReply(reply)}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="chat-input-form">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="chat-input"
                  rows="1"
                  disabled={isTyping}
                />
                <button 
                  type="submit" 
                  className="chat-send-btn"
                  disabled={!inputMessage.trim() || isTyping}
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
// // src/components/ai/Chatbot.js
// import React, { useState } from 'react';
// import { aiService } from '../../services/aiServices';
// import { MessageCircle, Send, X, Bot, User } from 'lucide-react';

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hi! I'm your AI shopping assistant. How can I help you today?",
//       sender: 'bot',
//       timestamp: new Date()
//     }
//   ]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!inputMessage.trim()) return;

//     const userMessage = {
//       id: Date.now(),
//       text: inputMessage,
//       sender: 'user',
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
//     setIsTyping(true);

      
//       try {
//           const context = {
//               user,
//               cartItems,
//               cartTotal: getCartTotal(),
//               hasItems: cartItems.length > 0
//           };

//           const response = await aiService.getChatbotResponse(messageText, context);
          
//           const botMessage = {
//               id: Date.now() + 1,
//               text: response.message, // Make sure we're using response.message, not the entire response
//               sender: 'bot',
//               timestamp: new Date(),
//               suggestions: response.suggestions || [],
//               actions: response.actions || []
//           };
          
//           setMessages(prev => [...prev, botMessage]);
          
//           // Update quick replies based on context
//           if (response.quickReplies) {
//               setQuickReplies(response.quickReplies);
//           }
//       } catch (error) {
//           console.error('Chatbot error:', error);
//           const errorMessage = {
//               id: Date.now() + 1,
//               text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
//               sender: 'bot',
//               timestamp: new Date(),
//               type: 'error'
//           };
//           setMessages(prev => [...prev, errorMessage]);
//       } finally {
//           setIsTyping(false);
//       }
//     // try {
//     //   const response = await aiService.getChatbotResponse(inputMessage);
//     //   const botMessage = {
//     //     id: Date.now() + 1,
//     //     text: response,
//     //     sender: 'bot',
//     //     timestamp: new Date()
//     //   };
      
//     //   setMessages(prev => [...prev, botMessage]);
//     // } catch (error) {
//     //   console.error('Chatbot error:', error);
//     // } finally {
//     //   setIsTyping(false);
//     // }
//   };

//   return (
//     <div className="chatbot-container">
//       {/* Chat Toggle Button */}
//       <button 
//         className="chat-toggle-btn"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
//       </button>

//       {/* Chat Window */}
//       {isOpen && (
//         <div className="chat-window">
//           <div className="chat-header">
//             <Bot size={20} />
//             <span>AI Assistant</span>
//             <button onClick={() => setIsOpen(false)} className="close-chat">
//               <X size={18} />
//             </button>
//           </div>

//           <div className="chat-messages">
//             {messages.map(message => (
//               <div key={message.id} className={`message ${message.sender}`}>
//                 <div className="message-avatar">
//                   {message.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
//                 </div>
//                 <div className="message-content">
//                   <p>{message.text}</p>
//                   <span className="message-time">
//                     {message.timestamp.toLocaleTimeString([], { 
//                       hour: '2-digit', 
//                       minute: '2-digit' 
//                     })}
//                   </span>
//                 </div>
//               </div>
//             ))}
            
//             {isTyping && (
//               <div className="message bot">
//                 <div className="message-avatar">
//                   <Bot size={16} />
//                 </div>
//                 <div className="typing-indicator">
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//               </div>
//             )}
//           </div>

//           <form onSubmit={sendMessage} className="chat-input-form">
//             <input
//               type="text"
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               placeholder="Type your message..."
//               className="chat-input"
//             />
//             <button type="submit" className="chat-send-btn">
//               <Send size={18} />
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;
