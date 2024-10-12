import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { SettingsPage } from "@/components/settings-page";
import { AuthScreen } from "@/components/AuthScreen";

export default async function Settings() {
  const session = await getServerSession(authOptions);

  return session ? <SettingsPage /> : <AuthScreen />;
}
