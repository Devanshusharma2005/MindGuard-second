"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock, Trophy } from "lucide-react";

const activeChallenges = [
  {
    id: 1,
    title: "7-Day Mindfulness Challenge",
    description: "Practice mindfulness meditation for at least 10 minutes each day",
    category: "Mindfulness",
    progress: 57,
    daysCompleted: 4,
    totalDays: 7,
    reward: "Silver Mindfulness Badge",
    deadline: "3 days left"
  },
  {
    id: 2,
    title: "Gratitude Journal",
    description: "Write down 3 things you're grateful for each day",
    category: "Self-reflection",
    progress: 40,
    daysCompleted: 4,
    totalDays: 10,
    reward: "Gratitude Master Badge",
    deadline: "6 days left"
  },
  {
    id: 3,
    title: "Mood Tracking Streak",
    description: "Record your mood consistently every day",
    category: "Self-awareness",
    progress: 80,
    daysCompleted: 24,
    totalDays: 30,
    reward: "Premium Content Unlock",
    deadline: "6 days left"
  }
];

const availableChallenges = [
  {
    id: 4,
    title: "Nature Connection",
    description: "Spend at least 20 minutes outdoors in nature each day",
    category: "Physical Wellbeing",
    duration: "14 days",
    difficulty: "Easy",
    reward: "Nature Explorer Badge"
  },
  {
    id: 5,
    title: "Digital Detox",
    description: "Reduce screen time by 50% and practice being present",
    category: "Mindfulness",
    duration: "7 days",
    difficulty: "Medium",
    reward: "Digital Balance Badge"
  },
  {
    id: 6,
    title: "Sleep Improvement",
    description: "Maintain a consistent sleep schedule and practice good sleep hygiene",
    category: "Physical Wellbeing",
    duration: "21 days",
    difficulty: "Medium",
    reward: "Sleep Master Badge + 15% discount on premium features"
  },
  {
    id: 7,
    title: "Anxiety Management Toolkit",
    description: "Learn and practice a new anxiety management technique each day",
    category: "Stress Management",
    duration: "10 days",
    difficulty: "Medium",
    reward: "Anxiety Management Badge"
  },
  {
    id: 8,
    title: "Social Connection",
    description: "Reach out to a friend or family member each day",
    category: "Social Wellbeing",
    duration: "7 days",
    difficulty: "Easy",
    reward: "Connection Champion Badge"
  }
];

const completedChallenges = [
  {
    id: 9,
    title: "5-Day Meditation Challenge",
    description: "Complete a guided meditation session each day",
    category: "Mindfulness",
    completedDate: "May 15, 2025",
    reward: "Meditation Beginner Badge"
  },
  {
    id: 10,
    title: "Positive Affirmations",
    description: "Practice daily positive affirmations for self-esteem",
    category: "Self-care",
    completedDate: "April 28, 2025",
    reward: "Positivity Badge"
  }
];

export function ChallengesList() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Challenges</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          {activeChallenges.map((challenge) => (
            <Card key={challenge.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{challenge.title}</h3>
                        <Badge variant="outline">{challenge.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {challenge.deadline}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{challenge.daysCompleted}/{challenge.totalDays} days</span>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Trophy className="mr-1 h-3 w-3" />
                      Reward: {challenge.reward}
                    </div>
                    <Button variant="outline" size="sm">
                      Check In Today
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="available" className="space-y-4">
          {availableChallenges.map((challenge) => (
            <Card key={challenge.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{challenge.title}</h3>
                        <Badge variant="outline">{challenge.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                    </div>
                    <Badge variant="secondary">{challenge.difficulty}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      Duration: {challenge.duration}
                    </div>
                    <div className="flex items-center">
                      <Trophy className="mr-1 h-3 w-3" />
                      Reward: {challenge.reward}
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    Start Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          {completedChallenges.map((challenge) => (
            <Card key={challenge.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{challenge.title}</h3>
                        <Badge variant="outline">{challenge.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <div>Completed on: {challenge.completedDate}</div>
                        <div className="flex items-center">
                          <Trophy className="mr-1 h-3 w-3" />
                          Reward: {challenge.reward}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}