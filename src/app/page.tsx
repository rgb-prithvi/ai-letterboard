import LetterboardWithAudio from '@/components/LetterboardWithAudio'
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { AuthScreen } from '@/components/AuthScreen';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return session ? <LetterboardWithAudio /> : <AuthScreen />;
}
