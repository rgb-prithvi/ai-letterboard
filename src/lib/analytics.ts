import posthog from "posthog-js";
import { supabase } from "@/lib/supabase";

class AnalyticsSDK {
  startSession(): void {
    posthog.capture("session_started");
  }

  endSession(): void {
    posthog.capture("session_ended");
  }

  trackBoardUsage(boardType: string, startTime: Date, endTime: Date): void {
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
    posthog.capture("board_usage", {
      board_type: boardType,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      duration,
    });
  }

  async trackInteraction(type: string, content: string, compositionTime?: number): Promise<void> {
    // PostHog tracking
    posthog.capture("board_interaction", {
      type,
      content,
      composition_time: compositionTime,
    });

    // Supabase tracking
    try {
      await supabase.from("interaction").insert({
        type,
        content,
        composition_time: compositionTime,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error writing to Supabase:", error);
    }
  }

  trackAudioTrace(interactionId: string, description: string): void {
    posthog.capture("audio_trace", {
      interaction_id: interactionId,
      description,
    });
  }

  submitFeedback(content: string): void {
    posthog.capture("feedback_submitted", {
      content,
    });
  }

  updateLastActive(): void {
    posthog.capture("user_active");
  }

  async trackPredictionSelect(prediction: string): Promise<void> {
    // PostHog tracking
    posthog.capture("board_interaction", {
      type: "prediction_select",
      content: prediction,
    });

    // Supabase tracking
    try {
      await supabase.from("interaction").insert({
        type: "prediction_select",
        content: prediction,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error writing to Supabase:", error);
    }
  }
}

const analytics = new AnalyticsSDK();
export default analytics;
