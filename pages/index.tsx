import {
  VStack
} from '@chakra-ui/react';
import { useRef } from 'react';

import FeatureComponent from '@components/Features';
import Hero from '@components/Hero';
import Footer from '@components/Footer';

export default function Home() {
  const featureRef = useRef<HTMLDivElement>(null);

  function handleFeatureClick() {
    featureRef.current.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <VStack align="stretch">
      <Hero onGetStarted={ handleFeatureClick}/>
      <FeatureComponent ref={featureRef}/>
      <Footer/>
    </VStack>
  )
}
