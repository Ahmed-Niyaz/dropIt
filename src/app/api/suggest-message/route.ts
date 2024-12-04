import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    // const prompt =
    //   "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

      // Dynamically generate a temperature between 0.1 and 0.9
    const temperature = +(Math.random() + 0.1).toFixed(1);

    // Dynamically generate an index between 0 and 6
    const randomIndex = Math.floor(Math.random() * 6);

    // Generation configuration with dynamic temperature
    const generationConfig = {
      maxOutputTokens: 500,
      temperature: temperature,
      topP: 0.6,
      topK: 16,
    };

    const { text } = await generateText({
      model: google("gemini-1.5-pro-latest"),
      prompt: promptsArray[randomIndex],
      ...generationConfig
    });

    return new Response(text);
  } catch (error) {
    console.error("Error:", error);
    return new Response("Error generating messages", { status: 500 });
  }
}



const promptsArray = [
  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
  "Create a list of three fun and thought-provoking questions formatted as a single string. Each question should be separated by '||'. These questions are for a casual, anonymous social messaging platform, encouraging lighthearted and creative conversations. Avoid deeply personal or controversial topics. Examples of good questions include: 'What's a fictional world you wish was real?||If you could master any skill instantly, what would it be?||What's a song that always makes you feel good?'. Make sure the questions inspire curiosity and invite imaginative responses.",
  "Generate a list of three unique and engaging questions formatted as a single string. Separate each question with '||'. These questions are meant for a public, anonymous messaging platform to spark friendly and inclusive discussions. Avoid sensitive or divisive topics. For instance, a good output would look like: 'What's a food you were surprised to love?||If you could invent a holiday, what would it celebrate?||What's the best piece of advice you've ever received?'. Ensure the questions encourage creativity and a sense of connection.",
  "Create a set of three quirky and lighthearted questions formatted as a single string. Separate each question with '||'. These questions are for a friendly social messaging platform, designed to break the ice and promote casual interactions. Avoid topics that could be too personal or divisive. An example format: 'What's your favorite childhood memory involving food?||If animals could talk, which one would be the funniest?||What's a small goal you’ve set for yourself recently?'. Ensure the questions are approachable and fun.",
  "Write three intriguing and casual questions formatted as a single string. Each question should be separated by '||'. These questions are meant to inspire friendly and inclusive conversations on an anonymous platform, avoiding personal or sensitive subjects. For example: 'If you could bring back any trend, what would it be?||What's your go-to comfort activity after a long day?||If you could swap lives with someone for a day, who would it be?'. Make the questions fun, easy to answer, and relatable to a wide audience.",
  "Generate a list of three creative and engaging questions formatted as a single string. Separate the questions with '||'. These questions are for an anonymous social platform to encourage positive and imaginative interactions. Avoid deeply personal or controversial topics. For example, the output could look like: 'What's a superpower you'd want for a day and why?||If you had to describe yourself using only emojis, which would you choose?||What’s a simple activity that always puts you in a good mood?'. Ensure the questions are broad, entertaining, and inclusive."

]