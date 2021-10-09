import {
    Flex,Box,Spinner,Icon,Text,Tooltip,
    Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalBody,
    useDisclosure,useColorModeValue,

} from "@chakra-ui/react"
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

import axios from '@utils/axios';
import { CreateTextIcon, CreateCodeIcon } from "@utils/customSVG";

const createNote = async (type:string) => {
  const note = await axios.post('/api/note/create', {type});
  return note;
}

const ModalJSX = ({isLoading,isError,isSuccess,data,router,error}) => {
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
  const properties = { ...mutation, router };
  return (
    <>
      <Tooltip placement="bottom-start" fontSize="md"
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
          onClick={() => {
            onOpen();
            mutation.mutate('text');
          }
          } />
      </Tooltip>
      <Tooltip placement="bottom-start" fontSize="md"
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
            {isOpen ? <ModalJSX {...properties}/>:null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
