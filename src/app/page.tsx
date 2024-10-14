import InputWrapper from "@/components/input-wrapper";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AuthScreen } from "@/components/AuthScreen";
import { getUserSettings } from "@/lib/getUserSettings";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AuthScreen />;
  }

  const userSettings = await getUserSettings(session.user.id);

  return <InputWrapper userSettings={userSettings} />;
}
