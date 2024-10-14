import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AuthScreen } from "@/components/AuthScreen";
import CustomKeyboard from "@/components/custom-keyboard";

export default async function Settings() {
  const session = await getServerSession(authOptions);

  return session ? <CustomKeyboard /> : <AuthScreen />;
}
