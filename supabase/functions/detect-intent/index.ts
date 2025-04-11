
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { message } = await req.json();
    
    // Simple rule-based intent detection - could be replaced with OpenAI for more accuracy
    let intent = 'general';
    
    const lowerMessage = message.toLowerCase();
    
    if (/hello|hi|hey|good morning|good afternoon|good evening|howdy|greetings/i.test(lowerMessage)) {
      intent = 'greeting';
    } else if (/appointment|schedule|book|reserve|visit|meet|consult/i.test(lowerMessage)) {
      intent = 'appointment';
    } else if (/insurance|coverage|plan|policy|covered|provider/i.test(lowerMessage)) {
      intent = 'insurance';
    } else if (/doctor|dentist|specialist|orthodontist|periodontist|endodontist/i.test(lowerMessage)) {
      intent = 'doctor';
    } else if (/hospital|clinic|location|facility|center|branch/i.test(lowerMessage)) {
      intent = 'hospital';
    }

    return new Response(JSON.stringify({ intent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in detect-intent function:', error);
    return new Response(JSON.stringify({ error: error.message, intent: 'general' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
