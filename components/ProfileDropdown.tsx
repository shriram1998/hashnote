import {
    useColorModeValue,
    MenuItem,
    MenuList,
} from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import {useRouter} from 'next/router';

export default function ProfileDropdown() {
    const router = useRouter();
    return (
        <MenuList
            bg={useColorModeValue('white', 'black')}
            borderColor={useColorModeValue('gray.200', 'gray.700')}>
            <MenuItem onClick={() => { router.push('/') }}>Home</MenuItem>
            <MenuItem onClick={() => { signOut()} }>Sign out</MenuItem>
        </MenuList>
    )
}