import { Box, Container, useColorMode } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
// import Header from '@components/Header';
const Header = dynamic(() => import('@components/Header'));


export default function Layout({ children }) {
    const { pathname } = useRouter();
    const { colorMode } = useColorMode();
    if (pathname !== '/') {
            return (
            <Box
                backgroundColor={colorMode==='light'?"white": "black"}
                minH="100vh"
                overflow="hidden"
            >
                <Header />
                <Container overflow="hidden" as="main" p="1" maxW="container.xl" mt="20">
                    {children}
                </Container>
            </Box>
        );   
    }
    else {
        return (
            <Box
                backgroundColor={colorMode==='light'?"white": "black"}
                minH="100vh"
                overflow="hidden"
            >
                {children}
            </Box>
        )
    }
    
}