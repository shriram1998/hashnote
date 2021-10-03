import {
    useColorModeValue,
    MenuDivider,
    MenuItem,
    MenuList,
} from '@chakra-ui/react';
import { signOut } from 'next-auth/client';

export default function ProfileDropdown() {
    return (
        <MenuList
            bg={useColorModeValue('white', 'gray.900')}
            borderColor={useColorModeValue('gray.200', 'gray.700')}>
            {/* <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Billing</MenuItem>
            <MenuDivider /> */}
            <MenuItem onClick={() => { signOut()} }>Sign out</MenuItem>
        </MenuList>
    )
}