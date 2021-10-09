import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from "react-query";
import '@utils/main.css';
import Layout from '@components/Layout';
import theme from '@utils/theme';

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Hashnote</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" type="image/png" sizes="32x32" href="assets/icons/manifest-icon-192.maskable.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="assets/icons/favicon-16x16.png" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;

  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker.register('/service-worker.js');
  //     console.log('Service worker registered successfully');
  //   }
  // }, []);
