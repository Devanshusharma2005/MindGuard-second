"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { TaskTimeline } from "@/components/task-timeline"
import { RewardPopup } from "@/components/reward-popup"
import { WalkProgress } from "@/components/walk-progress"
import type { Task, UserStats } from "@/types"
import { tasks as initialTasks } from "@/data/tasks"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

export default function ChallengesList() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    streak: 0,
    lastCompletedDate: null,
  })
  const [showRewardPopups, setShowRewardPopups] = useState(true)
  const [walkStartTime, setWalkStartTime] = useState<Date | null>(null)
  const [stepCount, setStepCount] = useState(0)
  const initialStepCountRef = useRef<number | null>(null)

  // Load user stats from localStorage on initial render
  useEffect(() => {
    const savedStats = localStorage.getItem("mindTrackUserStats")
    const savedTasks = localStorage.getItem("mindTrackTasks")
    const savedCurrentTaskIndex = localStorage.getItem("mindTrackCurrentTaskIndex")

    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }

    if (savedCurrentTaskIndex) {
      setCurrentTaskIndex(Number.parseInt(savedCurrentTaskIndex))
    }

    // Check streak
    checkStreak()
  }, [])

  // Save user stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("mindTrackUserStats", JSON.stringify(userStats))
  }, [userStats])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("mindTrackTasks", JSON.stringify(tasks))
  }, [tasks])

  // Save current task index to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("mindTrackCurrentTaskIndex", currentTaskIndex.toString())
  }, [currentTaskIndex])

  // Setup step counter when walk starts
  useEffect(() => {
    if (!walkStartTime) return;

    let stepSensor: any = null;

    const startStepCounting = async () => {
      try {
        if ('Sensor' in window && 'StepCounter' in window) {
          stepSensor = new (window as any).StepCounter();
          initialStepCountRef.current = null;

          stepSensor.onreading = () => {
            const currentSteps = stepSensor.steps;
            
            if (initialStepCountRef.current === null) {
              initialStepCountRef.current = currentSteps;
              setStepCount(0);
              return;
            }

            const stepsTaken = currentSteps - initialStepCountRef.current;
            setStepCount(stepsTaken);
          };

          stepSensor.start();
          
          toast({
            title: "Step Counter Active",
            description: "Your steps are being counted automatically.",
          });
        } else {
          toast({
            title: "Step Counter Not Available",
            description: "Using timer-based tracking instead.",
          });
        }
      } catch (error) {
        console.error('Error starting step counter:', error);
        toast({
          title: "Step Counter Error",
          description: "Using timer-based tracking instead.",
        });
      }
    };

    startStepCounting();

    return () => {
      if (stepSensor) {
        stepSensor.stop();
      }
    };
  }, [walkStartTime]);

  const checkStreak = () => {
    const today = new Date().toDateString()
    const lastCompleted = userStats.lastCompletedDate

    if (!lastCompleted) return

    const lastDate = new Date(lastCompleted)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    // If last completed date is before yesterday, reset streak
    if (lastDate < new Date(yesterday.toDateString())) {
      setUserStats((prev) => ({
        ...prev,
        streak: 0,
      }))

      toast({
        title: "Streak Reset",
        description: "You missed a day! Your streak has been reset.",
        variant: "destructive",
      })
    }
  }

  const startWalk = () => {
    setWalkStartTime(new Date());
    setStepCount(0);
    initialStepCountRef.current = null;
    toast({
      title: "Walk Started",
      description: "Your 15-minute walk has begun. Keep moving!",
    });
  };

  const completeTask = (taskId: string) => {
    // Find the task index
    const taskIndex = tasks.findIndex((t) => t.id === taskId)
    if (taskIndex !== currentTaskIndex) {
      toast({
        title: "Task Locked",
        description: "You need to complete the current task first!",
        variant: "destructive",
      })
      return
    }

    // Check if it's the afternoon walk task
    const isAfternoonWalk = tasks[taskIndex].title === "Afternoon Walk";
    if (isAfternoonWalk) {
      if (!walkStartTime) {
        startWalk();
        return;
      }

      const walkDuration = (new Date().getTime() - walkStartTime.getTime()) / (1000 * 60); // Duration in minutes
      const minimumSteps = 1500; // Approximately 1500 steps for a 15-minute walk
      
      if (walkDuration < 15) {
        const remainingMinutes = Math.ceil(15 - walkDuration);
        toast({
          title: "Keep Walking",
          description: `You've taken ${stepCount} steps. Keep going for ${remainingMinutes} more minutes!`,
          variant: "destructive",
        });
        return;
      }
      
      // Reset walk tracking
      setWalkStartTime(null);
    }

    // Update the task as completed
    const updatedTasks = [...tasks]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      completed: true,
      progress: 100,
    }

    setTasks(updatedTasks)

    // Generate random reward points (10-50)
    const points = Math.floor(Math.random() * 41) + 10
    setRewardPoints(points)

    // Only show reward popup if enabled
    if (showRewardPopups) {
      setShowReward(true)
    } else {
      // If popups are disabled, just update the points directly
      const today = new Date().toDateString()
      setUserStats((prev) => ({
        points: prev.points + points,
        streak: prev.lastCompletedDate === today ? prev.streak : prev.streak + 1,
        lastCompletedDate: today,
      }))

      // Show a toast notification instead
      toast({
        title: "Task Completed!",
        description: `You earned ${points} points!`,
      })
    }

    // Update current task index if there are more tasks
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1)
    }
  }

  const closeReward = () => {
    setShowReward(false)
  }

  const resetTasks = () => {
    setTasks(initialTasks)
    setCurrentTaskIndex(0)
    toast({
      title: "Tasks Reset",
      description: "All tasks have been reset. Your points and streak remain.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 bg-[url('/pattern.svg')] bg-fixed">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
            MindTrack Journey
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl">
            Complete daily wellness tasks to earn rewards and maintain your streak. Your mental health journey
            visualized as a path to wellness.
          </p>
          <Button variant="outline" className="mt-4" onClick={resetTasks}>
            Reset Tasks
          </Button>
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRewardPopups(!showRewardPopups)}
              className="text-xs"
            >
              {showRewardPopups ? "Disable" : "Enable"} Reward Popups
            </Button>
            <span className="text-xs text-muted-foreground">
              {showRewardPopups ? "Popups are enabled" : "Using toast notifications instead"}
            </span>
          </div>
        </div>

        {/* Show walk progress if afternoon walk is active */}
        {tasks[currentTaskIndex]?.title === "Afternoon Walk" && (
          <div className="max-w-md mx-auto mb-8">
            <WalkProgress
              startTime={walkStartTime}
              stepCount={stepCount}
              targetSteps={1500}
              targetMinutes={15}
            />
          </div>
        )}

        <TaskTimeline tasks={tasks} currentTaskIndex={currentTaskIndex} onCompleteTask={completeTask} />

        {showReward && <RewardPopup points={rewardPoints} onClose={closeReward} />}
      </main>
      <Toaster />
    </div>
  )
}

