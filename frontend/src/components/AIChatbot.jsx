import { useState, useRef, useEffect } from "react";
import api from "../api/axios";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaShoppingBag,
  FaTrash,
} from "react-icons/fa";
import "../styles/AIChatbot.css";

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am SmartShop AI 🤖. Ask me to find products, recommend items under a budget, or search categories!",
      products: [],
    },
  ]);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputMsg.trim() || loading) return;

    const userText = inputMsg.trim();
    setInputMsg("");

    // Add User Message
    const updatedMessages = [
      ...messages,
      { sender: "user", text: userText, products: [] },
    ];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Query search endpoint
      const response = await api.get(
        `/search?query=${encodeURIComponent(userText)}`
      );

      let foundProducts = [];
      let replyText = "";

      if (Array.isArray(response.data) && response.data.length > 0) {
        foundProducts = response.data.slice(0, 3);
        replyText = `I found ${response.data.length} products matching "${userText}". Here are top picks for you:`;
      } else {
        replyText = `Sorry, I couldn't find exact products matching "${userText}". Try searching for categories like "Skin Care", "Kitchen", "Hair Care", or "Electronics".`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: replyText,
          products: foundProducts,
        },
      ]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Oops! Something went wrong querying AI recommendations. Please try again.",
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "ai",
        text: "Chat history cleared. How else can I assist your shopping today?",
        products: [],
      },
    ]);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.asin === product.asin);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="ai-chatbot-wrapper">
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          className="chatbot-trigger-btn"
          onClick={() => setIsOpen(true)}
          title="Ask SmartShop AI"
        >
          <FaRobot className="bot-icon-spin" />
          <span>Ask AI</span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="bot-header-badge">
                <FaRobot />
              </span>
              <div>
                <h4>SmartShop AI Assistant</h4>
                <p>Powered by FastAPI & Cosine Similarity</p>
              </div>
            </div>

            <div className="chatbot-header-actions">
              <button
                className="chat-action-btn"
                onClick={clearChat}
                title="Clear Chat"
              >
                <FaTrash />
              </button>
              <button
                className="chat-action-btn"
                onClick={() => setIsOpen(false)}
                title="Close Chat"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble-container ${
                  msg.sender === "user" ? "user-msg" : "ai-msg"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="avatar">
                    <FaRobot />
                  </div>
                )}

                <div className="chat-bubble">
                  <p>{msg.text}</p>

                  {/* Recommended Products Cards inside Chat */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="chat-products-list">
                      {msg.products.map((prod) => (
                        <div key={prod.asin} className="chat-prod-card">
                          <img
                            src={
                              prod.image ||
                              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
                            }
                            alt={prod.title}
                          />
                          <div className="chat-prod-info">
                            <h5>{prod.title}</h5>
                            <span className="price">
                              ₹{Number(prod.price).toLocaleString("en-IN")}
                            </span>
                            <button
                              className="chat-cart-btn"
                              onClick={() => addToCart(prod)}
                            >
                              <FaShoppingBag /> Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-bubble-container ai-msg">
                <div className="avatar">
                  <FaRobot />
                </div>
                <div className="chat-bubble loading-bubble">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <div className="chatbot-footer">
            <input
              type="text"
              placeholder="Ask AI e.g. 'Show me hair creams'..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button className="chat-send-btn" onClick={handleSend}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIChatbot;
