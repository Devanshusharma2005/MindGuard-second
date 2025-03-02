import { DashboardOverview } from "@/components/patient/dashboard-overview";
import { UpcomingAppointments } from "@/components/patient/upcoming-appointments";
import { MoodTracker } from "@/components/patient/mood-tracker";
import { WellnessScore } from "@/components/patient/wellness-score";
import { RecommendedActivities } from "@/components/patient/recommended-activities";
import { CommunityHighlights } from "@/components/patient/community-highlights";

export default function PatientDashboard() {
  return (
    <div className="space-y-8">
      <DashboardOverview />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <WellnessScore />
        <MoodTracker />
        <UpcomingAppointments />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <RecommendedActivities />
        <CommunityHighlights />
      </div>
    </div>
  );
}