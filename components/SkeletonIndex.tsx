import { SkeletonText, Box,Flex, useColorMode } from "@chakra-ui/react";

import useIsSsr from "@utils/useIsSSR";

export default function SkeletonIndex() {
    const isSSR = useIsSsr();
    const { colorMode } = useColorMode();

    if (isSSR) {
        return null;
    }

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const row = Math.floor(screenHeight / 500);
    const col = Math.floor(screenWidth / 300);
    const total = row * col >= 8 ? 8 : row * col;

    let skeletonJSX = (
        <>
            {
                [...Array(total)].map((e, i) => {
                    return (
                        <Box
                            key={i}
                            position="relative"
                            border="1px"
                            borderColor={colorMode === 'light' ? "gray.50" : "gray.800"}
                            w="208px"
                            h="320px"
                            py="4"
                            px="5"
                            m="25px"
                            bg={colorMode === 'light' ? "gray.50" : "gray.900"}
                            shadow="lg"
                            rounded="lg"

                        >
                            <SkeletonText noOfLines={15} spacing="2" />
                        </Box>
                    );
                })
            }
        </>);
    return (
        <Flex >
            <Flex flexWrap="wrap" justifyContent="center" w="100%" mt="20"
                mx={{ base: "3", sm: "4", lg: "5" }}
                p={{  base: "3", sm: "4", lg: "5"  }}
            >
                {skeletonJSX}
            </Flex>
        </Flex>
    );
}
