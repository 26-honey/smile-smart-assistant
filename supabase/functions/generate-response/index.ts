
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
    const { message, context, intent } = await req.json();
    
    console.log(`Processing message with intent: ${intent}`);
    console.log(`Context size: ${context?.length || 0} characters`);

    // Build system message based on intent
    let systemPrompt = 'You are SmileSmartAssistant, a helpful dental chatbot. ';
    
    switch (intent) {
      case 'greeting':
        systemPrompt += 'Respond in a friendly and welcoming manner to the user\'s greeting.';
        break;
      case 'appointment':
        systemPrompt += 'Help the user schedule a dental appointment. Be informative about the process and available options.';
        break;
      case 'insurance':
        systemPrompt += 'Provide specific information about dental insurance coverage and accepted providers.';
        break;
      case 'doctor':
        systemPrompt += 'Provide detailed information about our dentists, their specializations, and availability.';
        break;
      case 'hospital':
        systemPrompt += 'Provide specific information about our dental clinics, locations, and services.';
        break;
      default:
        systemPrompt += 'Answer the user\'s questions about dental care and services accurately and helpfully.';
    }
    
    systemPrompt += ' Be concise and friendly in your responses. Base your answers directly on the provided context. If the specific information is not in the context, say so politely.';

    // Add context if available
    if (context) {
      systemPrompt += '\n\nHere is relevant information to help answer the query:\n' + context;
    }

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
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      throw new Error(data.error.message || 'Error from OpenAI API');
    }
    
    const generatedResponse = data.choices[0].message.content;
    console.log('Generated response successfully');

    return new Response(JSON.stringify({ response: generatedResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-response function:', error);
    return new Response(JSON.stringify({ error: error.message, response: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later." }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
