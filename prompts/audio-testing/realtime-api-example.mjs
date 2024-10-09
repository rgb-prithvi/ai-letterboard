import { RealtimeClient } from '@openai/realtime-api-beta';
import player from "play-sound";
import fs from 'fs/promises';
import { Buffer } from 'buffer';

const client = new RealtimeClient({ apiKey: process.env.OPENAI_API_KEY });

async function writeAudioToFile(audioData, outputPath) {
  console.log('Writing audio to file:', outputPath);
  try {
    let buffer;
    if (typeof audioData === 'string') {
      // Assume it's base64 encoded
      buffer = Buffer.from(audioData, 'base64');
    } else if (Buffer.isBuffer(audioData)) {
      buffer = audioData;
    } else {
      throw new Error('Unsupported audio data format');
    }

    await fs.writeFile(outputPath, buffer);
    console.log('Audio file written successfully');
  } catch (error) {
    console.error('Error writing audio file:', error);
    throw error;
  }
}

// Can set parameters ahead of connecting, either separately or all at once
client.updateSession({ instructions: 'You are a great, upbeat friend.' });
client.updateSession({ voice: 'alloy' });
client.updateSession({
  turn_detection: { type: 'none' }, // or 'server_vad'
  input_audio_transcription: { model: 'whisper-1' },
});

// Set up event handling
console.log('Setting up event handling');
client.on('conversation.updated', async (event) => {
  const { item, delta } = event;
  const items = client.conversation.getItems();
  console.log('Conversation updated:', { item, delta, items });

  // Write conversation update to JSON file
  try {
    const jsonData = JSON.stringify({ item, delta, items }, null, 2);
    const filename = `conversation_update_${Date.now()}.json`;
    await fs.writeFile(filename, jsonData, 'utf8');
    console.log(`Conversation update written to ${filename}`);
  } catch (error) {
    console.error('Error writing conversation update to JSON file:', error);
  }
});

// Connect to Realtime API
console.log('Connecting to Realtime API');
await client.connect();

// Send a item and triggers a generation
console.log('Sending user message');
client.sendUserMessageContent([{ type: 'input_text', text: `How are you?` }]);
console.log('Script completed');
