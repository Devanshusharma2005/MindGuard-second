import os
import uuid
from typing import Dict, Optional, List
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from agent.workflow import MentalHealthAgent

from dotenv import load_dotenv
load_dotenv()  # Loads API keys from .env file

app = FastAPI(title="MindGuard API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store chat instances for different users
chat_instances: Dict[str, 'MentalHealthChat'] = {}

RESPONSE_GUIDELINES = {
    "max_words": 50,
    "style": "friendly and supportive",
    "format": "short, clear sentences",
    "tone": "positive and encouraging"
}

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    user_id: str
    provider: str
    emotional_state: Optional[dict] = None

class HealthQuestionnaire(BaseModel):
    user_id: str
    mood: int  # 1-10 scale
    anxiety: str  # none, mild, moderate, severe
    sleep_quality: int  # 1-10 scale
    self_care: str  # yes/no
    stress_factors: str  # free text

class HealthData(BaseModel):
    insights: Dict
    progress: Dict
    recommendations: List[Dict]

class MentalHealthChat:
    def __init__(self, user_id=None):
        # Initialize or use provided user_id for persistent personalization
        self.user_id = user_id or self._get_or_create_user_id()
        
        # Determine which provider to use based on available API keys
        self.provider = self._determine_provider()
        self.backup_providers = self._get_backup_providers()
        
        # Try to initialize with the primary provider
        try:
            self.agent = MentalHealthAgent(provider=self.provider, user_id=self.user_id)
            self.provider_name = self.provider.capitalize() if self.provider else "Auto-detected"
        except Exception as e:
            print(f"Warning: Could not initialize with {self.provider}: {e}")
            # Try fallback providers if available
            success = False
            for backup in self.backup_providers:
                try:
                    print(f"Falling back to {backup.capitalize()}...")
                    self.provider = backup
                    self.agent = MentalHealthAgent(provider=self.provider, user_id=self.user_id)
                    self.provider_name = backup.capitalize()
                    success = True
                    break
                except Exception as e2:
                    print(f"Warning: Could not initialize with {backup}: {e2}")
            
            if not success:
                print("All providers failed. Using emergency offline mode.")
                try:
                    # Set environment variables for offline mode
                    os.environ["OFFLINE_MODE"] = "true"
                    # Try one more time with no specific provider (will use offline alternatives)
                    self.provider = None
                    self.agent = MentalHealthAgent(provider=None, user_id=self.user_id)
                    self.provider_name = "Offline Mode"
                except Exception as e3:
                    print(f"Emergency offline mode also failed: {e3}")
                    raise ValueError("No working API providers found. Please check your API keys.") from e3
                
    def _get_or_create_user_id(self):
        """Get existing user ID or create a new one for persistent personalization."""
        # Check if user ID is stored in a file
        user_id_file = ".user_id"
        if os.path.exists(user_id_file):
            try:
                with open(user_id_file, 'r') as f:
                    user_id = f.read().strip()
                    if user_id:
                        return user_id
            except Exception:
                pass
        
        # Create new user ID if none exists
        user_id = str(uuid.uuid4())
        try:
            os.makedirs("user_data", exist_ok=True)
            with open(user_id_file, 'w') as f:
                f.write(user_id)
        except Exception as e:
            print(f"Warning: Could not save user ID: {e}")
            
        return user_id

    def _determine_provider(self):
        """Determine which provider to use based on available API keys."""
        # Set priority order: OpenAI, Groq, Gemini
        if os.environ.get("OPENAI_API_KEY"):
            return "openai"
        elif os.environ.get("GROQ_API_KEY"):
            return "groq"
        elif os.environ.get("GOOGLE_API_KEY"):
            return "gemini"
        else:
            print("Warning: No API keys found. The application may not work correctly.")
            return None
    
    def _get_backup_providers(self):
        """Get list of available backup providers."""
        backups = []
        # Don't include the primary provider in backups
        if self.provider != "groq" and os.environ.get("GROQ_API_KEY"):
            backups.append("groq")
        if self.provider != "openai" and os.environ.get("OPENAI_API_KEY"):
            backups.append("openai")
        if self.provider != "gemini" and os.environ.get("GOOGLE_API_KEY"):
            backups.append("gemini")
        return backups

    async def get_response(self, message: str) -> Dict:
        try:
            result = self.agent.workflow.invoke({
                "user_input": message,
                "history": [],
                "response": "",
                "needs_escalation": False,
                "emotional_state": {
                    "emotion": "neutral",
                    "confidence": 0.5,
                    "valence": 0.0,
                    "is_crisis": False,
                    "intensity": 0.1
                },
                "therapeutic_recommendations": None,
                "mood_insights": None,
                "gamification_update": None,
                "response_guidelines": RESPONSE_GUIDELINES
            })

            response = result.get("response", "I'm here to listen. Could you tell me more about that?")
            words = response.split()
            
            if len(words) > RESPONSE_GUIDELINES["max_words"]:
                response = " ".join(words[:RESPONSE_GUIDELINES["max_words"]]) + "... Would you like me to elaborate?"

            return {
                "response": response,
                "emotional_state": result.get("emotional_state"),
                "provider": self.provider_name
            }
        except Exception as e:
            # Try backup providers if available
            for backup in self._get_backup_providers():
                try:
                    self.provider = backup
                    self.agent = MentalHealthAgent(provider=self.provider, user_id=self.user_id)
                    self.provider_name = backup.capitalize()
                    return await self.get_response(message)
                except Exception:
                    continue
            
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    user_id = request.user_id
    
    # Create or get existing chat instance
    if user_id not in chat_instances:
        chat_instances[user_id] = MentalHealthChat(user_id=user_id)
    
    chat_instance = chat_instances[user_id]
    
    # Get response from the chat instance
    result = await chat_instance.get_response(request.message)
    
    return ChatResponse(
        response=result["response"],
        user_id=chat_instance.user_id,
        provider=result["provider"],
        emotional_state=result.get("emotional_state")
    )

def analyze_mental_health(data: Dict, history: Optional[Dict] = None) -> Dict:
    """Analyze mental health data and generate insights."""
    insights = {
        "mainInsight": "",
        "riskAnalysis": {"low": 0, "moderate": 0, "high": 0},
        "anxietyTrend": {"status": "stable", "percentage": 0, "detail": ""},
        "stressResponse": {"status": "stable", "percentage": 0, "detail": ""},
        "moodStability": {"status": "stable", "detail": ""},
        "patterns": []
    }

    # Analyze mood and sleep correlation
    if data["mood"] < 5 and data["sleep_quality"] < 5:
        insights["patterns"].append("Sleep quality affects mood")
        insights["mainInsight"] = "Your sleep quality seems to be affecting your mood. Consider establishing a consistent sleep routine."

    # Analyze anxiety levels
    anxiety_levels = {"none": 0, "mild": 2, "moderate": 5, "severe": 8}
    anxiety_score = anxiety_levels.get(data["anxiety"], 0)
    
    if anxiety_score > 5:
        insights["riskAnalysis"]["high"] = 60
        insights["riskAnalysis"]["moderate"] = 30
        insights["riskAnalysis"]["low"] = 10
        insights["anxietyTrend"]["status"] = "increasing"
        insights["anxietyTrend"]["detail"] = "High anxiety levels detected. Consider relaxation techniques or professional support."
    else:
        insights["riskAnalysis"]["high"] = 10
        insights["riskAnalysis"]["moderate"] = 30
        insights["riskAnalysis"]["low"] = 60
        insights["anxietyTrend"]["status"] = "decreasing"
        insights["anxietyTrend"]["detail"] = "Your anxiety levels are manageable. Keep practicing your coping strategies."

    # Analyze stress factors
    stress_keywords = ["work", "job", "deadline", "pressure", "overwhelm"]
    if any(keyword in data["stress_factors"].lower() for keyword in stress_keywords):
        insights["stressResponse"]["status"] = "worsening"
        insights["stressResponse"]["detail"] = "Work-related stress detected. Consider time management and boundary-setting techniques."
        insights["patterns"].append("Work stress triggers")

    # Generate progress data
    progress = {
        "moodData": generate_mood_data(data, history),
        "sleepData": generate_sleep_data(data, history),
        "activityData": generate_activity_data(data, history),
        "summary": {
            "mood": {"change": calculate_change(data["mood"], history)},
            "anxiety": {"change": calculate_anxiety_change(data["anxiety"], history)},
            "stress": {"change": calculate_stress_change(data["stress_factors"], history)},
            "sleep": {
                "durationChange": calculate_change(data["sleep_quality"], history),
                "qualityChange": calculate_change(data["sleep_quality"], history)
            },
            "activities": {
                "exerciseChange": 0,
                "meditationChange": 0,
                "socialChange": 0
            }
        }
    }

    # Generate recommendations
    recommendations = {
        "articles": generate_article_recommendations(insights),
        "videos": generate_video_recommendations(insights)
    }

    return {
        "insights": insights,
        "progress": progress,
        "recommendations": recommendations
    }

def generate_mood_data(data: Dict, history: Optional[Dict]) -> List[Dict]:
    """Generate mood tracking data."""
    # Implementation would include actual historical data
    return [
        {"date": "Week 1", "mood": data["mood"], "anxiety": 5, "stress": 5},
        # Add more historical data points
    ]

def generate_sleep_data(data: Dict, history: Optional[Dict]) -> List[Dict]:
    """Generate sleep tracking data."""
    return [
        {"date": "Week 1", "hours": data["sleep_quality"], "quality": data["sleep_quality"]},
        # Add more historical data points
    ]

def generate_activity_data(data: Dict, history: Optional[Dict]) -> List[Dict]:
    """Generate activity tracking data."""
    return [
        {"date": "Week 1", "exercise": 3, "meditation": 2, "social": 4},
        # Add more historical data points
    ]

def calculate_change(current: float, history: Optional[Dict]) -> float:
    """Calculate percentage change."""
    if not history or "previous" not in history:
        return 0
    previous = history["previous"]
    return ((current - previous) / previous) * 100 if previous != 0 else 0

def calculate_anxiety_change(current: str, history: Optional[Dict]) -> float:
    """Calculate anxiety level change."""
    anxiety_levels = {"none": 0, "mild": 2, "moderate": 5, "severe": 8}
    current_score = anxiety_levels.get(current, 0)
    if not history or "previous_anxiety" not in history:
        return 0
    previous_score = anxiety_levels.get(history["previous_anxiety"], 0)
    return ((current_score - previous_score) / previous_score) * 100 if previous_score != 0 else 0

def calculate_stress_change(current: str, history: Optional[Dict]) -> float:
    """Calculate stress level change based on text analysis."""
    # Implementation would include actual stress level calculation
    return -15  # Example: 15% decrease in stress

def generate_article_recommendations(insights: Dict) -> List[Dict]:
    """Generate personalized article recommendations."""
    articles = []
    if insights["anxietyTrend"]["status"] == "increasing":
        articles.append({
            "title": "Managing Anxiety: Practical Techniques",
            "type": "Guide",
            "duration": "5 min read",
            "description": "Learn evidence-based strategies for managing anxiety in daily life.",
            "action": {"label": "Read Now", "url": "/guides/anxiety-management"}
        })
    # Add more conditional recommendations
    return articles

def generate_video_recommendations(insights: Dict) -> List[Dict]:
    """Generate personalized video recommendations."""
    videos = []
    if "Work stress triggers" in insights["patterns"]:
        videos.append({
            "title": "Stress Management at Work",
            "type": "Video Course",
            "duration": "15 minutes",
            "description": "Quick techniques for managing workplace stress.",
            "action": {"label": "Watch Now", "url": "/courses/workplace-stress"}
        })
    # Add more conditional recommendations
    return videos

@app.post("/health-tracking", response_model=HealthData)
async def process_health_data(questionnaire: HealthQuestionnaire):
    try:
        chat_instance = chat_instances.get(questionnaire.user_id)
        if not chat_instance:
            chat_instance = MentalHealthChat(user_id=questionnaire.user_id)
            chat_instances[questionnaire.user_id] = chat_instance
        
        # Get historical data
        history = await get_health_history(questionnaire.user_id)
        
        # Analyze current data
        analysis_result = analyze_mental_health(questionnaire.model_dump(), history)
        
        # Store results for future reference
        # Implementation would include actual data storage
        
        return HealthData(**analysis_result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health-history/{user_id}")
async def get_health_history(user_id: str):
    try:
        # Implementation would include actual database queries
        return {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)


