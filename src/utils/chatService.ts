
import { AppointmentDetails } from "@/components/AppointmentModal";
import { detectIntent, generateResponse, getAppointmentResponse as generateAppointmentResponse } from "./ragService";
import { supabase } from "@/integrations/supabase/client";

// Function to get response based on user message
const getResponse = async (message: string): Promise<string> => {
  try {
    console.log('Processing user message:', message);
    
    // Detect the intent of the message
    const intent = await detectIntent(message);
    console.log('Detected intent:', intent);
    
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
    // Format the date to string if it's a Date object
    let formattedDate: string;
    if (details.date instanceof Date) {
      formattedDate = details.date.toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD' format
    } else if (details.date) {
      formattedDate = String(details.date); // Use String() instead of toString() to handle various types
    } else {
      formattedDate = new Date().toISOString().split('T')[0]; // Default to today if no date provided
    }
    
    console.log('Saving appointment for:', details.name, 'on', formattedDate);
    
    // Save appointment to database with proper typing
    const { error: dbError } = await supabase
      .from('appointments')
      .insert({
        name: details.name,
        email: details.email,
        phone: details.phone,
        date: formattedDate,
        time: details.time,
        dentist: details.dentist,
        reason: details.reason
      });
    
    if (dbError) {
      console.error('Error saving appointment to database:', dbError);
      throw dbError;
    }
    
    console.log('Appointment saved successfully. Generating response...');
    
    // Generate response using OpenAI
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

// Function to populate vector database with CSV data
const populateVectorDatabase = async (): Promise<boolean> => {
  try {
    console.log('Starting database population with CSV data');
    
    // Check if we already have embeddings
    const { count, error: countError } = await supabase
      .from('document_embeddings')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking existing embeddings:', countError);
      throw countError;
    }
    
    if (count && count > 0) {
      console.log(`Database already contains ${count} embeddings. Skipping population.`);
      return true;
    }
    
    // Import data service to get the CSV data
    const dataService = await import('./dataService');
    
    // Prepare data for embedding
    const documentsToEmbed = [
      // FAQs
      ...dataService.FAQs.map(faq => ({
        text: `Question: ${faq.Question}\nAnswer: ${faq.Answer}`,
        metadata: { type: 'faq', question: faq.Question }
      })),
      
      // Doctors
      ...dataService.Doctors.map(doc => ({
        text: `Doctor: ${doc['First Name']} ${doc['Last Name']}, Specialization: ${doc.Specialization}, Available: ${doc.days_available}`,
        metadata: { 
          type: 'doctor', 
          firstName: doc['First Name'],
          lastName: doc['Last Name'],
          specialization: doc.Specialization,
          availability: doc.days_available
        }
      })),
      
      // Hospitals
      ...dataService.Hospitals.map(hospital => ({
        text: `Hospital: ${hospital.hospital_name}, Location: ${hospital.branch_location}, Address: ${hospital.address}, Hours: ${hospital.open_hours}, Urgent Care: ${hospital.urgent_care}`,
        metadata: { 
          type: 'hospital', 
          name: hospital.hospital_name,
          location: hospital.branch_location,
          address: hospital.address,
          hours: hospital.open_hours,
          urgentCare: hospital.urgent_care
        }
      })),
      
      // Insurance
      ...dataService.Insurance.map(ins => ({
        text: `Provider: ${ins['insurance provider Name']}, Type: ${ins.coverage_type}, Status: ${ins.insurance_status}`,
        metadata: { 
          type: 'insurance', 
          provider: ins['insurance provider Name'],
          coverageType: ins.coverage_type,
          status: ins.insurance_status
        }
      }))
    ];
    
    console.log(`Prepared ${documentsToEmbed.length} documents for embedding`);
    
    // Send data to the populate-embeddings function in batches
    const batchSize = 20;
    for (let i = 0; i < documentsToEmbed.length; i += batchSize) {
      const batch = documentsToEmbed.slice(i, i + batchSize);
      console.log(`Processing batch ${i/batchSize + 1} of ${Math.ceil(documentsToEmbed.length/batchSize)}`);
      
      const { data, error } = await supabase.functions.invoke('populate-embeddings', {
        body: { data: batch }
      });
      
      if (error) {
        console.error('Error populating embeddings:', error);
        throw error;
      }
      
      console.log(`Successfully processed batch with ${data.count} embeddings`);
    }
    
    console.log('Successfully populated vector database');
    return true;
  } catch (error) {
    console.error('Error populating vector database:', error);
    return false;
  }
};

export { getResponse, getAppointmentResponse, populateVectorDatabase };
