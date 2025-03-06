"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface Memory {
  _id: string;
  date: string;
  content: string;
}

const MemoryNotepa

const fetchMemories = async () => {
  try {
    setIsLoading(true);
    const response = await fetch('/api/memories');
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch memories');
    }
    
    const data = await response.json();
    console.log('Fetched memories:', data);
    setMemories(data);
    
    // Set current memory if exists for today
    const todayMemory = data.find((m: Memory) => m.date === today);
    setCurrentMemory(todayMemory?.content || "");
  } catch (error) {
    console.error("Failed to load memories:", error);
    alert("Failed to load memories: " + error.message);
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
        content: currentMemory.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save memory');
    }

    const savedMemory = await response.json();
    console.log('Memory saved:', savedMemory);
    
    await fetchMemories(); // Refresh memories after saving
    alert("Memory saved successfully!");
  } catch (error) {
    console.error("Failed to save memory:", error);
    alert("Failed to save memory: " + error.message);
  } finally {
    setIsSaving(false);
  }
}; 