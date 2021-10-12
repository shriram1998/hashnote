import { signIn } from 'next-auth/react';

import {
  Flex,HStack,Stack,
  useColorModeValue, Button,Image,
  Text, SkeletonCircle, SkeletonText,
} from '@chakra-ui/react';

import { VscNote } from 'react-icons/vsc';

import { useSession } from '@utils/useSession';
import UserCard from '@components/UserCard';
import DarkModeSwitch from '@components/DarkModeSwitch';
import NavLink from '@components/NavLink';

export default function Header() {
  const [session, loading] = useSession();
  
  const UserCardX = () => {
    if (session) {
      return <UserCard {...session.user} />;
    }
    else if (loading) {
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
      as="header"
      w="100%"
      position="fixed"
      top="0"
      zIndex="999"
      backdropFilter="saturate(180%) blur(5px)"
      backgroundColor={useColorModeValue("rgba(255, 255, 255, 0.8)","rgba(0, 0, 0, 0.8)")} 
    >
      <Flex
        w="100%"
        mx="5"
        px="4"
        height="20"
        alignItems="center"
        borderBottomWidth="1px"
        justifyContent="space-between">
        <Flex>
          <Image src="assets/icons/android-chrome-192x192.png" height={30} width={30} alt="Logo"/>
          <Text fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          pl="2"
          >
          Hashnote
        </Text>
        </Flex>
        <HStack spacing={{ base: '2', md: '6' }}>
          <HStack
              as={'nav'}
              spacing={4}>
            {session ? <NavLink label="Notes" href="/note" key="Notes" icon={VscNote}/> : null}
            </HStack>
          <DarkModeSwitch />
          <UserCardX/>
        </HStack>
      </Flex>
    </Flex>
  );
};