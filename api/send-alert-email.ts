
// Edge function: /api/send-alert-email
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";

serve(async (req) => {
  try {
    // Extract request data
    const { userEmail, riskScore, subject, excerpt } = await req.json();
    
    if (!userEmail) {
      return new Response(
        JSON.stringify({ error: "No recipient email provided" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Create email content
    const emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #e63946; margin: 0;">⚠️ High Risk Alert</h1>
              <p style="color: #666; font-size: 14px;">Phishing Detection System</p>
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
              <p>This is an automated security alert. Please do not reply to this email.</p>
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
        from: "security@yourdomain.com",
        to: userEmail,
        subject: "🚨 High Risk Phishing Content Detected",
        html: emailHtml,
      }),
    });
    
    const resendData = await resendResponse.json();
    
    return new Response(
      JSON.stringify({ success: true, messageId: resendData.id }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in send-alert-email function:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to send email", details: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});
