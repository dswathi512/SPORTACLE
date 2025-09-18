
import { AthleteProfile, TestResult, FitnessTest, TestName } from '../types';
import { FITNESS_TESTS } from '../constants';

// This is a mock service. In a real application, you would import and use the @google/genai library here.
// import { GoogleGenAI } from "@google/genai";
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getTestNameById = (id: string): TestName | string => {
  return FITNESS_TESTS.find(test => test.id === id)?.name || 'Unknown Test';
};

export const generatePersonalizedFeedback = async (athlete: AthleteProfile): Promise<string> => {
  console.log('Generating feedback for:', athlete.firstName);

  const performanceSummary = athlete.results.map(result => {
    const testName = getTestNameById(result.testId);
    const comparison = result.latestScore > result.benchmark ? 'above' : 'below';
    return `- ${testName}: Scored ${result.latestScore}, which is ${comparison} the benchmark of ${result.benchmark}. (Top ${100 - result.percentile}%)`;
  }).join('\n');

  const prompt = `
    You are an expert sports coach. Analyze the following performance data for an athlete named ${athlete.firstName} who is a ${athlete.age}-year-old ${athlete.gender.toLowerCase()} specializing in ${athlete.sport}.
    
    Performance Summary:
    ${performanceSummary}

    Based on this data, provide:
    1. A brief, encouraging summary of their strengths.
    2. One key area for improvement.
    3. A specific, actionable drill or exercise to help with that improvement.

    Keep the feedback concise, positive, and easy to understand for a young athlete.
  `;

  // --- MOCK GEMINI API CALL ---
  // In a real app, you would use:
  // const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  // return response.text;
  
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API latency

  // Mocked response for demonstration
  const strengths = [];
  const weaknesses = [];

  athlete.results.forEach(r => {
      if (r.percentile >= 80) strengths.push(getTestNameById(r.testId));
      else if (r.percentile < 70) weaknesses.push(getTestNameById(r.testId));
  });

  let feedback = `**Great job, ${athlete.firstName}!**\n\n`;

  if (strengths.length > 0) {
    feedback += `**Strengths:** You're showing outstanding performance in **${strengths.join(', ')}**. Your power and stamina are impressive. Keep up the great work!\n\n`;
  } else {
    feedback += `You are building a strong foundation across all tests. Keep pushing!\n\n`;
  }

  if (weaknesses.length > 0) {
    const focusArea = weaknesses[0];
    feedback += `**Area for Improvement:** Let's focus on improving your **${focusArea}**.\n\n`;
    feedback += `**Actionable Tip:** To boost your ${focusArea} score, try incorporating **interval sprints** into your routine. Run at 80% intensity for 200 meters, rest for 60 seconds, and repeat 5 times. Do this twice a week.`;
  } else {
    feedback += `**Next Level:** You're performing well across the board. To take it to the next level, focus on consistency in your training and nutrition.`;
  }
  
  return feedback;
};
