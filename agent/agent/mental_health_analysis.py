import torch
from transformers import pipeline, AutoTokenizer, AutoModelForMaskedLM
import os
from dotenv import load_dotenv
from langchain_community.chat_models import ChatOpenAI

class MentalHealthAnalyzer:
    def __init__(self):
        # Load environment variables
        load_dotenv()  # Ensure to load the .env file
        self.groq_api_key = os.getenv('GROQ_API_KEY')

        # Define a fixed set of questions for mental health assessment
        self.questions = [
            "How often have you been feeling down, depressed, or hopeless?",
            "How often have you had little interest or pleasure in doing things?",
            "How often have you been feeling anxious or worried?",
            "How often have you had trouble sleeping or sleeping too much?",
            "How often have you felt that you would be better off dead or hurting yourself in some way?",
            "How often do you feel overwhelmed by your responsibilities?",
            "How often do you find it hard to concentrate on tasks?",
            "How often do you feel isolated or alone?",
            "How often do you experience mood swings?",
            "How often do you feel fatigued or low on energy?",
            "How often do you have thoughts of self-harm?",
            "How often do you feel hopeless about the future?",
            "How often do you feel that you are a burden to others?",
            "How often do you feel restless or unable to relax?",
            "How often do you have difficulty making decisions?",
            "How often do you feel that you lack motivation?",
            "How often do you feel that you are not in control of your life?",
            "How often do you feel that your emotions are too intense?",
            "How often do you find it hard to enjoy activities you used to love?",
            "How often do you feel that you are not understood by others?"
        ]
        # Load models using pipeline
        self.bert_pipe = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")
        # Initialize ChatOpenAI if GROQ_API_KEY is available
        if self.groq_api_key:
            self.chat_openai = ChatOpenAI(
                temperature=0.7,
                base_url="https://api.groq.com/openai/v1",
                api_key=self.groq_api_key,
                model_name="llama-3.3-70b-versatile"
            )
        else:
            self.chat_openai = None  # Set to None if the key is not available
        # Load the mental model directly
        self.tokenizer = AutoTokenizer.from_pretrained("mental/mental-bert-base-uncased")
        self.model = AutoModelForMaskedLM.from_pretrained("mental/mental-bert-base-uncased")

    def analyze_responses(self, responses):
        """
        Analyze the responses to the fixed set of questions.
        
        Args:
            responses: A list of responses corresponding to the questions.
        
        Returns:
            A dictionary indicating potential mental health concerns.
        """
        concerns = []
        
        # Analyze responses using Mental BERT pipeline
        for question, response in zip(self.questions, responses):
            result = self.bert_pipe(f"{question} {response}")
            predicted_class = result[0]['score']
            if predicted_class > 0.5:  # Assuming a threshold for concern
                concerns.append(question)
        
        return {
            "concerns": concerns,
            "message": "Please consider seeking professional help if you have multiple concerns."
        }

    def generate_report(self, responses):
        """
        Generate a report based on the responses using the ChatOpenAI model.
        
        Args:
            responses: A list of responses corresponding to the questions.
        
        Returns:
            A generated report summarizing the responses.
        """
        if self.chat_openai is None:
            return "ChatOpenAI model is not available for report generation."
        prompt = "Based on the following responses, please provide a detailed mental health report: " + str(responses)
        report = self.chat_openai.invoke(prompt)
        return report

# Example usage
if __name__ == "__main__":
    analyzer = MentalHealthAnalyzer()
    sample_responses = [
        "often",  # Response to question 1
        "sometimes",  # Response to question 2
        "very often",  # Response to question 3
        "rarely",  # Response to question 4
        "often",  # Response to question 5
        "often",  # Response to question 6
        "sometimes",  # Response to question 7
        "very often",  # Response to question 8
        "rarely",  # Response to question 9
        "often",  # Response to question 10
        "sometimes",  # Response to question 11
        "often",  # Response to question 12
        "very often",  # Response to question 13
        "rarely",  # Response to question 14
        "often",  # Response to question 15
        "sometimes",  # Response to question 16
        "very often",  # Response to question 17
        "rarely",  # Response to question 18
        "often",  # Response to question 19
        "sometimes"  # Response to question 20
    ]
    result = analyzer.analyze_responses(sample_responses)
    print(result)
    report = analyzer.generate_report(sample_responses)
    print(report) 