import { Box, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
const NavLink = ({ label,href }) => (
  <Link href={ href}>
    <Box
      cursor="pointer"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
    }}>
    {label}
    </Box>
  </Link>
);
export default NavLink;