'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, MoreVertical, Star } from "lucide-react"

const therapists = [
  {
    id: 1,
    name: "Dr. Rachel Green",
    email: "dr.green@mindguard.com",
    specialization: "Anxiety & Depression",
    status: "VERIFIED",
    rating: 4.9,
    patientsCount: 45,
    sessionsCompleted: 312,
    joinedAt: "2024-02-15T10:00:00",
    lastActive: "2024-03-20T15:30:00",
    avatar: "/avatars/04.png"
  },
  {
    id: 2,
    name: "Dr. James Wilson",
    email: "dr.wilson@mindguard.com",
    specialization: "Trauma & PTSD",
    status: "PENDING",
    rating: 0,
    patientsCount: 0,
    sessionsCompleted: 0,
    joinedAt: "2024-03-18T14:30:00",
    lastActive: "2024-03-20T16:45:00",
    avatar: "/avatars/05.png"
  },
  {
    id: 3,
    name: "Dr. Maria Garcia",
    email: "dr.garcia@mindguard.com",
    specialization: "Family Therapy",
    status: "VERIFIED",
    rating: 4.7,
    patientsCount: 38,
    sessionsCompleted: 245,
    joinedAt: "2024-02-20T09:15:00",
    lastActive: "2024-03-20T14:20:00",
    avatar: "/avatars/06.png"
  },
  {
    id: 4,
    name: "Dr. Michael Chen",
    email: "dr.chen@mindguard.com",
    specialization: "Cognitive Behavioral Therapy",
    status: "VERIFIED",
    rating: 4.8,
    patientsCount: 42,
    sessionsCompleted: 289,
    joinedAt: "2024-02-10T11:30:00",
    lastActive: "2024-03-20T17:15:00",
    avatar: "/avatars/07.png"
  },
  {
    id: 5,
    name: "Dr. Sarah Miller",
    email: "dr.miller@mindguard.com",
    specialization: "Addiction Recovery",
    status: "ON_LEAVE",
    rating: 4.6,
    patientsCount: 35,
    sessionsCompleted: 198,
    joinedAt: "2024-02-25T13:45:00",
    lastActive: "2024-03-15T09:30:00",
    avatar: "/avatars/08.png"
  }
]

export function TherapistManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [specializationFilter, setSpecializationFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = 
      therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSpecialization = specializationFilter === "ALL" || 
      therapist.specialization === specializationFilter
    const matchesStatus = statusFilter === "ALL" || therapist.status === statusFilter

    return matchesSearch && matchesSpecialization && matchesStatus
  })

  const specializations = Array.from(
    new Set(therapists.map(t => t.specialization))
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search therapists..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Specializations</SelectItem>
              {specializations.map(spec => (
                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="VERIFIED">Verified</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ON_LEAVE">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Therapist</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Patients</TableHead>
              <TableHead>Sessions</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTherapists.map((therapist) => (
              <TableRow key={therapist.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={therapist.avatar} />
                      <AvatarFallback>{therapist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{therapist.name}</p>
                      <p className="text-sm text-muted-foreground">{therapist.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{therapist.specialization}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    therapist.status === 'VERIFIED' ? 'success' :
                    therapist.status === 'PENDING' ? 'warning' : 'secondary'
                  }>
                    {therapist.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm">{therapist.rating || 'N/A'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{therapist.patientsCount}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{therapist.sessionsCompleted}</span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}