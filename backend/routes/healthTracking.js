const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const HealthReport = require('../models/HealthReport');
const UserInteraction = require('../models/UserInteraction');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `report-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only PDFs
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  },
  fileFilter: fileFilter
});

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
    console.log('Received health tracking data:', req.body);
    
    // Validate and normalize input data
    const validatedData = validateQuestionnaireData(req.body);
    const { user_id } = req.body;

    // Get previous reports for calculating changes
    const previousReports = await HealthReport.find({ userId: user_id })
      .sort({ timestamp: -1 })
      .limit(2)
      .exec();

    // Calculate summary data
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

    if (previousReports.length > 0) {
      const previous = previousReports[0]; // Most recent report
      
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
          durationChange: 0,
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

    // Store detailed questionnaire responses
    const questionResponses = [
      {
        questionId: 'mood',
        questionText: 'How would you rate your overall mood today?',
        response: validatedData.mood
      },
      {
        questionId: 'anxiety',
        questionText: 'How would you describe your anxiety level?',
        response: validatedData.anxiety
      },
      {
        questionId: 'sleep_quality',
        questionText: 'How would you rate your sleep quality?',
        response: validatedData.sleep_quality
      },
      {
        questionId: 'energy_levels',
        questionText: 'How are your energy levels today?',
        response: validatedData.energy_levels
      },
      {
        questionId: 'physical_symptoms',
        questionText: 'Are you experiencing any physical symptoms?',
        response: validatedData.physical_symptoms
      },
      {
        questionId: 'concentration',
        questionText: 'How is your concentration today?',
        response: validatedData.concentration
      },
      {
        questionId: 'self_care',
        questionText: 'How would you rate your self-care activities?',
        response: validatedData.self_care
      },
      {
        questionId: 'social_interactions',
        questionText: 'How would you rate your social interactions?',
        response: validatedData.social_interactions
      },
      {
        questionId: 'intrusive_thoughts',
        questionText: 'Are you experiencing any intrusive thoughts?',
        response: validatedData.intrusive_thoughts
      },
      {
        questionId: 'optimism',
        questionText: 'How optimistic do you feel about the future?',
        response: validatedData.optimism
      },
      {
        questionId: 'stress_factors',
        questionText: 'What are your current stress factors?',
        response: validatedData.stress_factors
      },
      {
        questionId: 'coping_strategies',
        questionText: 'What coping strategies are you using?',
        response: validatedData.coping_strategies
      },
      {
        questionId: 'social_support',
        questionText: 'How would you rate your social support system?',
        response: validatedData.social_support
      },
      {
        questionId: 'self_harm',
        questionText: 'Any thoughts of self-harm?',
        response: validatedData.self_harm
      },
      {
        questionId: 'discuss_professional',
        questionText: 'Would you like to discuss with a professional?',
        response: validatedData.discuss_professional
      }
    ];

    let report;
    try {
      // Generate emotion report with more context
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

      report = await generateEmotionReport(responses);
      console.log('Generated emotion report:', report);
    } catch (error) {
      console.error('Error generating emotion report:', error);
      // Create a more meaningful fallback report based on the actual data
      report = {
        summary: {
          emotions_count: { 
            'positive': validatedData.mood >= 7 ? 1 : 0,
            'neutral': validatedData.mood >= 4 && validatedData.mood < 7 ? 1 : 0,
            'negative': validatedData.mood < 4 ? 1 : 0
          },
          average_confidence: validatedData.concentration / 10,
          average_valence: validatedData.mood / 10,
          crisis_count: validatedData.self_harm !== 'none' || validatedData.anxiety === 'severe' ? 1 : 0,
          risk_factors: [
            ...(validatedData.self_harm !== 'none' ? ['Self-harm thoughts present'] : []),
            ...(validatedData.anxiety === 'severe' ? ['Severe anxiety'] : []),
            ...(validatedData.mood < 4 ? ['Low mood'] : []),
            ...(validatedData.intrusive_thoughts === 'severe' ? ['Severe intrusive thoughts'] : [])
          ]
        },
        disorder_indicators: [
          ...(validatedData.anxiety !== 'none' ? [`${validatedData.anxiety} anxiety symptoms`] : []),
          ...(validatedData.mood < 4 ? ['Depressive symptoms'] : []),
          ...(validatedData.intrusive_thoughts !== 'none' ? [`${validatedData.intrusive_thoughts} intrusive thoughts`] : []),
          ...(validatedData.sleep_quality < 4 ? ['Sleep disturbance'] : [])
        ]
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

    // Create new health report
    const healthReport = new HealthReport({
      userId: user_id,
      questionnaireData: validatedData,
      emotionReport: report,
      progressData: progressData,
      timestamp: now
    });

    // Create new user interaction
    const userInteraction = new UserInteraction({
      userId: user_id,
      sessionId: uuidv4(),
      interactionType: 'questionnaire',
      questionnaireResponses: questionResponses,
      startTime: now,
      endTime: now,
      metadata: {
        userAgent: req.headers['user-agent'],
        platform: req.headers['sec-ch-ua-platform'],
        browser: req.headers['sec-ch-ua'],
        emotionalState: {
          mood: validatedData.mood,
          anxiety: validatedData.anxiety,
          stress: 10 - validatedData.mood
        }
      }
    });

    // Save both documents
    const [savedReport, savedInteraction] = await Promise.all([
      healthReport.save(),
      userInteraction.save()
    ]);

    // Format and send response
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
        patterns: report.disorder_indicators || [],
        risk_factors: report.summary.risk_factors || []
      },
      progress: {
        moodData: progressData.moodData,
        sleepData: progressData.sleepData,
        activityData: progressData.activityData,
        summary
      },
      interactionId: savedInteraction._id
    });

  } catch (err) {
    console.error('Error processing health data:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get health history for a user
router.get('/:userId', async (req, res) => {
  try {
    console.log('Fetching health history for user:', req.params.userId);
    
    // Get all reports for the user, sorted by timestamp
    const reports = await HealthReport.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(30) // Limit to last 30 reports for performance
      .exec();

    if (!reports || reports.length === 0) {
      return res.status(200).json({ 
        insights: {
          mainInsight: { "neutral": 1 },
          riskAnalysis: {
            low: 0,
            moderate: 0,
            high: 0
          },
          anxietyTrend: {
            status: "stable",
            percentage: 0,
            detail: "No previous data available to determine anxiety trend"
          },
          stressResponse: {
            status: "stable",
            percentage: 0,
            detail: "No previous data available to determine stress response"
          },
          moodStability: {
            status: "stable",
            detail: "No previous data available to determine mood stability"
          },
          patterns: [],
          risk_factors: []
        },
        progress: {
          moodData: [],
          sleepData: [],
          activityData: [],
          summary: {
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
          }
        },
        recommendations: {
          articles: [],
          videos: [],
          wellness: {
            lifestyle: [],
            exercises: [],
            mindfulness: [],
            natural_remedies: []
          }
        }
      });
    }

    // Get the latest report for current insights
    const latestReport = reports[0];

    // Format historical data
    const historicalData = reports.map(report => ({
      timestamp: report.timestamp,
      mood: report.questionnaireData.mood,
      anxiety: report.questionnaireData.anxiety === 'none' ? 0 :
              report.questionnaireData.anxiety === 'mild' ? 30 :
              report.questionnaireData.anxiety === 'moderate' ? 60 : 90,
      sleep_quality: report.questionnaireData.sleep_quality,
      energy_levels: report.questionnaireData.energy_levels,
      concentration: report.questionnaireData.concentration,
      social_interactions: report.questionnaireData.social_interactions,
      optimism: report.questionnaireData.optimism
    }));

    // Calculate trends from historical data
    const calculateTrend = (metric) => {
      if (reports.length < 2) return 'stable';
      const recent = reports.slice(0, Math.min(7, reports.length));
      const values = recent.map(r => r.questionnaireData[metric]);
      const trend = values[0] - values[values.length - 1];
      return trend > 0 ? 'improving' : trend < 0 ? 'worsening' : 'stable';
    };

    // Format the response data
    const formattedData = {
      healthreports: historicalData,
      insights: {
        mainInsight: latestReport.emotionReport?.summary?.emotions_count || { neutral: 1 },
        riskAnalysis: {
          low: latestReport.emotionReport?.disorder_indicators?.filter(i => i.toLowerCase().includes('mild')).length || 0,
          moderate: latestReport.emotionReport?.disorder_indicators?.filter(i => i.toLowerCase().includes('moderate')).length || 0,
          high: latestReport.emotionReport?.disorder_indicators?.filter(i => i.toLowerCase().includes('severe')).length || 0
        },
        anxietyTrend: {
          status: calculateTrend('anxiety'),
          percentage: (latestReport.emotionReport?.summary?.average_confidence || 0.5) * 100,
          detail: `Based on your responses, your anxiety level appears to be ${latestReport.questionnaireData?.anxiety || 'normal'}`
        },
        stressResponse: {
          status: calculateTrend('stress_factors'),
          percentage: Math.round(((latestReport.emotionReport?.summary?.average_valence || 0.5) * 100)),
          detail: `Your stress management through ${latestReport.questionnaireData?.self_care || 'normal'} self-care activities shows ${latestReport.questionnaireData?.self_care === 'moderate' || latestReport.questionnaireData?.self_care === 'extensive' ? 'improvement' : 'room for improvement'}`
        },
        moodStability: {
          status: calculateTrend('mood'),
          detail: `Your mood rating of ${latestReport.questionnaireData?.mood || 5}/10 indicates ${latestReport.questionnaireData?.mood >= 5 ? 'stable mood' : 'mood fluctuations'}`
        },
        patterns: latestReport.emotionReport?.disorder_indicators || [],
        risk_factors: latestReport.emotionReport?.summary?.risk_factors || []
      },
      progress: {
        moodData: reports.map(report => ({
          date: report.timestamp.toISOString(),
          mood: report.questionnaireData.mood,
          anxiety: report.questionnaireData.anxiety === 'none' ? 0 :
                  report.questionnaireData.anxiety === 'mild' ? 30 :
                  report.questionnaireData.anxiety === 'moderate' ? 60 : 90,
          stress: report.questionnaireData.stress_factors ? 7 : 3
        })),
        sleepData: reports.map(report => ({
          date: report.timestamp.toISOString(),
          hours: 8, // Default value until sleep duration is added
          quality: report.questionnaireData.sleep_quality
        })),
        activityData: reports.map(report => ({
          date: report.timestamp.toISOString(),
          exercise: report.questionnaireData.self_care === 'extensive' ? 8 :
                   report.questionnaireData.self_care === 'moderate' ? 5 :
                   report.questionnaireData.self_care === 'minimal' ? 3 : 1,
          meditation: 5, // Default value
          social: report.questionnaireData.social_interactions
        })),
        summary: {
        mood: { 
            change: calculatePercentageChange(reports, 'mood') 
        },
        anxiety: { 
            change: calculatePercentageChange(reports, 'anxiety') 
        },
        stress: { 
            change: calculatePercentageChange(reports, 'stress_factors') 
        },
        sleep: {
            durationChange: 0, // Will be implemented when sleep duration is added
            qualityChange: calculatePercentageChange(reports, 'sleep_quality')
        },
        activities: {
            exerciseChange: calculatePercentageChange(reports, 'self_care'),
            meditationChange: 0, // Default until meditation tracking is added
            socialChange: calculatePercentageChange(reports, 'social_interactions')
          }
        }
      }
    };

    // Helper function to calculate percentage change
    function calculatePercentageChange(reports, metric) {
      if (reports.length < 2) return 0;
      const recent = reports.slice(0, Math.min(7, reports.length));
      const oldestValue = recent[recent.length - 1].questionnaireData[metric];
      const newestValue = recent[0].questionnaireData[metric];
      
      // Handle categorical values
      if (typeof newestValue === 'string') {
        const valueMap = {
          'none': 0,
          'mild': 30,
          'moderate': 60,
          'severe': 90,
          'minimal': 30,
          'extensive': 90
        };
        const oldVal = valueMap[oldestValue] || 0;
        const newVal = valueMap[newestValue] || 0;
        return Math.round(((newVal - oldVal) / oldVal) * 100);
      }
      
      // Handle numeric values
      return Math.round(((newestValue - oldestValue) / oldestValue) * 100);
    }

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching health history:', error);
    const errorMessage = error.name === 'CastError' ? 
      'Invalid user ID format' : 
      error.name === 'MongoError' ? 
        'Database connection error' : 
        'Error fetching health history';
    
    res.status(500).json({ 
      error: errorMessage,
      details: error.message
    });
  }
});

// Add new route to get user interaction history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, limit = 10, page = 1 } = req.query;

    const query = { userId };
    if (type) {
      query.interactionType = type;
    }

    const skip = (page - 1) * limit;

    const interactions = await UserInteraction.find(query)
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    const total = await UserInteraction.countDocuments(query);

    res.json({
      interactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching user interaction history:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route for viewing a specific report
router.get('/report/view/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find the user interaction that contains the report
    const interaction = await UserInteraction.findOne({
      _id: reportId,
      userId: userId,
      interactionType: 'report'
    });

    if (!interaction) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // If the interaction has a reportData field with a filePath
    if (interaction.reportData && interaction.reportData.filePath) {
      const filePath = interaction.reportData.filePath;
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Report file not found on server' });
      }
      
      // Set appropriate headers
      const filename = interaction.reportData.filename || 'report.pdf';
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      // If there's no file path, just return the interaction data
      res.json(interaction);
    }
  } catch (error) {
    console.error('Error viewing report:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Add new route to store chat messages
router.post('/chat/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { message, sessionId } = req.body;

    let interaction = await UserInteraction.findOne({
      userId,
      sessionId,
      interactionType: 'chat'
    });

    if (!interaction) {
      interaction = new UserInteraction({
        userId,
        sessionId,
        interactionType: 'chat',
        chatHistory: [],
        metadata: {
          userAgent: req.headers['user-agent'],
          platform: req.headers['sec-ch-ua-platform'],
          browser: req.headers['sec-ch-ua']
        }
      });
    }

    interaction.chatHistory.push({
      role: 'user',
      content: message
    });

    await interaction.save();

    res.json({ success: true, interaction });

  } catch (error) {
    console.error('Error storing chat message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save chat history
router.post('/chat', async (req, res) => {
  try {
    const { userId, messages, sessionId, metadata, interactionType, emotionalState } = req.body;

    // Validate messages format
    if (!Array.isArray(messages)) {
      throw new Error('Messages must be an array');
    }

    // Ensure each message has required fields
    const validatedMessages = messages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
    }));

    // Create a new user interaction
    const userInteraction = new UserInteraction({
      userId,
      sessionId: sessionId || uuidv4(),
      interactionType: interactionType || 'chat',
      chatHistory: validatedMessages,
      metadata: {
        ...metadata,
        timestamp: new Date(),
        emotionalState
      }
    });

    await userInteraction.save();

    res.json({
      success: true,
      msg: 'Chat history saved successfully'
    });
  } catch (error) {
    console.error('Error saving chat history:', error);
    res.status(500).json({
      success: false,
      msg: 'Failed to save chat history',
      error: error.message
    });
  }
});

// Test route for file uploads
router.post('/test-upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        message: 'Please upload a file to test.' 
      });
    }
    
    console.log('Test file received:', req.file);
    
    return res.status(200).json({
      success: true,
      message: 'Test file upload successful',
      fileDetails: {
        name: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        type: req.file.mimetype
      }
    });
    
  } catch (error) {
    console.error('Error in test file upload:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'An unexpected error occurred during test upload.'
    });
  }
});

// PDF Report Upload and Analysis
router.post('/pdf-analysis', upload.single('file'), async (req, res) => {
  try {
    console.log('=== PDF ANALYSIS REQUEST RECEIVED ===');
    console.log('RequestID:', new Date().getTime()); // For tracking in logs
    
    // Check if file is uploaded
    if (!req.file) {
      console.log('Error: No file uploaded');
      return res.status(400).json({ 
        error: 'No file uploaded',
        message: 'Please upload a PDF file.'
      });
    }
    
    // Check if userId is provided
    const { userId } = req.body;
    if (!userId) {
      console.log('Error: No userId provided');
      return res.status(400).json({ 
        error: 'User ID missing',
        message: 'User ID is required for processing reports.'
      });
    }
    
    // Log file details
    console.log('File received:', {
      originalName: req.file.originalname,
      size: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
      mimeType: req.file.mimetype,
      path: req.file.path
    });
    console.log('Processing for user:', userId);
    
    // Get file path
    const filePath = req.file.path;
    const sessionId = uuidv4();
    
    // Here you would call the PDF analysis service
    // For now, we'll simulate the analysis with a timeout
    setTimeout(async () => {
      try {
        console.log('Starting PDF analysis processing for:', req.file.originalname);
        
        // Mock data for sample response
        const pdfAnalysisData = {
          timestamp: new Date(),
          documentType: 'Medical Report',
          extractedData: {
            mood: 7,
            anxiety: 'mild',
            sleep_quality: 6,
            energy_levels: 5,
            physical_symptoms: 'mild',
            concentration: 8,
            self_care: 'moderate',
            social_interactions: 6,
            intrusive_thoughts: 'none',
            optimism: 7,
            stress_factors: 'Work deadlines and financial concerns',
            coping_strategies: 'Daily meditation and journaling',
            social_support: 8,
            self_harm: 'none',
            discuss_professional: 'Currently seeing a therapist bi-weekly'
          },
          findings: [
            {
              category: 'Mood',
              value: 'Relatively stable with mild fluctuations',
              recommendation: 'Continue current management strategies'
            },
            {
              category: 'Anxiety',
              value: 'Mild anxiety symptoms noted',
              recommendation: 'Consider mindfulness practice and cognitive techniques'
            },
            {
              category: 'Physical Health',
              value: 'No significant concerns identified',
              recommendation: 'Maintain regular exercise and healthy diet'
            }
          ]
        };
        
        console.log('PDF analysis data generated:', pdfAnalysisData);
        console.log('Creating HealthReport document...');
        
        // Save the analysis to the database
        const newReport = new HealthReport({
          userId,
          reportType: 'pdf-upload',
          reportPath: filePath,
          questionnaireData: pdfAnalysisData.extractedData,
          analysisResults: {
            summary: {
              mood: { value: pdfAnalysisData.extractedData.mood, change: 0 },
              anxiety: { value: pdfAnalysisData.extractedData.anxiety, change: 0 },
              sleep: { value: pdfAnalysisData.extractedData.sleep_quality, change: 0 }
            },
            insights: pdfAnalysisData.findings.map(finding => ({
              area: finding.category,
              insight: finding.value,
              recommendation: finding.recommendation
            })),
            riskFactors: []
          },
          emotionReport: {
            summary: {
              emotions_count: { 
                "positive": pdfAnalysisData.extractedData.mood >= 7 ? 1 : 0,
                "neutral": pdfAnalysisData.extractedData.mood >= 4 && pdfAnalysisData.extractedData.mood < 7 ? 1 : 0,
                "negative": pdfAnalysisData.extractedData.mood < 4 ? 1 : 0
              },
              average_confidence: pdfAnalysisData.extractedData.concentration / 10,
              average_valence: pdfAnalysisData.extractedData.mood / 10,
              crisis_count: pdfAnalysisData.extractedData.self_harm !== 'none' || pdfAnalysisData.extractedData.anxiety === 'severe' ? 1 : 0,
              risk_factors: [
                ...(pdfAnalysisData.extractedData.self_harm !== 'none' ? ['Self-harm thoughts present'] : []),
                ...(pdfAnalysisData.extractedData.anxiety === 'severe' ? ['Severe anxiety'] : []),
                ...(pdfAnalysisData.extractedData.mood < 4 ? ['Low mood'] : []),
                ...(pdfAnalysisData.extractedData.intrusive_thoughts === 'severe' ? ['Severe intrusive thoughts'] : [])
              ]
            },
            disorder_indicators: [
              ...(pdfAnalysisData.extractedData.anxiety !== 'none' ? [`${pdfAnalysisData.extractedData.anxiety} anxiety symptoms`] : []),
              ...(pdfAnalysisData.extractedData.mood < 4 ? ['Depressive symptoms'] : []),
              ...(pdfAnalysisData.extractedData.intrusive_thoughts !== 'none' ? [`${pdfAnalysisData.extractedData.intrusive_thoughts} intrusive thoughts`] : []),
              ...(pdfAnalysisData.extractedData.sleep_quality < 4 ? ['Sleep disturbance'] : [])
            ]
          },
          progressData: {
            moodData: [{
              date: new Date(),
              mood: pdfAnalysisData.extractedData.mood,
              anxiety: pdfAnalysisData.extractedData.anxiety === 'none' ? 0 : 
                      pdfAnalysisData.extractedData.anxiety === 'mild' ? 30 :
                      pdfAnalysisData.extractedData.anxiety === 'moderate' ? 60 : 90,
              stress: 10 - pdfAnalysisData.extractedData.mood
            }],
            sleepData: [{
              date: new Date(),
              hours: 8,
              quality: pdfAnalysisData.extractedData.sleep_quality
            }],
            activityData: [{
              date: new Date(),
              exercise: ['moderate', 'extensive'].includes(pdfAnalysisData.extractedData.self_care) ? 7 : 3,
              meditation: ['moderate', 'extensive'].includes(pdfAnalysisData.extractedData.self_care) ? 6 : 2,
              social: pdfAnalysisData.extractedData.social_interactions
            }]
          },
          timestamp: new Date()
        });
        
        // Create a new user interaction for the report submission
        const questionResponses = Object.entries(pdfAnalysisData.extractedData).map(([key, value]) => ({
          questionId: key,
          questionText: key.replace(/_/g, ' '),
          response: value
        }));
        
        const userInteraction = new UserInteraction({
          userId,
          sessionId,
          interactionType: 'report',
          questionnaireResponses: questionResponses,
          reportData: {
            title: pdfAnalysisData.documentType || 'Medical Report',
            filename: req.file.originalname,
            filePath: filePath,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            uploadDate: new Date()
          },
          startTime: pdfAnalysisData.timestamp,
          endTime: new Date(),
          metadata: {
            browser: req.headers['user-agent'],
            platform: req.headers['sec-ch-ua-platform'] || 'unknown'
          }
        });
        
        // Save both documents
        const [savedReport, savedInteraction] = await Promise.all([
          newReport.save(),
          userInteraction.save()
        ]);
        
        console.log('PDF analysis saved for user:', userId);
        console.log('Report document ID:', savedReport._id);
        console.log('User interaction ID:', savedInteraction._id);
        console.log('Emotion Report Data:', savedReport.emotionReport);
        console.log('=== PDF ANALYSIS COMPLETE ===');
        
        // Remove the file after processing (optional)
        // fs.unlinkSync(filePath);
        
      } catch (processError) {
        console.error('Error processing uploaded PDF:', processError);
        // Log the error but don't return - response already sent
      }
    }, 2000); // Simulate processing time
    
    // Return immediate success response to client
    // The actual processing happens asynchronously
    console.log('Responding to client with success message');
    return res.status(200).json({
      success: true,
      message: 'File uploaded and being processed',
      fileDetails: {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype
      }
    });
    
  } catch (error) {
    console.error('Error in PDF analysis endpoint:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'An unexpected error occurred while processing your file.'
    });
  }
});

module.exports = router; 