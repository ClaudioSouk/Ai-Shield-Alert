
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { supabase } from '@/lib/supabase';

const ThreatDistributionCard = () => {
  const [data, setData] = useState([
    { name: 'High Risk', value: 0 },
    { name: 'Medium Risk', value: 0 },
    { name: 'Low Risk', value: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: analyses, error } = await supabase
          .from("phishing_analyses")
          .select("risk_level")
          .order("created_at", { ascending: false });
          
        if (error) {
          console.error("Error fetching threat distribution:", error);
          return;
        }
        
        // Count by risk level
        const counts = {
          high: 0,
          medium: 0,
          low: 0
        };
        
        analyses?.forEach(analysis => {
          if (analysis.risk_level in counts) {
            counts[analysis.risk_level]++;
          }
        });
        
        setData([
          { name: 'High Risk', value: counts.high || 0 },
          { name: 'Medium Risk', value: counts.medium || 0 },
          { name: 'Low Risk', value: counts.low || 0 },
        ]);
      } catch (error) {
        console.error("Error in threat distribution:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const COLORS = ['#ef4444', '#f97316', '#6b7280'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : data.every(item => item.value === 0) ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No threat data available yet</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThreatDistributionCard;
