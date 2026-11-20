"use client";

import { useMutation } from "@tanstack/react-query";
import {
  trackFunnelEvent,
  TrackFunnelEventRequest,
} from "@/services/payment/track-funnel-event";

export function useTrackFunnelEvent() {
  return useMutation<void, Error, TrackFunnelEventRequest>({
    mutationFn: trackFunnelEvent,
  });
}
