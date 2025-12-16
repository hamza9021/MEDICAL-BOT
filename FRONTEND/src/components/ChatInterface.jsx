import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Stethoscope, ShieldAlert } from 'lucide-react';
import axios from 'axios';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'system',
      content: 'My algorithms are designed to heal, but your smile is the only medicine that matters. Stay healthy, Mishu and keep smiling!💕🫠—my entire system depends on you.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL, {
        message: input
      });

      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.response
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to the server. Please ensure the backend is running."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200 my-4">
      {/* Header */}
      <div className="bg-teal-600 p-4 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Stethoscope size={24} />
          </div>
          <div>
            <h1 className="font-bold text-xl">MediChat AI</h1>
            <p className="text-teal-100 text-xs">Always verify with a professional</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs bg-teal-800/30 px-3 py-1 rounded-full border border-teal-500/30">
          <ShieldAlert size={14} />
          <span>Not for emergencies</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex max-w-[80%] gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white border border-slate-200 text-teal-600 shadow-sm'
                }`}
              >
                {msg.role === 'user' ? <User size={16} /> : <Bot size={18} />}
              </div>

              <div
                className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-teal-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start w-full">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-teal-600 shadow-sm flex items-center justify-center">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-slate-100">
        <form onSubmit={handleSubmit} className="flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms or ask a medical question..."
            className="flex-1 bg-slate-50 border-0 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center shadow-lg shadow-teal-600/20"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
