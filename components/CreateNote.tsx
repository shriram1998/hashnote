import {
    Button,Flex,Spinner,Text,Box,BoxProps,
    Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalFooter, ModalBody, ModalCloseButton,Image,Icon,IconButton,
  useDisclosure,useColorModeValue,Tooltip,

} from "@chakra-ui/react"
import axios from '@utils/axios';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { CreateTextIcon, CreateCodeIcon } from "@utils/customIcons";
const createNote = async (type:string) => {
  const note = await axios.post('/api/note/create', {type});
  return note;
}

const ModalStuff = ({isLoading,isError,isSuccess,data,router,error}) => {
  if (isLoading) {
      return (
          <Flex align="center" justify="center" m="4">
            <Text fontSize="22">Please wait. Creating your note</Text>
            <Spinner
              ml="2"
              size="md"
              thickness="3px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
            />
        </Flex>
      );
    }
    if (isError) {
      return (
        <Flex
          // h="100vh"
          justify="center"
          fontSize="24"
        >
          <Box>
            <Text>
              Please contact the team to get the following issue resolved
            </Text>
            <br />
            <Text as="i">Error: {error.message}</Text>
          </Box>
        </Flex>
      );
      }
      if (isSuccess) {
        router.push(`/note/${data.data.insertedId}`);
      }
      return null;
}
export default function CreateNoteModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mutation = useMutation("create", createNote);
  const router = useRouter();
  return (
    <>
      <Tooltip hasArrow placement="bottom-start" fontSize="md"
         label="Create Note" openDelay={150} closeDelay={100} shouldWrapChildren>
        <Icon
          color={useColorModeValue("gray-200","white-alpha-300")}
          cursor="pointer"
          aria-label="create-text"
          as={CreateTextIcon}
          h="45px"
          w="45px"
          m="2"
          p="2px"
          // _hover={
          //   {
          //     bg: useColorModeValue("gray.100","gray.700"),
          //     borderRadius: "10%"
          //   }
          // }
          onClick={() => {
            onOpen();
            mutation.mutate('text');
          }
          } />
      </Tooltip>
      <Tooltip hasArrow placement="bottom-start" fontSize="md"
         label="Create Code" openDelay={150} closeDelay={100} shouldWrapChildren>
        <Icon
          color={useColorModeValue("gray-100","white-alpha-300")}
          cursor="pointer"
          aria-label="create-code"
          as={CreateCodeIcon}
          h="45px"
          w="45px"
          m="2"
          p="2px"
          pr="5px"
          // _hover={
          //   {
          //     bg: useColorModeValue("gray.200","gray.700"),
          //     borderRadius: "10%"
          //   }
          // }
          onClick={() => {
            onOpen();
            mutation.mutate('code');
          }
          } />
      </Tooltip>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent opacity="0.8" bg={useColorModeValue('gray.200', 'gray.800')}>
          <ModalHeader>Creating your note...</ModalHeader>
          <ModalBody>
            { isOpen?ModalStuff({ ...mutation, router }):null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
