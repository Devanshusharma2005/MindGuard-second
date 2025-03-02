import os
import uuid
from agent.workflow import MentalHealthAgent

from dotenv import load_dotenv
load_dotenv()  # Loads API keys from .env file


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

    def chat(self):
        print(f"🧠 MindGuard ({self.provider_name} powered): Hello! I'm here to support your mental wellbeing. Type 'exit' to quit.")
        print(f"✨ User session: {self.user_id[:8]}... (For personalized experience)")
        
        # Check for gamification status
        try:
            user_stats = self.agent.gamification.get_user_stats()
            if user_stats:
                print(f"🏆 Level: {user_stats.get('level', 1)} | 🔥 Streak: {user_stats.get('streak', 0)} days | ⭐ Points: {user_stats.get('points', 0)}")
        except Exception:
            pass  # Don't worry if gamification stats can't be displayed
        
        while True:
            user_input = input("\nYou: ")

            if user_input.lower() in ["exit", "quit"]:
                print("MindGuard: Take care of yourself. Remember, I'm here whenever you need support. 💙")
                break

            try:
                result = self.agent.workflow.invoke({
                    "user_input": user_input,
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
                    "gamification_update": None
                })

                if "response" in result:
                    print(f"MindGuard: {result['response']}")
                else:
                    print("MindGuard: I'm here to listen. Could you tell me more about that?")
            except Exception as e:
                print(f"Error generating response: {e}")
                
                # Try to switch providers if there's an API error
                if "API key" in str(e) or "API error" in str(e) or "authentication" in str(e).lower():
                    success = False
                    for backup in self._get_backup_providers():
                        try:
                            print(f"Trying to switch to {backup.capitalize()}...")
                            self.provider = backup
                            self.agent = MentalHealthAgent(provider=self.provider, user_id=self.user_id)
                            self.provider_name = backup.capitalize()
                            # Try again with the new provider
                            result = self.agent.workflow.invoke({
                                "user_input": user_input,
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
                                "gamification_update": None
                            })
                            if "response" in result:
                                print(f"MindGuard: {result['response']}")
                                success = True
                                break
                        except Exception as e2:
                            print(f"Error with fallback provider {backup}: {e2}")
                    
                    if success:
                        continue
                
                # If we get here, all providers failed or no fallback was available
                print("MindGuard: I'm here to listen and support you. Let's continue our conversation when you're ready.")


if __name__ == "__main__":
    MentalHealthChat().chat()


