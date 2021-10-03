import { signIn } from 'next-auth/client';

import {
  IconButton,CloseButton,Button,Spinner,
  Flex,HStack,FlexProps,Box,Stack,
  useColorModeValue,
  Input, InputGroup, InputLeftElement, Text,
  SkeletonCircle,SkeletonText,
} from '@chakra-ui/react';
import {
  FiMenu,
  FiBell,
  FiSearch,
} from 'react-icons/fi';

import { useSession } from '@utils/useSession';
import UserCard from '@components/UserCard';
import DarkModeSwitch from '@components/DarkModeSwitch';
import NavLink from '@components/NavLink';
export default function Header() {
  const [session,loading] = useSession();
  const UserCardX = () => {
    if (session) {
      return <UserCard {...session.user} />;
    }
    else if (typeof window !== 'undefined' && loading) {
      return (
        <Stack w="7em">
          <SkeletonCircle size="5" />
          <SkeletonText noOfLines={1} display="inline-flex"/>
        </Stack>
      )
    }
    else {
      return (
        <Button
          colorScheme="blue"
          onClick={() => { signIn() }}>
          Login/Register
        </Button>
      )
    }

  }
  return (
    <Flex
      mx="5"
      px="4"
      height="20"
      alignItems="center"
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="space-between">
      <Text
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        Hashnote
      </Text>
      {/* <InputGroup w="96" display={{ base: "none", md: "flex" }}>
          <InputLeftElement color="gray.500" children={<FiSearch />} />
          <Input placeholder="Search anything..." />
      </InputGroup> */}
      <HStack spacing={{ base: '0', md: '6' }}>
         <HStack
            as={'nav'}
            spacing={4}>
              <NavLink label="Notes" href="/note" key="Notes"/>
          </HStack>
        <DarkModeSwitch />
         {/* <IconButton
          size="md"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        /> */}
        {UserCardX()}
      </HStack>
    </Flex>
  );
};