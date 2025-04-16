import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar, Mail, Briefcase, Star, Clock, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface DoctorInfoPopupProps {
  doctor: {
    id: number;
    name: string;
    email: string;
    specialty: string;
    yearsOfExperience: number;
    rating: number;
    reviews: number;
    avatar: string;
    available: boolean;
    bookingLink: string;
  };
  onClose: () => void;
}

export function DoctorInfoPopup({ doctor, onClose }: DoctorInfoPopupProps) {
  const router = useRouter();

  const handleChat = () => {
    onClose();
    router.push("/patient/consultations?tab=chat");
  };

  const handleScheduleMeeting = () => {
    window.open(doctor.bookingLink, "_blank");
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if the click is directly on the overlay
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <Card className="w-full max-w-2xl mx-4 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardContent className="p-0">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-t-lg">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={doctor.avatar} />
                <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold">{doctor.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-sm">
                    {doctor.specialty}
                  </Badge>
                  {doctor.available ? (
                    <Badge variant="outline" className="text-sm">Available</Badge>
                  ) : (
                    <Badge variant="outline" className="text-sm text-red-500">Unavailable</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Contact Information</h4>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-5 w-5" />
                <span>{doctor.email}</span>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Professional Information</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-5 w-5" />
                  <span>{doctor.specialty}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>{doctor.yearsOfExperience} years of experience</span>
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Rating</h4>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span className="ml-1 font-medium">{doctor.rating}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <Button 
                className="flex-1" 
                onClick={handleChat}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Chat
              </Button>
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={handleScheduleMeeting}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 