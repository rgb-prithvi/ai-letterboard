"use client"

import { useState, useEffect, useRef } from 'react'
import { RealtimeClient } from '@openai/realtime-api-beta'
import { Letterboard } from './letterboard'
import useLetterboardStore from '@/store/useLetterboardStore'

const SAMPLE_RATE = 24000; // Adjust this value if needed

function normalizeAudio(audioData: Record<string, number>) {
  const values = Object.values(audioData);
  const maxValue = Math.max(...values.map(Math.abs));
  const scaleFactor = 32767 / maxValue;

  const normalizedData: Record<string, number> = {};
  for (const [key, value] of Object.entries(audioData)) {
    normalizedData[key] = Math.round(value * scaleFactor);
  }

  return normalizedData;
}

function convertToWav(audioData: Record<string, number>): ArrayBuffer {
  const bitDepth = 16;
  const numChannels = 1;
  const dataLength = Object.keys(audioData).length;
  const buffer = new ArrayBuffer(44 + dataLength * 2);
  const view = new DataView(buffer);

  // Write WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * numChannels * bitDepth / 8, true);
  view.setUint16(32, numChannels * bitDepth / 8, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength * 2, true);

  let offset = 44;
  for (let i = 0; i < dataLength; i++) {
    view.setInt16(offset, audioData[i], true);
    offset += 2;
  }

  return buffer;
}

export function LetterboardWithAudio() {
  const [client, setClient] = useState<RealtimeClient | null>(null)
  const { text } = useLetterboardStore()
  const lastWordRef = useRef<string>('')

  useEffect(() => {
    const initializeClient = async () => {
      const newClient = new RealtimeClient({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowAPIKeyInBrowser: true })
      
      newClient.updateSession({
        instructions: 'You are a text-to-speech assistant. Respond only with the text provided, without any additional commentary.',
        voice: 'alloy',
        turn_detection: { type: 'none' },
        input_audio_transcription: { model: 'whisper-1' },
      })

      newClient.on('conversation.updated', handleConversationUpdate)

      await newClient.connect()
      setClient(newClient)
    }

    initializeClient()

    return () => {
      if (client) {
        client.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    const words = text.trim().split(/\s+/)
    const lastWord = words[words.length - 1]

    if (lastWord && lastWord !== lastWordRef.current) {
      sendWordToAPI(lastWord)
      lastWordRef.current = lastWord
    }

    if (text.endsWith(' ') || text.endsWith('\n')) {
      sendWordToAPI(text.trim())
    }
  }, [text, client])

  const sendWordToAPI = (word: string) => {
    if (client) {
      client.sendUserMessageContent([{ type: 'input_text', text: word }])
    }
  }

  const handleConversationUpdate = async (event: any) => {
    const { item } = event
    if (item.role === 'assistant' && item.formatted && item.formatted.audio) {
      const audioData = item.formatted.audio
      playAudio(audioData)
    }
  }

  const playAudio = (audioData: Record<string, number>) => {
    const normalizedAudioData = normalizeAudio(audioData);
    const wavBuffer = convertToWav(normalizedAudioData);
    const blob = new Blob([wavBuffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    
    audio.onended = () => {
      URL.revokeObjectURL(url);
    };

    console.log(`Playing audio with sample rate: ${SAMPLE_RATE} Hz`);
    console.log(`Audio duration: ${Object.keys(audioData).length / SAMPLE_RATE} seconds`);
    
    audio.play().catch(error => console.error('Error playing audio:', error));
  }

  return (
    <div>
      <Letterboard />
    </div>
  )
}