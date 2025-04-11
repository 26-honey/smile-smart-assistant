
import { supabase } from '@/integrations/supabase/client';
import { getFAQsText, getDoctorsText, getHospitalsText, getInsuranceText, 
         getDoctorsBySpecialty, getAvailableDays, checkInsuranceValidity } from './dataService';

export type MessageIntent = 'general' | 'appointment' | 'insurance' | 'doctor' | 'hospital' | 'greeting';

// Detect message intent
export const detectIntent = async (message: string): Promise<MessageIntent> => {
  try {
    const { data, error } = await supabase.functions.invoke('detect-intent', {
      body: { message }
    });
    
    if (error) throw error;
    return data.intent;
  } catch (error) {
    console.error('Error detecting intent:', error);
    return 'general';
  }
};

// Generate response based on message and intent
export const generateResponse = async (message: string, intent: MessageIntent): Promise<string> => {
  try {
    // Create context based on intent
    let context = '';
    
    switch (intent) {
      case 'appointment':
        context = `${getFAQsText()}\n\n${getDoctorsText()}`;
        break;
      case 'insurance':
        context = getInsuranceText();
        break;
      case 'doctor':
        context = getDoctorsText();
        break;
      case 'hospital':
        context = getHospitalsText();
        break;
      case 'greeting':
        // No context needed for greetings
        break;
      default:
        context = getFAQsText();
    }

    const { data, error } = await supabase.functions.invoke('generate-response', {
      body: { 
        message,
        context,
        intent
      }
    });
    
    if (error) throw error;
    return data.response;
  } catch (error) {
    console.error('Error generating response:', error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
};

// Function to generate appointment-specific responses
export const getAppointmentResponse = async (details: any): Promise<string> => {
  try {
    // Get relevant doctor information
    const specialtyDoctors = getDoctorsBySpecialty(details.reason === "Regular Checkup" ? "Endodontics" : "Orthodontics");
    const availableDays = getAvailableDays(details.dentist);
    
    const { data, error } = await supabase.functions.invoke('generate-appointment-response', {
      body: { 
        details,
        specialtyDoctors,
        availableDays
      }
    });
    
    if (error) throw error;
    return data.response;
  } catch (error) {
    console.error('Error generating appointment response:', error);
    
    // Fallback response if the edge function fails
    const appointmentDate = details.date ? new Date(details.date) : new Date();
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    return `Great! Your appointment with ${details.dentist} has been scheduled for ${formattedDate} at ${details.time} for ${details.reason}. A confirmation email has been sent to ${details.email}. If you need to reschedule or have any questions, just let me know!`;
  }
};
