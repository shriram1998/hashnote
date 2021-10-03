import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from "react-query";
import '@utils/main.css';
import Layout from '@components/Layout';
import theme from '@utils/theme';
const queryClient = new QueryClient();
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
