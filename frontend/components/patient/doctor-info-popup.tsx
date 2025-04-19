import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar, Mail, Briefcase, Star, Clock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

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
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    email: "",
    hasTestedQuestionnaire: false,
    mentalProblem: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Function to safely open Cal.com URL
  const openCalendarLink = useCallback((url: string) => {
    // Ensure we're opening a valid URL
    try {
      // Use window.open directly instead of relying on Cal.com's embed script
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening calendar link:", error);
      toast({
        title: "Error",
        description: "Could not open booking calendar. Please try again.",
        variant: "destructive"
      });
    }
  }, []);

  const handleChat = () => {
    onClose();
    router.push("/patient/consultations?tab=chat");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = "Age must be a valid number";
    }
    
    if (!formData.gender.trim()) {
      newErrors.gender = "Gender is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.hasTestedQuestionnaire && !formData.mentalProblem) {
      newErrors.mentalProblem = "Please select a mental health concern or check the questionnaire box";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleScheduleMeeting = async () => {
    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Save patient details to extradetailspatients table
      const response = await fetch('/api/patient/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          doctorName: doctor.name,
          doctorSpecialty: doctor.specialty,
          patientName: formData.fullName,
          patientAge: formData.age,
          patientGender: formData.gender,
          patientEmail: formData.email,
          hasCompletedQuestionnaire: formData.hasTestedQuestionnaire,
          mentalHealthConcern: formData.mentalProblem,
          appointmentRequestDate: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save patient details');
      }
      
      // After successful save, open cal.com using our safe method
      openCalendarLink(doctor.bookingLink);
      
      // Close the popup
      onClose();
      
      toast({
        title: "Appointment Request Submitted",
        description: "Your details have been saved. Complete your booking on the calendar page.",
      });
    } catch (error) {
      console.error('Error submitting appointment request:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while saving your details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if the click is directly on the overlay
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      hasTestedQuestionnaire: checked,
      mentalProblem: checked ? "" : prev.mentalProblem // Clear mental problem if questionnaire is checked
    }));
    // Clear error when user checks
    if (errors.mentalProblem) {
      setErrors(prev => ({ ...prev, mentalProblem: '' }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, mentalProblem: value }));
    // Clear error when user selects
    if (errors.mentalProblem) {
      setErrors(prev => ({ ...prev, mentalProblem: '' }));
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <Card className="w-full max-w-2xl max-h-[90vh] relative flex flex-col">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 rounded-full z-10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardContent className="p-0 flex flex-col overflow-hidden">
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
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
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

            {/* Patient Information Form */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Patient Information</h4>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter your age"
                    className={errors.age ? "border-red-500" : ""}
                  />
                  {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Input
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    placeholder="Enter your gender"
                    className={errors.gender ? "border-red-500" : ""}
                  />
                  {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="questionnaire"
                    checked={formData.hasTestedQuestionnaire}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="questionnaire">I have completed the mental health questionnaire</Label>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mentalProblem">Mental Health Concern {!formData.hasTestedQuestionnaire && "*"}</Label>
                  <Select
                    value={formData.mentalProblem}
                    onValueChange={handleSelectChange}
                    disabled={formData.hasTestedQuestionnaire}
                  >
                    <SelectTrigger className={errors.mentalProblem ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a mental health concern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ptsd">PTSD</SelectItem>
                      <SelectItem value="anxiety">Anxiety</SelectItem>
                      <SelectItem value="depression">Depression</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.mentalProblem && <p className="text-sm text-red-500">{errors.mentalProblem}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex gap-4 p-6 border-t bg-background">
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
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 