'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button onClick={() => signOut()}>Sign out</button>
    );
  }
  return (
    <button onClick={() => signIn('credentials')}>Sign in</button>
  );
}