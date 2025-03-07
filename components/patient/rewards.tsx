"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Rewards() {
  const [activeTab, setActiveTab] = useState("badges");
  const [userRewards, setUserRewards] = useState({
    points: 0,
    badges: [],
    redeemedRewards: [],
    totalPoints: 0,
    earnedPoints: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeRewards();
  }, []);

  const initializeRewards = async () => {
    try {
      const response = await fetch('/api/rewards');
      const { data } = await response.json();
      
      if (!data) {
        // If no rewards exist, create initial rewards with 0 points
        const initResponse = await fetch('/api/rewards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'INITIALIZE',
            data: {
              points: 0,
              badges: [],
              redeemedRewards: [],
              totalPoints: 0,
              earnedPoints: []
            }
          })
        });
        const { data: initialData } = await initResponse.json();
        setUserRewards(initialData);
      } else {
        setUserRewards(data);
      }
    } catch (error) {
      console.error('Failed to initialize rewards:', error);
      // Set default state if initialization fails
      setUserRewards({
        points: 0,
        badges: [],
        redeemedRewards: [],
        totalPoints: 0,
        earnedPoints: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async (reward) => {
    try {
      const response = await fetch('/api/rewards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'REDEEM_REWARD',
          data: {
            name: reward.name,
            description: reward.description,
            icon: reward.icon,
            pointsCost: reward.cost
          }
        })
      });

      const { success, data, error } = await response.json();
      if (success) {
        setUserRewards(data);
        alert('Reward redeemed successfully');
      } else {
        console.error('Failed to redeem reward:', error);
        alert('Failed to redeem reward');
      }
    } catch (error) {
      console.error('Failed to redeem reward:', error);
      alert('Failed to redeem reward');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-bold">{userRewards.totalPoints || 0}</div>
          <div className="text-muted-foreground">Total Points</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-bold">{userRewards.badges.length}</div>
          <div className="text-muted-foreground">Badges Earned</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-bold">{userRewards.redeemedRewards.length}</div>
          <div className="text-muted-foreground">Rewards Redeemed</div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="points">Points History</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="redeem">Redeem Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="points">
          <Card>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium mt-4">Points History</h3>
              {userRewards.earnedPoints?.map((entry, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b">
                  <div>
                    <p className="font-medium">{entry.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(entry.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">+{entry.amount} points</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* ... other tabs content ... */}
      </Tabs>
    </div>
  );
} 