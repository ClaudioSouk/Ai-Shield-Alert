
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const { message, userEmail } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "No message provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured on server" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Fetch user settings from database
    const { data: userSettings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (settingsError && settingsError.code !== 'PGRST116') { // PGRST116 means not found
      console.error("Error fetching user settings:", settingsError);
    }
    
    // Fetch user's active alert rules
    const { data: alertRules, error: rulesError } = await supabase
      .from('alert_rules')
      .select('*')
      .eq('user_id', user.id)
      .eq('enabled', true);
    
    if (rulesError) {
      console.error("Error fetching alert rules:", rulesError);
    }
    
    // Process alert rules to build analysis instruction
    const activeRuleTypes = alertRules?.map(rule => rule.rule_type) || [];
    const sensitivityLevels = alertRules?.reduce((acc, rule) => {
      acc[rule.rule_type] = rule.sensitivity;
      return acc;
    }, {} as Record<string, string>) || {};

    // Extract email components for better analysis
    const extractedData = extractEmailComponents(message);

    // Create a powerful system prompt for OpenAI analysis
    // Configure this based on user settings and enabled rules
    let systemPrompt = `You are an expert in phishing email detection specializing in identifying sophisticated attacks, including AI-generated phishing attempts. Your analysis must be extremely accurate and thorough.
            
    Analyze the provided email or message and return a JSON object with this exact structure:
    { 
      score: number 0-100, 
      riskLevel: 'low', 'medium', or 'high', 
      explanation: string with detailed analysis, 
      confidenceLevel: 'low', 'medium', or 'high'
    }
    
    Follow these analysis guidelines:
    1. Be more suspicious of emails requesting urgent action, financial transactions, password resets, or account verifications
    2. Carefully analyze sender addresses for subtle misspellings, character substitutions, or unusual domains
    3. Check for mismatches between display names and actual email addresses
    4. Analyze URLs for suspicious patterns, redirects, or unusual domains
    5. Consider language patterns that seem generic, overly formal, or contain inconsistent tone
    6. Pay special attention to AI-generated content that's grammatically perfect but contextually odd
    7. For legitimate-looking business emails, verify if the sender domain matches the actual business domain
    
    ${userSettings?.false_positive_protection === true ? 
      "8. Apply rigorous false positive protection - when in doubt, err on the side of caution to avoid flagging legitimate emails as phishing" : ""}
    ${userSettings?.min_confidence_threshold ? 
      `9. Only provide a 'high' confidenceLevel when you're at least ${userSettings?.min_confidence_threshold || 70}% certain of your assessment` : ""}`;

    // Add rule-specific instructions based on enabled rules
    if (activeRuleTypes.includes('ai_content')) {
      const sensitivity = sensitivityLevels['ai_content'] || 'medium';
      systemPrompt += `\n\nFor AI-generated content detection (${sensitivity} sensitivity):`;
      if (sensitivity === 'low') {
        systemPrompt += "\n- Only flag clearly AI-generated text with obvious patterns";
      } else if (sensitivity === 'medium') {
        systemPrompt += "\n- Look for content that seems artificially structured or has unusual phrasing";
      } else if (sensitivity === 'high') {
        systemPrompt += "\n- Be highly suspicious of perfectly formatted text, subtle AI patterns, or content that seems too perfect";
      }
    }

    if (activeRuleTypes.includes('domain_spoof')) {
      const sensitivity = sensitivityLevels['domain_spoof'] || 'medium';
      systemPrompt += `\n\nFor domain spoofing detection (${sensitivity} sensitivity):`;
      if (sensitivity === 'low') {
        systemPrompt += "\n- Flag only obvious domain spoofing (e.g., 'google-accounts.com' instead of 'google.com')";
      } else if (sensitivity === 'medium') {
        systemPrompt += "\n- Detect moderate domain manipulation and homograph attacks";
      } else if (sensitivity === 'high') {
        systemPrompt += "\n- Detect even subtle domain variations, look for homograph attacks, international character substitutions";
      }
    }

    if (activeRuleTypes.includes('urls')) {
      const sensitivity = sensitivityLevels['urls'] || 'medium';
      systemPrompt += `\n\nFor suspicious URL detection (${sensitivity} sensitivity):`;
      if (sensitivity === 'low') {
        systemPrompt += "\n- Flag only clearly malicious URLs";
      } else if (sensitivity === 'medium') {
        systemPrompt += "\n- Analyze URL paths, parameters, and check for redirection techniques";
      } else if (sensitivity === 'high') {
        systemPrompt += "\n- Be highly suspicious of URL shorteners, encoded URLs, or unusual TLDs";
      }
    }

    if (activeRuleTypes.includes('urgency')) {
      const sensitivity = sensitivityLevels['urgency'] || 'medium';
      systemPrompt += `\n\nFor urgency detection (${sensitivity} sensitivity):`;
      if (sensitivity === 'low') {
        systemPrompt += "\n- Flag only extreme urgency language (e.g., 'act now or your account will be deleted')";
      } else if (sensitivity === 'medium') {
        systemPrompt += "\n- Be suspicious of time-pressure tactics and deadlines";
      } else if (sensitivity === 'high') {
        systemPrompt += "\n- Flag any language that creates a sense of urgency or time pressure";
      }
    }

    systemPrompt += `\n\nLook for these phishing indicators:
    - Urgency and threatening language
    - Mismatched or suspicious URLs
    - Request for sensitive information
    - Grammar and spelling errors (or suspiciously perfect grammar from AI)
    - Impersonation of trusted entities
    - Unusual sender addresses with subtle misspellings
    - AI-generated text patterns
    - Evasive techniques that bypass traditional filters
    - Unusual email routing or headers
    - Suspicious attachments or unusual file types
    
    For scoring guidance:
    - Scores 80-100: High risk, multiple strong indicators of phishing
    - Scores 40-79: Medium risk, some concerning elements that warrant caution
    - Scores 0-39: Low risk, likely legitimate communication
    
    For confidence levels:
    - High confidence: Clear indicators present, strong evidence supports conclusion
    - Medium confidence: Some indicators present, but with possible ambiguity
    - Low confidence: Limited indicators or competing legitimate explanations exist
    
    If the email includes headers, consider the sender domain, reply-to address, and routing information in your analysis.
    
    Always consider the context and provide a detailed explanation supporting your risk assessment. Be specific about which indicators led to your conclusion.`;

    // Call OpenAI API for analysis with enhanced system prompt
    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using the most appropriate model for detection
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: extractedData.formattedMessage || message }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1 // Lower temperature for more deterministic responses
      }),
    });
    
    const openAiData = await openAiResponse.json();
    
    if (!openAiData.choices || !openAiData.choices[0]) {
      throw new Error("Invalid response from OpenAI");
    }
    
    const result = JSON.parse(openAiData.choices[0].message.content);
    
    // If user has false positive protection enabled and confidence is low or medium,
    // adjust the risk level downward slightly to avoid false positives
    if (userSettings?.false_positive_protection === true && 
        (result.confidenceLevel === 'low' || result.confidenceLevel === 'medium')) {
      
      // Add explanation about false positive protection
      result.explanation += "\n\nNote: False positive protection is enabled on your account. When confidence is not high, the risk assessment may be adjusted to reduce false positives.";
      
      if (result.confidenceLevel === 'low' && result.riskLevel === 'high') {
        // Downgrade high risk to medium when confidence is low
        result.riskLevel = 'medium';
        result.score = Math.max(40, Math.min(result.score, 79)); // Keep score in medium range
      } else if (result.confidenceLevel === 'medium' && result.riskLevel === 'high' && result.score > 90) {
        // Slightly reduce very high scores when confidence is only medium
        result.score = 85;
      }
    }

    // Auto-report option for high risk emails
    let autoReported = false;
    if (userSettings?.auto_report_high_risk === true && 
        result.riskLevel === 'high' && 
        result.confidenceLevel === 'high' &&
        result.score > 85) {
      // Here we would implement the auto-reporting logic
      // This could be a call to another endpoint or database entry
      autoReported = true;
    }
    
    // Store result in database with default status
    const { data: insertData, error: insertError } = await supabase
      .from("phishing_analyses")
      .insert({
        user_id: user.id,
        user_email: userEmail || user.email,
        message: message.substring(0, 10000), // Limit message size
        score: result.score,
        risk_level: result.riskLevel,
        explanation: result.explanation,
        confidence_level: result.confidenceLevel,
        status: autoReported ? 'reported' : 'new', // Set status
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (insertError) {
      console.error("Error inserting analysis:", insertError);
      // Continue anyway, we don't want to fail the analysis if the insert fails
    }
    
    // Include the stored analysis ID in the response
    if (insertData) {
      result.id = insertData.id;
    }

    // Add auto-reported flag to the result if applicable
    if (autoReported) {
      result.autoReported = true;
      result.explanation += "\n\nNote: This high-risk email was automatically reported based on your settings.";
    }

    // Add explanation about which rules affected the analysis if detailed indicators are enabled
    if (userSettings?.show_detailed_indicators === true && alertRules && alertRules.length > 0) {
      result.explanation += "\n\nActive detection rules that affected this analysis:";
      alertRules.forEach(rule => {
        result.explanation += `\n- ${rule.name} (${rule.sensitivity} sensitivity)`;
      });
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

/**
 * Extract components from an email format
 */
function extractEmailComponents(emailContent: string) {
  // Default return structure
  const result = {
    formattedMessage: emailContent,
    metadata: null
  };
  
  try {
    // Check if this looks like an email with headers
    const hasHeaders = emailContent.match(/^(From|To|Subject|Date):/im);
    
    if (!hasHeaders) {
      // Try to detect if this might be a forwarded email
      const forwardedMatch = emailContent.match(/^[-]+\s*Forwarded message\s*[-]+|^[-]+\s*Original Message\s*[-]+/im);
      if (forwardedMatch) {
        // Extract potential headers from forwarded email
        const fromMatch = emailContent.match(/From:(.+?)(?=\n)/i);
        const toMatch = emailContent.match(/To:(.+?)(?=\n)/i);
        const subjectMatch = emailContent.match(/Subject:(.+?)(?=\n)/i);
        const dateMatch = emailContent.match(/Date:(.+?)(?=\n)/i);
        
        if (fromMatch || toMatch || subjectMatch || dateMatch) {
          const metadata: Record<string, string | null> = {
            subject: subjectMatch ? subjectMatch[1].trim() : null,
            from: fromMatch ? fromMatch[1].trim() : null,
            date: dateMatch ? dateMatch[1].trim() : null,
            to: toMatch ? toMatch[1].trim() : null,
            is_forwarded: "true"
          };
          
          result.metadata = metadata;
          
          // Create enhanced formatted message that highlights it's a forwarded email
          let formattedMessage = `ANALYSIS REQUEST: Forwarded Email Phishing Check\n\n`;
          if (metadata.subject) formattedMessage += `SUBJECT: ${metadata.subject}\n`;
          if (metadata.from) formattedMessage += `FROM: ${metadata.from}\n`;
          if (metadata.to) formattedMessage += `TO: ${metadata.to}\n`;
          if (metadata.date) formattedMessage += `DATE: ${metadata.date}\n`;
          formattedMessage += `\nFORWARDED EMAIL CONTENT:\n${emailContent}`;
          
          result.formattedMessage = formattedMessage;
          return result;
        }
      }
      
      return result;
    }
    
    // Extract headers and body
    const parts = emailContent.split(/\r?\n\r?\n/);
    const headers = parts[0];
    const body = parts.slice(1).join("\n\n");
    
    // Extract key headers
    const subjectMatch = headers.match(/Subject: (.*?)(\r?\n|$)/i);
    const fromMatch = headers.match(/From: (.*?)(\r?\n|$)/i);
    const dateMatch = headers.match(/Date: (.*?)(\r?\n|$)/i);
    const toMatch = headers.match(/To: (.*?)(\r?\n|$)/i);
    
    // Create formatted message for analysis that highlights the important parts
    let formattedMessage = `ANALYSIS REQUEST: Email Phishing Check\n\n`;
    
    if (subjectMatch?.length) formattedMessage += `SUBJECT: ${subjectMatch[1].trim()}\n`;
    if (fromMatch?.length) formattedMessage += `FROM: ${fromMatch[1].trim()}\n`;
    if (toMatch?.length) formattedMessage += `TO: ${toMatch[1].trim()}\n`;
    if (dateMatch?.length) formattedMessage += `DATE: ${dateMatch[1].trim()}\n`;
    
    formattedMessage += `\nEMAIL BODY:\n${body}`;
    
    return {
      formattedMessage,
      metadata: null
    };
  } catch (error) {
    console.error("Error extracting email components:", error);
    return result;
  }
}
