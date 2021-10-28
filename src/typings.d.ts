export {};
declare var window: Window;
declare global {
  interface Window {
    process: any;
    require: any;
  }
}
