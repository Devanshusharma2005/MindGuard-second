"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, MicOff, Volume2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionnaireResponse {
  question: string;
  answer: string;
}

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

export function VoiceQuestionnaire() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string>("");
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Load voices when component mounts
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
    return () => {
      // Cleanup on unmount
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("mindguard_user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = crypto.randomUUID();
      localStorage.setItem("mindguard_user_id", newUserId);
      setUserId(newUserId);
    }
  }, []);

  const speakMessage = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(voice => 
          voice.lang.includes('en') && voice.name.includes('Natural')
        ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
        
        if (englishVoice) {
          utterance.voice = englishVoice;
        }

        utterance.lang = 'en-US';
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };

        utterance.onerror = (event) => {
          setIsSpeaking(false);
          reject(event);
        };

        window.speechSynthesis.speak(utterance);
      } else {
        reject(new Error('Speech synthesis not supported'));
      }
    });
  };

  const startListening = () => {
    try {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      const recognition = recognitionRef.current;
      
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setError("");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleResponse(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setError("Failed to recognize speech. Please try again.");
        setIsListening(false);
        // Retry listening after error
        timeoutRef.current = setTimeout(() => {
          if (!isComplete && currentQuestionIndex >= 0) {
            startListening();
          }
        }, 1000);
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
    if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
      const newResponses = [...responses];
      newResponses[currentQuestionIndex] = {
        question: questions[currentQuestionIndex],
        answer: response
      };
      setResponses(newResponses);

      // Add a slightly longer delay to allow for more detailed responses
      timeoutRef.current = setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          handleCompletion(newResponses);
        }
      }, 1500); // Increased delay to 1.5 seconds
    }
  };

  const handleCompletion = async (finalResponses: QuestionnaireResponse[]) => {
    setIsComplete(true);
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    try {
      // Format responses for the backend
      const formattedData = formatResponsesForBackend(finalResponses);
      
      // Add userId to the request body
      const requestBody = {
        ...formattedData,
        user_id: userId
      };

      // Send to backend
      const response = await fetch("http://localhost:5000/health-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Speak completion message
      await speakMessage("Thank you for completing the questionnaire. Your responses have been recorded.");
      
    } catch (error) {
      console.error("Error saving responses:", error);
      setError("Failed to save your responses. Please try again.");
    }
  };

  const formatResponsesForBackend = (responses: QuestionnaireResponse[]) => {
    // Helper function to extract sentiment score (1-10) from response
    const getSentimentScore = (response: string): number => {
      const text = response.toLowerCase();
      // Positive indicators
      if (text.includes('great') || text.includes('excellent') || text.includes('very good')) return 9;
      if (text.includes('good') || text.includes('well') || text.includes('positive')) return 8;
      if (text.includes('okay') || text.includes('fine') || text.includes('alright')) return 6;
      // Negative indicators
      if (text.includes('terrible') || text.includes('awful') || text.includes('very bad')) return 2;
      if (text.includes('bad') || text.includes('poor') || text.includes('not good')) return 3;
      if (text.includes('struggling') || text.includes('difficult')) return 4;
      return 5; // neutral default
    };

    // Helper function to assess anxiety level
    const getAnxietyLevel = (response: string): string => {
      const text = response.toLowerCase();
      if (text.includes('very anxious') || text.includes('extremely') || text.includes('severe')) return 'severe';
      if (text.includes('quite') || text.includes('moderate') || text.includes('somewhat')) return 'moderate';
      if (text.includes('slightly') || text.includes('mild') || text.includes('a little')) return 'mild';
      if (text.includes('calm') || text.includes('relaxed') || text.includes('no anxiety')) return 'none';
      return 'mild'; // default to mild if unclear
    };

    // Helper function to assess physical symptoms
    const getPhysicalSymptomLevel = (response: string): string => {
      const text = response.toLowerCase();
      if (text.includes('no ') || text.includes('none')) return 'none';
      if (text.includes('severe') || text.includes('intense') || text.includes('extreme')) return 'severe';
      if (text.includes('moderate') || text.includes('significant')) return 'moderate';
      return 'mild';
    };

    return {
      mood: getSentimentScore(responses[0].answer),
      anxiety: getAnxietyLevel(responses[1].answer),
      sleep_quality: getSentimentScore(responses[3].answer),
      energy_levels: getSentimentScore(responses[4].answer),
      physical_symptoms: getPhysicalSymptomLevel(responses[10].answer),
      concentration: getSentimentScore(responses[6].answer),
      self_care: responses[8].answer.toLowerCase().includes('no') ? 'none' :
                 responses[8].answer.toLowerCase().includes('little') ? 'minimal' :
                 responses[8].answer.toLowerCase().includes('lot') ? 'extensive' : 'moderate',
      social_interactions: getSentimentScore(responses[7].answer),
      intrusive_thoughts: getPhysicalSymptomLevel(responses[14].answer),
      optimism: getSentimentScore(responses[9].answer),
      stress_factors: responses[14].answer,
      coping_strategies: responses[2].answer,
      social_support: getSentimentScore(responses[7].answer),
      self_harm: responses[13].answer.toLowerCase().includes('no') ? 'none' :
                 responses[13].answer.toLowerCase().includes('thought') ? 'passive' :
                 responses[13].answer.toLowerCase().includes('plan') ? 'active' : 'severe',
      discuss_professional: responses[14].answer,
      // Additional fields for more detailed analysis
      medication_adherence: responses[11].answer,
      substance_use: responses[12].answer,
      appetite_changes: responses[5].answer
    };
  };

  const startQuestionnaire = async () => {
    setIsStarted(true);
    setCurrentQuestionIndex(0);
    setResponses([]);
    setIsComplete(false);
    setError("");

    // More detailed initial instruction
    await speakMessage(
      "I will now ask you several questions about your mental health and well-being. " +
      "Please take your time to answer each question thoroughly and honestly. " +
      "You can speak naturally and provide as much detail as you feel comfortable sharing. " +
      "I'll listen carefully to your responses."
    );
    
    await askCurrentQuestion();
  };

  const askCurrentQuestion = async () => {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
      try {
        // Speak the current question
        await speakMessage(questions[currentQuestionIndex]);
        
        // Start listening after speaking
        timeoutRef.current = setTimeout(() => {
          startListening();
        }, 500);
      } catch (error) {
        console.error("Error speaking question:", error);
        setError("Failed to speak question. Please try again.");
      }
    }
  };

  // Effect to handle question progression
  useEffect(() => {
    if (currentQuestionIndex >= 0 && !isComplete) {
      askCurrentQuestion();
    }
  }, [currentQuestionIndex]);

  return (
    <div className="space-y-4 p-4">
      <Card className="p-6">
        <div className="space-y-4">
          {!isStarted ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Voice Mental Health Assessment</h2>
              <p className="mb-4 text-muted-foreground">
                This assessment will ask you questions about your mental health.
                Please speak your answers naturally after each question.
              </p>
              <Button onClick={startQuestionnaire} size="lg">
                Start Assessment
              </Button>
            </div>
          ) : isComplete ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Assessment Complete</h3>
              <div className="space-y-2">
                {responses.map((response, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <p className="font-medium">{response.question}</p>
                    <p className="text-muted-foreground">{response.answer}</p>
                  </div>
                ))}
              </div>
              <Button onClick={startQuestionnaire} className="mt-4">
                Start New Assessment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h3>
                <div className="flex items-center gap-2">
                  {isSpeaking && <Volume2 className="h-5 w-5 animate-pulse" />}
                  {isListening && <Mic className="h-5 w-5 text-green-500 animate-pulse" />}
                </div>
              </div>

              <p className="text-lg">{questions[currentQuestionIndex]}</p>

              {error && (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              )}

              <div className="h-20 flex items-center justify-center">
                {isListening ? (
                  <div className="flex items-center gap-2">
                    <MicOff className="h-6 w-6 text-red-500" />
                    <span>Listening...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mic className="h-6 w-6" />
                    <span>Processing...</span>
                  </div>
                )}
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
