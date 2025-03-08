const fs = require('fs');

// Function to store input and output in JSON
function storeDataInJson(input, output, filePath = 'data.json') {
    try {
        // Read existing data
        let data = [];
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath);
            data = JSON.parse(fileData);
        }

        // Append new input and output
        data.push({ input, output });

        // Write updated data back to the file
        console.log(`Writing data to ${filePath}`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        console.log(`Data successfully written to ${filePath}`);
    } catch (error) {
        console.error(`Error writing to file ${filePath}:`, error);
    }
}

// Function to handle data from frontend
function handleDataFromFrontend(data) {
    // Process the data and generate a report
    const report = generateReport(data);

    // Store both input and output in JSON
    storeDataInJson(data, report);

    // Send the report to the agent
    sendToAgent(report);
}

// Dynamic report generation based on input data
function generateReport(data) {
    // Example of dynamic processing
    const emotionsCount = {};
    const riskFactors = [];
    const disorderIndicators = [];

    // Process data to fill the report
    for (const key in data) {
        if (key.includes('emotion')) {
            emotionsCount[key] = data[key];
        } else if (key.includes('risk')) {
            riskFactors.push(data[key]);
        } else if (key.includes('disorder')) {
            disorderIndicators.push(data[key]);
        }
    }

    return {
        summary: {
            emotions_count: emotionsCount,
            average_confidence: data.average_confidence || 0,
            average_valence: data.average_valence || 0,
            crisis_count: data.crisis_count || 0,
            risk_factors: riskFactors
        },
        disorder_indicators: disorderIndicators
    };
}

// Function to send data to the agent
function sendToAgent(report) {
    // Logic to send the report to the agent
    console.log('Sending report to agent:', report);
}

// Example usage
const exampleData = {
    user_id: 'e045643d-37cf-44fe-86d4-eb329456b5ab',
    emotion_sad: 1,
    emotion_anxious: 2,
    risk_sleep_quality: 'Poor',
    disorder_anxiety: 'Moderate',
    average_confidence: 0.7,
    average_valence: 0.2,
    crisis_count: 5
};

handleDataFromFrontend(exampleData); 