"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

interface HealthQuestionnaireProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const initialQuestions = [
  {
    id: 1,
    question: "How would you rate your overall mood today?",
    type: "slider",
    min: 1,
    max: 10,
    step: 1,
    labels: ["Very low", "Neutral", "Very high"],
    answer: 5
  },
  {
    id: 2,
    question: "Have you experienced any anxiety symptoms in the past 24 hours?",
    type: "radio",
    options: [
      { value: "none", label: "None at all" },
      { value: "mild", label: "Mild symptoms" },
      { value: "moderate", label: "Moderate symptoms" },
      { value: "severe", label: "Severe symptoms" }
    ],
    answer: ""
  },
  {
    id: 3,
    question: "How would you rate your sleep quality last night?",
    type: "slider",
    min: 1,
    max: 10,
    step: 1,
    labels: ["Very poor", "Average", "Excellent"],
    answer: 5
  },
  {
    id: 4,
    question: "Have you engaged in any self-care activities today?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ],
    answer: ""
  },
  {
    id: 5,
    question: "Is there anything specific causing you stress right now?",
    type: "textarea",
    answer: ""
  }
];

export function HealthQuestionnaire({ onSubmit, isLoading }: HealthQuestionnaireProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [userId, setUserId] = useState<string>("");

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

  const handleSliderChange = (value: number[]) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].answer = value[0];
    setQuestions(updatedQuestions);
  };

  const handleRadioChange = (value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].answer = value;
    setQuestions(updatedQuestions);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].answer = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    const questionnaireData = {
      user_id: userId,
      mood: questions[0].answer,
      anxiety: questions[1].answer,
      sleep_quality: questions[2].answer,
      self_care: questions[3].answer,
      stress_factors: questions[4].answer
    };

    onSubmit(questionnaireData);
    setCompleted(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReset = () => {
    setQuestions(initialQuestions);
    setCurrentQuestion(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-3">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mb-2 text-xl font-bold">Assessment Completed</h3>
        <p className="mb-6 text-muted-foreground">
          Thank you for completing your daily health assessment. Your responses have been recorded.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>
            Start New Assessment
          </Button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-muted-foreground text-right">
        Question {currentQuestion + 1} of {questions.length}
      </p>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">{question.question}</h3>

        {question.type === "slider" && (
          <div className="space-y-6 py-4">
            <Slider
              defaultValue={[question.answer as number]}
              max={question.max}
              min={question.min}
              step={question.step}
              onValueChange={handleSliderChange}
            />
            <div className="flex justify-between">
              {question.labels.map((label, index) => (
                <span key={index} className="text-xs text-muted-foreground">
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {question.type === "radio" && (
          <RadioGroup
            value={question.answer as string}
            onValueChange={handleRadioChange}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === "textarea" && (
          <Textarea
            placeholder="Type your answer here..."
            value={question.answer as string}
            onChange={handleTextareaChange}
            rows={4}
          />
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0 || isLoading}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        <Button 
          onClick={currentQuestion === questions.length - 1 ? handleSubmit : handleNext}
          disabled={isLoading}
          className="gap-2"
        >
          {currentQuestion === questions.length - 1 ? (
            isLoading ? "Submitting..." : "Complete"
          ) : (
            <>Next <ArrowRight className="h-4 w-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
}