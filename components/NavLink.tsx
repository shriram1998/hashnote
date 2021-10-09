import { Box, useColorModeValue,Icon } from '@chakra-ui/react';
import Link from 'next/link';
const NavLink = ({ label,href,icon=null }) => (
  <Link href={ href}>
    <Box
      cursor="pointer"
      px={{ base: 0, md: 2 }}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
    }}>
      <Icon display={{ base: 'none', md: 'inline' }} mr="2" mb="2px" as={icon}/>
    {label}
    </Box>
  </Link>
);
export default NavLink;