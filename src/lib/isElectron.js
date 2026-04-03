export function isElectron() {
  return !!window?.electronEnv?.isElectron;
}
