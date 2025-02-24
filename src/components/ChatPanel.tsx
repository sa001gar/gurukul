import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2, Code2 } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'code';
  language?: string;
}

interface ChatPanelProps {
  onSendMessage: (message: string) => Promise<string>;
}

export function ChatPanel({ onSendMessage }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "👋 Hi! I'm your coding assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
    }
  }, [messages, isExpanded]);

  const formatMessage = (text: string): Message[] => {
    const messages: Message[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        messages.push({
          text: text.slice(lastIndex, match.index).trim(),
          isUser: false,
          timestamp: new Date(),
          type: 'text'
        });
      }

      messages.push({
        text: match[2].trim(),
        isUser: false,
        timestamp: new Date(),
        type: 'code',
        language: match[1] || 'plaintext'
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      messages.push({
        text: text.slice(lastIndex).trim(),
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      });
    }

    return messages.filter(m => m.text);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage = {
      text: newMessage,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await onSendMessage(newMessage);
      const formattedMessages = formatMessage(response);
      setMessages(prev => [...prev, ...formattedMessages]);
    } catch (error) {
      const errorMessage = {
        text: "I couldn't process that. Could you try again?",
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: Message) => {
    if (message.type === 'code') {
      return (
        <div className="relative group">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="text-xs font-mono bg-gray-700 text-white px-2 py-1 rounded">
              {message.language}
            </div>
          </div>
          <pre className="bg-gray-900 rounded-md p-3 overflow-x-auto">
            <code className="text-sm font-mono text-gray-100 whitespace-pre">
              {message.text}
            </code>
          </pre>
        </div>
      );
    }

    return (
      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
    );
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 w-80 transition-all duration-300 ease-in-out transform ${
        isExpanded ? 'h-[500px]' : 'h-12'
      } sm:w-96`}
    >
      <div className="bg-white rounded-lg shadow-lg h-full flex flex-col overflow-hidden border border-purple-100">
        <div 
          className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-600 to-purple-600 text-white cursor-pointer select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-1.5 rounded-full">
              <MessageSquare className="h-4 w-4" />
            </div>
            <span className="font-medium text-sm">Chat Assistant</span>
          </div>
          {isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="hover:bg-white/10 rounded-full p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {isExpanded && (
          <>
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3 space-y-3 scroll-smooth"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#E9D5FF transparent'
              }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 shadow-sm ${
                      message.isUser
                        ? 'bg-purple-600 text-white'
                        : 'bg-gradient-to-br from-orange-50 to-purple-50'
                    } ${message.type === 'code' ? 'w-full' : ''}`}
                  >
                    {renderMessage(message)}
                    <div className={`flex items-center gap-2 mt-1 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                      <span className={`text-[10px] ${message.isUser ? 'text-white/70' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.type === 'code' && (
                        <Code2 className={`h-3 w-3 ${message.isUser ? 'text-white/70' : 'text-gray-500'}`} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-gradient-to-br from-orange-50 to-purple-50 text-purple-600 rounded-lg p-2 flex items-center gap-2 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="border-t border-purple-100 p-3 bg-white">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  className="flex-1 rounded-full border border-purple-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                />
                <button
                  type="submit"
                  disabled={isLoading || !newMessage.trim()}
                  className="p-1.5 rounded-full bg-gradient-to-r from-orange-600 to-purple-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}