
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format, parseISO, subHours } from 'date-fns';

interface ActivityData {
  time: string;
  value: number;
}

const RealTimeThreatMonitor = () => {
  const [data, setData] = useState<ActivityData[]>([]);
  const [alertCount, setAlertCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Function to fetch threat data from Supabase
  const fetchThreatData = async () => {
    try {
      // Get analyses from the last 6 hours, grouped by 30-minute intervals
      const sixHoursAgo = format(subHours(new Date(), 6), 'yyyy-MM-dd HH:mm:ss');
      
      const { data: analyses, error } = await supabase
        .from("phishing_analyses")
        .select("created_at, risk_level")
        .gte("created_at", sixHoursAgo)
        .order("created_at", { ascending: true });
      
      if (error) {
        console.error("Error fetching analysis activity data:", error);
        return;
      }
      
      // Count high-risk analyses as alerts
      const highRiskCount = analyses?.filter(a => a.risk_level === 'high').length || 0;
      setAlertCount(highRiskCount);
      
      // Group analyses by 30-minute intervals
      const intervals: ActivityData[] = [];
      const now = new Date();
      
      // Create 12 empty intervals (6 hours with 30-minute intervals)
      for (let i = 11; i >= 0; i--) {
        const time = subHours(now, i / 2);
        intervals.push({
          time: format(time, 'HH:mm'),
          value: 0
        });
      }
      
      // Fill in the data
      analyses?.forEach(analysis => {
        try {
          const timestamp = parseISO(analysis.created_at);
          const timeDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 30); // time difference in 30-minute intervals
          const intervalIndex = 11 - Math.floor(timeDiff);
          
          if (intervalIndex >= 0 && intervalIndex < 12) {
            // Add 1 for any threat, add more for higher risk
            if (analysis.risk_level === 'high') {
              intervals[intervalIndex].value += 3;
            } else if (analysis.risk_level === 'medium') {
              intervals[intervalIndex].value += 2;
            } else {
              intervals[intervalIndex].value += 1;
            }
          }
        } catch (e) {
          console.error("Error processing timestamp:", e);
        }
      });
      
      setData(intervals);
    } catch (error) {
      console.error("Error in fetchThreatData:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchThreatData();
    
    // Refresh data every 3 minutes
    const interval = setInterval(fetchThreatData, 3 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Recent Analysis Activity</CardTitle>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Bell className="h-4 w-4 text-amber-500" />
          <span className="text-amber-500">{alertCount} Alerts</span>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading analysis data...</p>
          </div>
        ) : data.every(item => item.value === 0) ? (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">No analyses performed in the last 6 hours</p>
          </div>
        ) : (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Analysis activity - Last 6 hours (manually analyzed emails only)
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeThreatMonitor;
