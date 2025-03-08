"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, MicOff, Volume2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Update questions to be more conversational
const questions = [
  "How would you describe your mood today? Please explain how you're feeling.",
  "Could you describe your anxiety levels today? Are you feeling calm, slightly worried, or very anxious?",
  "Tell me about your stress levels. How are you coping with daily pressures?",
  "How did you sleep last night? Please describe the quality and duration of your sleep.",
  "How are your energy levels today? Do you feel energetic, tired, or somewhere in between?",
  "How would you describe your appetite today? Have there been any changes in your eating patterns?",
  "How is your ability to focus and concentrate today? Are you finding it easy or difficult to stay on task?",
  "Tell me about your social interactions today. Have you been connecting with others?",
  "What physical activities have you done today? How active have you been?",
  "How would you describe your motivation levels today? What's driving you or holding you back?",
  "Are you experiencing any physical symptoms? Please describe them in detail.",
  "Have you been taking your prescribed medications? Please tell me about your medication routine.",
  "Have you used any substances in the last 24 hours? If comfortable, please provide details.",
  "Have you had any thoughts of self-harm? Please be honest and know that help is available.",
  "What specific things are causing you distress today? Please describe any concerns or worries."
];

interface VoiceQuestionnaireProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function VoiceQuestionnaire({ onSubmit, isLoading }: VoiceQuestionnaireProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [responses, setResponses] = useState<Array<{ question: string; answer: string }>>([]);
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<'idle' | 'active' | 'completed'>('idle');

  const startListening = () => {
    try {
      setIsListening(true);
      setError("");

      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        console.log("Speech recognition started");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        setIsListening(false);
        handleResponse(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setError("Failed to recognize speech. Please try again.");
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      console.error("Speech recognition error:", error);
      setError("Speech recognition is not supported in this browser");
      setIsListening(false);
    }
  };

  const handleResponse = (response: string) => {
    // Store the response with its question
    const newResponse = {
      question: questions[currentQuestionIndex],
      answer: response
    };
    
    const newResponses = [...responses, newResponse];
    setResponses(newResponses);

    // Move to next question or complete
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscript("");
    } else {
      // Format data to match the health tracking backend expectations
      const formattedData = {
        user_id: localStorage.getItem("mindguard_user_id"),
        assessmentType: "voice",
        timestamp: new Date().toISOString(),
        // Map responses to match the backend validation schema
        mood: extractNumericValue(newResponses[0].answer, 5), // Default to 5 if can't extract
        anxiety: mapAnxietyLevel(newResponses[1].answer),
        sleep_quality: extractNumericValue(newResponses[3].answer, 5),
        energy_levels: extractNumericValue(newResponses[4].answer, 5),
        physical_symptoms: mapSymptomSeverity(newResponses[10].answer),
        concentration: extractNumericValue(newResponses[6].answer, 5),
        self_care: mapSelfCare(newResponses[8].answer), // Physical activity question
        social_interactions: extractNumericValue(newResponses[7].answer, 5),
        intrusive_thoughts: mapIntrusiveThoughts(newResponses[13].answer), // Self-harm question
        optimism: extractNumericValue(newResponses[9].answer, 5), // Motivation question
        stress_factors: newResponses[2].answer, // Stress question
        coping_strategies: extractCopingStrategies(newResponses),
        social_support: extractNumericValue(newResponses[7].answer, 5),
        self_harm: mapSelfHarmLevel(newResponses[13].answer),
        discuss_professional: newResponses[14].answer,
        
        // Include raw responses for the report generator
        raw_responses: newResponses.map(r => ({
          question: r.question,
          answer: r.answer
        }))
      };

      setStatus('completed');
      onSubmit(formattedData);
    }
  };

  // Helper functions to map voice responses to expected backend format
  const extractNumericValue = (text: string, defaultValue: number): number => {
    const numbers = {
      'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
    };
    
    const words = text.toLowerCase().split(' ');
    
    // Try to find a direct number
    const directNumber = parseInt(text);
    if (!isNaN(directNumber) && directNumber >= 0 && directNumber <= 10) {
      return directNumber;
    }

    // Look for number words
    for (const word of words) {
      if (numbers[word] !== undefined) {
        return numbers[word];
      }
    }

    // Map descriptive terms to numbers
    if (text.match(/excellent|great|very good|perfect/i)) return 9;
    if (text.match(/good|well|fine/i)) return 7;
    if (text.match(/okay|average|moderate/i)) return 5;
    if (text.match(/poor|bad|not good/i)) return 3;
    if (text.match(/terrible|awful|very bad/i)) return 1;

    return defaultValue;
  };

  const mapAnxietyLevel = (text: string): string => {
    text = text.toLowerCase();
    if (text.match(/severe|extreme|very anxious|panic|overwhelming/)) return 'severe';
    if (text.match(/moderate|quite|somewhat|worried/)) return 'moderate';
    if (text.match(/mild|slight|little|minimal/)) return 'mild';
    if (text.match(/no|none|calm|relaxed|peaceful/)) return 'none';
    return 'moderate'; // Default
  };

  const mapSymptomSeverity = (text: string): string => {
    text = text.toLowerCase();
    if (text.match(/severe|extreme|intense|many|lot/)) return 'severe';
    if (text.match(/moderate|some|several|noticeable/)) return 'moderate';
    if (text.match(/mild|slight|few|minor/)) return 'mild';
    if (text.match(/no|none|nothing|healthy/)) return 'none';
    return 'none'; // Default
  };

  const mapSelfCare = (text: string): string => {
    text = text.toLowerCase();
    if (text.match(/lot|extensive|many|very active|regular/)) return 'extensive';
    if (text.match(/moderate|some|average|few/)) return 'moderate';
    if (text.match(/minimal|little|barely|not much/)) return 'minimal';
    if (text.match(/no|none|nothing|haven't/)) return 'none';
    return 'minimal'; // Default
  };

  const mapIntrusiveThoughts = (text: string): string => {
    text = text.toLowerCase();
    if (text.match(/severe|constant|overwhelming|many|lot/)) return 'severe';
    if (text.match(/moderate|some|several|noticeable/)) return 'moderate';
    if (text.match(/mild|slight|few|minor|sometimes/)) return 'mild';
    if (text.match(/no|none|nothing/)) return 'none';
    return 'none'; // Default
  };

  const mapSelfHarmLevel = (text: string): string => {
    text = text.toLowerCase();
    if (text.match(/severe|active|plan|want to|going to/)) return 'severe';
    if (text.match(/yes|thoughts|thinking|considered/)) return 'active';
    if (text.match(/sometimes|passive|mild|slight/)) return 'passive';
    if (text.match(/no|none|never|not/)) return 'none';
    return 'none'; // Default
  };

  const extractCopingStrategies = (responses: Array<{ question: string; answer: string }>): string => {
    // Combine relevant responses about coping
    const copingText = [
      responses[8].answer, // Physical activities
      responses[11].answer, // Medication
      responses[7].answer  // Social interactions
    ].join(' ');
    
    return copingText || 'No specific coping strategies mentioned';
  };

  const startAssessment = () => {
    setStatus('active');
    setCurrentQuestionIndex(0);
    setResponses([]);
    setTranscript("");
    setError("");
  };

  if (status === 'completed') {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-xl font-bold mb-4">Voice Assessment Completed</h3>
        <p className="text-muted-foreground mb-4">
          Thank you for completing the voice assessment. Your responses have been recorded and are being analyzed.
        </p>
        <div className="space-y-4">
          <h4 className="font-medium">Your Responses:</h4>
          {responses.map((response, i) => (
            <div key={i} className="text-left p-4 bg-muted rounded-lg">
              <p className="font-medium">{response.question}</p>
              <p className="text-muted-foreground">{response.answer}</p>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setStatus('idle');
            setResponses([]);
            setTranscript("");
          }}
          className="mt-6"
          disabled={isLoading}
        >
          Start New Assessment
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {status === 'idle' ? (
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold">Voice-Based Mental Health Assessment</h3>
          <p className="text-muted-foreground">
            This assessment will guide you through 15 questions about your mental health.
            Please speak clearly and naturally when answering.
          </p>
          <div className="space-y-4">
            <div className="flex flex-col gap-2 items-center justify-center p-4 border rounded-lg bg-muted/50">
              <Volume2 className="h-8 w-8 text-primary" />
              <p className="font-medium">Answer questions by speaking naturally</p>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center p-4 border rounded-lg bg-muted/50">
              <Mic className="h-8 w-8 text-primary" />
              <p className="font-medium">15 questions to answer</p>
            </div>
          </div>
          <Button 
            onClick={startAssessment}
            disabled={isLoading}
            className="w-full max-w-sm"
          >
            Start Voice Assessment
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h3>
              <Progress 
                value={(currentQuestionIndex / questions.length) * 100} 
                className="w-1/3" 
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-lg font-medium">{questions[currentQuestionIndex]}</p>
            
            {transcript && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">Your response:</p>
                <p className="text-muted-foreground">{transcript}</p>
              </div>
            )}

            <div className="flex justify-center gap-4">
              {!isListening ? (
                <Button
                  onClick={startListening}
                  disabled={isLoading}
                  className={cn(
                    "w-full max-w-sm",
                    isListening && "bg-destructive hover:bg-destructive/90"
                  )}
                >
                  <Mic className={cn("mr-2 h-4 w-4", isListening && "animate-pulse")} />
                  Start Speaking
                </Button>
              ) : (
                <Button
                  onClick={() => setIsListening(false)}
                  variant="destructive"
                  className="w-full max-w-sm"
                >
                  <MicOff className="mr-2 h-4 w-4" />
                  Stop Recording
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
