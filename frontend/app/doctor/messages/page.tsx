"use client";

import { useState, useEffect, useRef } from "react";
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
import { Search, MessageSquare, Phone, Video, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { userIdKey, userTypeKey, tokenKey, apiUrl } from "@/lib/config";
import { formatDistanceToNow } from "date-fns";

interface Participant {
  id: string;
  name: string;
  role: string;
  profileImage: string | null;
  specialty?: string | null;
}

interface Conversation {
  id: string;
  _id?: string;
  participants: Participant[];
  lastMessage: {
    content: string;
    timestamp: string;
    senderId: string;
  } | null;
  unreadCount: number;
  updatedAt: string;
  createdAt: string;
  title: string;
}

interface ChatMessage {
  id: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  error?: boolean;
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [userType, setUserType] = useState<"patient" | "doctor" | "admin">("doctor");
  const [token, setToken] = useState<string>("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  // Initialize user data
  useEffect(() => {
    // Get user info from local storage
    const storedUserId = localStorage.getItem(userIdKey);
    const storedUserType = localStorage.getItem(userTypeKey) as "patient" | "doctor" | "admin";
    const storedToken = localStorage.getItem(tokenKey);

    if (storedUserId && storedUserType && storedToken) {
      setUserId(storedUserId);
      setUserType(storedUserType);
      setToken(storedToken);
      console.log("User data found:", { userId: storedUserId, userType: storedUserType, hasToken: !!storedToken });
    } else {
      console.error("Missing user data:", { 
        hasUserId: !!storedUserId, 
        hasUserType: !!storedUserType, 
        hasToken: !!storedToken 
      });
      setFetchError("Authentication required. Please log in again.");
      setIsLoading(false);
      toast({
        title: "Authentication Error",
        description: "You need to log in to use the chat",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Fetch conversations when user ID is available
  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const conversationId = getConversationId(selectedConversation);
      if (conversationId) {
        console.log(`Fetching messages for conversation ID: ${conversationId}`);
        fetchMessages(conversationId);
        
        // Mark messages as read
        if (selectedConversation.unreadCount > 0) {
          markMessagesAsRead(conversationId);
        }
      } else {
        console.warn("Selected conversation has no valid ID", selectedConversation);
      }
    }
  }, [selectedConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Helper function to get conversation ID regardless of format
  const getConversationId = (conversation: any): string | undefined => {
    if (!conversation) return undefined;
    return conversation.id || conversation._id;
  };

  // Fetch conversations
  const fetchConversations = async () => {
    if (!userId) return;
    
    console.log("Fetching conversations for user:", userId);
    setIsLoading(true);
    setFetchError(null);
    
    try {
      const response = await fetch(
        `${apiUrl}/api/chat/conversations/${userId}?page=1&limit=10`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );
      
      console.log("Conversations response status:", response.status);
      
      if (!response.ok) {
        let errorText = "";
        try {
          const errorData = await response.json();
          errorText = JSON.stringify(errorData);
        } catch (e) {
          errorText = await response.text();
        }
        
        console.error("Error response:", errorText);
        throw new Error(`Status ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
      }
      
      const data = await response.json();
      console.log("Raw conversations data:", data);
      
      if (data.success) {
        if (data.conversations && data.conversations.length > 0) {
          // Format conversations to ensure participants are properly structured
          const formattedConversations = data.conversations.map((conv: any) => {
            console.log("Processing conversation:", conv);
            
            // Filter out current user from participants
            const otherParticipants = Array.isArray(conv.participants) 
              ? conv.participants.filter((p: any) => {
                  const participantId = p.id || p.userId || p.user;
                  console.log(`Comparing participant ID ${participantId} with current user ID ${userId}`);
                  return participantId !== userId;
                })
              : [];
            
            // Ensure each participant has the required fields
            const formattedParticipants = otherParticipants.map((p: any) => {
              // Extract participant ID from various possible fields
              const id = p.id || p.userId || p.user;
              
              // Extract name from various possible fields
              const name = p.name || p.fullName || p.username || 'Unknown User';
              
              return {
                id,
                name,
                role: p.role || 'unknown',
                profileImage: p.profileImage || null,
                specialty: p.specialty || p.specialization || null
              };
            });

            return {
              ...conv,
              participants: formattedParticipants
            };
          });

          console.log("Final formatted conversations:", formattedConversations);
          setConversations(formattedConversations);
          
          // Select the first conversation by default
          if (formattedConversations.length > 0 && !selectedConversation) {
            setSelectedConversation(formattedConversations[0]);
          }
        } else {
          console.log("No conversations found");
        }
      } else {
        throw new Error("API returned success: false");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setFetchError(`Error fetching conversations: ${errorMessage}`);
      
      toast({
        title: "Error",
        description: `Failed to load conversations: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: string) => {
    if (!userId || !conversationId) {
      console.log(`Missing required data: userId=${userId}, conversationId=${conversationId}`);
      return;
    }
    
    console.log(`Fetching messages for conversation ${conversationId}...`);
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/chat/messages/${conversationId}?userId=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Messages response:", data);
      
      if (data.success) {
        const formattedMessages = data.data.map((msg: any) => ({
          id: msg._id,
          sender: {
            id: msg.sender.id,
            name: msg.sender.name,
            role: msg.sender.model === 'User' ? 'patient' : 
                 msg.sender.model === 'Doctor' ? 'doctor' : 'admin'
          },
          content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content || ''),
          timestamp: msg.createdAt,
          status: msg.readBy.some((r: any) => r.user !== userId) ? 'read' : 'delivered'
        }));
        
        setMessages(formattedMessages as ChatMessage[]);
      } else {
        console.log("No messages found or unexpected response format:", data);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive"
      });
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (conversationId: string) => {
    if (!userId) return;
    
    try {
      const response = await fetch(
        `${apiUrl}/api/chat/messages/read/${conversationId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ userId })
        }
      );
      
      if (response.ok) {
        // Update the unread count in the conversations list
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
          )
        );
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !userId || sendingMessage) return;
    
    const messageContent = newMessage.trim();
    setNewMessage("");
    setSendingMessage(true);
    
    // Optimistically add the message to the UI
    const tempMessageId = crypto.randomUUID();
    const tempMessage: ChatMessage = {
      id: tempMessageId,
      sender: {
        id: userId,
        name: "You", // This will be replaced with the actual user name
        role: userType
      },
      content: messageContent,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, tempMessage]);
    
    try {
      const response = await fetch(
        `${apiUrl}/api/chat/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            conversationId: getConversationId(selectedConversation),
            senderId: userId,
            content: messageContent
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Update the message status and ID
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === tempMessageId ? { ...msg, id: data.message._id, status: 'delivered' } : msg
          )
        );
        
        // Update the conversation with the new message
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            getConversationId(conv) === getConversationId(selectedConversation) 
              ? { 
                  ...conv, 
                  lastMessage: {
                    content: messageContent,
                    timestamp: new Date().toISOString(),
                    senderId: userId
                  },
                  updatedAt: new Date().toISOString() 
                } 
              : conv
          )
        );
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Mark message as failed
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessageId 
          ? { ...msg, error: true, status: 'sent' } 
          : msg
      ));
      
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setSendingMessage(false);
    }
  };

  // Time formatting helper
  const formatTime = (timestamp: string): string => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "Unknown time";
    }
  };

  // Filter conversations based on search query
  const filteredConversations = searchQuery
    ? conversations.filter(conv => {
        // Check if any participant's name contains the search query
        return conv.participants.some(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
      })
    : conversations;

  // Render loading state
  if (isLoading && conversations.length === 0 && !fetchError) {
    return (
      <div className="flex flex-col h-[600px] items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading your conversations...</p>
      </div>
    );
  }

  // Render error state
  if (fetchError) {
    return (
      <div className="flex flex-col h-[600px] items-center justify-center p-4">
        <Alert variant="destructive" className="mb-4 max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
        <Button onClick={fetchConversations}>Try Again</Button>
      </div>
    );
  }

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
          <Button onClick={fetchConversations}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Refresh
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
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  {searchQuery ? "No conversations match your search" : "No conversations yet"}
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  // Get the other participant
                  const otherParticipant = conversation.participants[0] || {
                    name: "Unknown",
                    role: "unknown",
                    profileImage: null
                  };
                  
                  const isSelected = selectedConversation?.id === conversation.id || 
                                  selectedConversation?._id === conversation._id;
                  
                  return (
                <div
                      key={conversation.id || conversation._id}
                      className={`flex items-center space-x-4 rounded-lg border p-3 hover:bg-accent cursor-pointer ${
                        isSelected ? "bg-accent" : ""
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="relative">
                    <Avatar>
                          {otherParticipant.profileImage ? (
                            <AvatarImage src={otherParticipant.profileImage} />
                          ) : null}
                          <AvatarFallback>
                            {otherParticipant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                    </Avatar>
                        <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-gray-400`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                          <p className="font-medium">{otherParticipant.name}</p>
                      <span className="text-xs text-muted-foreground">
                            {conversation.lastMessage ? formatTime(conversation.lastMessage.timestamp) : "New"}
                      </span>
                    </div>
                        <p className="text-sm text-muted-foreground capitalize">
                          {otherParticipant.role}
                        </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                          {conversation.lastMessage ? conversation.lastMessage.content : "No messages yet"}
                    </p>
                  </div>
                      {conversation.unreadCount > 0 && (
                    <Badge className="ml-auto flex h-6 w-6 items-center justify-center rounded-full">
                          {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="col-span-2">
          {selectedConversation ? (
            <>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                    {selectedConversation.participants[0]?.profileImage ? (
                      <AvatarImage src={selectedConversation.participants[0].profileImage} />
                    ) : (
                      <AvatarFallback>
                        {selectedConversation.participants[0]?.name.split(' ').map(n => n[0]).join('') || '?'}
                      </AvatarFallback>
                    )}
              </Avatar>
              <div>
                    <CardTitle>{selectedConversation.participants[0]?.name || "Unknown User"}</CardTitle>
                <CardDescription>
                      {selectedConversation.participants[0]?.role || "User"}
                      {selectedConversation.participants[0]?.specialty 
                        ? ` • ${selectedConversation.participants[0].specialty}` 
                        : ''}
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
                <ScrollArea className="h-[500px] space-y-4 overflow-y-auto border rounded-lg p-4 mb-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 my-8">
                      <p>No messages yet</p>
                      <p className="text-sm">Send a message to start the conversation</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender.id === userId ? "justify-end" : "justify-start"} mb-4`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender.id === userId
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                </div>
              </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </ScrollArea>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-1" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim() || sendingMessage}>
                    {sendingMessage ? <Spinner size="sm" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[600px]">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No conversation selected</h3>
              <p className="text-muted-foreground">Select a conversation to view messages</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
