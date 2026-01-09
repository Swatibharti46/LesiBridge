
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface IntakeAnalysisResult {
  title: string;
  summary: string;
  keyIssues: string[];
  suggestedCategory: string;
  estimatedBudget: string;
  caseType: string;
  confidenceScore: number;
  simpleExplanation: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  urgency: 'Low' | 'Medium' | 'High';
  roadmap: string[];
}

export const analyzeLegalIntake = async (userDescription: string, language: string = 'English'): Promise<IntakeAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user has described a legal situation in ${language}. 
      Analyze the raw description and convert it into a structured professional case brief.
      Provide the 'simpleExplanation' and 'roadmap' in the requested language: ${language}.
      
      User Description: "${userDescription}"`,
      config: {
        systemInstruction: "You are an expert legal aide. Analyze input to categorize case type, estimate risk, and provide a layman roadmap. Support multiple languages by translating results to the user's input language.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedCategory: { type: Type.STRING },
            estimatedBudget: { type: Type.STRING },
            caseType: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            simpleExplanation: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            urgency: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            roadmap: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "summary", "keyIssues", "suggestedCategory", "estimatedBudget", "caseType", "confidenceScore", "simpleExplanation", "riskLevel", "urgency", "roadmap"]
        }
      }
    });

    return JSON.parse(response.text) as IntakeAnalysisResult;
  } catch (error) {
    console.error("Error analyzing intake:", error);
    return {
      title: "Legal Inquiry",
      summary: userDescription,
      keyIssues: ["Review required"],
      suggestedCategory: "General",
      estimatedBudget: "TBD",
      caseType: "Unknown",
      confidenceScore: 0,
      simpleExplanation: "Analysis failed. A lawyer needs to review this manually.",
      riskLevel: "Medium",
      urgency: "Medium",
      roadmap: ["Wait for lawyer review", "Schedule consultation"]
    };
  }
};

export interface DocumentExplanationResult {
  keyPoints: string[];
  deadlines: string[];
  risks: string[];
  recommendedSteps: string[];
  laymanSummary: string;
  extractedMetadata?: Record<string, string>;
}

// Simulates Azure Form Recognizer using Gemini's Vision
export const analyzeDocumentImage = async (base64Data: string, mimeType: string): Promise<DocumentExplanationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        },
        {
          text: "Analyze this legal document image. Extract key points, deadlines, risks, and a layman summary. Also extract any dates, names, or amounts found as metadata."
        }
      ],
      config: {
        systemInstruction: "You are an advanced legal document parser. Extract structured data from images of legal notices, contracts, or court summons.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            deadlines: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            laymanSummary: { type: Type.STRING },
            extractedMetadata: { type: Type.OBJECT, additionalProperties: { type: Type.STRING } }
          },
          required: ["keyPoints", "deadlines", "risks", "recommendedSteps", "laymanSummary"]
        }
      }
    });
    return JSON.parse(response.text) as DocumentExplanationResult;
  } catch (error) {
    console.error("Error analyzing doc image:", error);
    throw error;
  }
};

export const explainLegalDocument = async (docText: string): Promise<DocumentExplanationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain this legal document in plain English: "${docText}"`,
      config: {
        systemInstruction: "You are a legal document translator. Extract key points, hidden risks, and critical deadlines.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            deadlines: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            laymanSummary: { type: Type.STRING }
          },
          required: ["keyPoints", "deadlines", "risks", "recommendedSteps", "laymanSummary"]
        }
      }
    });
    return JSON.parse(response.text) as DocumentExplanationResult;
  } catch (error) {
    console.error("Error explaining doc:", error);
    throw error;
  }
};

export const summarizeConsultation = async (problemDescription: string, lawyerAdvice: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Summarize consultation. Problem: "${problemDescription}". Advice: "${lawyerAdvice}"`,
             config: { systemInstruction: "Be clear and actionable." }
        });
        return response.text || "Could not generate summary.";
    } catch (error) {
        return "Summary generation failed.";
    }
};
