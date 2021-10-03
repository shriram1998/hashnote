import {  SkeletonText,Stack} from "@chakra-ui/react";

const SkeletonComp = (
    <Stack
            w="full"
            // px={{ sm: 10, md: 15, lg: 50, xl: 150, xl2: 250 }}
            p="7"
        >
            <SkeletonText mt="5" noOfLines={12} spacing="6"/>
    </Stack>
);
export default SkeletonComp;