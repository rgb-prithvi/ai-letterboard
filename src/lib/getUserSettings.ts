import { supabase } from "@/lib/supabase";

export async function getUserSettings(userId: string) {
  const { data, error } = await supabase
    .from("app_user")
    .select("settings")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }

  console.log("data", data);
  return data?.settings;
}
