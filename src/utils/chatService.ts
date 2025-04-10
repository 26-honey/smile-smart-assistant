
// Simulated service for handling chat functionality
import { AppointmentDetails } from "@/components/AppointmentModal";

// Predefined FAQs and responses
const faqResponses: Record<string, string> = {
  "hello": "Hello! I'm SmileSmartAssistant, your virtual dental assistant. How can I help you today?",
  "hi": "Hi there! I'm SmileSmartAssistant. I can help you schedule appointments, answer dental questions, or provide information about our services.",
  "how are you": "I'm functioning perfectly! Thank you for asking. How can I assist with your dental needs today?",
  "appointment": "I'd be happy to help you schedule an appointment! You can click the calendar button below or just tell me what day and time works best for you.",
  "root canal": "A root canal is a dental procedure to treat infection at the center of a tooth. It's needed when bacteria infect the tooth's pulp, causing pain. The procedure involves removing infected pulp, cleaning the space, and sealing it. Modern root canals are much more comfortable than their reputation suggests!",
  "teeth whitening": "We offer professional teeth whitening services that can brighten your smile by several shades. Our in-office treatments take about an hour and provide immediate results. We also offer take-home kits for gradual whitening. Would you like to learn more or schedule a whitening appointment?",
  "braces": "We offer several orthodontic options including traditional braces, ceramic braces, and clear aligners like Invisalign. The best option depends on your specific needs, preferences, and budget. Would you like to schedule a consultation to discuss which option might be best for you?",
  "toothache": "Tooth pain can be caused by many factors including cavities, gum disease, teeth grinding, or infected pulp. If you're experiencing persistent tooth pain, it's important to schedule an appointment soon. In the meantime, over-the-counter pain relievers may help manage discomfort. Would you like to schedule an examination?",
  "wisdom teeth": "Wisdom teeth, or third molars, typically emerge between ages 17-25. Not everyone needs them removed, but extraction is often recommended if they're impacted, causing pain, or creating alignment issues. Would you like to schedule a consultation to evaluate your wisdom teeth?",
  "gum disease": "Gum disease (periodontal disease) is an infection of the tissues that hold your teeth in place, caused primarily by poor brushing and flossing habits. Symptoms include red, swollen gums, bleeding, bad breath, and in advanced stages, tooth loss. Regular dental cleanings and good oral hygiene can prevent and treat early stages of gum disease.",
  "dental implants": "Dental implants are titanium posts surgically positioned into the jawbone beneath your gums to replace missing tooth roots. Once in place, they allow your dentist to mount replacement teeth. Implants provide stable support and blend with your natural teeth. Would you like to learn more about the implant process?",
  "flossing": "Flossing daily is essential for removing plaque and food particles between teeth where your toothbrush can't reach. For proper flossing technique: use about 18 inches of floss, wind most around your middle fingers, grip 1-2 inches between thumbs and forefingers, gently guide between teeth using a rubbing motion, and curve around each tooth in a C shape when you reach the gumline.",
  "brushing technique": "For effective brushing: use a soft-bristled brush and fluoride toothpaste, brush at a 45-degree angle to the gums, use short gentle back-and-forth strokes, brush all surfaces (outer, inner, chewing), don't forget to brush your tongue to remove bacteria, and replace your toothbrush every 3-4 months. Brush for two minutes, twice daily.",
  "insurance": "We accept most major dental insurance plans including Delta Dental, Cigna, Aetna, MetLife, Guardian, and many others. For specific questions about your coverage, please provide your insurance provider's name, and I can give you more detailed information about what may be covered.",
  "emergency": "If you're experiencing a dental emergency like severe pain, a knocked-out tooth, or an abscess, please call our emergency line at (555) 123-4567 immediately. For a knocked-out tooth, try to place it back in the socket without touching the root, or keep it in milk or saliva and come in immediately – time is critical!",
  "cavity": "A cavity is a permanently damaged area in the hard surface of your tooth that develops into tiny holes. Caused by factors like bacteria, sugary foods, and poor cleaning, cavities need professional treatment. If you suspect you have a cavity, schedule an appointment soon, as they progressively worsen without treatment.",
  "kids": "We provide comprehensive pediatric dental services in a child-friendly environment! Services include cleanings, fluoride treatments, sealants, cavity treatment, and early orthodontic assessment. Our team specializes in making children comfortable during dental visits. Would you like to schedule an appointment for your child?",
  "crown": "A dental crown is a cap placed over a damaged tooth to restore its shape, size, strength, and appearance. Crowns are needed when a tooth is cracked, worn down, or weakened by decay. The procedure typically requires two visits – one for preparation and getting a temporary crown, and another to place the permanent crown.",
  "sensitive teeth": "Tooth sensitivity can be caused by worn enamel, exposed roots, cavities, cracked teeth, or gum disease. To manage sensitivity: use toothpaste for sensitive teeth, brush gently with a soft-bristled brush, avoid acidic foods/drinks, and consider using a fluoride mouthwash. If sensitivity persists, please schedule an examination as it could indicate a more serious issue."
};

// Function to get response based on user message
const getResponse = (message: string): string => {
  // Convert to lowercase for matching
  const lowerMessage = message.toLowerCase();
  
  // Check for exact or partial matches in our FAQ database
  for (const [keyword, response] of Object.entries(faqResponses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }
  
  // Check for appointment booking intent
  if (
    lowerMessage.includes("book") || 
    lowerMessage.includes("schedule") || 
    lowerMessage.includes("appointment") ||
    lowerMessage.includes("reserve") ||
    lowerMessage.includes("visit")
  ) {
    return "I'd be happy to help you schedule an appointment! You can click the calendar button below or tell me what day and time works best for you.";
  }

  // Default response if no match found
  return "I appreciate your question! As an AI dental assistant, I can help with appointment scheduling, dental procedures information, and general oral health questions. Could you provide more details or try asking in a different way?";
};

// Simulated appointment booking response
const getAppointmentResponse = (details: AppointmentDetails): string => {
  const appointmentDate = details.date ? new Date(details.date) : new Date();
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  return `Great! Your appointment with ${details.dentist} has been scheduled for ${formattedDate} at ${details.time} for ${details.reason}. A confirmation email has been sent to ${details.email}. If you need to reschedule or have any questions, just let me know!`;
};

export { getResponse, getAppointmentResponse };
