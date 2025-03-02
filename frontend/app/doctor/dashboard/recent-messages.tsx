import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  senderName: string;
  senderImage?: string;
  content: string;
  time: string;
  isUnread: boolean;
}

interface RecentMessagesProps {
  messages: Message[];
}

export function RecentMessages({ messages }: RecentMessagesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Messages</CardTitle>
        <CardDescription>
          You have {messages.filter((m) => m.isUnread).length} unread messages.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex items-start space-x-4 rounded-md border p-4"
            >
              <Avatar>
                <AvatarImage src={message.senderImage} />
                <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{message.senderName}</p>
                  <span className="text-xs text-muted-foreground">{message.time}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
              </div>
              {message.isUnread && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
          ))}
          <Button variant="outline" className="w-full">View All Messages</Button>
        </div>
      </CardContent>
    </Card>
  );
}