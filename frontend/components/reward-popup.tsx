"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Trophy } from "lucide-react"
import confetti from "canvas-confetti"

interface RewardPopupProps {
  points: number
  onClose: () => void
}

export function RewardPopup({ points, onClose }: RewardPopupProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isChestOpened, setIsChestOpened] = useState(false)

  useEffect(() => {
    if (isChestOpened) {
      // Trigger confetti when chest is opened
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [isChestOpened])

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  const openChest = () => {
    setIsChestOpened(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center text-center p-4">
          <div className="mb-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            Congratulations!
          </div>
          <p className="mb-6">Your task is completed successfully.</p>

          <div className="relative mb-6 cursor-pointer" onClick={!isChestOpened ? openChest : undefined}>
            {!isChestOpened ? (
              <div className="relative w-24 h-24 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg shadow-lg transform transition-all hover:scale-105 flex items-center justify-center">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-r from-amber-700 to-yellow-800 rounded-t-lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-8 bg-amber-900 rounded-sm" />
                </div>
                <div className="absolute bottom-0 w-full text-xs text-amber-200 font-bold">CLICK TO OPEN</div>
              </div>
            ) : (
              <div className="relative w-24 h-24 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg shadow-lg transform transition-all animate-bounce flex items-center justify-center">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-r from-amber-700 to-yellow-800 rounded-t-lg transform -translate-y-4 rotate-12" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Trophy className="h-12 w-12 text-yellow-300 animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {isChestOpened && (
            <div className="mb-6 animate-fade-in">
              <div className="text-xl font-bold mb-2">You earned</div>
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-500">
                +{points} points
              </div>
            </div>
          )}

          <Button onClick={handleClose} className={isChestOpened ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}>
            {isChestOpened ? "Continue Journey" : "Skip Reward"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

