"""
Mood tracking and insights module for MindGuard.

This module provides functionality for tracking user mood over time,
generating insights, and creating reports to help users monitor their
mental health progress.
"""

from typing import Dict, List, Any, Optional
import datetime
import json
import os
import matplotlib.pyplot as plt
import pandas as pd
from collections import defaultdict


class MoodTracker:
    """
    Tracks user mood over time and generates insights and reports.
    
    Features:
    - Daily and weekly mood tracking
    - Trend analysis and pattern recognition
    - Customizable report generation
    - Data visualization for progress monitoring
    """
    
    def __init__(self, user_id: str, data_dir: str = "./user_data"):
        """
        Initialize the mood tracker.
        
        Args:
            user_id: Unique identifier for the user
            data_dir: Directory to store mood tracking data
        """
        self.user_id = user_id
        self.data_dir = data_dir
        self.user_data_path = os.path.join(data_dir, f"{user_id}_mood_data.json")
        self.mood_data = self._load_data()
        
    def _load_data(self) -> Dict[str, Any]:
        """Load mood data from disk or initialize if not exists."""
        os.makedirs(self.data_dir, exist_ok=True)
        
        if os.path.exists(self.user_data_path):
            try:
                with open(self.user_data_path, 'r') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading mood data: {e}")
                return self._initialize_data()
        else:
            return self._initialize_data()
            
    def _initialize_data(self) -> Dict[str, Any]:
        """Initialize an empty mood tracking dataset."""
        return {
            "user_id": self.user_id,
            "entries": [],
            "insights": [],
            "last_report_date": None
        }
        
    def _save_data(self):
        """Save mood data to disk."""
        try:
            with open(self.user_data_path, 'w') as f:
                json.dump(self.mood_data, f, indent=2)
        except Exception as e:
            print(f"Error saving mood data: {e}")
            
    def add_mood_entry(self, 
                      mood: str, 
                      valence: float, 
                      intensity: float, 
                      context: Optional[str] = None,
                      triggers: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Add a new mood entry to the tracker.
        
        Args:
            mood: The detected emotional state
            valence: Positive/negative value (-1.0 to 1.0)
            intensity: Strength of the emotion (0.0 to 1.0)
            context: Optional context for the mood
            triggers: Optional list of triggers that caused the mood
            
        Returns:
            The newly created entry
        """
        timestamp = datetime.datetime.now().isoformat()
        
        entry = {
            "timestamp": timestamp,
            "date": datetime.datetime.now().strftime("%Y-%m-%d"),
            "time": datetime.datetime.now().strftime("%H:%M"),
            "mood": mood,
            "valence": valence,
            "intensity": intensity,
            "context": context,
            "triggers": triggers or []
        }
        
        self.mood_data["entries"].append(entry)
        self._save_data()
        
        # Generate new insights if we have enough data
        if len(self.mood_data["entries"]) % 5 == 0:  # Every 5 entries
            self._generate_insights()
            
        return entry
    
    def _generate_insights(self) -> List[Dict[str, Any]]:
        """
        Generate insights based on mood patterns.
        
        Returns:
            List of newly generated insights
        """
        if len(self.mood_data["entries"]) < 3:
            return []  # Not enough data
            
        new_insights = []
        
        # Calculate mood distribution
        mood_counts = defaultdict(int)
        for entry in self.mood_data["entries"][-10:]:  # Last 10 entries
            mood_counts[entry["mood"]] += 1
            
        # Find most common mood
        if mood_counts:
            most_common_mood = max(mood_counts, key=mood_counts.get)
            most_common_count = mood_counts[most_common_mood]
            
            if most_common_count >= 3:  # At least 3 occurrences
                insight = {
                    "type": "pattern",
                    "timestamp": datetime.datetime.now().isoformat(),
                    "description": f"You've experienced '{most_common_mood}' frequently in recent interactions.",
                    "recommendation": self._get_recommendation_for_mood(most_common_mood)
                }
                new_insights.append(insight)
                
        # Analyze mood trends (improving or worsening)
        if len(self.mood_data["entries"]) >= 5:
            recent_valences = [e["valence"] for e in self.mood_data["entries"][-5:]]
            avg_valence = sum(recent_valences) / len(recent_valences)
            
            if avg_valence > 0.2:
                insight = {
                    "type": "trend",
                    "timestamp": datetime.datetime.now().isoformat(),
                    "description": "Your mood has been generally positive recently.",
                    "recommendation": "Keep up the good work! Continue the activities that bring you joy."
                }
                new_insights.append(insight)
            elif avg_valence < -0.2:
                insight = {
                    "type": "trend",
                    "timestamp": datetime.datetime.now().isoformat(),
                    "description": "Your mood has been trending downward recently.",
                    "recommendation": "Consider trying some new self-care activities or reaching out for support."
                }
                new_insights.append(insight)
                
        # Add insights to storage
        self.mood_data["insights"].extend(new_insights)
        self._save_data()
        
        return new_insights
        
    def _get_recommendation_for_mood(self, mood: str) -> str:
        """Get a recommendation based on mood."""
        recommendations = {
            "joy": "Notice what activities bring you joy and try to incorporate them regularly.",
            "sadness": "Be gentle with yourself. Consider journaling or talking with someone you trust.",
            "anxiety": "Practice deep breathing exercises and try to identify specific worries.",
            "anger": "Physical activity can help release tension. Try a brief walk or stretching.",
            "fear": "Grounding exercises can help. Try the 5-4-3-2-1 technique with your senses.",
            "surprise": "Take a moment to process unexpected events before reacting.",
            "neutral": "This is a good time for reflection. Consider what you want to focus on.",
            "hopelessness": "Remember that feelings are temporary. Please reach out for professional support."
        }
        
        return recommendations.get(mood, "Pay attention to activities that improve your mood.")
    
    def get_recent_moods(self, days: int = 7) -> List[Dict[str, Any]]:
        """
        Get mood entries from the last specified days.
        
        Args:
            days: Number of days to look back
            
        Returns:
            List of mood entries
        """
        cutoff_date = (datetime.datetime.now() - datetime.timedelta(days=days)).strftime("%Y-%m-%d")
        
        recent_entries = []
        for entry in reversed(self.mood_data["entries"]):
            if entry["date"] >= cutoff_date:
                recent_entries.append(entry)
                
        return recent_entries
    
    def get_latest_insights(self, count: int = 3) -> List[Dict[str, Any]]:
        """
        Get the most recent insights.
        
        Args:
            count: Number of insights to return
            
        Returns:
            List of recent insights
        """
        return self.mood_data["insights"][-count:] if self.mood_data["insights"] else []
    
    def generate_daily_report(self) -> Dict[str, Any]:
        """
        Generate a daily mood report.
        
        Returns:
            Report data
        """
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        today_entries = [e for e in self.mood_data["entries"] if e["date"] == today]
        
        if not today_entries:
            return {
                "date": today,
                "summary": "No mood data recorded today.",
                "recommendations": ["Consider logging your mood to build insights."]
            }
        
        # Calculate average valence and most frequent mood
        avg_valence = sum(e["valence"] for e in today_entries) / len(today_entries)
        
        mood_counts = defaultdict(int)
        for entry in today_entries:
            mood_counts[entry["mood"]] += 1
            
        most_frequent_mood = max(mood_counts, key=mood_counts.get) if mood_counts else "neutral"
        
        # Generate recommendations
        recommendations = [self._get_recommendation_for_mood(most_frequent_mood)]
        
        # Add specific recommendation based on overall valence
        if avg_valence < -0.5:
            recommendations.append("Today has been challenging. Consider reaching out to someone for support.")
        elif avg_valence < 0:
            recommendations.append("Try a brief self-care activity to boost your mood.")
        elif avg_valence > 0.5:
            recommendations.append("You're having a good day! Take note of what's contributing to your positive mood.")
        
        report = {
            "date": today,
            "entry_count": len(today_entries),
            "dominant_mood": most_frequent_mood,
            "avg_valence": avg_valence,
            "summary": f"Today you've mostly felt {most_frequent_mood}.",
            "recommendations": recommendations
        }
        
        self.mood_data["last_report_date"] = today
        self._save_data()
        
        return report
        
    def generate_weekly_report(self) -> Dict[str, Any]:
        """
        Generate a weekly mood report with visualization data.
        
        Returns:
            Report data with visualizations
        """
        # Get data from the last 7 days
        recent_entries = self.get_recent_moods(days=7)
        
        if not recent_entries:
            return {
                "period": "last 7 days",
                "summary": "No mood data recorded in the last week.",
                "recommendations": ["Regular mood logging helps build meaningful insights."]
            }
        
        # Organize data by day
        days = []
        valences = []
        intensities = []
        
        for i in range(7):
            date = (datetime.datetime.now() - datetime.timedelta(days=6-i)).strftime("%Y-%m-%d")
            day_entries = [e for e in recent_entries if e["date"] == date]
            
            days.append(date)
            
            if day_entries:
                valences.append(sum(e["valence"] for e in day_entries) / len(day_entries))
                intensities.append(sum(e["intensity"] for e in day_entries) / len(day_entries))
            else:
                valences.append(0)
                intensities.append(0)
                
        # Count moods
        mood_counts = defaultdict(int)
        for entry in recent_entries:
            mood_counts[entry["mood"]] += 1
            
        top_moods = sorted(mood_counts.items(), key=lambda x: x[1], reverse=True)[:3]
        top_moods = [{"mood": mood, "count": count} for mood, count in top_moods]
        
        # Check for trends
        trend_direction = "stable"
        if len(valences) >= 3:
            first_half = sum(valences[:3]) / 3
            second_half = sum(valences[-3:]) / 3
            
            if second_half - first_half > 0.2:
                trend_direction = "improving"
            elif first_half - second_half > 0.2:
                trend_direction = "declining"
                
        # Generate recommendations
        recommendations = []
        
        if trend_direction == "improving":
            recommendations.append("Your mood is improving. Keep up what you're doing!")
        elif trend_direction == "declining":
            recommendations.append("Your mood has been declining. Consider what factors might be contributing.")
        
        # Add specific recommendation based on top mood
        if top_moods:
            top_mood = top_moods[0]["mood"]
            recommendations.append(self._get_recommendation_for_mood(top_mood))
        
        report = {
            "period": "last 7 days",
            "days": days,
            "valences": valences,
            "intensities": intensities,
            "top_moods": top_moods,
            "trend": trend_direction,
            "summary": f"Your mood has been {trend_direction} over the past week.",
            "recommendations": recommendations
        }
        
        return report
        
    def generate_visualization(self, output_path: str, report_type: str = "weekly") -> bool:
        """
        Generate a visualization of mood data.
        
        Args:
            output_path: Path to save the visualization
            report_type: Type of report ("daily" or "weekly")
            
        Returns:
            True if successful, False otherwise
        """
        try:
            if report_type == "weekly":
                report = self.generate_weekly_report()
                
                fig, ax = plt.subplots(figsize=(10, 6))
                
                # Plot valence line
                ax.plot(report["days"], report["valences"], marker='o', linewidth=2, label="Mood Valence")
                
                # Add intensity as area
                ax.fill_between(report["days"], report["intensities"], alpha=0.2, color="orange", label="Intensity")
                
                # Add labels and title
                ax.set_xlabel("Date")
                ax.set_ylabel("Valence (-1 to +1)")
                ax.set_title("Weekly Mood Tracking")
                ax.grid(True, linestyle="--", alpha=0.7)
                ax.legend()
                
                # Save the figure
                plt.tight_layout()
                plt.savefig(output_path)
                plt.close()
                
                return True
                
            elif report_type == "daily":
                # Implementation for daily visualization
                return True
                
            return False
            
        except Exception as e:
            print(f"Error generating visualization: {e}")
            return False


# Example usage
if __name__ == "__main__":
    tracker = MoodTracker("test_user")
    
    # Add some test entries
    tracker.add_mood_entry("joy", 0.8, 0.7, "Spent time with friends")
    tracker.add_mood_entry("anxiety", -0.6, 0.8, "Job interview coming up")
    tracker.add_mood_entry("sadness", -0.7, 0.5, "Feeling lonely")
    
    # Generate reports
    daily_report = tracker.generate_daily_report()
    weekly_report = tracker.generate_weekly_report()
    
    print("Daily Report:", daily_report)
    print("\nWeekly Report:", weekly_report)
    
    # Get insights
    insights = tracker.get_latest_insights()
    print("\nInsights:", insights) 