const fs = require('fs');
const player = require('play-sound')(opts = {})

// Configurable sample rate - adjust this value if needed
const SAMPLE_RATE = 24000; // Try different values like 8000, 16000, 22050, 44100

function normalizeAudio(audioData) {
  const values = Object.values(audioData);
  const maxValue = Math.max(...values.map(Math.abs));
  const scaleFactor = 32767 / maxValue;

  const normalizedData = {};
  for (const [key, value] of Object.entries(audioData)) {
    normalizedData[key] = Math.round(value * scaleFactor);
  }

  return normalizedData;
}

function convertToWav(audioData, outputFilePath) {
  const bitDepth = 16;
  const numChannels = 1;

  const dataLength = Object.keys(audioData).length;
  const buffer = Buffer.alloc(44 + dataLength * 2);

  // Write WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * numChannels * bitDepth / 8, 28);
  buffer.writeUInt16LE(numChannels * bitDepth / 8, 32);
  buffer.writeUInt16LE(bitDepth, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength * 2, 40);

  let offset = 44;
  for (let i = 0; i < dataLength; i++) {
    buffer.writeInt16LE(audioData[i], offset);
    offset += 2;
  }

  fs.writeFileSync(outputFilePath, buffer);
}

function playAudio(audioData) {
  const tempFilePath = 'temp_audio.wav';
  
  const normalizedAudioData = normalizeAudio(audioData);

  convertToWav(normalizedAudioData, tempFilePath);

  console.log(`Playing audio with sample rate: ${SAMPLE_RATE} Hz`);
  console.log(`Audio duration: ${Object.keys(audioData).length / SAMPLE_RATE} seconds`);

  player.play(tempFilePath, (err) => {
    if (err) console.error('Error playing audio:', err);
    fs.unlinkSync(tempFilePath);
  });
}

function playAudioFromJson(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      const audioData = jsonData.item.formatted.audio;

      if (!audioData) {
        console.error('Audio data not found in the specified JSON structure');
        return;
      }

      console.log(`Total audio samples: ${Object.keys(audioData).length}`);
      playAudio(audioData);
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
    }
  });
}

// Usage
playAudioFromJson('./conversation-output.json');