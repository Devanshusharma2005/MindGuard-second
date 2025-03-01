"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare, Phone, Video } from "lucide-react";

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual API data
  const conversations = [
    {
      id: "1",
      patientName: "Sarah Johnson",
      patientImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=128&h=128&auto=format&fit=crop",
      lastMessage: "Thank you for the session today, doctor.",
      time: "5 mins ago",
      unread: true,
      status: "online"
    },
    {
      id: "2",
      patientName: "Michael Brown",
      patientImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&h=128&auto=format&fit=crop",
      lastMessage: "Can we reschedule tomorrow's appointment?",
      time: "2 hours ago",
      unread: true,
      status: "offline"
    },
    {
      id: "3",
      patientName: "Emily Davis",
      patientImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&h=128&auto=format&fit=crop",
      lastMessage: "I've been following the exercises you suggested",
      time: "Yesterday",
      unread: false,
      status: "online"
    }
  ];

  const filteredConversations = conversations.filter(conversation =>
    conversation.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with your patients securely
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" />
            Call
          </Button>
          <Button variant="outline">
            <Video className="mr-2 h-4 w-4" />
            Video Chat
          </Button>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Conversations List */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Your recent message threads</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center space-x-4 rounded-lg border p-3 hover:bg-accent cursor-pointer"
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.patientImage} />
                      <AvatarFallback>{conversation.patientName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                      conversation.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{conversation.patientName}</p>
                      <span className="text-xs text-muted-foreground">
                        {conversation.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread && (
                    <Badge className="ml-auto flex h-6 w-6 items-center justify-center rounded-full">
                      •
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={conversations[0].patientImage} />
                <AvatarFallback>{conversations[0].patientName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{conversations[0].patientName}</CardTitle>
                <CardDescription>
                  {conversations[0].status === 'online' ? 'Online' : 'Offline'}
                </CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] space-y-4 overflow-y-auto border rounded-lg p-4 mb-4">
              {/* Example Messages */}
              <div className="flex justify-start">
                <div className="rounded-lg bg-accent p-4 max-w-[80%]">
                  <p className="text-sm">Hello Dr., I wanted to discuss my progress.</p>
                  <span className="text-xs text-muted-foreground">10:30 AM</span>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="rounded-lg bg-primary p-4 max-w-[80%] text-primary-foreground">
                  <p className="text-sm">Of course! How are you feeling since our last session?</p>
                  <span className="text-xs opacity-70">10:32 AM</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
