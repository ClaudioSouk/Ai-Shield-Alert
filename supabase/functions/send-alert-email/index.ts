
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth header
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
    
    // Extract request data
    const { userEmail, riskScore, subject, excerpt } = await req.json();
    
    if (!userEmail) {
      return new Response(
        JSON.stringify({ error: "No recipient email provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Resend API key not configured on server" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Create email content
    const emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #e63946; margin: 0;">⚠️ High Risk Alert</h1>
              <p style="color: #666; font-size: 14px;">AI Shield Alert - Phishing Detection</p>
            </div>
            
            <div style="margin-bottom: 20px; padding: 15px; background-color: #fff4f4; border-left: 4px solid #e63946; border-radius: 3px;">
              <p style="margin: 0; font-size: 16px;">We've detected a <strong>high risk phishing attempt</strong> in content you submitted.</p>
              <p style="margin: 10px 0 0; font-size: 14px;">Risk Score: <span style="color: #e63946; font-weight: bold;">${riskScore}%</span></p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 18px; margin-top: 0;">Phishing Content Details</h2>
              <p style="font-size: 14px; color: #666;">Subject: ${subject || 'N/A'}</p>
              <div style="background-color: #f5f5f5; padding: 10px; border-radius: 3px; font-family: monospace; font-size: 13px;">
                ${excerpt || 'No content preview available'}
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
              <p>This is an automated security alert from AI Shield Alert.</p>
              <p>To manage your security settings, log in to your dashboard at <a href="https://yourdomain.com/dashboard">https://yourdomain.com/dashboard</a>.</p>
              <p>If you need assistance, please contact our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    // Send email with Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "security@aishieldalert.com",
        to: userEmail,
        subject: "🚨 High Risk Phishing Content Detected",
        html: emailHtml,
      }),
    });
    
    const resendData = await resendResponse.json();
    
    if (!resendResponse.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(resendData)}`);
    }
    
    return new Response(
      JSON.stringify({ success: true, messageId: resendData.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in send-alert-email function:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to send email", details: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
