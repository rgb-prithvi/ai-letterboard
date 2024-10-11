import { createClient, SupabaseClient } from '@supabase/supabase-js';

class AnalyticsSDK {
  private supabase: SupabaseClient;
  private userId: string | null = null;
  private sessionId: string | null = null;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async identify(userId: string): Promise<void> {
    this.userId = userId;
  }

  async startSession(): Promise<void> {
    if (!this.userId) {
      throw new Error('User must be identified before starting a session');
    }

    const { data, error } = await this.supabase
      .from('session')
      .insert({ user_id: this.userId, start_time: new Date().toISOString() })
      .select('session_id')
      .single();

    if (error) {
      console.error('Error starting session:', error);
      return;
    }

    this.sessionId = data.session_id;
  }

  async endSession(): Promise<void> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    const endTime = new Date().toISOString();
    const { error } = await this.supabase
      .from('session')
      .update({ end_time: endTime })
      .eq('session_id', this.sessionId);

    if (error) {
      console.error('Error ending session:', error);
    }

    this.sessionId = null;
  }

  async trackBoardUsage(boardType: string, startTime: Date, endTime: Date): Promise<void> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
    const { error } = await this.supabase
      .from('board_usage')
      .insert({
        session_id: this.sessionId,
        board_type: boardType,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration
      });

    if (error) {
      console.error('Error tracking board usage:', error);
    }
  }

  async trackInteraction(type: string, content: string, compositionTime?: number): Promise<void> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    const { error } = await this.supabase
      .from('interaction')
      .insert({
        session_id: this.sessionId,
        type,
        content,
        timestamp: new Date().toISOString(),
        composition_time: compositionTime
      });

    if (error) {
      console.error('Error tracking interaction:', error);
    }
  }

  async trackAudioTrace(interactionId: string, description: string): Promise<void> {
    const { error } = await this.supabase
      .from('audio_trace')
      .insert({
        interaction_id: interactionId,
        file_path: description, // We're using this field to store the description now
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('Error tracking audio trace:', error);
    }
  }

  async submitFeedback(content: string): Promise<void> {
    if (!this.userId) {
      throw new Error('User must be identified before submitting feedback');
    }

    const { error } = await this.supabase
      .from('feedback')
      .insert({
        user_id: this.userId,
        content,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('Error submitting feedback:', error);
    }
  }

  async updateLastActive(): Promise<void> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    const { error } = await this.supabase
      .from('session')
      .update({ last_active: new Date().toISOString() })
      .eq('session_id', this.sessionId);

    if (error) {
      console.error('Error updating last active timestamp:', error);
    }
  }

  async closeInactiveSessions(): Promise<void> {
    const inactivityThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds
    const thresholdDate = new Date(Date.now() - inactivityThreshold).toISOString();

    const { data, error } = await this.supabase
      .from('session')
      .update({ end_time: new Date().toISOString() })
      .is('end_time', null)
      .lt('last_active', thresholdDate);

    if (error) {
      console.error('Error closing inactive sessions:', error);
    } else {
      console.log(`Closed ${data?.length || 0} inactive sessions`);
    }
  }
}

// Create and export a singleton instance
const analytics = new AnalyticsSDK(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default analytics;