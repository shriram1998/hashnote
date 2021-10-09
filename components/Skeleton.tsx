import {  SkeletonText,Stack} from "@chakra-ui/react";

const SkeletonComp = (
    <Stack
            w="full"
            p="7"
        >
            <SkeletonText mt="5" noOfLines={20} spacing="6"/>
    </Stack>
);
export default SkeletonComp;