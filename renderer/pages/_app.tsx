import '../styles/global.css';
import { AppProps } from 'next/app';

import { useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { GA_TRACKING_ID, pageview } from '../lib/gtag';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Script
        strategy="beforeInteractive"
        id="webaudio-controls-config"
      >{`window.WebAudioControlsOptions = { useMidi: 1 };`}</Script>
      <Script
        strategy="beforeInteractive"
        src="https://github.com/kmturley/webaudio-controls/releases/download/v1.0.0/webaudio-controls.min.js"
      />
      <Script strategy="beforeInteractive" src="https://sfzlab.github.io/sfz-web-player/sfz.min.js" />
      <Component {...pageProps} />
    </>
  );
};

export default App;
