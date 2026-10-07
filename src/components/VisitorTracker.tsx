'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const VISITOR_ID_KEY = 'dc_vid';

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    // Private browsing / storage blocked — fall back to a per-load id.
    return crypto.randomUUID();
  }
}

/**
 * Fires a lightweight, privacy-conscious page-view beacon on mount and on
 * every client-side route change. No cookies, no raw IP read client-side,
 * no PII — just an anonymous local id so /api/track can approximate unique
 * visitors vs. total page views.
 */
export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          path: pathname,
          referrer: document.referrer || undefined,
          visitorId: getVisitorId(),
        }),
      }).catch(() => {});
    } catch {
      // Tracking must never break the page.
    }
  }, [pathname]);

  return null;
}
