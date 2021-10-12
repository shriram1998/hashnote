import {
  VStack,Container,Flex,Image,Text,useColorModeValue,
} from '@chakra-ui/react';
import { useRef } from 'react';

import FeatureComponent from '@components/Features';
import Hero from '@components/Hero';

import Footer from '@components/Footer';
import DarkModeSwitch from '@components/DarkModeSwitch';

export default function Home() {
  const featureRef = useRef<HTMLDivElement>(null);

  function handleFeatureClick() {
    featureRef.current.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <>
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
          <DarkModeSwitch/>
        </Flex>
      </Flex>  
      <Container overflow="hidden" as="main" p="1" maxW="container.xl" mt="20">
        <VStack>
          <Hero onGetStarted={ handleFeatureClick}/>
          <FeatureComponent ref={featureRef}/>
          <Footer/>
        </VStack>
      </Container>
    </>
  )
}
