"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your AI mental health assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: 2,
    role: "user",
    content: "I've been feeling anxious about an upcoming presentation at work.",
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString()
  },
  {
    id: 3,
    role: "assistant",
    content: "I understand presentation anxiety can be challenging. Would you like some quick relaxation techniques you can use before your presentation, or would you prefer to explore the root causes of your anxiety?",
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString()
  },
  {
    id: 4,
    role: "user",
    content: "I'd like some relaxation techniques I can use right before the presentation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString()
  },
  {
    id: 5,
    role: "assistant",
    content: "Here are three effective techniques you can use right before your presentation:\n\n1. **Box Breathing**: Inhale for 4 counts, hold for 4 counts, exhale for 4 counts, hold for 4 counts. Repeat 4 times.\n\n2. **Progressive Muscle Relaxation**: Tense and then release each muscle group in your body, starting from your toes and working up to your head.\n\n3. **Visualization**: Spend 2 minutes imagining yourself delivering the presentation confidently and successfully.\n\nWould you like me to explain any of these in more detail?",
    timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString()
  }
];

const suggestedQuestions = [
  "How can I improve my sleep quality?",
  "What are some mindfulness exercises for anxiety?",
  "Can you suggest some self-care activities?",
  "How do I recognize signs of burnout?"
];

export function AIChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage("");

    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        role: "assistant",
        content: "I understand your concern. This is a simulated response. In a real application, I would provide personalized guidance based on your message.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleSuggestedQuestion = (question: string) => {
    setNewMessage(question);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-[600px] flex-col rounded-md border overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="flex items-start gap-3 max-w-[80%]">
                {message.role === "assistant" && (
                  <Avatar className="mt-0.5">
                    <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="whitespace-pre-line text-sm">{message.content}</div>
                  <p className="mt-1 text-right text-xs opacity-70">{formatTime(message.timestamp)}</p>
                </div>
                {message.role === "user" && (
                  <Avatar className="mt-0.5">
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="mb-4">
          <p className="mb-2 text-xs text-muted-foreground">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon" className="h-10 w-10">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          This AI assistant provides general guidance and is not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
}