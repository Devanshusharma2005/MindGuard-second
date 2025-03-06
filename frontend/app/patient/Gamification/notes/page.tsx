import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

const MemoryNotepad = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const [memories, setMemories] = useState(() => {
    const savedMemories = localStorage.getItem("memories");
    return savedMemories ? JSON.parse(savedMemories) : {};
  });
  const [memory, setMemory] = useState(memories[today] || "");

  useEffect(() => {
    localStorage.setItem("memories", JSON.stringify(memories));
  }, [memories]);

  const handleSaveMemory = () => {
    setMemories({ ...memories, [today]: memory });
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold">My Memory Diary</h1>
      <p className="text-lg">Today's Date: {today}</p>
      <Card className="w-96 p-4 bg-gray-800 shadow-lg border-2 border-yellow-500 rounded-lg relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-gray-300 rounded-full"></div>
        <CardContent className="flex flex-col space-y-4 p-6 bg-[url('/hindi-notebook.png')] bg-cover bg-no-repeat bg-white rounded-lg border border-gray-300 shadow-md">
          <Textarea
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            placeholder="Write your best memory of the day..."
            className="bg-transparent p-2 text-black text-lg leading-relaxed"
            style={{ fontFamily: "cursive", minHeight: "200px", border: "none", outline: "none" }}
          />
          <Button onClick={handleSaveMemory} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded">
            Save Memory
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryNotepad;