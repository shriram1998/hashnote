import dynamic from 'next/dynamic'
import {
    Avatar,
    Box,
    Flex,
    HStack,
    VStack,
    Text,
    Menu,
    MenuButton,
} from '@chakra-ui/react';
import {
  FiChevronDown,
} from '@react-icons/all-files/fi/FiChevronDown';

const ProfileDropdown = dynamic(() => import('./ProfileDropdown'));
export default function UserCard({ name, image }: {name:string,image:string}) {
    return (
        <Flex alignItems={'center'}>
          <Menu isLazy>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  name={name}
                  src={image}
                  width="7"
                  height="7"
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                <Text fontSize="sm">{name}</Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <ProfileDropdown/>
          </Menu>
        </Flex>
    );
}