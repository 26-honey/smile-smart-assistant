
import { AppointmentDetails } from "@/components/AppointmentModal";
import { detectIntent, generateResponse, getAppointmentResponse as generateAppointmentResponse } from "./ragService";

// Function to get response based on user message
const getResponse = async (message: string): Promise<string> => {
  try {
    // Detect the intent of the message
    const intent = await detectIntent(message);
    
    // Generate a response based on the intent and message
    return await generateResponse(message, intent);
  } catch (error) {
    console.error('Error in getResponse:', error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
  }
};

// Function for appointment responses
const getAppointmentResponse = async (details: AppointmentDetails): Promise<string> => {
  try {
    return await generateAppointmentResponse(details);
  } catch (error) {
    console.error('Error in getAppointmentResponse:', error);
    
    // Fallback response
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

export { getResponse, getAppointmentResponse };
