import { ReactElement } from "react";
import Link from "next/link";
import {
    Flex, Box, Heading, Text,IconButton,
    useColorModeValue, useColorMode,
} from '@chakra-ui/react';

import { BsCodeSlash } from "@react-icons/all-files/bs/BsCodeSlash";
import { CgList } from "@react-icons/all-files/cg/CgList";
import { MONTHS } from "@utils/constants";

export default function SlateThumbnail({ data }) {
    const { colorMode } = useColorMode();
    
    let plainText = data.thumbnailText;
    let icon: ReactElement=data.type==='code'?<BsCodeSlash/>:<CgList/>;

    let ThumbnailText = () => {
        switch (data.type) {
            case 'text':    
                return (
                    <p>
                        {plainText}
                    </p>
                );
            case 'code':
                return plainText?plainText.map((val,ix) => {
                    return (
                        <pre key={ix} className="truncate">
                            {val}
                        </pre>
                    );
                }):<></>;
        }
    }
    let date = new Date(data.lastModified);
    let readableDate = MONTHS[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear().toString().slice(2, 4);
    
    return (
        <Link href={`/note/${data._id}`}>
            <Box
                position="relative"
                cursor="pointer"
                border="1px"
                borderColor={useColorModeValue("gray.50", "gray.800")}
                _hover={{
                    borderColor: "var(--chakra-colors-facebook-500)",
                    backgroundColor: colorMode === "light" ? "var(--chakra-colors-facebook-50)" : "var(--chakra-colors-facebook-700)"
                }}
                w="13em"
                h="20em"
                py={4}
                px={5}
                m="35px"
                bg={useColorModeValue("gray.50", "gray.800")}
                shadow="lg"
                rounded="lg"

            >
                <Flex justifyContent={{ base: "center", md: "end" }} mt={-10}>
                    <IconButton
                        zIndex="10"
                        cursor="default"
                        w={10}
                        h={10}
                        fit="cover"
                        rounded="full"
                        borderStyle="solid"
                        borderWidth={2}
                        borderColor={useColorModeValue("brand.500", "brand.400")}
                        aria-label="Note type"
                        icon={icon}
                    />
                </Flex>
                <Box
                    overflow="wrap"
                    wordBreak="break-word"
                    transform="scale(0.6,0.6)"
                    transformOrigin="top left"
                    w="15em"
                    h="100%"
                >
                    <Heading
                        isTruncated
                        fontSize={{ base: "xl", md: "2xl" }}
                        my="2"
                        fontWeight="bold"
                        >
                        {data.title?data.title:""}
                    </Heading>
                    <ThumbnailText/>
                </Box>
                <Box position="absolute" bottom="0" mb="4px">
                    <Text size="sm" color="gray.400">{ readableDate}</Text>
                </Box>
            </Box>
        </Link>
    );
};