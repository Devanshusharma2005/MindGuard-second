from mental_health_analysis import MentalHealthAnalyzer

# Detailed sample responses for testing
sample_responses = [
    "I often feel overwhelmed by my responsibilities at work and home, which makes it hard for me to focus on anything.",  # Response to question 1
    "Sometimes, I find it difficult to get out of bed in the morning because I feel so low and unmotivated.",  # Response to question 2
    "Very often, I experience mood swings that leave me feeling anxious and restless.",  # Response to question 3
    "Rarely do I feel like I can enjoy activities I used to love, like going out with friends or reading.",  # Response to question 4
    "I often have thoughts about whether I would be better off dead, especially during tough times.",  # Response to question 5
    "I feel isolated and alone, even when I am surrounded by people, which adds to my anxiety.",  # Response to question 6
    "Sometimes, I struggle to concentrate on tasks, and it feels like my mind is racing all the time.",  # Response to question 7
    "I often feel fatigued and low on energy, making it hard to get through the day.",  # Response to question 8
    "Very often, I find myself worrying about the future and what it holds for me.",  # Response to question 9
    "I feel like I am a burden to my family and friends, which makes me withdraw from them.",  # Response to question 10
]

# Create an instance of the MentalHealthAnalyzer
analyzer = MentalHealthAnalyzer()

# Analyze the responses
analysis_result = analyzer.analyze_responses(sample_responses)
print("Analysis Result:", analysis_result)

# Generate a report
report = analyzer.generate_report(sample_responses)
print("Generated Report:", report) 