from mental_health_analysis import MentalHealthAnalyzer

# Sample responses for testing
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

# Create an instance of the MentalHealthAnalyzer
analyzer = MentalHealthAnalyzer()

# Analyze the responses
analysis_result = analyzer.analyze_responses(sample_responses)
print("Analysis Result:", analysis_result)

# Generate a report
report = analyzer.generate_report(sample_responses)
print("Generated Report:", report) 