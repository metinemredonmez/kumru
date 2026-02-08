"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // İlk açıldığında karşılama mesajı
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = language === 'tr'
        ? "Merhaba! Ben Kumru Köseler'in dijital asistanıyım. Size nasıl yardımcı olabilirim? Koçluk programları, retreat'ler veya randevu hakkında sorularınızı yanıtlayabilirim."
        : "Hello! I'm Kumru Köseler's digital assistant. How can I help you? I can answer your questions about coaching programs, retreats, or appointments.";

      setMessages([{ role: "assistant", content: welcomeMessage }]);
    }
  }, [isOpen, language, messages.length]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("https://kumrukoseler.com/api/chat.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          language
        }),
      });

      const data = await response.json();

      if (data.message) {
        setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
      } else {
        throw new Error("No response");
      }
    } catch {
      const errorMsg = language === 'tr'
        ? "Üzgünüm, bir hata oluştu. Lütfen WhatsApp üzerinden bize ulaşın."
        : "Sorry, an error occurred. Please contact us via WhatsApp.";
      setMessages(prev => [...prev, { role: "assistant", content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      >
        {isOpen ? (
          <div className="w-14 h-14 rounded-full bg-[var(--dark)] flex items-center justify-center">
            <X size={24} className="text-white" />
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-gradient-to-r from-[var(--indigo)] to-[var(--purple)] pl-1.5 pr-5 py-1.5 rounded-full">
            <img
              src="/logo.png"
              alt="Kumru Köseler"
              className="w-10 h-10 rounded-full object-cover bg-white p-1"
            />
            <span className="text-white font-semibold">
              {language === 'tr' ? 'Merhaba!' : 'Hello!'}
            </span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl overflow-hidden border border-[var(--lavender)]/30">
          {/* Header */}
          <div className="bg-gradient-to-r from-[var(--indigo)] to-[var(--purple)] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Kumru Köseler</h3>
                <p className="text-white/70 text-xs">
                  {language === 'tr' ? 'Dijital Asistan' : 'Digital Assistant'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-[var(--soft)]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-[var(--indigo)] text-white rounded-br-md"
                      : "bg-white text-[var(--dark)] rounded-bl-md shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm">
                  <Loader2 size={20} className="text-[var(--indigo)] animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-[var(--lavender)]/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === 'tr' ? "Mesajınızı yazın..." : "Type your message..."}
                className="flex-1 px-4 py-2 rounded-full border border-[var(--lavender)] focus:outline-none focus:ring-2 focus:ring-[var(--indigo)] text-sm bg-white text-[var(--dark)]"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-full bg-[var(--indigo)] text-white flex items-center justify-center hover:bg-[var(--purple)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] text-center mt-2">
              {language === 'tr'
                ? 'Hızlı yanıt için WhatsApp: +90 534 367 56 69'
                : 'Quick response via WhatsApp: +90 534 367 56 69'
              }
            </p>
          </div>
        </div>
      )}
    </>
  );
}
