"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock, Users, Video } from "lucide-react";

interface SupportGroupsProps {
  anonymousMode: boolean;
}

const supportGroups = [
  {
    id: 1,
    name: "Anxiety Relief Circle",
    description: "Weekly group sessions focused on anxiety management techniques and mutual support",
    members: 24,
    facilitator: "Dr. Sarah Johnson",
    facilitatorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=256&h=256&auto=format&fit=crop",
    meetingDay: "Mondays",
    meetingTime: "7:00 PM - 8:30 PM",
    format: "virtual",
    tags: ["Anxiety", "Stress", "Beginners Welcome"]
  },
  {
    id: 2,
    name: "Depression Recovery Path",
    description: "Supportive environment for those dealing with depression, focusing on coping strategies and recovery",
    members: 18,
    facilitator: "Dr. Michael Chen",
    facilitatorAvatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=256&h=256&auto=format&fit=crop",
    meetingDay: "Wednesdays",
    meetingTime: "6:00 PM - 7:30 PM",
    format: "virtual",
    tags: ["Depression", "Recovery", "Peer Support"]
  },
  {
    id: 3,
    name: "Mindfulness Meditation Group",
    description: "Guided meditation sessions and discussions on incorporating mindfulness into daily life",
    members: 32,
    facilitator: "Dr. Emily Rodriguez",
    facilitatorAvatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=256&h=256&auto=format&fit=crop",
    meetingDay: "Fridays",
    meetingTime: "5:30 PM - 6:30 PM",
    format: "virtual",
    tags: ["Meditation", "Mindfulness", "Stress Reduction"]
  },
  {
    id: 4,
    name: "Young Adults Support Circle",
    description: "For ages 18-30 dealing with various mental health challenges in this life stage",
    members: 22,
    facilitator: "Dr. James Wilson",
    facilitatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&auto=format&fit=crop",
    meetingDay: "Tuesdays",
    meetingTime: "7:30 PM - 9:00 PM",
    format: "virtual",
    tags: ["Young Adults", "Life Transitions", "Peer Support"]
  },
  {
    id: 5,
    name: "Sleep & Insomnia Support",
    description: "Focused on improving sleep quality and managing insomnia through behavioral techniques",
    members: 16,
    facilitator: "Dr. Lisa Thompson",
    facilitatorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&auto=format&fit=crop",
    meetingDay: "Thursdays",
    meetingTime: "8:00 PM - 9:00 PM",
    format: "virtual",
    tags: ["Sleep", "Insomnia", "Relaxation"]
  }
];

export function SupportGroups({ anonymousMode }: SupportGroupsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {supportGroups.map((group) => (
          <Card key={group.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{group.name}</h3>
                  <Badge variant={group.format === "virtual" ? "outline" : "secondary"} className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    Virtual
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{group.description}</p>
                <div className="flex flex-wrap gap-1">
                  {group.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="mr-1 h-3 w-3" />
                    {group.members} members
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="mr-1 h-3 w-3" />
                    {group.meetingDay}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {group.meetingTime}
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={anonymousMode ? "" : group.facilitatorAvatar} />
                    <AvatarFallback>{group.facilitator.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">
                    Facilitated by {anonymousMode ? "Healthcare Professional" : group.facilitator}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Learn More
                  </Button>
                  <Button size="sm" className="flex-1">
                    Join Group
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-center">
        <Button variant="outline">View All Groups</Button>
      </div>
    </div>
  );
}