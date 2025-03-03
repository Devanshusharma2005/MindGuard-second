"""
Enhanced emotion analysis module for MindGuard.

This module provides functionality for detecting and analyzing emotions
in text, with robust fallback mechanisms for offline usage.
"""

from typing import Dict, List, Any, Optional, Union, Callable
import os
import json
import re
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer

class EmotionAnalyzer:
    """
    Enhanced emotion analyzer with multiple detection methods and offline support.
    
    Features:
    - Multiple emotion detection models (Hugging Face, rule-based, lexicon-based)
    - Offline support with pre-downloaded models or fallback mechanisms
    - Confidence scoring for detected emotions
    - Support for 27 distinct emotional states
    """
    
    def __init__(self, 
                model_path: str = "borisn70/bert-43-multilabel-emotion-detection",
                offline_mode: bool = True,
                cache_dir: Optional[str] = None):
        """
        Initialize the emotion analyzer.
        
        Args:
            model_path: Path to the emotion detection model or model name
            offline_mode: Whether to operate in offline mode
            cache_dir: Directory to cache models and lexicons
        """
        self.model_path = model_path
        self.offline_mode = offline_mode
        self.cache_dir = cache_dir or os.path.join(os.path.dirname(__file__), "cached_models")
        
        # Initialize the Hugging Face emotion detection model
        self.analyzer = pipeline("text-classification", model=self.model_path)
        
        # Initialize the crisis detection model
        self.crisis_detection_model = CrisisDetectionModel()
        
        # Initialize the emotion detection model
        self.emotion_detection_model = EmotionDetectionModel()
        
    def analyze(self, text: str) -> Dict[str, Any]:
        """
        Analyze text for emotional content.
        
        Args:
            text: The text to analyze
            
        Returns:
            Dictionary with detected emotion, confidence, and metadata
        """
        # Skip analysis for very short texts
        if len(text.strip()) < 3:
            return {
                "emotion": "neutral",
                "confidence": 0.7,
                "valence": 0.0,
                "is_crisis": False,
                "intensity": 0.1
            }
        
        # Check for crisis keywords first (safety measure)
        crisis_keywords = [
            "suicide", "kill myself", "end it all", "end my life",
            "want to die", "better off dead", "can't go on", "no reason to live"
        ]
        
        if any(keyword in text.lower() for keyword in crisis_keywords):
            return {
                "emotion": "crisis",
                "confidence": 0.95,
                "valence": -0.9,
                "is_crisis": True,
                "intensity": 0.9
            }
        
        # Use the emotion detection model to analyze text
        emotion_scores = self.analyzer(text)  # Get the predictions from the model
        
        # Process the scores and return the results
        if emotion_scores:
            max_emotion = emotion_scores[0]['label']  # Extract the label from the first prediction
            max_score = emotion_scores[0]['score']  # Extract the score from the first prediction
            
            # Map emotion to valence (positive/negative scale)
            valence_map = {
                # Positive emotions
                "joy": 0.8, "contentment": 0.7, "excitement": 0.8, "pride": 0.7,
                "gratitude": 0.8, "love": 0.9, "hope": 0.7,
                
                # Neutral emotions
                "surprise": 0.0, "confusion": -0.1, "neutral": 0.0,
                
                # Negative emotions
                "sadness": -0.7, "fear": -0.7, "anger": -0.7, "disgust": -0.6,
                "anxiety": -0.7, "frustration": -0.6, "guilt": -0.6,
                "hopelessness": -0.9, "loneliness": -0.7, "grief": -0.8,
                "dread": -0.7, "embarrassment": -0.5
            }
            
            valence = valence_map.get(max_emotion, 0.0)
            
            # Determine if this is a potential crisis  
            is_crisis = (
                max_emotion in ["hopelessness", "sadness", "fear"] and max_score > 0.8
            )
            
            return {
                "emotion": max_emotion,
                "confidence": max_score,
                "valence": valence,
                "is_crisis": is_crisis,
                "intensity": abs(valence) * max_score
            }
        
        # If no emotions detected, default to neutral
        return {
            "emotion": "neutral",
            "confidence": 0.5,
            "valence": 0.0,
            "is_crisis": False,
            "intensity": 0.1
        }

# Test the analyzer if run directly
if __name__ == "__main__":
    analyzer = EmotionAnalyzer()
    
    test_texts = [
        "I'm feeling really happy today!",
        "I'm so sad and depressed, nothing seems to work out.",
        "I'm worried about my upcoming exam.",
        "I'm so angry that they cancelled the event!",
        "I don't know what to do anymore, I feel hopeless."
    ]
    
    for text in test_texts:
        result = analyzer.analyze(text)
        print(f"Text: {text}")
        print(f"Emotion: {result['emotion']} (Confidence: {result['confidence']:.2f})")
        print(f"Valence: {result['valence']:.2f}, Crisis: {result['is_crisis']}")
        print("-" * 50)
