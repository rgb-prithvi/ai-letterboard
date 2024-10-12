import posthog from "posthog-js";

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

  trackInteraction(type: string, content: string, compositionTime?: number): void {
    posthog.capture("board_interaction", {
      type,
      content,
      composition_time: compositionTime,
    });
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
}

const analytics = new AnalyticsSDK();
export default analytics;
