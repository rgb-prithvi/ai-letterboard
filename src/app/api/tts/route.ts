import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

export async function POST(request: NextRequest) {
  const { text, voice_id } = await request.json();

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}/stream`, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "TTS request failed" }, { status: response.status });
  }

  // Create a TransformStream to convert the ReadableStream to a Web-compatible stream
  const { readable, writable } = new TransformStream();

  // Pipe the response body to the TransformStream
  response.body?.pipeTo(writable);

  // Return a streaming response
  return new NextResponse(readable, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Transfer-Encoding": "chunked",
    },
  });
}
