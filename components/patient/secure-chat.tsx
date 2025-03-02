"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send } from "lucide-react";

const conversations = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    specialty: "Psychiatrist",
    lastMessage: "How are you feeling with the new medication?",
    time: "2 hours ago",
    unread: true,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=256&h=256&auto=format&fit=crop"
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "Therapist",
    lastMessage: "Remember to practice those breathing exercises we discussed.",
    time: "Yesterday",
    unread: false,
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=256&h=256&auto=format&fit=crop"
  },
  {
    id: 3,
    doctor: "Dr. Emily Rodriguez",
    specialty: "Clinical Psychologist",
    lastMessage: "Your sleep journal looks good. Let's discuss it in our next session.",
    time: "3 days ago",
    unread: false,
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=256&h=256&auto=format&fit=crop"
  }
];

const messages = [
  {
    id: 1,
    sender: "doctor",
    content: "Hello Jessica, how are you feeling with the new medication? Have you noticed any side effects?",
    time: "10:30 AM",
    read: true
  },
  {
    id: 2,
    sender: "patient",
    content: "Hi Dr. Johnson, I've been taking it for 5 days now. I noticed some mild nausea in the first two days, but it's better now. My sleep has improved slightly.",
    time: "10:45 AM",
    read: true
  },
  {
    id: 3,
    sender: "doctor",
    content: "That's good to hear. Mild nausea is common in the first few days but should continue to improve. How about your anxiety symptoms?",
    time: "11:00 AM",
    read: true
  },
  {
    id: 4,
    sender: "patient",
    content: "I think they're a bit better, especially in the mornings. I still get anxious in social situations though.",
    time: "11:15 AM",
    read: true
  },
  {
    id: 5,
    sender: "doctor",
    content: "It typically takes 2-3 weeks to see the full effects on anxiety. Keep taking it as prescribed and we'll evaluate at your next appointment. Would you like to schedule a follow-up sooner?",
    time: "11:30 AM",
    read: false
  }
];

export function SecureChat() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="flex h-[600px] flex-col md:flex-row border rounded-md overflow-hidden">
      <div className="w-full border-r md:w-1/3">
        <div className="p-3 border-b">
          <p className="font-medium">Your Conversations</p>
        </div>
        <ScrollArea className="h-[calc(600px-57px)]">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex cursor-pointer items-center gap-3 border-b p-3 transition-colors hover:bg-accent/50 ${
                selectedConversation.id === conversation.id ? "bg-accent" : ""
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <Avatar>
                <AvatarImage src={conversation.avatar} />
                <AvatarFallback>{conversation.doctor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">{conversation.doctor}</p>
                  <p className="text-xs text-muted-foreground">{conversation.time}</p>
                </div>
                <p className="text-xs text-muted-foreground">{conversation.specialty}</p>
                <p className={`text-xs truncate ${conversation.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unread && (
                <div className="h-2 w-2 rounded-full bg-primary"></div>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-3 border-b p-3">
          <Avatar>
            <AvatarImage src={selectedConversation.avatar} />
            <AvatarFallback>{selectedConversation.doctor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{selectedConversation.doctor}</p>
            <p className="text-xs text-muted-foreground">{selectedConversation.specialty}</p>
          </div>
        </div>
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "patient"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="mt-1 text-right text-xs opacity-70">{message.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t p-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button size="icon" className="h-9 w-9">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            This is a secure, HIPAA-compliant messaging system. Your conversation is encrypted and private.
          </p>
        </div>
      </div>
    </div>
  );
}