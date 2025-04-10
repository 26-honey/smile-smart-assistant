
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatHistory, { ChatMessageItem } from './ChatHistory';
import ChatInput from './ChatInput';
import AppointmentModal, { AppointmentDetails } from './AppointmentModal';
import { getResponse, getAppointmentResponse } from '@/utils/chatService';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: uuidv4(),
      text: "Hello! I'm your SmileSmartAssistant. How can I help with your dental care today?",
      type: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const addMessage = useCallback((text: string, type: 'user' | 'assistant') => {
    const newMessage: ChatMessageItem = {
      id: uuidv4(),
      text,
      type,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    // Add user message
    addMessage(message, 'user');
    
    // Simulate AI processing
    setProcessing(true);
    
    setTimeout(() => {
      // Get AI response
      const response = getResponse(message);
      addMessage(response, 'assistant');
      setProcessing(false);
    }, 1000);
  }, [addMessage]);

  const handleRequestAppointment = useCallback(() => {
    setAppointmentModalOpen(true);
  }, []);

  const handleScheduleAppointment = useCallback((details: AppointmentDetails) => {
    // Close the modal
    setAppointmentModalOpen(false);
    
    // Add user message about scheduling
    const userMessage = `I'd like to schedule an appointment on ${details.date?.toLocaleDateString()} at ${details.time} with ${details.dentist} for ${details.reason}.`;
    addMessage(userMessage, 'user');
    
    // Simulate AI processing
    setProcessing(true);
    
    setTimeout(() => {
      // Get appointment confirmation response
      const response = getAppointmentResponse(details);
      addMessage(response, 'assistant');
      setProcessing(false);
      
      // Show toast notification
      toast({
        title: "Appointment Scheduled",
        description: `Your appointment with ${details.dentist} on ${details.date?.toLocaleDateString()} at ${details.time} has been confirmed.`,
        duration: 5000,
      });
    }, 1000);
  }, [addMessage, toast]);

  return (
    <Card className="flex flex-col w-full h-[80vh] max-w-3xl mx-auto overflow-hidden">
      <ChatHistory messages={messages} />
      <ChatInput 
        onSendMessage={handleSendMessage} 
        onRequestAppointment={handleRequestAppointment}
        disabled={processing}
      />
      <AppointmentModal
        open={appointmentModalOpen}
        onOpenChange={setAppointmentModalOpen}
        onSchedule={handleScheduleAppointment}
      />
    </Card>
  );
};

export default Chat;
