
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLectureSummary = async (lectureTitle: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بصفتك مساعداً تعليمياً ذكياً، قم بتلخيص هذه المحاضرة في 3 نقاط أساسية للطالب. 
      عنوان المحاضرة: ${lectureTitle}. 
      الوصف: ${description}`,
      config: {
        systemInstruction: "أنت مساعد تعليمي متخصص في المناهج الدراسية العربية.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "لا يمكن إنشاء ملخص في الوقت الحالي.";
  }
};
