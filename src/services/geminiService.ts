import { AthleteProfile, TestName } from '../types';
import { FITNESS_TESTS, TRANSLATIONS } from '../constants';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getTestNameById = (id: string): string => {
  const test = FITNESS_TESTS.find(test => test.id === id);
  if (!test) {
    return 'Unknown Test';
  }
  const nameKey = `test_name_${test.name}`;
  return TRANSLATIONS['en'][nameKey] || 'Unknown Test';
};

export const generatePersonalizedFeedback = async (athlete: AthleteProfile): Promise<string> => {
  console.log('Generating feedback for:', athlete.firstName);

  const performanceSummary = athlete.results.map(result => {
    const testName = getTestNameById(result.testId);
    let scoreDisplay = `${result.latestScore}`;
    
    if (result.benchmark > 0) {
        const comparison = result.latestScore > result.benchmark ? 'above' : 'below';
        return `- ${testName}: Scored ${scoreDisplay}, which is ${comparison} the benchmark of ${result.benchmark}. (Top ${100 - result.percentile}%)`;
    } else {
        return `- ${testName}: Score is ${scoreDisplay}. (Top ${100 - result.percentile}%)`;
    }

  }).join('\n');

  const prompt = `
    You are an expert sports coach. Analyze the following performance data for an athlete named ${athlete.firstName} who is a ${athlete.age}-year-old ${athlete.gender.toLowerCase()} specializing in ${athlete.sport}.
    
    Performance Summary:
    ${performanceSummary}

    Based on this data, provide:
    1. A brief, encouraging summary of their strengths.
    2. One key area for improvement.
    3. A specific, actionable drill or exercise to help with that improvement.

    Keep the feedback concise, positive, and easy to understand for a young athlete. Use markdown for formatting.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({ 
      model: 'gemini-2.5-flash', 
      contents: prompt 
    });
    return response.text;
  } catch (error) {
    console.error("Error generating feedback from Gemini API:", error);
    return "Sorry, an error occurred while generating feedback. Please try again later.";
  }
};