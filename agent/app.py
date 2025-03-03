from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/test', methods=['GET'])
def test_route():
    return jsonify({'message': 'Flask is working!'}), 200

@app.route('/api/emotion', methods=['POST'])
def analyze_emotion():
    data = request.json
    text = data.get('text', '')
    # Here you would call your emotion detection logic
    # For now, just return the received text
    return jsonify({'received_text': text}), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 