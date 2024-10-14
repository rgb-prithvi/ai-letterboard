import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const { name, description, wordCount } = await request.json();

    if (!name || !wordCount) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const promptDescription = description
      ? `The words should also all be highly relevant to the description provided by the user: ${description}.`
      : "";
    const prompt = `Generate a list of ${wordCount} words related to a word bank named "${name}". The words should be highly relevant to the word bank name. ${promptDescription}`;

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        words: z.array(z.string())
      }),
      prompt: prompt,
    });

    const words = object.words.map((word) => ({ word, is_highlighted: false }));
    return NextResponse.json({ words });
  } catch (error) {
    console.error("Error generating words:", error);
    return NextResponse.json({ error: "Failed to generate words" }, { status: 500 });
  }
}
