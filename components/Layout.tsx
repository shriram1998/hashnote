import { Box, Container, useColorModeValue } from '@chakra-ui/react';

import Header from '@components/Header';

export default function Layout({ children }) {
    return (
        <Box
            backgroundColor={useColorModeValue("white", "black")}
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