import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, voice_id } = await request.json();

    if (!text || !voice_id) {
      console.warn({ text, voice_id }, "Missing required parameters");
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `${text.trim()}.`,
        voice_settings: {
          stability: 0.9,
          similarity_boost: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        {
          status: response.status,
          statusText: response.statusText,
          errorBody,
        },
        "ElevenLabs request failed",
      );
      return NextResponse.json(
        { error: "TTS request failed", details: response.statusText },
        { status: response.status },
      );
    }

    const { readable, writable } = new TransformStream();
    response.body?.pipeTo(writable);

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error({ error }, "Unexpected error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
