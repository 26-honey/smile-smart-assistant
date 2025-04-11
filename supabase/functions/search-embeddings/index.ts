
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Function to generate embeddings using OpenAI API
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    console.log(`Generating query embedding for: ${text.substring(0, 50)}...`);
    
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-3-small',
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      throw new Error(data.error.message || 'Error from OpenAI API');
    }
    
    return data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, threshold = 0.7, limit = 5 } = await req.json();
    
    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'Query is required and must be a string' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Generate embedding for the query
    const embedding = await generateEmbedding(query);
    
    // Search for similar documents using the Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: matches, error } = await supabase.rpc(
      'match_documents',
      {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: limit
      }
    );
    
    if (error) {
      console.error('Error searching for similar documents:', error);
      throw error;
    }
    
    console.log(`Found ${matches?.length || 0} matches for query "${query.substring(0, 50)}..."`);
    
    return new Response(JSON.stringify({ matches }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in search-embeddings function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
