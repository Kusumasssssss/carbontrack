import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
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
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={24} className="text-white" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-brand-600 to-indigo-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">AI Coach</h3>
                  <p className="text-brand-100 text-xs opacity-80">Powered by Gemini</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-800/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 flex-shrink-0 flex items-center justify-center mt-1 border border-brand-500/30">
                      <Bot size={16} className="text-brand-400" />
                    </div>
                  )}
                  <div 
                    className={`px-4 py-2.5 rounded-2xl max-w-[75%] text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-brand-600 text-white rounded-tr-sm' 
                        : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 flex-shrink-0 flex items-center justify-center mt-1 border border-brand-500/30">
                    <Bot size={16} className="text-brand-400" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 rounded-tl-sm flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Language Selection */}
            <div className="px-3 pt-2 bg-slate-900">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 mb-2"
              >
                <option value="en">🇺🇸 English</option>
                <option value="hi">🇮🇳 Hindi</option>
                <option value="kn">ಕರ್ನಾಟಕ Kannada</option>
                <option value="te">తెలుగు Telugu</option>
                <option value="ta">தமிழ் Tamil</option>
              </select>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about reducing emissions..."
                className="flex-1 bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all placeholder-slate-500"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-500 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
