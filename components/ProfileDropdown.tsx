import {
    useColorModeValue,
    MenuDivider,
    MenuItem,
    MenuList,
} from '@chakra-ui/react';
import { signOut } from 'next-auth/react';

export default function ProfileDropdown() {
    return (
        <MenuList
            bg={useColorModeValue('white', 'black')}
            borderColor={useColorModeValue('gray.200', 'gray.700')}>
            <MenuItem onClick={() => { signOut()} }>Sign out</MenuItem>
        </MenuList>
    )
}