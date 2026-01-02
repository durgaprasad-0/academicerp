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

  const modelsToTry = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-flash-latest"];
  let lastError = null;

  const { 
    totalMarks, 
    examType,
    difficultyDistribution,
    bloomDistribution,
    courseId
  } = config;

  const prompt = `
    You are an expert Academic Question Paper Generator. 
    Generate a professional question paper for Course ID: ${courseId}, Exam Type: ${examType}, Total Marks: ${totalMarks}.
    
    Constraints:
    - Difficulty: ${JSON.stringify(difficultyDistribution)}
    - Bloom Levels: ${JSON.stringify(bloomDistribution)}

    Source Questions:
    ${JSON.stringify(availableQuestions.map(q => ({
      id: q.id,
      text: q.questionText,
      marks: q.marks,
      unitId: q.unitId
    })))}

    Return ONLY a JSON object:
    {
      "questions": [
        {"id": 1, "questionText": "...", "marks": 5, "unitId": 1, "bloomLevelId": 1, "difficultyLevelId": 1, "type": "short"}
      ],
      "totalMarks": ${totalMarks}
    }
    Ensure total marks sum to exactly ${totalMarks}.
  `;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying Gemini model: ${modelName}...`);
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: { responseMimeType: "application/json" }
      }); // Default to v1 stable

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
    }
  }

  throw new Error(lastError?.message || 'Failed to generate paper using Gemini AI after multiple attempts.');
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
