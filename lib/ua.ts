// Small hand-written User-Agent heuristic — good enough for device/browser/OS
// buckets in aggregate analytics. No new dependency, and critically, the raw
// UA string itself is never stored (see api/track/route.ts).

const BOT_PATTERN = /bot|crawler|spider|slurp|googlebot|bingbot|duckduckbot|baiduspider|yandexbot|facebookexternalhit|whatsapp|telegrambot|semrush|ahrefsbot|mj12bot|uptimerobot|pingdom|headlesschrome/i;

export function isBotUserAgent(ua: string): boolean {
  if (!ua) return true; // no UA at all is almost always a script, not a visitor
  return BOT_PATTERN.test(ua);
}

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function parseDeviceType(ua: string): DeviceType {
  if (/iPad|Tablet(?!.*Mobile)/i.test(ua)) return 'tablet';
  if (/Mobi|Android(?=.*Mobile)|iPhone|iPod/i.test(ua)) return 'mobile';
  return 'desktop';
}

export function parseBrowser(ua: string): string {
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR\/|Opera/i.test(ua)) return 'Opera';
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return 'Chrome';
  if (/CriOS/i.test(ua)) return 'Chrome';
  if (/FxiOS|Firefox\//i.test(ua)) return 'Firefox';
  if (/Safari\//i.test(ua) && /Version\//i.test(ua)) return 'Safari';
  return 'Other';
}

export function parseOS(ua: string): string {
  if (/Windows/i.test(ua)) return 'Windows';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Mac OS X/i.test(ua)) return 'macOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Other';
}
