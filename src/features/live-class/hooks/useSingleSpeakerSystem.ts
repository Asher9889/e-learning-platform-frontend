import type { LocalParticipant, RemoteParticipant } from "livekit-client";
import { useRef, useState, useEffect, useCallback } from "react";

// ── Tuneable constants ────────────────────────────────────────────────────────
const SPEAK_START_THRESHOLD = 0.05;  // audioLevel above this = speaking
const SPEAK_STOP_DELAY      = 900;   // ms of silence before a speaker is dropped
const SWITCH_COOLDOWN       = 600;   // ms before active speaker can change
const FADE_DURATION         = 300;   // ms — returned so UI can match transition

// ── Types ─────────────────────────────────────────────────────────────────────
export interface SpeakerState {
  /** Identity of the current active speaker, null if silent */
  activeSpeaker: string | null;
  /** True during the FADE_DURATION window after a speaker change */
  isTransitioning: boolean;
  /** Same value as FADE_DURATION — use this in your CSS transition */
  fadeDuration: number;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useSingleSpeakerSystem(
  participants: (RemoteParticipant | LocalParticipant)[],
  teacherId?: string
): SpeakerState {
  const [activeSpeaker, setActiveSpeaker]     = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Refs — never stale inside rAF loop, never cause re-renders
  const lastAudioRef    = useRef<Map<string, number>>(new Map());  // id → last active ms
  const queueRef        = useRef<string[]>([]);                    // speaker queue
  const lastSwitchRef   = useRef<number>(0);
  const activeSpeakerRef = useRef<string | null>(null);            // mirror without closure
  const transitionTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const rafRef          = useRef<number>(undefined);

  // Keep ref in sync with state
  useEffect(() => { activeSpeakerRef.current = activeSpeaker; }, [activeSpeaker]);

  const switchTo = useCallback((next: string | null) => {
    if (next === activeSpeakerRef.current) return;

    activeSpeakerRef.current = next;
    setActiveSpeaker(next);
    lastSwitchRef.current = Date.now();

    // Transition flag — lets UI apply a CSS fade
    clearTimeout(transitionTimer.current);
    setIsTransitioning(true);
    transitionTimer.current = setTimeout(
      () => setIsTransitioning(false),
      FADE_DURATION
    );
  }, []);

  // Participants ref so the rAF loop always sees latest without restarting
  const participantsRef = useRef(participants);
  useEffect(() => { participantsRef.current = participants; }, [participants]);

  const teacherIdRef = useRef(teacherId);
  useEffect(() => { teacherIdRef.current = teacherId; }, [teacherId]);

  useEffect(() => {
    const loop = () => {
      const now          = Date.now();
      const parts        = participantsRef.current;
      const tid          = teacherIdRef.current;
      const canSwitch    = now - lastSwitchRef.current > SWITCH_COOLDOWN;

      // ── 1. Update last-active timestamps ──────────────────────────────────
      for (const p of parts) {
        const id = p.identity;
        if (!id) continue;
        const speaking =
          p.isSpeaking || (p.audioLevel && p.audioLevel > SPEAK_START_THRESHOLD);
        if (speaking) lastAudioRef.current.set(id, now);
      }

      // ── 2. Evict stale speakers from map & queue ──────────────────────────
      for (const [id, time] of lastAudioRef.current.entries()) {
        if (now - time > SPEAK_STOP_DELAY) {
          lastAudioRef.current.delete(id);
          queueRef.current = queueRef.current.filter((q) => q !== id);
        }
      }

      // ── 3. Rebuild queue: teacher first, then most-recent ────────────────
      // Collect all currently-active speaker ids
      const activeSpeakers = [...lastAudioRef.current.keys()];

      // Sort: teacher always first, rest by most recent
      activeSpeakers.sort((a, b) => {
        if (a === tid) return -1;
        if (b === tid) return  1;
        return (lastAudioRef.current.get(b) ?? 0) -
               (lastAudioRef.current.get(a) ?? 0);
      });

      queueRef.current = activeSpeakers;

      // ── 4. Pick next speaker ──────────────────────────────────────────────
      const next = queueRef.current[0] ?? null;

      // Teacher override: switch immediately even within cooldown
      const isTeacherOverride =
        next === tid && activeSpeakerRef.current !== tid;

      if (next !== activeSpeakerRef.current) {
        if (isTeacherOverride || canSwitch) {
          switchTo(next);
        }
        // else: hold current speaker until cooldown passes (prevents flicker)
      } else if (next === null && activeSpeakerRef.current !== null) {
        // Nobody speaking → clear
        switchTo(null);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(transitionTimer.current);
    };
  // Only runs once — all dynamic values accessed via refs
  }, [switchTo]);

  return { activeSpeaker, isTransitioning, fadeDuration: FADE_DURATION };
}