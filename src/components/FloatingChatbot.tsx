
import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Chat from '@/components/Chat';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-[380px] h-[600px] max-h-[80vh] flex flex-col overflow-hidden animate-fade-in-up">
          <div className="bg-dental-blue p-3 text-white flex justify-between items-center">
            <h3 className="font-medium">SmileSmart Assistant</h3>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-dental-dark-blue">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <Chat />
          </div>
        </div>
      ) : (
        <Button 
          onClick={toggleChat}
          className="rounded-full w-14 h-14 shadow-lg bg-dental-blue hover:bg-dental-dark-blue"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default FloatingChatbot;
