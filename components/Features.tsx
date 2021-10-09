import {
    chakra, Flex, Box, SimpleGrid,
    useColorModeValue, Icon,
} from '@chakra-ui/react';
import { forwardRef, ReactElement, ReactNode } from 'react';

import { MdDevices } from 'react-icons/md';
import { BsCodeSlash } from 'react-icons/bs';
import { FiFilter } from 'react-icons/fi';
import { GrDocumentTest } from 'react-icons/gr';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { GiSpeedometer } from 'react-icons/gi';

interface FeatureProps{
  title: string;
  icon: ReactElement;
  color: string;
  children: ReactNode;
}
const FeatureComponent = (( props,ref) => {
  const Feature = (props:FeatureProps) => {
    return (
      <Box shadow="xl" p="5"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          w={10}
          h={10}
          mb={4}
          rounded="full"
          color={useColorModeValue(`${props.color}.600`, `${props.color}.100`)}
          bg={useColorModeValue(`${props.color}.100`, `${props.color}.600`)}
        >
          <Icon
            pt="1"
            pl="1"
            boxSize="9"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            {props.icon}
          </Icon>
        </Flex>
        <chakra.h3
          fontSize="xl"
          mb={2}
          fontWeight="semibold"
          lineHeight="shorter"
          color={useColorModeValue("gray.900", "gray.50")}
        >
          {props.title}
        </chakra.h3>
        <chakra.p
          fontSize={{ base: "md", md: "lg" }}
          color={useColorModeValue("gray.500", "gray.400")}
        >
          {props.children}
        </chakra.p>
      </Box>
    );
  };
  return (
    <Flex
      ref={ref}
      w="auto"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        px={8}
        py={20}
        mx="auto"
      >
        <Box textAlign={{ lg: "center" }} mb="10">
          <chakra.p
            mt={2}
            fontSize={{ base: "3xl", sm: "4xl" }}
            lineHeight="8"
            fontWeight="extrabold"
            letterSpacing="tight"
          >
            Features
          </chakra.p>
          <chakra.p
            mt={4}
            maxW="2xl"
            fontSize="xl"
            mx={{ lg: "auto" }}
            color={useColorModeValue("gray.500", "gray.400")}
          >
            Reasons why Hashnote could be the perfect notes app for you
          </chakra.p>
        </Box>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3 }}
          spacingX={{ base: 16, lg: 24 }}
          spacingY={20}
        >
          <Feature title="Fast and minimal"
            icon={<GiSpeedometer />}
            color="gray"
          >
            Since the app is built with features that are just the essentials,
            you are always ensured to have a fast and fluid experience.{" "}
          </Feature>
          <Feature title="Community driven"
            icon={<HiOutlineUserGroup />}
            color="teal"
          >
            Complete focus on the needs of the user community without any
            personal opinion or agenda
          </Feature>
          <Feature title="All-in-one"
            icon={<GrDocumentTest />}
            color="pink"
          >
            Never find yourself switching between applications for noting down in different
            formats. Hashnote already supports rich text and code formats with canvas, todos and
            audio/visual embeds just around the corner.
          </Feature>
          <Feature title="Intuitive filter and search"
            color="green"
            icon={<FiFilter />}
          >
            Hashnote uses tag-first approach for quickly searching your notes.
            Go beyond tag search by using the type of the note and favourites to narrow down
            your search.
          </Feature>
          <Feature title="Code editing" color="blue"
            icon={<BsCodeSlash />}
          >
            The code editor supports major programming languages, with in-house code formatting
            and code numbering capabilities to enhance the experience for developers.
          </Feature>
          <Feature title="Progressive Web App (PWA)"
            icon={<MdDevices />}
            color="purple">
            Use the application offline in tablets and mobile devices by installing Hashnote
            just like any native app and access your notes seamlessly across multiple devices.{" "}
          </Feature>
        </SimpleGrid>
      </Box>
    </Flex>
  );
});
const Features = forwardRef<HTMLDivElement>(FeatureComponent);
export default Features;