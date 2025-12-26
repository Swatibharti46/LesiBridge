import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
// Note: API Key is assumed to be available in process.env.API_KEY per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface IntakeAnalysisResult {
  title: string;
  summary: string;
  keyIssues: string[];
  suggestedCategory: string;
  estimatedBudget: string;
}

export const analyzeLegalIntake = async (userDescription: string): Promise<IntakeAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user has described a legal situation regarding a startup. 
      Please act as a senior legal intake specialist. 
      Analyze the raw description and convert it into a structured professional case brief.
      
      User Description: "${userDescription}"`,
      config: {
        systemInstruction: "You are an expert legal aide for a startup law platform. Your job is to take confused, informal client requests and turn them into structured, professional summaries for lawyers to review. Be concise, objective, and highlight legal risks.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "A professional 5-10 word title for the case."
            },
            summary: {
              type: Type.STRING,
              description: "A 2-3 sentence professional summary of the facts."
            },
            keyIssues: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3-5 potential legal issues identified."
            },
            suggestedCategory: {
              type: Type.STRING,
              description: "E.g., Intellectual Property, Employment, Corporate Structure."
            },
            estimatedBudget: {
              type: Type.STRING,
              description: "A very rough estimated price range for this service (e.g. '$500 - $1000')."
            }
          },
          required: ["title", "summary", "keyIssues", "suggestedCategory", "estimatedBudget"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as IntakeAnalysisResult;

  } catch (error) {
    console.error("Error analyzing intake:", error);
    // Fallback in case of AI error to allow flow to continue (graceful degradation)
    return {
      title: "Legal Inquiry (AI Unavailable)",
      summary: userDescription,
      keyIssues: ["Review required"],
      suggestedCategory: "General",
      estimatedBudget: "TBD"
    };
  }
};