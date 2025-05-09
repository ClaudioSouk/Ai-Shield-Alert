
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserHistory from '@/components/UserHistory';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ThreatDistributionCard from '@/components/dashboard/ThreatDistributionCard';
import StatCard from '@/components/dashboard/StatCard';
import DetectionTable from '@/components/dashboard/DetectionTable';
import ExportReportButton from '@/components/dashboard/ExportReportButton';
import AlertRulesCard from '@/components/dashboard/AlertRulesCard';
import RealTimeThreatMonitor from '@/components/dashboard/RealTimeThreatMonitor';
import GeographicThreatMap from '@/components/dashboard/GeographicThreatMap';
import ThreatTimeline from '@/components/dashboard/ThreatTimeline';
import { Shield, ShieldAlert, User, Settings, ChartBar, Clock, BarChart2, Map, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import AnalysisSettings from '@/components/AnalysisSettings';
import { DetectedEmail } from '@/lib/supabase';
import { getUserAlertRules, updateAlertRule, fetchUserPhishingAnalyses, getDashboardStats, updateDetectionStatus, convertAnalysesToDetections } from '@/services/phishingService';
import { useToast } from '@/hooks/use-toast';
import { AlertRule } from '@/services/phishingService';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [isLoadingRules, setIsLoadingRules] = useState(true);
  const [rulesError, setRulesError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // New states for real data
  const [userStats, setUserStats] = useState({
    emailsAnalyzed: 0,
    threatsDetected: 0,
    safeEmails: 0,
    averageRiskScore: 0,
  });
  const [detections, setDetections] = useState<DetectedEmail[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingDetections, setIsLoadingDetections] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        setIsLoadingRules(true);
        setRulesError(null);
        const rules = await getUserAlertRules();
        setAlertRules(rules || []);
      } catch (error) {
        console.error('Error fetching alert rules:', error);
        setRulesError("Failed to load alert rules. Please try again later.");
        toast({
          title: "Failed to load rules",
          description: "There was a problem loading your alert rules.",
          variant: "destructive"
        });
        // Set to empty array to prevent undefined
        setAlertRules([]);
      } finally {
        setIsLoadingRules(false);
      }
    };

    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        setDataError(null);
        const stats = await getDashboardStats();
        
        // Calculate average risk score
        let avgScore = 0;
        if (stats.totalDetected > 0) {
          avgScore = Math.round(
            ((stats.highRisk * 85) + (stats.mediumRisk * 65) + (stats.lowRisk * 30)) / 
            stats.totalDetected
          );
        }

        setUserStats({
          emailsAnalyzed: stats.totalDetected,
          threatsDetected: stats.highRisk + stats.mediumRisk,
          safeEmails: stats.lowRisk + stats.totalSafe,
          averageRiskScore: avgScore
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setDataError("Failed to load dashboard statistics.");
        toast({
          title: "Failed to load stats",
          description: "There was a problem loading your dashboard statistics.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    const fetchDetections = async () => {
      try {
        setIsLoadingDetections(true);
        const analyses = await fetchUserPhishingAnalyses();
        const convertedDetections = convertAnalysesToDetections(analyses);
        setDetections(convertedDetections);
      } catch (error) {
        console.error('Error fetching detections:', error);
        toast({
          title: "Failed to load detections",
          description: "There was a problem loading your email detections.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingDetections(false);
      }
    };

    if (isAuthenticated) {
      fetchRules();
      fetchStats();
      fetchDetections();
    }
  }, [isAuthenticated, toast]);

  if (!isAuthenticated) {
    navigate("/auth?action=signup");
    return null;
  }

  const handleMarkSafe = async (id: string) => {
    try {
      await updateDetectionStatus(id, 'safe');
      toast({
        title: "Marked as safe",
        description: "The email has been marked as safe."
      });
      // Update the detections list
      setDetections(prev => 
        prev.map(item => item.id === id ? { ...item, status: 'safe' } : item)
      );
    } catch (error) {
      console.error('Error marking as safe:', error);
      toast({
        title: "Action failed",
        description: "Could not mark the email as safe.",
        variant: "destructive"
      });
    }
  };

  const handleReport = async (id: string) => {
    try {
      await updateDetectionStatus(id, 'reported');
      toast({
        title: "Reported",
        description: "The email has been reported as phishing."
      });
      // Update the detections list
      setDetections(prev => 
        prev.map(item => item.id === id ? { ...item, status: 'reported' } : item)
      );
    } catch (error) {
      console.error('Error reporting:', error);
      toast({
        title: "Action failed",
        description: "Could not report the email.",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (id: string) => {
    // This is handled in the DetectionTable component via dialog
  };

  const handleRuleToggle = async (id: string, enabled: boolean) => {
    try {
      await updateAlertRule(id, { enabled });
      setAlertRules(rules => 
        rules.map(rule => rule.id === id ? { ...rule, enabled } : rule)
      );
      toast({
        title: "Rule updated",
        description: `Rule has been ${enabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      console.error('Error updating rule:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating the rule.",
        variant: "destructive"
      });
    }
  };

  const handleSensitivityChange = async (id: string, sensitivity: string) => {
    try {
      await updateAlertRule(id, { sensitivity });
      setAlertRules(rules => 
        rules.map(rule => rule.id === id ? { ...rule, sensitivity } : rule)
      );
      toast({
        title: "Sensitivity updated",
        description: `Rule sensitivity set to ${sensitivity}.`,
      });
    } catch (error) {
      console.error('Error updating sensitivity:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating the sensitivity.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container px-4 md:px-6 py-10">
      <DashboardHeader 
        title="Security Dashboard" 
        description="Monitor and manage your phishing security"
      />
      
      <div className="mt-8">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center border-b mb-6">
            <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:w-auto">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <ChartBar className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="detections" className="flex items-center gap-1">
                <ShieldAlert className="h-4 w-4" />
                <span className="hidden sm:inline">Detections</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
              <TabsTrigger value="rules" className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Rules</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
            <div className="hidden md:flex gap-2">
              <ExportReportButton />
              <Button variant="outline" onClick={() => navigate("/analyzer")}>Analyze New Email</Button>
            </div>
          </div>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoadingStats ? (
                Array(4).fill(0).map((_, idx) => (
                  <div key={idx} className="h-[100px] bg-muted/20 animate-pulse rounded-lg"></div>
                ))
              ) : (
                <>
                  <StatCard
                    title="Emails Analyzed"
                    value={userStats.emailsAnalyzed}
                    icon={<User className="h-4 w-4 text-gray-500" />}
                  />
                  <StatCard
                    title="Threats Detected"
                    value={userStats.threatsDetected}
                    icon={<ShieldAlert className="h-4 w-4 text-red-500" />}
                  />
                  <StatCard
                    title="Safe Emails"
                    value={userStats.safeEmails}
                    icon={<Shield className="h-4 w-4 text-green-500" />}
                  />
                  <StatCard
                    title="Average Risk Score"
                    value={`${userStats.averageRiskScore}%`}
                    icon={<BarChart2 className="h-4 w-4 text-gray-500" />}
                  />
                </>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ThreatDistributionCard />
              <ThreatTimeline />
            </div>
            <GeographicThreatMap />
            <RealTimeThreatMonitor />
          </TabsContent>
          
          <TabsContent value="detections" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recent Detections</h2>
              <p className="text-muted-foreground">
                Review recent threats and take action
              </p>
            </div>
            {isLoadingDetections ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">Loading detections...</p>
                </div>
              </div>
            ) : detections.length === 0 ? (
              <div className="bg-muted/20 rounded-lg p-8 text-center">
                <ShieldAlert className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Detections Yet</h3>
                <p className="text-muted-foreground mb-6">You haven't analyzed any emails yet or no threats have been detected.</p>
                <Button onClick={() => navigate("/analyzer")}>Analyze Your First Email</Button>
              </div>
            ) : (
              <DetectionTable
                detections={detections}
                onMarkSafe={handleMarkSafe}
                onReport={handleReport}
                onViewDetails={handleViewDetails}
              />
            )}
          </TabsContent>
          
          <TabsContent value="history">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Analysis History</h2>
              </div>
              <UserHistory />
            </div>
          </TabsContent>
          
          <TabsContent value="rules">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Alert Rules</h2>
                <p className="text-muted-foreground">
                  Configure how alerts are triggered
                </p>
              </div>
              {rulesError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{rulesError}</AlertDescription>
                </Alert>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {isLoadingRules ? (
                    <div className="col-span-2 flex justify-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        <p className="text-sm text-muted-foreground">Loading rules...</p>
                      </div>
                    </div>
                  ) : (
                    <AlertRulesCard 
                      rules={alertRules} 
                      onRuleToggle={handleRuleToggle}
                      onSensitivityChange={handleSensitivityChange}
                    />
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Analysis Settings</h2>
                <p className="text-muted-foreground">
                  Configure detection thresholds and accuracy preferences
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <AnalysisSettings />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
