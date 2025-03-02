'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const therapists = [
  {
    id: '1',
    name: 'Dr. Sarah Miller',
    specialty: 'Cognitive Behavioral Therapy',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop',
    status: 'verified',
    joinedAt: '1 day ago',
  },
  {
    id: '2',
    name: 'Dr. Robert Kim',
    specialty: 'Trauma Therapy',
    avatar: '',
    status: 'pending',
    joinedAt: '2 days ago',
  },
  {
    id: '3',
    name: 'Dr. Lisa Patel',
    specialty: 'Anxiety & Depression',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop',
    status: 'verified',
    joinedAt: '3 days ago',
  },
  {
    id: '4',
    name: 'Dr. John Davis',
    specialty: 'Family Therapy',
    avatar: '',
    status: 'pending',
    joinedAt: '5 days ago',
  },
];

export function RecentTherapists() {
  return (
    <div className="space-y-4">
      {therapists.map((therapist) => (
        <div key={therapist.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={therapist.avatar} alt={therapist.name} />
              <AvatarFallback>{therapist.name.charAt(0)}{therapist.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{therapist.name}</p>
              <p className="text-xs text-muted-foreground">{therapist.specialty}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Badge variant={therapist.status === 'verified' ? 'default' : 'secondary'} className="text-xs">
              {therapist.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}