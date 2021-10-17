import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "next-auth/client";
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
      <Provider
          session={pageProps.session}
          options={{
          keepAlive: 0, 
          clientMaxAge: 0,
        }}>
          <ChakraProvider theme={theme}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ChakraProvider>
        </Provider>
      </QueryClientProvider>
    </>
  );
}

export default App;
