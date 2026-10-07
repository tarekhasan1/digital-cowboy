import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { collections } from '@/lib/email-va/firebase';
import { isBotUserAgent, parseDeviceType, parseBrowser, parseOS } from '@/lib/ua';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get('user-agent') || '';
    if (isBotUserAgent(userAgent)) {
      return NextResponse.json({ success: true, skipped: 'bot' });
    }

    const body = await req.json();
    const path: string = typeof body.path === 'string' ? body.path.slice(0, 300) : '/';
    const referrer: string | undefined = typeof body.referrer === 'string' ? body.referrer.slice(0, 300) : undefined;
    const visitorId: string | undefined = typeof body.visitorId === 'string' ? body.visitorId.slice(0, 100) : undefined;

    // Vercel populates `.geo` on every request (edge or node). Fall back to
    // reading its headers directly in case `.geo` is empty (e.g. local dev).
    const geo = (req as any).geo || {};
    const country = geo.country || req.headers.get('x-vercel-ip-country') || undefined;
    const region = geo.region || req.headers.get('x-vercel-ip-country-region') || undefined;
    const city = geo.city || req.headers.get('x-vercel-ip-city') || undefined;

    // Explicitly: no raw IP address and no raw user-agent string are stored —
    // only derived, aggregate-friendly category labels.
    const data = {
      path,
      referrer: referrer || null,
      visitorId: visitorId || null,
      country: country || null,
      region: region ? decodeURIComponent(region) : null,
      city: city ? decodeURIComponent(city) : null,
      deviceType: parseDeviceType(userAgent),
      browser: parseBrowser(userAgent),
      os: parseOS(userAgent),
      createdAt: new Date(),
    };

    await collections.visits.add(data);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Tracking failures should never surface to the visitor.
    console.error('[Track] error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
