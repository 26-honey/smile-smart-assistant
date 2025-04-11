
import React, { useState, useCallback, useEffect } from 'react';
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

  // Track and display console logs in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Chat component initialized. Ready to process dental queries.');
    }
  }, []);

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
    
    // Show AI is processing
    setProcessing(true);
    
    try {
      console.log('Sending message:', message);
      // Get AI response
      const response = await getResponse(message);
      console.log('Received response:', response.substring(0, 50) + '...');
      addMessage(response, 'assistant');
    } catch (error) {
      console.error('Error getting response:', error);
      addMessage("I'm sorry, I'm having trouble connecting right now. Please try again in a moment.", 'assistant');
    } finally {
      setProcessing(false);
    }
  }, [addMessage]);

  const handleRequestAppointment = useCallback(() => {
    setAppointmentModalOpen(true);
  }, []);

  const handleScheduleAppointment = useCallback(async (details: AppointmentDetails) => {
    // Close the modal
    setAppointmentModalOpen(false);
    
    // Add user message about scheduling
    const userMessage = `I'd like to schedule an appointment on ${details.date?.toLocaleDateString()} at ${details.time} with ${details.dentist} for ${details.reason}.`;
    addMessage(userMessage, 'user');
    
    // Show AI is processing
    setProcessing(true);
    
    try {
      console.log('Scheduling appointment:', details);
      // Get appointment confirmation response
      const response = await getAppointmentResponse(details);
      addMessage(response, 'assistant');
      
      // Show toast notification
      toast({
        title: "Appointment Scheduled",
        description: `Your appointment with ${details.dentist} on ${details.date?.toLocaleDateString()} at ${details.time} has been confirmed.`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      addMessage("I'm sorry, there was an issue scheduling your appointment. Please try again or contact our office directly.", 'assistant');
    } finally {
      setProcessing(false);
    }
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
