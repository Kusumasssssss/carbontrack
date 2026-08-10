import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAuth } from '../api';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI Sustainability Coach. How can I help you reduce your carbon footprint today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message to state
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setIsLoading(true);

    try {
      // Build conversation history context
      const conversationHistory = messages
        .map(m => `${m.sender === 'ai' ? 'Coach' : 'User'}: ${m.text}`)
        .join('\n');

      const fullContext = conversationHistory + `\nUser: ${userMessage}`;

      const res = await fetchAuth('/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: fullContext,
          language: language
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { text: data.response, sender: 'ai' }]);
      } else {
        setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to my servers.", sender: 'ai' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { text: "Sorry, a network error occurred.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-brand flex items-center justify-center shadow-[0_10px_30px_rgba(34,194,116,0.35)] z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={22} className="text-white" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[520px] bg-surface-card border border-surface-border rounded-2xl shadow-card-hover z-50 flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-brand p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                    AI Coach <Sparkles size={13} className="text-white/80" />
                  </h3>
                  <p className="text-white/75 text-xs">Your sustainability assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/15 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-surface-base custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-brand-50 flex-shrink-0 flex items-center justify-center mt-1 border border-brand-100">
                      <Bot size={16} className="text-brand-600" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl max-w-[75%] text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-brand text-white rounded-tr-sm'
                        : 'bg-surface-card border border-surface-border text-ink-700 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-brand-50 flex-shrink-0 flex items-center justify-center mt-1 border border-brand-100">
                    <Bot size={16} className="text-brand-600" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-surface-card border border-surface-border rounded-tl-sm flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Language Selection */}
            <div className="px-3 pt-2 bg-surface-card border-t border-surface-border">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-surface-panel border border-surface-border text-ink-700 text-sm rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-1 focus:ring-brand-400"
              >
                <option value="en">🇺🇸 English</option>
                <option value="hi">🇮🇳 Hindi</option>
                <option value="kn">ಕರ್ನಾಟಕ Kannada</option>
                <option value="te">తెలుగు Telugu</option>
                <option value="ta">தமிழ் Tamil</option>
              </select>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="p-3 bg-surface-card border-t border-surface-border flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about reducing emissions..."
                className="flex-1 bg-surface-panel border border-surface-border text-ink-900 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-400 transition-all placeholder-ink-300"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-brand hover:opacity-90 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;
