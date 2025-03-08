const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const HealthReport = require('../models/HealthReport');
const fs = require('fs');

// Helper function to run Python emotion report generator
const generateEmotionReport = async (responses) => {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(__dirname, '../../agent/agent/emotion_report_generator.py');
    console.log('Python script path:', pythonScriptPath);
    console.log('Sending responses to Python:', JSON.stringify(responses));

    const pythonProcess = spawn('python', [pythonScriptPath]);
    let result = '';
    let error = '';

    pythonProcess.stdin.write(JSON.stringify(responses));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
      const chunk = data.toString();
      console.log('Python stdout chunk:', chunk);
      result += chunk;
    });

    pythonProcess.stderr.on('data', (data) => {
      const chunk = data.toString();
      console.log('Python stderr chunk:', chunk);
      error += chunk;
    });

    pythonProcess.on('close', (code) => {
      console.log('Python process exited with code:', code);
      console.log('Final stdout:', result);
      console.log('Final stderr:', error);

      if (code !== 0) {
        reject(new Error(`Python process failed with code ${code}: ${error}`));
      } else {
        try {
          // Try to clean the output in case there's any extra output
          const cleanedResult = result.trim().split('\n').pop();
          console.log('Cleaned result:', cleanedResult);
          const parsedResult = JSON.parse(cleanedResult);
          resolve(parsedResult);
        } catch (e) {
          console.error('JSON parse error:', e);
          console.error('Raw result:', result);
          // Return a default report structure if parsing fails
          resolve({
            summary: {
              emotions_count: { "neutral": 1 },
              average_confidence: 0.5,
              average_valence: 0.5,
              crisis_count: 0,
              risk_factors: []
            },
            disorder_indicators: []
          });
        }
      }
    });

    pythonProcess.on('error', (err) => {
      console.error('Failed to start Python process:', err);
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });
  });
};

// Validate questionnaire data
const validateQuestionnaireData = (data) => {
  const {
    mood,
    anxiety,
    sleep_quality,
    energy_levels,
    physical_symptoms,
    concentration,
    self_care,
    social_interactions,
    intrusive_thoughts,
    optimism,
    stress_factors,
    coping_strategies,
    social_support,
    self_harm,
    discuss_professional
  } = data;

  // Validate numeric fields are between 1-10
  if (!Number.isInteger(mood) || mood < 1 || mood > 10) {
    throw new Error(`Mood must be a number between 1-10. Received: ${mood}`);
  }
  if (!Number.isInteger(sleep_quality) || sleep_quality < 1 || sleep_quality > 10) {
    throw new Error(`Sleep quality must be a number between 1-10. Received: ${sleep_quality}`);
  }
  if (!Number.isInteger(energy_levels) || energy_levels < 1 || energy_levels > 10) {
    throw new Error(`Energy levels must be a number between 1-10. Received: ${energy_levels}`);
  }
  if (!Number.isInteger(concentration) || concentration < 1 || concentration > 10) {
    throw new Error(`Concentration must be a number between 1-10. Received: ${concentration}`);
  }
  if (!Number.isInteger(social_interactions) || social_interactions < 1 || social_interactions > 10) {
    throw new Error(`Social interactions must be a number between 1-10. Received: ${social_interactions}`);
  }
  if (!Number.isInteger(optimism) || optimism < 1 || optimism > 10) {
    throw new Error(`Optimism must be a number between 1-10. Received: ${optimism}`);
  }
  if (!Number.isInteger(social_support) || social_support < 1 || social_support > 10) {
    throw new Error(`Social support must be a number between 1-10. Received: ${social_support}`);
  }

  // Validate categorical fields
  const validAnxietyLevels = ['none', 'mild', 'moderate', 'severe'];
  if (!validAnxietyLevels.includes(anxiety)) {
    throw new Error(`Anxiety must be one of: ${validAnxietyLevels.join(', ')}. Received: ${anxiety}`);
  }

  const validPhysicalSymptoms = ['none', 'mild', 'moderate', 'severe'];
  if (!validPhysicalSymptoms.includes(physical_symptoms)) {
    throw new Error(`Physical symptoms must be one of: ${validPhysicalSymptoms.join(', ')}. Received: ${physical_symptoms}`);
  }

  const validSelfCare = ['none', 'minimal', 'moderate', 'extensive'];
  if (!validSelfCare.includes(self_care)) {
    throw new Error(`Self-care response must be one of: ${validSelfCare.join(', ')}. Received: ${self_care}`);
  }

  const validIntrusiveThoughts = ['none', 'mild', 'moderate', 'severe'];
  if (!validIntrusiveThoughts.includes(intrusive_thoughts)) {
    throw new Error(`Intrusive thoughts must be one of: ${validIntrusiveThoughts.join(', ')}. Received: ${intrusive_thoughts}`);
  }

  const validSelfHarm = ['none', 'passive', 'active', 'severe'];
  if (!validSelfHarm.includes(self_harm)) {
    throw new Error(`Self-harm response must be one of: ${validSelfHarm.join(', ')}. Received: ${self_harm}`);
  }

  // Validate text fields are non-empty strings
  if (typeof stress_factors !== 'string' || !stress_factors.trim()) {
    throw new Error('Stress factors must be a non-empty string');
  }
  if (typeof coping_strategies !== 'string' || !coping_strategies.trim()) {
    throw new Error('Coping strategies must be a non-empty string');
  }
  if (typeof discuss_professional !== 'string' || !discuss_professional.trim()) {
    throw new Error('Professional discussion must be a non-empty string');
  }

  // Return normalized data
  return {
    ...data,
    mood: Number(mood),
    sleep_quality: Number(sleep_quality),
    energy_levels: Number(energy_levels),
    concentration: Number(concentration),
    social_interactions: Number(social_interactions),
    optimism: Number(optimism),
    social_support: Number(social_support),
    anxiety: anxiety.toLowerCase(),
    physical_symptoms: physical_symptoms.toLowerCase(),
    self_care: self_care.toLowerCase(),
    intrusive_thoughts: intrusive_thoughts.toLowerCase(),
    self_harm: self_harm.toLowerCase(),
    stress_factors: stress_factors.trim(),
    coping_strategies: coping_strategies.trim(),
    discuss_professional: discuss_professional.trim()
  };
};

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

// Submit questionnaire and get analysis
router.post('/', async (req, res) => {
  try {
    console.log('Received questionnaire data:', req.body);
    
    // Validate and normalize input data
    const validatedData = validateQuestionnaireData(req.body);
    const { user_id } = req.body;

    let report;
    try {
      // Prepare responses for Python agent
      const responses = [
        String(validatedData.mood),
        validatedData.anxiety,
        String(validatedData.sleep_quality),
        String(validatedData.energy_levels),
        validatedData.physical_symptoms,
        String(validatedData.concentration),
        validatedData.self_care,
        String(validatedData.social_interactions),
        validatedData.intrusive_thoughts,
        String(validatedData.optimism),
        validatedData.stress_factors,
        validatedData.coping_strategies,
        String(validatedData.social_support),
        validatedData.self_harm,
        validatedData.discuss_professional
      ];

      // Generate emotion report
      report = await generateEmotionReport(responses);
      console.log('Generated emotion report:', report);
    } catch (error) {
      console.error('Error generating emotion report:', error);
      report = {
        summary: {
          emotions_count: { 'neutral': 1 },
          average_confidence: 0.5,
          average_valence: validatedData.mood / 10,
          crisis_count: 0,
          risk_factors: []
        },
        disorder_indicators: []
      };
    }

    const now = new Date();
    
    // Create progress data
    const progressData = {
      moodData: [{
        date: now,
        mood: validatedData.mood,
        anxiety: validatedData.anxiety === 'none' ? 0 : validatedData.anxiety === 'mild' ? 3 : validatedData.anxiety === 'moderate' ? 6 : 9,
        stress: 10 - validatedData.mood
      }],
      sleepData: [{
        date: now,
        hours: 8,
        quality: validatedData.sleep_quality
      }],
      activityData: [{
        date: now,
        exercise: ['moderate', 'extensive'].includes(validatedData.self_care) ? 7 : 3,
        meditation: ['moderate', 'extensive'].includes(validatedData.self_care) ? 6 : 2,
        social: validatedData.social_interactions
      }]
    };

    // Prepare data for storage
    const healthReport = new HealthReport({
      userId: user_id,
      questionnaireData: validatedData,
      emotionReport: report,
      progressData: progressData,
      timestamp: now
    });

    // Save to database
    await healthReport.save();
    console.log('Saved health report to database');

    // Store the report in JSON
    storeDataInJson(validatedData, report);

    // Get previous reports for calculating changes
    const previousReports = await HealthReport.find({ userId: user_id })
      .sort({ timestamp: -1 })
      .limit(2)
      .exec();

    let summary = {
      mood: { change: 0 },
      anxiety: { change: 0 },
      stress: { change: 0 },
      sleep: {
        durationChange: 0,
        qualityChange: 0
      },
      activities: {
        exerciseChange: 0,
        meditationChange: 0,
        socialChange: 0
      }
    };

    if (previousReports.length > 1) {
      const previous = previousReports[1]; // Second most recent report
      
      summary = {
        mood: { 
          change: ((validatedData.mood - previous.questionnaireData.mood) / previous.questionnaireData.mood * 100).toFixed(1)
        },
        anxiety: { 
          change: ((validatedData.anxiety === 'none' ? 0 : validatedData.anxiety === 'mild' ? 3 : validatedData.anxiety === 'moderate' ? 6 : 9) -
            (previous.questionnaireData.anxiety === 'none' ? 0 : previous.questionnaireData.anxiety === 'mild' ? 3 : previous.questionnaireData.anxiety === 'moderate' ? 6 : 9)).toFixed(1)
        },
        stress: { 
          change: (((10 - validatedData.mood) - (10 - previous.questionnaireData.mood)) / (10 - previous.questionnaireData.mood) * 100).toFixed(1)
        },
        sleep: {
          durationChange: 0, // We don't track actual duration
          qualityChange: ((validatedData.sleep_quality - previous.questionnaireData.sleep_quality) / previous.questionnaireData.sleep_quality * 100).toFixed(1)
        },
        activities: {
          exerciseChange: (((['moderate', 'extensive'].includes(validatedData.self_care) ? 7 : 3) - 
            (['moderate', 'extensive'].includes(previous.questionnaireData.self_care) ? 7 : 3)) / 
            (['moderate', 'extensive'].includes(previous.questionnaireData.self_care) ? 7 : 3) * 100).toFixed(1),
          meditationChange: (((['moderate', 'extensive'].includes(validatedData.self_care) ? 6 : 2) - 
            (['moderate', 'extensive'].includes(previous.questionnaireData.self_care) ? 6 : 2)) / 
            (['moderate', 'extensive'].includes(previous.questionnaireData.self_care) ? 6 : 2) * 100).toFixed(1),
          socialChange: ((validatedData.social_interactions - previous.questionnaireData.social_interactions) / 
            previous.questionnaireData.social_interactions * 100).toFixed(1)
        }
      };
    }

    // Format response for frontend
    res.json({
      insights: {
        mainInsight: report.summary.emotions_count,
        riskAnalysis: {
          low: report.disorder_indicators.filter(i => i.toLowerCase().includes('mild')).length,
          moderate: report.disorder_indicators.filter(i => i.toLowerCase().includes('moderate')).length,
          high: report.disorder_indicators.filter(i => i.toLowerCase().includes('severe')).length
        },
        anxietyTrend: {
          status: validatedData.anxiety === 'moderate' || validatedData.anxiety === 'severe' ? 'increasing' : 'stable',
          percentage: report.summary.average_confidence * 100,
          detail: `Based on your responses, your anxiety level appears to be ${validatedData.anxiety}`
        },
        stressResponse: {
          status: validatedData.self_care === 'moderate' || validatedData.self_care === 'extensive' ? 'improving' : 'worsening',
          percentage: Math.round((report.summary.average_valence || validatedData.mood / 10) * 100),
          detail: `Your stress management through ${validatedData.self_care} self-care activities shows ${validatedData.self_care === 'moderate' || validatedData.self_care === 'extensive' ? 'improvement' : 'room for improvement'}`
        },
        moodStability: {
          status: validatedData.mood >= 5 ? 'stable' : 'fluctuating',
          detail: `Your mood rating of ${validatedData.mood}/10 indicates ${validatedData.mood >= 5 ? 'stable mood' : 'mood fluctuations'}`
        },
        patterns: report.disorder_indicators || []
      },
      progress: {
        moodData: progressData.moodData,
        sleepData: progressData.sleepData,
        activityData: progressData.activityData,
        summary
      }
    });
  } catch (error) {
    console.error('Error processing health tracking:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get health history for a user
router.get('/:userId', async (req, res) => {
  try {
    console.log('Fetching health history for user:', req.params.userId);
    
    // Get all reports for the user, sorted by timestamp
    const reports = await HealthReport.find({ userId: req.params.userId })
      .sort({ timestamp: 1 })
      .exec();

    if (!reports || reports.length === 0) {
      return res.status(404).json({ error: 'No health history found' });
    }

    // Aggregate all progress data
    const progressData = {
      moodData: reports.flatMap(report => 
        report.progressData?.moodData?.map(data => ({
          ...data,
          date: data.date.toISOString()
        })) || []
      ),
      sleepData: reports.flatMap(report => 
        report.progressData?.sleepData?.map(data => ({
          ...data,
          date: data.date.toISOString()
        })) || []
      ),
      activityData: reports.flatMap(report => 
        report.progressData?.activityData?.map(data => ({
          ...data,
          date: data.date.toISOString()
        })) || []
      )
    };

    // Calculate changes if there are at least 2 reports
    let summary = {
      mood: { change: 0 },
      anxiety: { change: 0 },
      stress: { change: 0 },
      sleep: {
        durationChange: 0,
        qualityChange: 0
      },
      activities: {
        exerciseChange: 0,
        meditationChange: 0,
        socialChange: 0
      }
    };

    if (reports.length >= 2) {
      const latest = reports[reports.length - 1];
      const previous = reports[reports.length - 2];

      summary = {
        mood: { 
          change: ((latest.questionnaireData.mood - previous.questionnaireData.mood) / previous.questionnaireData.mood * 100).toFixed(1)
        },
        anxiety: { 
          change: ((latest.questionnaireData.anxiety === 'none' ? 0 : latest.questionnaireData.anxiety === 'mild' ? 3 : latest.questionnaireData.anxiety === 'moderate' ? 6 : 9) -
            (previous.questionnaireData.anxiety === 'none' ? 0 : previous.questionnaireData.anxiety === 'mild' ? 3 : previous.questionnaireData.anxiety === 'moderate' ? 6 : 9)).toFixed(1)
        },
        stress: { 
          change: (((10 - latest.questionnaireData.mood) - (10 - previous.questionnaireData.mood)) / (10 - previous.questionnaireData.mood) * 100).toFixed(1)
        },
        sleep: {
          durationChange: 0,
          qualityChange: ((latest.questionnaireData.sleep_quality - previous.questionnaireData.sleep_quality) / previous.questionnaireData.sleep_quality * 100).toFixed(1)
        },
        activities: {
          exerciseChange: (((['moderate', 'extensive'].includes(latest.questionnaireData.self_care) ? 7 : 3) - 
            (['moderate', 'extensive'].includes(previous.questionnaireData.self_care) ? 7 : 3)) / 
            (['moderate', 'extensive'].includes(previous.questionnaireData.self_care) ? 7 : 3) * 100).toFixed(1),
          meditationChange: (((['moderate', 'extensive'].includes(latest.questionnaireData.self_care) ? 6 : 2) - 
            (['moderate', 'extensive'].includes(previous.questionnaireData.self_care) ? 6 : 2)) / 
            (['moderate', 'extensive'].includes(previous.questionnaireData.self_care) ? 6 : 2) * 100).toFixed(1),
          socialChange: ((latest.questionnaireData.social_interactions - previous.questionnaireData.social_interactions) / 
            previous.questionnaireData.social_interactions * 100).toFixed(1)
        }
      };
    }

    // Return both the latest emotion report and progress data
    res.json({
      emotionReport: reports[reports.length - 1].emotionReport,
      progress: {
        ...progressData,
        summary
      }
    });
  } catch (error) {
    console.error('Error fetching health history:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 