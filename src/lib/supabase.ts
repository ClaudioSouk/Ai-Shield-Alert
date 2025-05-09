
import { createClient } from '@supabase/supabase-js';

// Use the values from the integrations/supabase/client.ts file
const supabaseUrl = "https://mutkltxqouslkneswzyz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dGtsdHhxb3VzbGtuZXN3enl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNDg3MDksImV4cCI6MjA2MTgyNDcwOX0.HJelC_PkL_M5A6B_nMr9geJ5ImfiLegDBQgSFFxu6y4";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

export interface DetectedEmail {
  id: string;
  subject: string;
  sender: string;
  receivedAt: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'new' | 'reviewed' | 'safe' | 'reported';
  indicators: string[];
  excerpt: string;
  userEmail?: string;
  created_at?: string;
}

export interface DashboardStats {
  totalDetected: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  totalReported: number;
  totalSafe: number;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
