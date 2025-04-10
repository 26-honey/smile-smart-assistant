
import React, { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizontal, Mic, Calendar } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onRequestAppointment: () => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onRequestAppointment,
  disabled = false
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-end gap-2 bg-white p-3 border-t rounded-b-lg">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 text-dental-teal hover:text-dental-teal hover:bg-dental-teal/10 border-dental-teal/30"
        onClick={onRequestAppointment}
        title="Schedule appointment"
      >
        <Calendar className="h-5 w-5" />
      </Button>
      
      <div className="relative flex-1">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me about dental care or schedule an appointment..."
          className="pr-10 py-6 bg-muted/50"
          disabled={disabled}
        />
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 bottom-0 h-full text-dental-dark-blue hover:text-dental-teal"
          onClick={handleSubmit}
          disabled={!message.trim() || disabled}
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 text-dental-teal hover:text-dental-teal hover:bg-dental-teal/10 border-dental-teal/30"
        title="Voice input (coming soon)"
        disabled={true}
      >
        <Mic className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatInput;
