
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface RegionData {
  region: string;
  count: number;
  percentage: number;
}

const GeographicThreatMap = () => {
  const [threatsByRegion, setThreatsByRegion] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get the total number of threats
        const { data: analyses, error } = await supabase
          .from("phishing_analyses")
          .select("id");
          
        if (error) {
          console.error("Error fetching geographic data:", error);
          return;
        }
        
        const totalThreats = analyses?.length || 0;
        
        if (totalThreats === 0) {
          setThreatsByRegion([]);
          return;
        }
        
        // For now, we'll use placeholder regional distribution
        // In a real system, you would store and query the origin region of each threat
        const regions = [
          { region: 'North America', weight: 0.35 },
          { region: 'Europe', weight: 0.25 },
          { region: 'Asia Pacific', weight: 0.20 },
          { region: 'South America', weight: 0.12 },
          { region: 'Africa', weight: 0.08 }
        ];
        
        // Calculate weighted counts based on total threats
        const regionData = regions.map(r => {
          const count = Math.round(totalThreats * r.weight);
          return {
            region: r.region,
            count: count,
            percentage: Math.round((count / totalThreats) * 100)
          };
        });
        
        setThreatsByRegion(regionData);
      } catch (error) {
        console.error("Error in geographic threat map:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Threat Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          <div className="relative w-full max-w-md h-[200px] bg-muted/30 rounded-md overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNDkuOTExIDIzLjkwNEw1Ny43MiA5LjgxOWM0LjE2My03LjQ2NCAxMC44OTgtNy42MzMgMTYuMDcxLS4zMzJsOC4xODUgMTEuNTQ4YzUuMTczIDcuMzAxIC40MTYgMTMuMzEtMTAuNTY1IDEzLjM1NUg1OS44MjFjLTEwLjk4MS4wNDYtMTQuMDcxLTMuOTg1LTkuOTEtMTEuNDg2eiIgZmlsbD0iIzYyYmJmZiIvPjxwYXRoIGQ9Ik0xNjIuOTExIDI1OS45MDRsMTAuODA5LTE0LjA4NWM0LjE2My03LjQ2NCAxMC44OTgtNy42MzMgMTYuMDcxLS4zMzJsOC4xODUgMTEuNTQ4YzUuMTczIDcuMzAxLjQxNiAxMy4zMS0xMC41NjUgMTMuMzU1aC0xMS41OTFjLTEwLjk4MS4wNDYtMTQuMDcxLTMuOTg1LTkuOTEtMTEuNDg2eiIgZmlsbD0iIzYyYmJmZiIvPjxwYXRoIGQ9Ik0zNTAuOTExIDE2OS45MDRsMTUuODA5LTEyLjA4NWM0LjE2My03LjQ2NCAxMC44OTgtNy42MzMgMTYuMDcxLS4zMzJsOC4xODUgMTEuNTQ4YzUuMTczIDcuMzAxLjQxNiAxMy4zMS0xMC41NjUgMTMuMzU1aC0xNi41OTFjLTEwLjk4MS4wNDYtMTQuMDcxLTMuOTg1LTkuOTEtMTEuNDg2eiIgZmlsbD0iIzYyYmJmZiIvPjxwYXRoIGQ9Ik01NDguOTExIDEzMi45MDRsMTIuODA5LTE0LjA4NWM0LjE2My03LjQ2NCAxMC44OTgtNy42MzMgMTYuMDcxLS4zMzJsOC4xODUgMTEuNTQ4YzUuMTczIDcuMzAxLjQxNiAxMy4zMS0xMC41NjUgMTMuMzU1aC0xMy41OTFjLTEwLjk4MS4wNDYtMTQuMDcxLTMuOTg1LTkuOTEtMTEuNDg2eiIgZmlsbD0iIzYyYmJmZiIvPjxwYXRoIGQ9Ik02NzguOTExIDIzLjkwNGwxNC44MDktMTQuMDg1YzQuMTYzLTcuNDY0IDEwLjg5OC03LjYzMyAxNi4wNzEtLjMzMmw4LjE4NSAxMS41NDhjNS4xNzMgNy4zMDEuNDE2IDEzLjMxLTEwLjU2NSAxMy4zNTVoLTE1LjU5MWMtMTAuOTgxLjA0Ni0xNC4wNzEtMy45ODUtOS45MS0xMS40ODZ6IiBmaWxsPSIjNjJiYmZmIi8+PC9zdmc+')]"></div>
            
            {/* Threat hotspots - only show if we have data */}
            {threatsByRegion.length > 0 && (
              <>
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 left-3/5 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute top-2/3 left-1/5 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute top-3/4 left-2/5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="h-[150px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : threatsByRegion.length === 0 ? (
          <div className="h-[150px] flex items-center justify-center">
            <p className="text-muted-foreground">No geographic data available yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {threatsByRegion.map((region) => (
              <div key={region.region} className="flex items-center gap-2">
                <div className="text-sm font-medium w-32">{region.region}:</div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${region.percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm font-medium w-8 text-right">{region.count}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeographicThreatMap;
