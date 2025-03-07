"use client"

import { useState, useEffect } from "react"
import type { Task } from "@/types"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { CheckCircle, Circle, Clock, TrendingUp, Brain, Heart, Droplets, Dumbbell, Trophy } from "lucide-react"

interface TaskTimelineProps {
  tasks: Task[]
  currentTaskIndex: number
  onCompleteTask: (taskId: string) => void
}

export function TaskTimeline({ tasks, currentTaskIndex, onCompleteTask }: TaskTimelineProps) {
  const [animatedProgress, setAnimatedProgress] = useState<Record<string, number>>({})

  // Initialize animated progress values
  useEffect(() => {
    const initialProgress: Record<string, number> = {}
    tasks.forEach((task) => {
      initialProgress[task.id] = task.progress || 0
    })
    setAnimatedProgress(initialProgress)
  }, [tasks])

  // Get task icon based on category
  const getTaskIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "meditation":
        return <Brain className="h-5 w-5" />
      case "exercise":
        return <Dumbbell className="h-5 w-5" />
      case "hydration":
        return <Droplets className="h-5 w-5" />
      case "wellness":
        return <Heart className="h-5 w-5" />
      default:
        return <TrendingUp className="h-5 w-5" />
    }
  }

  // Format time to 12-hour format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const formattedHours = hours % 12 || 12
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Central track line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500/50 to-pink-500/50 transform -translate-x-1/2 rounded-full" />

      {/* Train marker (current position) */}
      {currentTaskIndex < tasks.length && (
        <div
          className="absolute left-1/2 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full transform -translate-x-1/2 z-10 shadow-lg shadow-purple-500/20 flex items-center justify-center"
          style={{
            top: `${(currentTaskIndex / tasks.length) * 100}%`,
            transition: "top 0.5s ease-in-out",
          }}
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}

      {tasks.map((task, index) => {
        const isCompleted = task.completed
        const isCurrent = index === currentTaskIndex
        const isPending = index > currentTaskIndex

        // Determine status color
        const statusColor = isCompleted
          ? "from-green-500 to-emerald-500"
          : isCurrent
            ? "from-purple-500 to-pink-500"
            : "from-slate-400 to-slate-500"

        // Determine card position (left or right)
        const isLeft = index % 2 === 0

        return (
          <div key={task.id} className="relative mb-16">
            {/* Time indicator before task */}
            {index === 0 && (
              <div
                className={cn(
                  "absolute top-0 text-sm font-medium text-muted-foreground",
                  isLeft ? "left-[calc(50%+1.5rem)]" : "right-[calc(50%+1.5rem)]",
                )}
              >
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(task.startTime)}</span>
                </div>
              </div>
            )}

            {/* Task card */}
            <div
              className={cn(
                "relative grid gap-2 p-4 rounded-xl transition-all",
                "bg-card border shadow-lg hover:shadow-xl",
                isCurrent && "ring-2 ring-purple-500/50 animate-pulse-slow",
                isLeft ? "mr-[calc(50%+1rem)] rounded-tr-none" : "ml-[calc(50%+1rem)] rounded-tl-none",
              )}
            >
              {/* Task header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("p-1.5 rounded-full bg-gradient-to-br", statusColor)}>
                    {getTaskIcon(task.category)}
                  </div>
                  <h3 className="font-semibold">{task.title}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary">{task.category}</span>
                </div>
              </div>

              {/* Task description */}
              <p className="text-sm text-muted-foreground">{task.description}</p>

              {/* Task progress */}
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Progress</span>
                  <span className="text-xs font-medium">{task.progress}%</span>
                </div>
                <Progress
                  value={task.progress}
                  className={cn(
                    "h-2",
                    isCompleted
                      ? "bg-muted [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-500"
                      : isCurrent
                        ? "bg-muted [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500"
                        : "bg-muted [&>div]:bg-slate-400",
                  )}
                />
              </div>

              {/* Reward indicator */}
              <div className="flex items-center gap-2 mt-1">
                <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                  Reward: {task.reward}
                </div>
              </div>

              {/* Action button */}
              <Button
                className={cn(
                  "mt-2 w-full",
                  isCompleted
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : isCurrent
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-muted text-muted-foreground",
                )}
                disabled={isCompleted || isPending}
                onClick={() => onCompleteTask(task.id)}
              >
                {isCompleted ? "Completed" : isCurrent ? "Complete Task" : "Locked"}
              </Button>
            </div>

            {/* Status circle */}
            <div
              className={cn(
                "absolute left-1/2 top-12 w-8 h-8 rounded-full transform -translate-x-1/2 z-10",
                "flex items-center justify-center border-2",
                isCompleted
                  ? "border-green-500 bg-green-500/20"
                  : isCurrent
                    ? "border-purple-500 bg-purple-500/20 animate-pulse"
                    : "border-slate-400 bg-slate-400/20",
              )}
            >
              {isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className={cn("h-5 w-5", isCurrent ? "text-purple-500" : "text-slate-400")} />
              )}
            </div>

            {/* Task number */}
            <div
              className={cn(
                "absolute top-12 text-xs font-bold",
                isLeft ? "left-[calc(50%-3rem)]" : "right-[calc(50%-3rem)]",
              )}
            >
              {index + 1}
            </div>

            {/* Time indicator after task */}
            {index === tasks.length - 1 && (
              <div
                className={cn(
                  "absolute bottom-0 text-sm font-medium text-muted-foreground",
                  isLeft ? "left-[calc(50%+1.5rem)]" : "right-[calc(50%+1.5rem)]",
                )}
              >
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(task.endTime)}</span>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Final destination */}
      <div className="relative mt-8 mb-16">
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center z-10">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        <div className="text-center pt-6 pb-2 px-4 max-w-xs mx-auto rounded-lg bg-card border shadow-md">
          <h3 className="font-semibold">Final Destination</h3>
          <p className="text-sm text-muted-foreground">Complete all tasks to reach your wellness goal!</p>
        </div>
      </div>
    </div>
  )
}

