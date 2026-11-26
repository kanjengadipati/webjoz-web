"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { captureAttributionParams, isTrackableWebjozContext } from "@/lib/ad-tracking";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "";
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID?.trim() || "";
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID?.trim() || "";

function RouteTrackingObserver() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isTrackableWebjozContext()) return;

    const search = searchParams?.toString() ? `?${searchParams.toString()}` : "";
    captureAttributionParams(search, pathname || "/");

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Track SPA route transitions after initial load
    if (META_PIXEL_ID && typeof window.fbq === "function") {
      try {
        window.fbq("track", "PageView");
      } catch { /* noop */ }
    }
    if (GA4_ID && typeof window.gtag === "function") {
      try {
        window.gtag("config", GA4_ID, { page_path: pathname + search });
      } catch { /* noop */ }
    }
    if (TIKTOK_PIXEL_ID && window.ttq && typeof window.ttq.page === "function") {
      try {
        window.ttq.page();
      } catch { /* noop */ }
    }
  }, [pathname, searchParams]);

  return null;
}

export function MarketingPixels() {
  const [canTrack, setCanTrack] = useState(false);

  useEffect(() => {
    if (isTrackableWebjozContext()) {
      captureAttributionParams();
      setCanTrack(true);
    }
  }, []);

  if (!canTrack) {
    return null;
  }

  return (
    <>
      <Suspense fallback={null}>
        <RouteTrackingObserver />
      </Suspense>

      {META_PIXEL_ID && (
        <Script id="webjoz-meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {GA4_ID && (
        <>
          <Script
            id="webjoz-ga4-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="webjoz-ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA4_ID}', { send_page_view: true });
            `}
          </Script>
        </>
      )}

      {TIKTOK_PIXEL_ID && (
        <Script id="webjoz-tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
              ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
              ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;
              ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");
              o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;
              var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('${TIKTOK_PIXEL_ID}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}
    </>
  );
}
