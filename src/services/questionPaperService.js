/**
 * Question Paper Service
 * Handles paper generation logic (Gemini simulator) and store integration
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import useQuestionPaperStore from '../store/useQuestionPaperStore';

// Initialize Gemini AI with stable v1 API version
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

/**
 * Generates a question paper using Gemini AI with fallback models
 * @param {Object} config - Paper configuration
 * @param {Array} availableQuestions - Pool of questions for the course
 */
export const generatePaper = async (config, availableQuestions) => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('Gemini API Key is missing. Please check your .env file.');
  }

  // Prioritize 2.0-flash-exp which is known to exist for this key, then fallback
  const modelsToTry = ["gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-pro"];
  let lastError = null;

  const { 
    totalMarks, 
    examType,
    difficultyDistribution,
    bloomDistribution,
    courseId,
    units: selectedUnits // Pass from Generator.jsx
  } = config;

  // Filter and limit questions to avoid hitting token limits
  const relevantQuestions = availableQuestions
    ?.filter(q => selectedUnits.map(u => u.id).includes(q.unitId))
    .map(q => ({
      id: q.id,
      text: q.questionText,
      marks: q.marks,
      unitId: q.unitId
    }))
    .slice(0, 50) || []; // Limit to 50 questions max context

  const prompt = `
    You are an expert Academic Question Paper Generator. 
    Generate a professional question paper for Course ID: ${courseId}, Exam Type: ${examType}, Total Marks: ${totalMarks}.
    
    The paper must cover exactly these ${selectedUnits.length} Units:
    ${selectedUnits.map(u => `- Unit ${u.unitNumber}: ${u.title} (Topics: ${u.topics.join(', ')})`).join('\n')}

    Rules:
    1. Distribute marks roughly equally across the selected units: ${selectedUnits.map(u => `Unit ${u.unitNumber}`).join(', ')}.
    2. Adhere to these constraints:
       - Difficulty: ${JSON.stringify(difficultyDistribution)}
       - Bloom Levels: ${JSON.stringify(bloomDistribution)}

    Source Question Bank (Use these if they fit the selected units/topics):
    ${JSON.stringify(relevantQuestions)}

    Return ONLY a JSON object:
    {
      "questions": [
        {"id": 1, "questionText": "...", "marks": 5, "unitId": 1, "bloomLevelId": 1, "difficultyLevelId": 1, "type": "short"}
      ],
      "totalMarks": ${totalMarks}
    }
    The "id" should be the original ID from the source if selected, or a new unique numeric ID if you generate a new question to fill gaps.
  `;

  // Fallback Rule-Based Generation (if API fails)
  const generateMockPaper = () => {
    console.warn("Falling back to rule-based generation due to API limits/errors.");
    
    let paperQuestions = [];
    let currentMarks = 0;
    
    // Shuffle questions to ensure randomness
    const shuffled = [...(availableQuestions || [])].sort(() => 0.5 - Math.random());
    
    // 1. Ensure at least one question from each selected unit
    selectedUnits.forEach(unit => {
      const q = shuffled.find(sq => sq.unitId === unit.id && !paperQuestions.includes(sq));
      if (q) {
        paperQuestions.push({
          id: q.id,
          questionText: q.questionText,
          marks: q.marks,
          unitId: q.unitId,
          bloomLevelId: q.bloomLevelId || 1,
          difficultyLevelId: q.difficultyLevelId || 2
        });
        currentMarks += q.marks;
      }
    });

    // 2. Fill remaining marks
    for (const q of shuffled) {
      if (currentMarks >= totalMarks) break;
      if (!paperQuestions.map(pq => pq.id).includes(q.id)) {
         paperQuestions.push({
          id: q.id,
          questionText: q.questionText,
          marks: q.marks,
          unitId: q.unitId,
          bloomLevelId: q.bloomLevelId || 1,
          difficultyLevelId: q.difficultyLevelId || 2
        });
        currentMarks += q.marks;
      }
    }

    return {
      id: Date.now(),
      questions: paperQuestions,
      totalMarks: currentMarks,
      config,
      generatedAt: new Date().toISOString(),
      status: 'final',
      generatedBy: 'Fallback Algorithm' // Indicate this was rule-based
    };
  };

  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying Gemini model: ${modelName}...`);
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: { responseMimeType: "application/json" }
      }); 

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      let paperJson;
      try {
        paperJson = JSON.parse(text);
      } catch (parseError) {
        console.error(`JSON Parse Error with ${modelName}. Raw Text:`, text);
        continue; // Try next model
      }

      if (!paperJson.questions || !Array.isArray(paperJson.questions)) {
        console.warn(`Invalid format from ${modelName}`);
        continue;
      }

      return {
        id: Date.now(),
        questions: paperJson.questions,
        totalMarks: paperJson.totalMarks || paperJson.questions.reduce((sum, q) => sum + q.marks, 0),
        config,
        generatedAt: new Date().toISOString(),
        status: 'final'
      };
    } catch (error) {
      console.error(`Error with ${modelName}:`, error.message);
      lastError = error;
      // Wait 2 seconds before retrying to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // If all models fail, return the rule-based fallback
  return generateMockPaper();
};

export const savePaper = (paper) => {
  const store = useQuestionPaperStore.getState();
  return store.addPaper(paper);
};

export const deletePaper = (id) => {
  const store = useQuestionPaperStore.getState();
  return store.deletePaper(id);
};

export const getHistory = () => {
  const store = useQuestionPaperStore.getState();
  return store.papers;
};

export default {
  generatePaper,
  savePaper,
  deletePaper,
  getHistory
};
