import { Injectable } from "@nestjs/common";

type SequenceState = {
  eventVersion: number;
  sequence: number;
};

@Injectable()
export class RealtimeService {
  private readonly sequenceByChannel = new Map<string, SequenceState>();

  nextEnvelope<T>(channel: string, eventType: string, payload: T) {
    const current = this.sequenceByChannel.get(channel) ?? { eventVersion: 1, sequence: 0 };
    const next = {
      eventVersion: current.eventVersion,
      sequence: current.sequence + 1,
    };
    this.sequenceByChannel.set(channel, next);

    return {
      channel,
      eventType,
      eventVersion: next.eventVersion,
      sequence: next.sequence,
      serverTimestampMs: Date.now(),
      payload,
    };
  }
}
