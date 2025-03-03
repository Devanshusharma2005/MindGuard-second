# emotion_report_generator.py

from emotion_questions import questions
from emotion_analysis import EmotionAnalyzer
import json

questions = [
    "How would you describe your overall mood in the past week?",
    "Can you recall a recent moment when you felt particularly happy? What was happening?",
    "What thoughts come to mind when you think about your future?",
    "How often do you feel overwhelmed by your responsibilities?",
    "When was the last time you felt truly relaxed? What were you doing?",
    "Do you find yourself avoiding social situations? If so, why?",
    "How do you cope when you feel stressed or anxious?",
    "Can you describe a time when you felt really sad? What triggered it?",
    "How do you feel about your ability to manage your emotions?",
    "What do you do when you feel like you can't cope with everything?",
    "How often do you experience feelings of hopelessness or despair?",
    "Do you have any recurring thoughts that you find distressing?",
    "How do you feel about seeking help or support from others?",
    "What activities or hobbies bring you joy, and how often do you engage in them?",
    "How do you feel when you think about your relationships with family and friends?",
    "What do you do to take care of your mental health?",
    "How often do you feel lonely, even when you are around others?",
    "Can you describe a situation that makes you feel anxious?",
    "How do you feel about your self-worth and confidence?",
    "What are your thoughts on how you handle criticism or feedback?"
]

class EmotionReportGenerator:
    def __init__(self):
        self.analyzer = EmotionAnalyzer()
        self.responses = []

    def ask_questions(self):
        for question in questions:
            response = input(question + " ")  # Collect user response
            self.responses.append(response)  # Store response

    def analyze_responses(self):
        # Load sample responses from JSON file
        sample_responses = self.load_sample_responses('agent/agent/sample_responses.json')
        analysis_report = []

        for response in sample_responses:
            # Here you would implement your analysis logic
            # For demonstration, let's assume we analyze the 'answer' field
            analysis = {
                'emotion': 'sad',  # Placeholder for actual emotion detection logic
                'confidence': 0.8,  # Placeholder for confidence score
                'valence': -0.5,  # Placeholder for valence score
                'is_crisis': False  # Placeholder for crisis detection
            }
            analysis_report.append(analysis)

        return analysis_report

    def summarize_report(self, analysis_report):
        summary = {
            'total_responses': len(analysis_report),
            'emotions_count': {},
            'crisis_count': 0,
            'average_confidence': 0.0,
            'average_valence': 0.0
        }

        for entry in analysis_report:
            emotion = entry['emotion']
            summary['emotions_count'][emotion] = summary['emotions_count'].get(emotion, 0) + 1
            if entry['is_crisis']:
                summary['crisis_count'] += 1
            summary['average_confidence'] += entry['confidence']
            summary['average_valence'] += entry['valence']

        # Calculate averages only if there are responses
        if summary['total_responses'] > 0:
            summary['average_confidence'] /= summary['total_responses']
            summary['average_valence'] /= summary['total_responses']
        else:
            summary['average_confidence'] = 0.0
            summary['average_valence'] = 0.0

        return summary

    def load_sample_responses(self, file_path):
        with open(file_path, 'r') as file:
            data = json.load(file)
            return data['responses']

    def generate_report(self):
        # Load sample responses from JSON file
        sample_responses = self.load_sample_responses('agent/agent/sample_responses.json')
        self.responses = [response['answer'] for response in sample_responses]  # Extract answers
        analysis_report = self.analyze_responses()  # Analyze responses
        summary = self.summarize_report(analysis_report)  # Summarize the report
        disorder_indicators = self.detect_disorder_indicators(analysis_report)  # Detect potential disorders
        return {"summary": summary, "disorder_indicators": disorder_indicators}

    def detect_disorder_indicators(self, analysis_report):
        disorder_indicators = []
        # Existing disorder detection logic
        if any(entry['emotion'] == 'anxiety' for entry in analysis_report):
            disorder_indicators.append('Possible Anxiety Disorder')
        # Adding new disorders
        if any(entry['emotion'] == 'sadness' for entry in analysis_report):
            disorder_indicators.append('Major Depressive Disorder')
        if any(entry['emotion'] == 'fear' for entry in analysis_report):
            disorder_indicators.append('Generalized Anxiety Disorder')
        if any(entry['emotion'] == 'social_anxiety' for entry in analysis_report):
            disorder_indicators.append('Social Anxiety Disorder')
        if any(entry['emotion'] == 'panic' for entry in analysis_report):
            disorder_indicators.append('Panic Disorder')
        if any(entry['emotion'] == 'trauma' for entry in analysis_report):
            disorder_indicators.append('Post-Traumatic Stress Disorder (PTSD)')
        if any(entry['emotion'] == 'obsessive' for entry in analysis_report):
            disorder_indicators.append('Obsessive-Compulsive Disorder (OCD)')
        if any(entry['emotion'] == 'bipolar' for entry in analysis_report):
            disorder_indicators.append('Bipolar Disorder')
        if any(entry['emotion'] == 'borderline' for entry in analysis_report):
            disorder_indicators.append('Borderline Personality Disorder')
        if any(entry['emotion'] == 'seasonal' for entry in analysis_report):
            disorder_indicators.append('Seasonal Affective Disorder')
        if any(entry['emotion'] == 'adhd' for entry in analysis_report):
            disorder_indicators.append('Attention-Deficit/Hyperactivity Disorder (ADHD)')
        if any(entry['emotion'] == 'eating' for entry in analysis_report):
            disorder_indicators.append('Eating Disorders (e.g., Anorexia, Bulimia)')
        if any(entry['emotion'] == 'substance' for entry in analysis_report):
            disorder_indicators.append('Substance Use Disorder')
        if any(entry['emotion'] == 'schizophrenia' for entry in analysis_report):
            disorder_indicators.append('Schizophrenia')
        if any(entry['emotion'] == 'dissociative' for entry in analysis_report):
            disorder_indicators.append('Dissociative Identity Disorder')
        if any(entry['emotion'] == 'phobia' for entry in analysis_report):
            disorder_indicators.append('Phobias (e.g., Agoraphobia, Specific Phobias)')
        if any(entry['emotion'] == 'chronic_stress' for entry in analysis_report):
            disorder_indicators.append('Chronic Stress Disorder')
        if any(entry['emotion'] == 'adjustment' for entry in analysis_report):
            disorder_indicators.append('Adjustment Disorder')
        if any(entry['emotion'] == 'impulse_control' for entry in analysis_report):
            disorder_indicators.append('Impulse Control Disorder')
        if any(entry['emotion'] == 'sleep' for entry in analysis_report):
            disorder_indicators.append('Sleep Disorders (e.g., Insomnia)')
        if any(entry['emotion'] == 'narcissistic' for entry in analysis_report):
            disorder_indicators.append('Personality Disorders (e.g., Narcissistic Personality Disorder)')
        if any(entry['emotion'] == 'psychotic' for entry in analysis_report):
            disorder_indicators.append('Psychotic Disorders')
        if any(entry['emotion'] == 'somatic' for entry in analysis_report):
            disorder_indicators.append('Somatic Symptom Disorder')
        if any(entry['emotion'] == 'factitious' for entry in analysis_report):
            disorder_indicators.append('Factitious Disorder')
        if any(entry['emotion'] == 'gender_dysphoria' for entry in analysis_report):
            disorder_indicators.append('Gender Dysphoria')
        if any(entry['emotion'] == 'complicated_grief' for entry in analysis_report):
            disorder_indicators.append('Complicated Grief')
        return disorder_indicators

# Example usage
if __name__ == "__main__":
    generator = EmotionReportGenerator()
    report = generator.generate_report()
    print(report) 