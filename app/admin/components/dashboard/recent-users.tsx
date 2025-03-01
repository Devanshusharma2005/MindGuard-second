'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const users = [
  {
    id: '1',
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    status: 'active',
    joinedAt: '2 hours ago',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    avatar: '',
    status: 'active',
    joinedAt: '5 hours ago',
  },
  {
    id: '3',
    name: 'Sophia Rodriguez',
    email: 'sophia.r@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
    status: 'active',
    joinedAt: '1 day ago',
  },
  {
    id: '4',
    name: 'James Johnson',
    email: 'james.j@example.com',
    avatar: '',
    status: 'active',
    joinedAt: '2 days ago',
  },
];

export function RecentUsers() {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="text-xs">
              {user.joinedAt}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}