
import React, { useEffect, useRef } from 'react';
import ChatMessage, { MessageType } from './ChatMessage';

export interface ChatMessageItem {
  id: string;
  text: string;
  type: MessageType;
  timestamp: Date;
}

interface ChatHistoryProps {
  messages: ChatMessageItem[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-dental-teal/20 scrollbar-track-transparent">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-6">
          <div className="mb-4 bg-dental-teal/10 rounded-full p-4">
            <img src="/tooth-icon.png" alt="Dental Assistant" className="w-16 h-16" />
          </div>
          <h3 className="text-xl font-medium text-dental-dark-blue mb-2">SmileSmartAssistant</h3>
          <p className="text-muted-foreground max-w-md">
            Hi! I'm your personal dental assistant. Ask me about dental services, schedule appointments, or get answers to your dental care questions.
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            type={message.type}
            timestamp={message.timestamp}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatHistory;
