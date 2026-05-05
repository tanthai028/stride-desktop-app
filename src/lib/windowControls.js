function getWindowControls() {
  return window?.windowControls;
}

export function minimizeWindow() {
  getWindowControls()?.minimize?.();
}

export function toggleMaximizeWindow() {
  getWindowControls()?.toggleMaximize?.();
}

export function closeWindow() {
  getWindowControls()?.close?.();
}

export function openApplyModeWindow() {
  getWindowControls()?.openApplyMode?.();
}

export function exitApplyModeWindow() {
  getWindowControls()?.exitApplyMode?.();
}
