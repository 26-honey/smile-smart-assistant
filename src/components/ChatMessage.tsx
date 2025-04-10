
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { Stethoscope } from 'lucide-react';

export type MessageType = 'user' | 'assistant';

interface ChatMessageProps {
  message: string;
  type: MessageType;
  timestamp: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, type, timestamp }) => {
  const isUser = type === 'user';
  const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className={cn("flex items-start gap-2 mb-4", isUser ? "flex-row-reverse" : "")}>
      <Avatar className={cn("mt-0.5", isUser ? "bg-dental-blue" : "bg-dental-teal")}>
        {isUser ? (
          <AvatarFallback className="text-white">U</AvatarFallback>
        ) : (
          <>
            <AvatarImage src="/tooth-icon.png" alt="Dental Assistant" />
            <AvatarFallback className="text-white bg-dental-teal">
              <Stethoscope className="h-5 w-5" />
            </AvatarFallback>
          </>
        )}
      </Avatar>
      
      <div className="flex flex-col">
        <div className={isUser ? "chat-bubble-user" : "chat-bubble-assistant"}>
          {message}
        </div>
        <span className={cn("text-xs text-muted-foreground mt-1", isUser ? "text-right" : "")}>
          {formattedTime}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
