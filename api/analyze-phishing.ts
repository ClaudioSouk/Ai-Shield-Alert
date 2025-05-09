
// Edge function: /api/analyze-phishing
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract request data
    const { message, userEmail } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: "No message provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Call OpenAI API for analysis
    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert in phishing email detection. Analyze the provided content and return a JSON object with the following structure: { score: number 0-100, riskLevel: 'low'|'medium'|'high', explanation: string with detailed analysis, confidenceLevel: 'low'|'medium'|'high' }. Base your analysis on common phishing indicators like urgency, grammar errors, threatening language, suspicious links, impersonation attempts, unusual requests, etc. Provide a clear explanation of why the message is or is not suspicious."
          },
          {
            role: "user",
            content: message
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      }),
    });
    
    const openAiData = await openAiResponse.json();
    
    if (!openAiData.choices || !openAiData.choices[0]) {
      throw new Error("Invalid response from OpenAI");
    }
    
    let result;
    try {
      result = JSON.parse(openAiData.choices[0].message.content);
    } catch (e) {
      result = {
        score: 50,
        riskLevel: "medium",
        explanation: "Unable to parse analysis result. The content may contain complex patterns that require manual review.",
        confidenceLevel: "low"
      };
    }
    
    // Store the analysis result in the database if user is authenticated
    if (userEmail) {
      try {
        await supabase.from("phishing_analyses").insert({
          user_id: (await supabase.auth.admin.getUserByEmail(userEmail)).data.user?.id,
          user_email: userEmail,
          message: message.substring(0, 1000), // Store first 1000 chars only
          score: result.score,
          risk_level: result.riskLevel,
          explanation: result.explanation,
          confidence_level: result.confidenceLevel,
          status: 'reviewed' // Default status for new analyses
        });
      } catch (dbError) {
        console.error("Error storing analysis result:", dbError);
        // Continue even if storage fails - don't block the response
      }
    }
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in analyze-phishing function:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
