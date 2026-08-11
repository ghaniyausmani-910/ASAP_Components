import Script from 'next/script'
import { GA_ID, CLARITY_ID } from '@/lib/analytics'

/**
 * Loads GA4 (with Consent Mode v2 defaulted to DENIED) and Microsoft Clarity.
 *
 * Nothing loads unless the corresponding env var is set, so local dev without
 * IDs is a clean no-op. Consent starts denied; CookieBanner flips it to granted
 * via updateConsent() only after the visitor accepts cookies.
 */
export function Analytics() {
  return (
    <>
      {GA_ID ? (
        <>
          <Script id="ga-consent-default" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
              });
              gtag('js', new Date());
              // In non-production builds, tag every hit with debug_mode so it
              // shows up in GA4 DebugView (and can be filtered out of reports),
              // keeping pre-launch testing out of your real numbers.
              gtag('config', '${GA_ID}'${process.env.NODE_ENV !== 'production' ? ", { debug_mode: true }" : ''});
            `}
          </Script>
          <Script
            id="ga-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
        </>
      ) : null}

      {CLARITY_ID ? (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}
        </Script>
      ) : null}
    </>
  )
}
