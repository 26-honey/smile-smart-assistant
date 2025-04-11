
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { details, specialtyDoctors, availableDays } = await req.json();
    
    const appointmentDate = details.date ? new Date(details.date) : new Date();
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    const systemPrompt = `You are SmileSmartAssistant, a dental clinic chatbot.
    
    Craft a friendly and positive confirmation message for a dental appointment with the following details:
    - Patient name: ${details.name}
    - Email: ${details.email}
    - Phone: ${details.phone}
    - Date: ${formattedDate}
    - Time: ${details.time}
    - Dentist: ${details.dentist}
    - Reason: ${details.reason}
    
    Include:
    1. A confirmation that the appointment has been scheduled
    2. The complete appointment details
    3. Information that a confirmation email has been sent
    4. Brief preparation instructions if relevant to the appointment type
    5. A note about rescheduling if needed
    
    Keep the response concise but complete and in a friendly tone.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate an appointment confirmation message' }
        ],
        temperature: 0.7,
        max_tokens: 350,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error from OpenAI API');
    }
    
    const generatedResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: generatedResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-appointment-response function:', error);
    
    // Fallback response if OpenAI request fails
    const appointmentDate = details?.date ? new Date(details.date) : new Date();
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    const fallbackResponse = `Great! Your appointment with ${details?.dentist} has been scheduled for ${formattedDate} at ${details?.time} for ${details?.reason}. A confirmation email has been sent to ${details?.email}. If you need to reschedule or have any questions, just let me know!`;
    
    return new Response(JSON.stringify({ response: fallbackResponse }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
