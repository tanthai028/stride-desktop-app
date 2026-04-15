import { getStoredSettings } from "../features/settings/storage/settingsStorage.js";

let audioContext = null;
let lastHoverAt = 0;
let hasPrimedAudio = false;

const HOVER_COOLDOWN_MS = 55;

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) return null;

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  return audioContext;
}

async function ensureAudioReady() {
  const context = getAudioContext();

  if (!context) return null;

  if (context.state === "suspended") {
    try {
      await context.resume();
    } catch {
      return null;
    }
  }

  return context;
}

function getActiveHoverSoundProfile(profileOverride) {
  if (profileOverride) {
    return profileOverride;
  }

  return getStoredSettings().hoverSoundProfile;
}

export async function primeUiFeedbackAudio() {
  await ensureAudioReady();
}

function playThock(context, t) {
  const osc = context.createOscillator();
  const gain = context.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(420, t);
  osc.frequency.exponentialRampToValueAtTime(360, t + 0.04);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(0.02, t + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

  osc.connect(gain);
  gain.connect(context.destination);

  osc.start(t);
  osc.stop(t + 0.06);
}

function playTactile(context, t) {
  const osc = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(920, t);
  osc.frequency.exponentialRampToValueAtTime(760, t + 0.018);

  filter.type = "highpass";
  filter.frequency.setValueAtTime(500, t);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.018, t + 0.0025);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  osc.start(t);
  osc.stop(t + 0.03);
}

function playClick(context, t) {
  const osc = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  osc.type = "square";
  osc.frequency.setValueAtTime(1400, t);
  osc.frequency.exponentialRampToValueAtTime(900, t + 0.008);

  filter.type = "highpass";
  filter.frequency.setValueAtTime(1000, t);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.015, t + 0.0015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  osc.start(t);
  osc.stop(t + 0.016);
}

function playFeedbackProfile(context, profile, t) {
  if (profile === "off") {
    return;
  }

  if (profile === "thock") {
    playThock(context, t);
    return;
  }

  if (profile === "tactile") {
    playTactile(context, t);
    return;
  }

  playClick(context, t);
}

export function triggerHoverFeedback(profile = "click") {
  const now = performance.now();

  if (now - lastHoverAt < HOVER_COOLDOWN_MS) return;
  lastHoverAt = now;

  const context = getAudioContext();
  if (!context || context.state !== "running") return;

  playFeedbackProfile(context, profile, context.currentTime);
}

export function getHoverFeedbackHandlers(profileOverride) {
  return {
    onPointerEnter: () => {
      const profile = getActiveHoverSoundProfile(profileOverride);

      if (profile === "off") {
        return;
      }

      if (!hasPrimedAudio) {
        hasPrimedAudio = true;
        void primeUiFeedbackAudio();
      }

      triggerHoverFeedback(profile);
    },
  };
}

export async function triggerPreviewFeedback(profile = "click") {
  const context = await ensureAudioReady();
  if (!context) return;

  playFeedbackProfile(context, profile, context.currentTime);
}
