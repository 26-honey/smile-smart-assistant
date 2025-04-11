
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
    console.log(`Generating embedding for text (${text.length} chars)`);
    
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

// Process and chunk document
function splitTextIntoChunks(text: string, maxChunkSize: number = 1000): string[] {
  if (text.length <= maxChunkSize) {
    return [text];
  }
  
  // Split the text into sentences and combine sentences into chunks
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxChunkSize) {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = sentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with admin rights
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data } = await req.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid or empty data array' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log(`Received ${data.length} items to process`);
    
    // Process each item
    const results = [];
    
    for (const item of data) {
      const { text, metadata } = item;
      
      if (!text || typeof text !== 'string') {
        console.warn('Skipping invalid item:', item);
        continue;
      }
      
      // Split document into chunks if it's too large
      const chunks = splitTextIntoChunks(text);
      console.log(`Split "${text.substring(0, 50)}..." into ${chunks.length} chunks`);
      
      // Process each chunk
      for (const [index, chunk] of chunks.entries()) {
        // Generate embedding
        const embedding = await generateEmbedding(chunk);
        
        // Store in database
        const { data: insertedData, error } = await supabase
          .from('document_embeddings')
          .insert({
            content: chunk,
            metadata: {
              ...metadata,
              chunk_index: index,
              total_chunks: chunks.length
            },
            embedding
          })
          .select('id');
        
        if (error) {
          console.error('Error storing embedding:', error);
          throw error;
        }
        
        results.push({
          id: insertedData?.[0]?.id,
          content: chunk.substring(0, 100) + '...',
          metadata: {
            ...metadata,
            chunk_index: index,
            total_chunks: chunks.length
          }
        });
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      count: results.length,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in populate-embeddings function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
