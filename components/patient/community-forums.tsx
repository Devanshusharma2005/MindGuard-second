"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, ThumbsUp, Users } from "lucide-react";

interface CommunityForumsProps {
  anonymousMode: boolean;
}

const forumTopics = [
  {
    id: 1,
    title: "Anxiety Management Strategies",
    description: "Share and discuss effective techniques for managing anxiety in daily life",
    members: 1245,
    posts: 324,
    lastActive: "10 minutes ago"
  },
  {
    id: 2,
    title: "Depression Support",
    description: "A safe space to discuss depression, treatment options, and recovery journeys",
    members: 987,
    posts: 256,
    lastActive: "1 hour ago"
  },
  {
    id: 3,
    title: "Mindfulness & Meditation",
    description: "Learn and share mindfulness practices and meditation techniques",
    members: 756,
    posts: 189,
    lastActive: "3 hours ago"
  },
  {
    id: 4,
    title: "Sleep Improvement",
    description: "Discuss sleep hygiene, insomnia, and strategies for better rest",
    members: 543,
    posts: 142,
    lastActive: "Yesterday"
  },
  {
    id: 5,
    title: "Stress Management",
    description: "Share tips and support for managing stress in work and personal life",
    members: 876,
    posts: 231,
    lastActive: "2 days ago"
  }
];

const popularPosts = [
  {
    id: 1,
    title: "How I overcame panic attacks using the 5-4-3-2-1 technique",
    author: "Sarah M.",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&h=256&auto=format&fit=crop",
    forum: "Anxiety Management Strategies",
    likes: 87,
    comments: 34,
    time: "2 days ago"
  },
  {
    id: 2,
    title: "My experience with cognitive behavioral therapy (CBT)",
    author: "Anonymous",
    authorAvatar: "",
    forum: "Depression Support",
    likes: 65,
    comments: 28,
    time: "3 days ago"
  },
  {
    id: 3,
    title: "A simple 10-minute meditation that changed my life",
    author: "Michael K.",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&auto=format&fit=crop",
    forum: "Mindfulness & Meditation",
    likes: 112,
    comments: 45,
    time: "1 week ago"
  }
];

export function CommunityForums({ anonymousMode }: CommunityForumsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search forums and posts..."
            className="pl-8"
          />
        </div>
        <Button>New Post</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-medium">Discussion Forums</h3>
          {forumTopics.map((topic) => (
            <Card key={topic.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{topic.title}</h4>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                    </div>
                    <Button variant="outline" size="sm">Join</Button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {topic.members} members
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="mr-1 h-3 w-3" />
                      {topic.posts} posts
                    </div>
                    <div>Last active: {topic.lastActive}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Popular Posts</h3>
          {popularPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={anonymousMode ? "" : post.authorAvatar} />
                      <AvatarFallback>{post.author[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {anonymousMode ? "Anonymous" : post.author}
                    </span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {post.forum}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{post.title}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        {post.likes}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        {post.comments}
                      </div>
                    </div>
                    <div>{post.time}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" className="w-full">View More</Button>
        </div>
      </div>
    </div>
  );
}