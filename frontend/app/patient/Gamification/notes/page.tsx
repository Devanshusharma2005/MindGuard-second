"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface Memory {
  date: string;
  content: string;
  _id: string;
}

const MemoryNotepad = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const [memories, setMemories] = useState<Memory[]>([]);
  const [currentMemory, setCurrentMemory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const response = await fetch('/api/memories');
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      const data = await response.json();
      setMemories(data);
      
      // Set current memory if exists for today
      const todayMemory = data.find((m: Memory) => m.date === today);
      setCurrentMemory(todayMemory?.content || "");
    } catch (error) {
      console.error("Failed to load memories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMemory = async () => {
    if (!currentMemory.trim()) {
      alert("Please write something before saving");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: today,
          content: currentMemory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save memory');
      }

      const data = await response.json();
      await fetchMemories(); // Refresh memories after saving
      alert("Memory saved successfully!");
    } catch (error) {
      console.error("Failed to save memory:", error);
      alert(error instanceof Error ? error.message : "Failed to save memory");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 space-y-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold">My Memory Diary</h1>
      <p className="text-lg">Today's Date: {today}</p>
      <Card className="w-96 p-4 bg-gray-800 shadow-lg border-2 border-yellow-500 rounded-lg relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-gray-300 rounded-full"></div>
        <CardContent className="flex flex-col space-y-4 p-6 bg-[url('/hindi-notebook.png')] bg-cover bg-no-repeat bg-white rounded-lg border border-gray-300 shadow-md">
          <Textarea
            value={currentMemory}
            onChange={(e) => setCurrentMemory(e.target.value)}
            placeholder="Write your best memory of the day..."
            className="bg-transparent p-2 text-black text-lg leading-relaxed"
            style={{ fontFamily: "cursive", minHeight: "200px", border: "none", outline: "none" }}
          />
          <Button 
            onClick={handleSaveMemory} 
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Memory'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryNotepad;