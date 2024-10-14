import { supabase } from "./supabase";

export type InteractionType = "word_spoken" | "key_press" | "text_submit" | "prediction_selected";

export async function logInteraction(type: InteractionType, content: string, userId: string) {
  try {
    const { error } = await supabase.from("interaction").insert({
      type,
      content,
      timestamp: new Date().toISOString(),
      user_id: userId,
    });

    if (error) {
      console.error("Error logging interaction:", error);
    }
  } catch (error) {
    console.error("Error logging interaction:", error);
  }
}
