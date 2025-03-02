import { Users, Calendar, MessageSquare, Activity } from "lucide-react";
import { RecentAppointments } from "./dashboard/recent-appointments";
import { StatCard } from "./dashboard/stat-card";
import { RecentMessages } from "./dashboard/recent-messages";
import { PatientConditionChart } from "./dashboard/patient-condition-chart";
import { PatientTrendChart } from "./dashboard/patient-trend-chart";
export default function DashboardPage() {
  // Mock data - in a real app, this would come from an API
  const stats = [
    {
      title: "Total Patients",
      value: 248,
      icon: Users,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Appointments Today",
      value: 8,
      icon: Calendar,
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Unread Messages",
      value: 12,
      icon: MessageSquare,
      trend: { value: 3, isPositive: false },
    },
    {
      title: "Recovery Rate",
      value: "78%",
      icon: Activity,
      trend: { value: 7, isPositive: true },
    },
  ];

  const appointments = [
    {
      id: "1",
      patientName: "Sarah Johnson",
      patientImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=128&h=128&auto=format&fit=crop",
      date: "Today",
      time: "9:00 AM",
      status: "upcoming" as const,
      type: "in-person" as const,
    },
    {
      id: "2",
      patientName: "Michael Brown",
      patientImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&h=128&auto=format&fit=crop",
      date: "Today",
      time: "11:30 AM",
      status: "upcoming" as const,
      type: "video" as const,
    },
    {
      id: "3",
      patientName: "Emily Davis",
      patientImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&h=128&auto=format&fit=crop",
      date: "Today",
      time: "2:00 PM",
      status: "upcoming" as const,
      type: "in-person" as const,
    },
    {
      id: "4",
      patientName: "David Wilson",
      patientImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&h=128&auto=format&fit=crop",
      date: "Today",
      time: "4:30 PM",
      status: "upcoming" as const,
      type: "video" as const,
    },
  ];

  const messages = [
    {
      id: "1",
      senderName: "Sarah Johnson",
      senderImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=128&h=128&auto=format&fit=crop",
      content: "Dr. Smith, I've been feeling much better since our last session. The new medication seems to be working well.",
      time: "10 min ago",
      isUnread: true,
    },
    {
      id: "2",
      senderName: "Michael Brown",
      senderImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&h=128&auto=format&fit=crop",
      content: "I'm experiencing some side effects from the medication. Could we discuss this during our appointment today?",
      time: "30 min ago",
      isUnread: true,
    },
    {
      id: "3",
      senderName: "Emily Davis",
      senderImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&h=128&auto=format&fit=crop",
      content: "Thank you for the resources you shared last week. They've been very helpful for managing my anxiety.",
      time: "2 hours ago",
      isUnread: false,
    },
  ];

  const conditionData = [
    { name: "Anxiety", value: 85, color: "hsl(var(--chart-1))" },
    { name: "Depression", value: 67, color: "hsl(var(--chart-2))" },
    { name: "PTSD", value: 42, color: "hsl(var(--chart-3))" },
    { name: "Bipolar", value: 28, color: "hsl(var(--chart-4))" },
    { name: "Other", value: 26, color: "hsl(var(--chart-5))" },
  ];

  const trendData = [
    { name: "Jan", newPatients: 20, recoveredPatients: 10 },
    { name: "Feb", newPatients: 25, recoveredPatients: 15 },
    { name: "Mar", newPatients: 30, recoveredPatients: 20 },
    { name: "Apr", newPatients: 28, recoveredPatients: 22 },
    { name: "May", newPatients: 35, recoveredPatients: 25 },
    { name: "Jun", newPatients: 40, recoveredPatients: 30 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Dr. Smith. Here's an overview of your practice.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RecentAppointments appointments={appointments} />
        <RecentMessages messages={messages} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PatientConditionChart data={conditionData} />
        <PatientTrendChart data={trendData} />
      </div>
    </div>
  );
}