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
import { Search, Filter, MoreVertical } from "lucide-react"

const users = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "PATIENT",
    status: "ACTIVE",
    joinedAt: "2024-03-15T10:00:00",
    lastActive: "2024-03-20T15:30:00",
    avatar: "/avatars/01.png"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    email: "m.chen@example.com",
    role: "THERAPIST",
    status: "ACTIVE",
    joinedAt: "2024-03-14T15:30:00",
    lastActive: "2024-03-20T16:45:00",
    avatar: "/avatars/02.png"
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma.w@example.com",
    role: "PATIENT",
    status: "INACTIVE",
    joinedAt: "2024-03-14T09:15:00",
    lastActive: "2024-03-18T11:20:00",
    avatar: "/avatars/03.png"
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    email: "j.wilson@example.com",
    role: "THERAPIST",
    status: "PENDING",
    joinedAt: "2024-03-13T14:20:00",
    lastActive: "2024-03-20T09:15:00",
    avatar: "/avatars/04.png"
  },
  {
    id: 5,
    name: "Alex Thompson",
    email: "alex.t@example.com",
    role: "ADMIN",
    status: "ACTIVE",
    joinedAt: "2024-03-10T11:00:00",
    lastActive: "2024-03-20T17:00:00",
    avatar: "/avatars/05.png"
  }
]

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter
    const matchesStatus = statusFilter === "ALL" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
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
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="THERAPIST">Therapist</SelectItem>
              <SelectItem value="PATIENT">Patient</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    user.role === 'ADMIN' ? 'default' :
                    user.role === 'THERAPIST' ? 'secondary' : 'outline'
                  }>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    user.status === 'ACTIVE' ? 'success' :
                    user.status === 'PENDING' ? 'warning' : 'secondary'
                  }>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
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