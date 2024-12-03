import { GoogleGenerativeAI } from "@google/generative-ai";

// 1
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

// 2
const generationConfig = {
//   stopSequences: ["red"],
  maxOutputTokens: 500,
  temperature: 0.7,
  topP: 0.6,
  topK: 16,
};

// 3
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  generationConfig,
});

//4
export async function GET(request: Request) {
  const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";


  try {
    const result = await model.generateContent(prompt);

    console.log("this is the response from gemini", result.response.text());
    return Response.json(
      {
        success: true,
        message: result.response.text(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error from gemini", error);
    return Response.json(
      {
        success: false,
        message: "Error from gemini",
      },
      { status: 400 }
    );
  }
}