import { Box, Flex,Container,useColorModeValue } from '@chakra-ui/react'
import Header from '@components/Header';
import { useState, useEffect } from 'react';
export default function Layout({ children }) {
    const [scrolled, setScrolled] = useState(false);

    const handleScroll = () => {
        const offset = window.scrollY;

        if (offset > 200) {
            setScrolled(true);
        }
        else {
            setScrolled(false);
        }
    }
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <Box
            as="main"
            bg={useColorModeValue("white", "black")}
            minH="100vh"
        >
            <Header />
            <Container p="1" maxW="container.xl">
                {children}
            </Container>
        </Box>
    );
}