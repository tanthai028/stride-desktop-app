import timerAlarmUrl from "../assets/sounds/Alarm03.wav";

let timerAlarmAudio = null;
let timerAlarmPlayId = 0;

export function playTimerAlarm({ loopCount = 2, onComplete } = {}) {
  timerAlarmPlayId += 1;
  const currentPlayId = timerAlarmPlayId;

  try {
    if (!timerAlarmAudio) {
      timerAlarmAudio = new Audio(timerAlarmUrl);
      timerAlarmAudio.preload = "auto";
    }

    let completedLoops = 0;

    const playNextLoop = () => {
      if (currentPlayId !== timerAlarmPlayId) return;

      if (completedLoops >= loopCount) {
        timerAlarmAudio.onended = null;
        onComplete?.();
        return;
      }

      completedLoops += 1;
      timerAlarmAudio.currentTime = 0;

      timerAlarmAudio.play().catch(() => {
        timerAlarmAudio.onended = null;
        onComplete?.();
      });
    };

    timerAlarmAudio.pause();
    timerAlarmAudio.currentTime = 0;
    timerAlarmAudio.onended = playNextLoop;

    playNextLoop();
  } catch {
    onComplete?.();
  }
}

export function stopTimerAlarm() {
  timerAlarmPlayId += 1;

  if (!timerAlarmAudio) return;

  timerAlarmAudio.pause();
  timerAlarmAudio.currentTime = 0;
  timerAlarmAudio.onended = null;
}
