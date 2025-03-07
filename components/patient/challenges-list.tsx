"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";

export default function ChallengesList() {
  const [challenges] = useState([
    {
      id: 1,
      name: "Daily Meditation",
      description: "Complete a 10-minute meditation session",
      points: 50
    },
    {
      id: 2,
      name: "Gratitude Journal",
      description: "Write 3 things you're grateful for",
      points: 30
    },
    // Add more challenges as needed
  ]);

  const handleCompleteChallenge = async (challenge) => {
    try {
      const response = await fetch('/api/rewards/points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId: challenge.id,
          points: challenge.points,
          description: `Completed ${challenge.name}`
        })
      });

      const { success } = await response.json();
      if (success) {
        alert(`Congratulations! You earned ${challenge.points} points!`);
      }
    } catch (error) {
      console.error('Failed to award points:', error);
    }
  };

  return (
    <div className="grid gap-4">
      {challenges.map((challenge) => (
        <div key={challenge.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">{challenge.name}</h3>
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
            <p className="text-sm font-medium text-green-600">{challenge.points} points</p>
          </div>
          <Button onClick={() => handleCompleteChallenge(challenge)}>
            Complete
          </Button>
        </div>
      ))}
    </div>
  );
} 