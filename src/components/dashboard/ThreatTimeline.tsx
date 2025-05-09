
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';
import { format, subDays, startOfDay, endOfDay, parseISO } from 'date-fns';

interface TimelineData {
  name: string;
  threats: number;
  safe: number;
}

const ThreatTimeline = () => {
  const [data, setData] = useState<TimelineData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get the last 7 days of data
        const today = new Date();
        const lastWeekData: TimelineData[] = [];
        
        for (let i = 6; i >= 0; i--) {
          const date = subDays(today, i);
          const dayName = format(date, 'EEE');
          lastWeekData.push({
            name: dayName,
            threats: 0,
            safe: 0
          });
        }
        
        // Fetch all analyses from the last 7 days
        const startDate = format(subDays(today, 6), 'yyyy-MM-dd');
        const { data: analyses, error } = await supabase
          .from("phishing_analyses")
          .select("created_at, risk_level, status")
          .gte("created_at", startDate);
          
        if (error) {
          console.error("Error fetching threat timeline:", error);
          return;
        }
        
        // Process the analyses data
        analyses?.forEach(analysis => {
          try {
            const date = parseISO(analysis.created_at);
            const dayIndex = 6 - Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            
            if (dayIndex >= 0 && dayIndex < 7) {
              lastWeekData[dayIndex].threats++;
              
              if (analysis.status === 'safe') {
                lastWeekData[dayIndex].safe++;
              }
            }
          } catch (e) {
            console.error("Error processing date:", e);
          }
        });
        
        setData(lastWeekData);
      } catch (error) {
        console.error("Error in threat timeline:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Weekly Threat Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : data.every(item => item.threats === 0) ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No threat data available for the past week</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="threats" fill="#f97316" name="Detected Threats" />
                <Bar dataKey="safe" fill="#10b981" name="Safe Messages" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThreatTimeline;
