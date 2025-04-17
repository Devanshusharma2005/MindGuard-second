import { SecureChat } from "@/components/patient/secure-chat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | Admin | MindGuard",
  description: "Admin messaging center for platform communication",
};

export default function AdminMessagesPage() {
  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with users and healthcare providers
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <SecureChat />
      </div>
    </div>
  );
}