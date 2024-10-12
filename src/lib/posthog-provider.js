"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useSession } from "next-auth/react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  });
}
export function CSPostHogProvider({ children }) {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user?.email) {
      posthog.identify(session.user.email);
    }
  }, [session]);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
