from agent.emotion_analysis import EmotionAnalyzer

def test_emotion_analyzer():
    # Initialize the EmotionAnalyzer
    analyzer = EmotionAnalyzer(offline_mode=False)  # Set to True if you want to test offline mode

    # Sample inputs for testing
    test_inputs = [
        "I am feeling very happy today!",
        "I am so sad and depressed after my breakup.",
        "I feel anxious about the future.",
        "I don't see any point in living anymore.",
        "Everything is going great, I feel joyful!"
    ]

    # Process each input and print the results
    for text in test_inputs:
        try:
            print(f"Analyzing text: '{text}'")
            result = analyzer.analyze(text)  # Call the analyze method
            print(f"Result: {result}\n")  # Print the result
        except Exception as e:
            print(f"Error analyzing text: '{text}'. Error: {e}\n")

# Call the test function
if __name__ == '__main__':
    test_emotion_analyzer() 