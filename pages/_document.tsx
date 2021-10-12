import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { ColorModeScript } from '@chakra-ui/react';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head >
          <meta name='application-name' content='Hashnote' />
          <meta name='description' content='Minimal and Unopinionated Open Source Notes Application' />
          <meta name='format-detection' content='telephone=no' />
          <meta name='mobile-web-app-capable' content='yes' />
          <link rel="manifest" href="/manifest.json" />
          <meta name='theme-color' content='#000000' />
          
          <meta name='msapplication-TileColor' content='#2B5797' />
          <meta name='msapplication-tap-highlight' content='no' />
          <link rel="mask-icon" href="assets/icons/safari-pinned-tab.svg" color="#5bbad5" />
          
          <meta name='apple-mobile-web-app-status-bar-style' content='default' />
          <meta name='apple-mobile-web-app-title' content='Hashnote' />
          <link rel="apple-touch-icon" href="assets/icons/apple-icon-180.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          <meta name='twitter:card' content='summary' />
          <meta name='twitter:title' content='Hashnote' />
          <meta name='twitter:description' content='Minimal and Unopinionated Open Source Notes Application' />
          <meta property='og:type' content='website' />
          <meta property='og:title' content='Hashnote' />
          <meta property='og:description' content='Minimal and Unopinionated Open Source Notes Application' />
          <meta property='og:site_name' content='Hashnote' />
        </Head>
        <body>
          {/* Make Color mode to persists when you refresh the page. */}
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
