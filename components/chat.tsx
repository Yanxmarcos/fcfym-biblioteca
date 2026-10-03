"use client";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
export const ChatWidget = () => {
    const [showChat, setShowChat] = useState(false);
    const [showHelpChat, setShowHelpChat] = useState(false);
    const [messages, setMessages] = useState<Array<{
        text: string;
        sender: 'user' | 'bot';
    }>>([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const toggleChat = () => {
        setShowChat(!showChat);
        if (!showChat) {
            setShowHelpChat(false);
            setMessages([]);
        }
    };
    const startHelpChat = () => {
        setShowHelpChat(true);
        setMessages([{ text: "Hola, ¿En qué puedo ayudarte?", sender: 'bot' }]);
    };
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
            setInputValue('');
            setTimeout(() => {
                setMessages(prev => [...prev, { text: "Hola, ¿En qué puedo ayudarte?", sender: 'bot' }]);
            }, 500);
        }
    };
    const closeHelpChat = () => {
        setShowHelpChat(false);
        setMessages([]);
    };
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    return (<div className="fixed bottom-8 right-8 z-50">
      {showChat && (<div className="mb-4 bg-secondary rounded-lg shadow-lg border-4 border-coral-light p-4 w-80 max-h-[500px] flex flex-col">
          {!showHelpChat ? (<>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-coral-dark"/>
                  <span className="font-medium text-coral-dark">
                    ¿Necesitas ayuda personalizada?
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={toggleChat} className="p-1 hover:bg-muted">
                  <X className="w-4 h-4 text-coral-dark"/>
                </Button>
              </div>
              <Button className="w-full bg-coral text-primary-foreground hover:bg-coral-dark" onClick={startHelpChat}>
                Click aquí para ayuda personalizada
              </Button>
            </>) : (<>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-coral-light">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-coral-dark"/>
                  <span className="font-medium text-coral-dark">
                    Chat de Ayuda
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={closeHelpChat} className="p-1 hover:bg-muted">
                  <X className="w-4 h-4 text-coral-dark"/>
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto mb-3 space-y-2 max-h-[300px]">
                {messages.map((message, index) => (<div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg px-3 py-2 ${message.sender === 'user'
                        ? 'bg-coral text-white rounded-br-none'
                        : 'bg-gray-300 text-gray-800 rounded-bl-none'}`}>
                      {message.text}
                    </div>
                  </div>))}
                <div ref={messagesEndRef}/>
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Escribe tu mensaje..." className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coral-light" aria-label="Escribe tu mensaje"/>
                <Button type="submit" className="bg-coral text-primary-foreground hover:bg-coral-dark" disabled={!inputValue.trim()}>
                  <Send className="w-4 h-4"/>
                </Button>
              </form>
            </>)}
        </div>)}

      <Button onClick={toggleChat} className="bg-coral rounded-full shadow-lg w-14 h-14 p-0" aria-label={showChat ? "Cerrar chat" : "Abrir chat"}>
        {showChat ? (<X className="w-6 h-6"/>) : (<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-question">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <path d="M12 17h.01"/>
          </svg>)}
      </Button>
    </div>);
};
