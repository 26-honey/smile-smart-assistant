
import { supabase } from '@/integrations/supabase/client';
import { AppointmentDetails } from "@/components/AppointmentModal";
import { FAQs, Doctors, Hospitals, Insurance, 
         getFAQsText, getDoctorsText, getHospitalsText, getInsuranceText, 
         getDoctorsBySpecialty, getAvailableDays, checkInsuranceValidity } from './dataService';

export type MessageIntent = 'general' | 'appointment' | 'insurance' | 'doctor' | 'hospital' | 'greeting';

// Detect message intent
export const detectIntent = async (message: string): Promise<MessageIntent> => {
  try {
    // Log the message being processed for debugging
    console.log('Detecting intent for message:', message);
    
    const { data, error } = await supabase.functions.invoke('detect-intent', {
      body: { message }
    });
    
    if (error) {
      console.error('Error from detect-intent function:', error);
      throw error;
    }
    
    console.log('Detected intent:', data.intent);
    return data.intent;
  } catch (error) {
    console.error('Error detecting intent:', error);
    return 'general';
  }
};

// Search vector database for relevant information
const searchVectorDatabase = async (message: string, intent: MessageIntent): Promise<string> => {
  try {
    // Log the search
    console.log('Searching vector database for intent:', intent);
    
    // Add intent-specific terms to improve search relevance
    let enhancedQuery = message;
    
    switch(intent) {
      case 'doctor':
        enhancedQuery += " doctor dentist specialist";
        break;
      case 'hospital':
        enhancedQuery += " hospital clinic location";
        break;
      case 'insurance':
        enhancedQuery += " insurance coverage provider";
        break;
      case 'appointment':
        enhancedQuery += " appointment schedule booking";
        break;
    }
    
    // Call the search-embeddings function
    const { data, error } = await supabase.functions.invoke('search-embeddings', {
      body: { 
        query: enhancedQuery,
        threshold: 0.7,
        limit: 5
      }
    });
    
    if (error) {
      console.error('Error from search-embeddings function:', error);
      throw error;
    }
    
    // Extract matching documents
    const matches = data.matches || [];
    
    if (matches.length === 0) {
      console.log('No vector matches found, falling back to default data');
      return getFallbackContextByIntent(intent);
    }
    
    // Sort by similarity and combine content
    const combinedContent = matches
      .sort((a: any, b: any) => b.similarity - a.similarity)
      .map((match: any) => match.content)
      .join('\n\n');
    
    console.log(`Found ${matches.length} vector matches with highest similarity of ${matches[0]?.similarity?.toFixed(2)}`);
    
    return combinedContent;
  } catch (error) {
    console.error('Error searching vector database:', error);
    // Fall back to keyword-based search
    return searchLocalData(message, intent);
  }
};

// Directly search CSV data for relevant information (as fallback)
const searchLocalData = (message: string, intent: MessageIntent): string => {
  const searchTerms = message.toLowerCase().split(' ');
  let relevantInfo = '';
  
  // Search based on intent
  switch(intent) {
    case 'doctor':
      // Search for doctor names, specialties
      const doctorMatches = Doctors.filter(doc => 
        searchTerms.some(term => 
          doc['First Name'].toLowerCase().includes(term) ||
          doc['Last Name'].toLowerCase().includes(term) ||
          doc.Specialization.toLowerCase().includes(term)
        )
      );
      
      if (doctorMatches.length > 0) {
        relevantInfo = doctorMatches.map(doc => 
          `Dr. ${doc['First Name']} ${doc['Last Name']}, Specialization: ${doc.Specialization}, Available: ${doc.days_available}`
        ).join('\n\n');
      } else {
        relevantInfo = getDoctorsText();
      }
      break;
      
    case 'hospital':
      // Search for hospital names, locations
      const hospitalMatches = Hospitals.filter(hospital => 
        searchTerms.some(term => 
          hospital.hospital_name.toLowerCase().includes(term) ||
          hospital.branch_location.toLowerCase().includes(term)
        )
      );
      
      if (hospitalMatches.length > 0) {
        relevantInfo = hospitalMatches.map(hospital => 
          `Hospital: ${hospital.hospital_name}, Location: ${hospital.branch_location}, Address: ${hospital.address}, Hours: ${hospital.open_hours}, Urgent Care: ${hospital.urgent_care}`
        ).join('\n\n');
      } else {
        relevantInfo = getHospitalsText();
      }
      break;
      
    case 'insurance':
      // Search for insurance providers
      const insuranceMatches = Insurance.filter(ins => 
        searchTerms.some(term => 
          ins['insurance provider Name'].toLowerCase().includes(term)
        )
      );
      
      if (insuranceMatches.length > 0) {
        relevantInfo = insuranceMatches.map(ins => 
          `Provider: ${ins['insurance provider Name']}, Type: ${ins.coverage_type}, Status: ${ins.insurance_status}`
        ).join('\n\n');
      } else {
        relevantInfo = getInsuranceText();
      }
      break;
      
    default:
      // Search FAQs for keywords
      const faqMatches = FAQs.filter(faq => 
        searchTerms.some(term => 
          faq.Question.toLowerCase().includes(term) ||
          faq.Answer.toLowerCase().includes(term)
        )
      );
      
      if (faqMatches.length > 0) {
        relevantInfo = faqMatches.map(faq => 
          `Question: ${faq.Question}\nAnswer: ${faq.Answer}`
        ).join('\n\n');
      } else {
        relevantInfo = getFAQsText();
      }
  }
  
  return relevantInfo;
};

// Get fallback context by intent
const getFallbackContextByIntent = (intent: MessageIntent): string => {
  switch (intent) {
    case 'appointment':
      return `${getFAQsText()}\n\n${getDoctorsText()}`;
    case 'insurance':
      return getInsuranceText();
    case 'doctor':
      return getDoctorsText();
    case 'hospital':
      return getHospitalsText();
    case 'greeting':
      // No context needed for greetings
      return "";
    default:
      return getFAQsText();
  }
};

// Generate response based on message and intent
export const generateResponse = async (message: string, intent: MessageIntent): Promise<string> => {
  try {
    console.log('Generating response for intent:', intent);
    
    // Get relevant context data using vector search
    let context = await searchVectorDatabase(message, intent);
    
    // If no context was found, fall back to predefined text
    if (!context) {
      context = getFallbackContextByIntent(intent);
    }
    
    console.log('Using context length:', context.length);
    
    const { data, error } = await supabase.functions.invoke('generate-response', {
      body: { 
        message,
        context,
        intent
      }
    });
    
    if (error) {
      console.error('Error from generate-response function:', error);
      throw error;
    }
    
    return data.response;
  } catch (error) {
    console.error('Error generating response:', error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
};

// Function to generate appointment-specific responses
export const getAppointmentResponse = async (details: AppointmentDetails): Promise<string> => {
  try {
    // Get relevant doctor information
    const specialtyDoctors = getDoctorsBySpecialty(details.reason === "Regular Checkup" ? "Endodontics" : "Orthodontics");
    const availableDays = getAvailableDays(details.dentist);
    
    console.log('Appointment for dentist:', details.dentist);
    console.log('Available days:', availableDays);
    
    const { data, error } = await supabase.functions.invoke('generate-appointment-response', {
      body: { 
        details,
        specialtyDoctors,
        availableDays
      }
    });
    
    if (error) {
      console.error('Error from generate-appointment-response function:', error);
      throw error;
    }
    
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
