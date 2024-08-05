declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    OneSignal: any;
  }
}

export default global;
