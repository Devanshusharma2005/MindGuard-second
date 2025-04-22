"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { TaskTimeline } from "@/components/task-timeline"
import { RewardPopup } from "@/components/reward-popup"
import { WalkProgress } from "@/components/walk-progress"
import { ExerciseVideoUpload } from "@/components/patient/exercise-video-upload"
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
  // State for exercise videos
  const [showExerciseUpload, setShowExerciseUpload] = useState(false)
  const [currentExerciseType, setCurrentExerciseType] = useState<"plank" | "pushup" | "squats" | "bicepcurls" | null>(null)

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

  // Helper function to determine exercise type
  const getExerciseType = (taskTitle: string): "plank" | "pushup" | "squats" | "bicepcurls" | null => {
    const title = taskTitle.toLowerCase();
    if (title.includes("plank")) return "plank";
    if (title.includes("push-up") || title.includes("pushup")) return "pushup";
    if (title.includes("squat")) return "squats";
    if (title.includes("bicep curl")) return "bicepcurls";
    return null;
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

    const currentTask = tasks[taskIndex];

    // Check if it's the afternoon walk task
    const isAfternoonWalk = currentTask.title === "Afternoon Walk";
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

    // Check if it's an exercise task that needs video upload
    const exerciseType = getExerciseType(currentTask.title);
    if (exerciseType) {
      try {
        setCurrentExerciseType(exerciseType);
        setShowExerciseUpload(true);
        
        // Safety timer removed - tasks will only complete based on agent responses
        
        return;
      } catch (error) {
        // If there's any error in the exercise process, complete the task anyway
        console.error("Error in exercise task:", error);
        completeTaskWithReward(taskIndex);
        return;
      }
    }

    // For other tasks, complete immediately
    completeTaskWithReward(taskIndex);
  }

  // Function to handle exercise completion
  const handleExerciseComplete = (duration: number) => {
    // Find the current task index
    const taskIndex = currentTaskIndex;
    
    // Log successful completion for debugging
    console.log(`Exercise completed with duration: ${duration}. Completing task at index ${taskIndex}`);
    
    // Store the current task for reference
    const currentTask = tasks[taskIndex];
    console.log(`Task details: ID=${currentTask.id}, Title=${currentTask.title}`);
    
    // Update UI state first before completing the task
    // This helps avoid race conditions where the UI doesn't update properly
    setShowExerciseUpload(false);
    setCurrentExerciseType(null);
    
    // Show immediate feedback to the user
    toast({
      title: "Exercise Completed",
      description: `Great job! You've completed the ${currentTask.title} exercise.`,
    });
    
    // Use a short timeout to ensure state updates have time to propagate
    // before we modify more state with task completion
    setTimeout(() => {
      // Complete the task and give reward
      completeTaskWithReward(taskIndex);
      
      console.log("Task completion and reward process initiated");
    }, 100);
  };

  // Function to handle exercise upload errors
  const handleExerciseError = (error: string) => {
    console.error(`Exercise analysis error: ${error}`);
    
    // Clear UI state immediately
    setShowExerciseUpload(false);
    setCurrentExerciseType(null);
    
    // Show feedback to user
    toast({
      title: "Exercise Recorded",
      description: "We've recorded your exercise completion. Analysis had issues but we've moved you forward.",
      variant: "default",
    });
    
    // Use timeout to ensure UI updates before more state changes
    setTimeout(() => {
      // Still complete the task even if the analysis fails
      // This ensures users don't get stuck
      const taskIndex = currentTaskIndex;
      completeTaskWithReward(taskIndex);
    }, 100);
  };

  // Function to complete a task and give reward
  const completeTaskWithReward = (taskIndex: number) => {
    // No need to clear safety timer as it's been removed
    
    // Add debug logging
    console.log("=== TASK COMPLETION DEBUG ===");
    console.log(`Current task index: ${currentTaskIndex}`);
    console.log(`Completing task at index: ${taskIndex}`);
    console.log(`Total tasks: ${tasks.length}`);

    // Update the task as completed
    const updatedTasks = [...tasks]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      completed: true,
      progress: 100,
    }

    console.log(`Task marked as completed: ${updatedTasks[taskIndex].title}`);
    // We need to setTasks first as a separate operation to ensure state is updated
    setTasks(updatedTasks);

    // Generate random reward points (10-50)
    const points = Math.floor(Math.random() * 41) + 10
    setRewardPoints(points)

    // Only show reward popup if enabled
    if (showRewardPopups) {
      console.log(`Showing reward popup with ${points} points`);
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
    if (taskIndex < tasks.length - 1) {
      console.log(`UNLOCKING NEXT TASK: Moving from ${taskIndex} to ${taskIndex + 1}`);
      console.log(`Next task will be: ${tasks[taskIndex + 1].title}`);
      
      // Force immediate state update and localStorage save
      const nextIndex = taskIndex + 1;
      
      // Store in localStorage first
      localStorage.setItem("mindTrackCurrentTaskIndex", nextIndex.toString());
      
      // Then update React state
      setCurrentTaskIndex(nextIndex);
      
      // Wait a short time to ensure state gets updated
      setTimeout(() => {
        // Confirm the localStorage and state are in sync
        const storedIndex = localStorage.getItem("mindTrackCurrentTaskIndex");
        if (storedIndex !== nextIndex.toString()) {
          console.warn("State update failed, forcing update...");
          localStorage.setItem("mindTrackCurrentTaskIndex", nextIndex.toString());
          setCurrentTaskIndex(nextIndex);
        }
        
        // Show a toast notification
        if (nextIndex < tasks.length) {
          toast({
            title: "Next Task Unlocked!",
            description: `${tasks[nextIndex].title} is now available.`,
          });
        } else {
          toast({
            title: "All Tasks Completed!",
            description: "Congratulations! You've completed all the tasks for today.",
          });
        }
      }, 100);
    } else {
      console.log("All tasks completed, no more tasks to progress to");
    }
    
    console.log("=== END DEBUG ===");
  }

  const closeReward = () => {
    setShowReward(false)
    
    // Force task progression check after popup closes
    // This ensures we don't lose the task progression if it was missed during popup display
    const currentTasksCompleted = tasks.filter(task => task.completed).length;
    console.log(`Popup closed. Total completed tasks: ${currentTasksCompleted}/${tasks.length}`);
    
    // Force re-read from localStorage to ensure we have the latest state
    const savedCurrentTaskIndex = localStorage.getItem("mindTrackCurrentTaskIndex");
    const parsedIndex = savedCurrentTaskIndex ? parseInt(savedCurrentTaskIndex) : currentTaskIndex;
    
    // If localStorage index is different, update it
    if (parsedIndex !== currentTaskIndex) {
      console.log(`Fixing task index desync: localStorage=${parsedIndex}, state=${currentTaskIndex}`);
      setCurrentTaskIndex(parsedIndex);
    }
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
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={resetTasks}>
              Reset Tasks
            </Button>
            {/* Debug button to manually advance to next task */}
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => {
                if (currentTaskIndex < tasks.length - 1) {
                  const nextIndex = currentTaskIndex + 1;
                  console.log(`DEBUG: Manually advancing to task ${nextIndex}`);
                  setCurrentTaskIndex(nextIndex);
                  localStorage.setItem("mindTrackCurrentTaskIndex", nextIndex.toString());
                  toast({
                    title: "Debug: Task Advanced",
                    description: `Manually unlocked ${tasks[nextIndex].title}`,
                  });
                } else {
                  toast({
                    title: "Debug: No More Tasks",
                    description: "Already at the last task",
                    variant: "destructive",
                  });
                }
              }}
            >
              Debug: Next Task
            </Button>
          </div>
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

        {/* Show exercise video upload if an exercise task is active */}
        {showExerciseUpload && currentExerciseType && (
          <div className="max-w-md mx-auto mb-8">
            <ExerciseVideoUpload
              exerciseType={currentExerciseType}
              taskId={tasks[currentTaskIndex]?.id}
              taskTitle={tasks[currentTaskIndex]?.title}
              onExerciseComplete={handleExerciseComplete}
              onExerciseError={handleExerciseError}
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

