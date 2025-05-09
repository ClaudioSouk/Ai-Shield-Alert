
import { supabase } from "@/lib/supabase";
import { DetectedEmail } from "@/lib/supabase";

interface PhishingAnalysisResult {
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  explanation: string;
  confidenceLevel: 'low' | 'medium' | 'high';
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  sensitivity: string;
  rule_type: string;
}

export const analyzePhishingMessage = async (message: string, userEmail?: string): Promise<PhishingAnalysisResult & { id?: string }> => {
  try {
    // Get the session token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("User not authenticated");
    }
    
    console.log("Sending analysis request to OpenAI via edge function");
    
    // Send the message to our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-phishing', {
      body: { 
        message, 
        userEmail: userEmail || session?.user?.email,
        source: 'web-app'
      },
    });

    if (error) {
      console.error("Error analyzing phishing message:", error);
      throw new Error(error.message || "Failed to analyze message");
    }

    if (!data) {
      throw new Error("No data received from analysis");
    }

    // Return the result with the ID if one was provided
    return data as PhishingAnalysisResult & { id?: string };
  } catch (error: any) {
    console.error("Error in phishingService:", error);
    throw new Error(error.message || "An error occurred while analyzing the message");
  }
};

export const fetchUserPhishingAnalyses = async () => {
  try {
    console.log("Fetching phishing analyses from Supabase...");
    const { data, error } = await supabase
      .from("phishing_analyses")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching phishing analyses:", error);
      throw new Error(error.message || "Failed to fetch analyses");
    }
    
    console.log("Fetched analyses:", data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.error("Error in fetchUserPhishingAnalyses:", error);
    throw new Error(error.message || "An error occurred while fetching analyses");
  }
};

export const deletePhishingAnalysis = async (id: string) => {
  try {
    const { error } = await supabase
      .from("phishing_analyses")
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting phishing analysis:", error);
      throw new Error(error.message || "Failed to delete analysis");
    }
    
    return true;
  } catch (error: any) {
    console.error("Error in deletePhishingAnalysis:", error);
    throw new Error(error.message || "An error occurred while deleting the analysis");
  }
};

export const forwardEmailForAnalysis = async (emailAddress: string): Promise<string> => {
  try {
    return `To analyze emails directly, forward them to scan@aishieldalert.com from your registered email address (${emailAddress}).

We'll automatically process all forwarded emails and send you analysis reports.`;
  } catch (error: any) {
    console.error("Error generating forward instructions:", error);
    throw new Error("Could not generate email forwarding instructions");
  }
};

export const getEmailIntegrationInstructions = (): { 
  gmail: string; 
  outlook: string; 
  generic: string;
  isAvailable: boolean;
} => {
  return {
    isAvailable: false, // Set to true when real integrations are available
    gmail: "Gmail integration coming soon. In the next version, you'll be able to connect your Gmail account for automatic scanning.",
    outlook: "Outlook integration coming soon. In the next version, you'll be able to connect your Microsoft account for automatic scanning.",
    generic: "Email integrations are coming in our next major update. For now, you can forward suspicious emails to scan@aishieldalert.com or use our Analyzer tab."
  };
};

export const updateDetectionStatus = async (id: string, status: 'reviewed' | 'safe' | 'reported'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("phishing_analyses")
      .update({ status })
      .eq('id', id);
      
    if (error) {
      console.error("Error updating detection status:", error);
      throw new Error(error.message || "Failed to update status");
    }
    
    return true;
  } catch (error: any) {
    console.error("Error in updateDetectionStatus:", error);
    throw new Error(error.message || "An error occurred while updating the status");
  }
};

export const getUserAlertRules = async (): Promise<AlertRule[]> => {
  try {
    const { data, error } = await supabase
      .from("alert_rules")
      .select("*");
      
    if (error) {
      console.error("Error fetching alert rules:", error);
      // Return default rules if no custom rules found
      return getDefaultAlertRules();
    }
    
    if (data && data.length > 0) {
      return data as AlertRule[];
    }
    
    // If no data, return default rules
    return getDefaultAlertRules();
  } catch (error: any) {
    console.error("Error in getUserAlertRules:", error);
    return getDefaultAlertRules();
  }
};

export const updateAlertRule = async (id: string, updates: { enabled?: boolean, sensitivity?: string }): Promise<AlertRule> => {
  try {
    const { data, error } = await supabase
      .from("alert_rules")
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating alert rule:", error);
      throw new Error(error.message || "Failed to update alert rule");
    }
    
    return data as AlertRule;
  } catch (error: any) {
    console.error("Error in updateAlertRule:", error);
    throw new Error("Failed to update alert rule");
  }
};

// Helper function to get default alert rules
function getDefaultAlertRules(): AlertRule[] {
  return [
    {
      id: "1",
      name: "AI Content Detection",
      description: "Detect AI-generated phishing content",
      enabled: true,
      sensitivity: "medium",
      rule_type: "ai_content"
    },
    {
      id: "2",
      name: "Domain Spoofing Detection",
      description: "Detect domains that look similar to legitimate ones",
      enabled: true,
      sensitivity: "high",
      rule_type: "domain_spoof"
    },
    {
      id: "3",
      name: "Suspicious URL Analysis",
      description: "Analyze URLs for phishing indicators",
      enabled: true,
      sensitivity: "medium",
      rule_type: "urls"
    },
    {
      id: "4",
      name: "Urgency Detection",
      description: "Detect messages creating false urgency",
      enabled: true,
      sensitivity: "medium",
      rule_type: "urgency"
    }
  ];
}

// Function to get dashboard statistics from real data
export const getDashboardStats = async () => {
  try {
    const { data, error } = await supabase
      .from("phishing_analyses")
      .select("*");
      
    if (error) {
      console.error("Error fetching analyses for stats:", error);
      throw new Error(error.message || "Failed to fetch statistics");
    }
    
    const analyses = data || [];
    
    // Calculate statistics from actual data
    return {
      totalDetected: analyses.length,
      highRisk: analyses.filter(a => a.risk_level === 'high').length,
      mediumRisk: analyses.filter(a => a.risk_level === 'medium').length,
      lowRisk: analyses.filter(a => a.risk_level === 'low').length,
      totalReported: analyses.filter(a => a.status === 'reported').length,
      totalSafe: analyses.filter(a => a.status === 'safe').length
    };
  } catch (error: any) {
    console.error("Error calculating dashboard stats:", error);
    // Return zeros as fallback
    return {
      totalDetected: 0,
      highRisk: 0,
      mediumRisk: 0,
      lowRisk: 0,
      totalReported: 0,
      totalSafe: 0
    };
  }
};

// Function to convert phishing_analyses to DetectedEmail format
export const convertAnalysesToDetections = (analyses: any[]): DetectedEmail[] => {
  return analyses.map(analysis => {
    // Extract potential phishing indicators from explanation
    const indicators: string[] = [];
    if (analysis.explanation) {
      const lines = analysis.explanation.split('\n');
      lines.forEach(line => {
        // Extract bullet points or numbered items that might represent indicators
        if (line.trim().startsWith('-') || line.trim().startsWith('•') || /^\d+\.\s/.test(line.trim())) {
          indicators.push(line.trim().replace(/^[-•\d\.]\s*/, ''));
        }
      });
    }
    
    return {
      id: analysis.id,
      subject: analysis.subject || "Analyzed Content",
      sender: analysis.user_id || "Unknown",
      receivedAt: analysis.created_at,
      riskScore: analysis.score,
      riskLevel: analysis.risk_level,
      status: analysis.status || 'new', // Use the status field from database
      indicators: indicators.length > 0 ? indicators : ["Suspicious content detected"],
      excerpt: analysis.message?.substring(0, 200) + (analysis.message?.length > 200 ? '...' : '') || 'No content',
      userEmail: analysis.user_email
    };
  });
};
