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