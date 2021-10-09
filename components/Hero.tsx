import {
    Box, Stack,
    Text, Heading,
    useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';

export default function Heros({ onGetStarted}) {
  return (
      <Box maxW="7xl" bg={useColorModeValue("gray.50", "gray.800")}>
        <Box
          pos="relative"
          pb={{ base: 8, sm: 16, md: 20, lg: 28, xl: 32 }}
          w="full"
          border="solid 1px transparent"
        >
          <Box
            mx="auto"
            px={{ base: 4, sm: 6, lg: 8 }}
            mt={{ base: 8, md: 12, lg: 16, xl: 24 }}
          >
            <Box
              textAlign="center"
              w={{ base: "full", md: 11 / 12, xl: 8 / 12 }}
              mx="auto"
            >
              <Heading
                fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}
                lineHeight="short"
                fontWeight="extrabold"
                mb="2"
              >
                    <Text as="span"
                        display={{ base: "block", xl: "inline" }}
                        bgClip="text"
                        bgGradient="linear(to-r, facebook.500,green.400)"
                    >
                        Hashnote       
                    </Text>
              </Heading>
              <Heading
                fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
                letterSpacing="tight"
                lineHeight="short"
                fontWeight="bold"
                color={useColorModeValue("gray.900", "white")}>
                A Minimal & Unopinionated Notes App! {" "}
              </Heading>
              <Text as="p"
                mt={{ base: 3, sm: 5, md: 5 }}
                mx={{ sm: "auto", lg: 0 }}
                mb={6}
                fontSize={{ base: "lg", md: "xl" }}
                // color="gray.500"
                lineHeight="base"
              >
                Elevate your note-taking to the next level with 
                a fast, light-weight notes application that is truly community-driven. 
                Seamlessly group your notes on the go using tags
              </Text>
              <Stack
                direction={{ base: "column", sm: "column", md: "row" }}
                mb={{ base: 4, md: 8 }}
                spacing={{ base: 4, md: 2 }}
                justifyContent="center"
              >
                <Box rounded="full" shadow="md">
                    <Link href="/note">
                        <Text
                            as="span"
                            w="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            border="solid 1px transparent"
                            fontSize={{ base: "md", md: "lg" }}
                            rounded="md"
                            color="white"
                            bg="facebook.600"
                            _hover={{ bg: "facebook.900" }}
                            px={{ base: 8, md: 10 }}
                            py={{ base: 3, md: 4 }}
                            cursor="pointer"
                        >
                            Get started
                        </Text>
                    </Link>
                </Box>
                <Box mt={[3, 0]} ml={[null, 3]}>
                    <Box
                      w="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      px={{ base: 8, md: 10 }}
                      py={{ base: 3, md: 4 }}
                      border="solid 1px transparent"
                      fontSize={{ base: "md", md: "lg" }}
                      rounded="md"
                      color="facebook.700"
                      bg="facebook.100"
                      _hover={{ bg: "facebook.200" }}
                      cursor="pointer"
                      onClick={onGetStarted}
                    >
                      Learn more
                    </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
  );
};