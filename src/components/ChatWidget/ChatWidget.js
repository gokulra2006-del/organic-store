import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Leaf } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! 🌿 Welcome to Organic Store. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (textToSend) => {
    const msgText = textToSend || input;
    if (!msgText.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: msgText }]);
    if (!textToSend) setInput("");

    // Simulate bot response
    setTimeout(() => {
      let reply = "I am a simple virtual assistant. If you want to track your order, please log into your Account page.";
      const lower = msgText.toLowerCase();
      if (lower.includes("order") || lower.includes("track")) {
        reply = "You can view your order tracking details directly on the Orders tab of your Account workspace! 📦";
      } else if (lower.includes("delivery") || lower.includes("shipping")) {
        reply = "We offer lightning fast 10-minute delivery for all locations within our service zones! 🛵 Delivery is free for orders over $30.";
      } else if (lower.includes("fresh") || lower.includes("organic") || lower.includes("source")) {
        reply = "All our produce is sourced from local, certified organic farms close to the communities we serve. Picked fresh every morning! ☀️";
      } else if (lower.includes("human") || lower.includes("agent") || lower.includes("support")) {
        reply = "Connecting you to a support specialist... Actually, they're currently offline, but you can leave a note at our Contact Us page! ✉️";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#153d2b] text-white shadow-xl hover:bg-emerald-800 hover:scale-105 active:scale-95 transition-all duration-250 cursor-pointer"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[480px] rounded-3xl border border-stone-200 bg-white shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-[#153d2b] px-5 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                <Leaf size={16} className="text-lime-300" />
              </span>
              <div>
                <h3 className="font-extrabold text-sm leading-none">Organic Standard</h3>
                <p className="text-[10px] text-emerald-200/80 font-bold mt-1">Virtual Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fbfcf9]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs font-bold leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#153d2b] text-white"
                      : "bg-stone-100 text-stone-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          <div className="p-3 bg-white border-t border-stone-100 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {["Track order", "Delivery zones", "Talk to agent"].map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="shrink-0 bg-stone-50 border border-stone-200 text-stone-600 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 rounded-lg px-2.5 py-1.5 text-[10px] font-black transition cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 border-t border-stone-200 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 min-h-10 px-4 rounded-xl border border-stone-200 bg-stone-50 outline-none text-xs font-bold transition focus:border-emerald-500 focus:bg-white"
            />
            <button
              type="submit"
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#153d2b] text-white hover:bg-emerald-800 transition active:scale-95 shrink-0"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
