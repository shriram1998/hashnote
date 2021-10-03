import {
    Descendant,
    Node
} from 'slate';
import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { useState, useEffect,useRef } from 'react';
import { FiTag, FiExternalLink, FiChevronDown } from 'react-icons/fi';
import { BiShow,BiHide } from 'react-icons/bi';
import { BsTrash } from 'react-icons/bs';
import { AiFillStar,AiOutlineStar } from 'react-icons/ai';

import {
    Wrap,Flex,VStack,Box,HStack,
    Input,InputGroup,InputLeftAddon,Textarea,Select,
    Icon, Text, IconButton, Tooltip,
    Menu,MenuButton,MenuList,Button,
    useColorModeValue,useToast,
} from '@chakra-ui/react';

import axios from '@utils/axios';

import TagItem from '@components/TagItem';
import SaveButton from '@components/SaveButton';
import Popover from '@components/Popover';
import SlateText from '@components/SlateText';
import SlateCode from '@components/SlateCode';
import TitleInput from '@components/TitleInput';

import { serialize } from "@utils/helper";
import { PRISM_EXTENSIONS } from '@utils/constants';

interface NoteProps {
    postid: string,
    tags?: Array<string>,
    value?: string,
    favourite?: boolean,
    title?:string,
    language?:string,
}
interface AddTagProps {
    newTag: string,
    postid:string
}

async function patchTag({ newTag, postid }: AddTagProps) {
    const response = await axios.patch(`/api/note/${postid}`, { tags: newTag });
    return response;
}

async function deleteNote({ postid }: {postid:string}) {
    const response = await axios.delete(`/api/note/${postid}`);
    return response;
}

async function putNote({ postid,...rest}:NoteProps) {
    const response = await axios.put(`/api/note/${postid}`, rest);
    return response;
}
const seed = {
    type: 'paragraph',
    children: [
        { text: '' },
    ]
};
export default function SlateEditor({ data }) {
    const [value, setValue] = useState(data.value?JSON.parse(data.value):seed);
    const [tags, setTags] = useState(data.tags);
    const [showTitle, setShowTitle] = useState(data.title ? true : false);
    let [isChanged, _setIsChanged] = useState(false);
    const isChangedRef = useRef(isChanged);
    const [language, setLanguage] = useState(data.language);
    const [save, setSave] = useState("Saved");
    const router = useRouter();
    const queryClient = useQueryClient();
    const toast = useToast();
    
    const setIsChanged = data => {
        isChangedRef.current = data;
        _setIsChanged(data);
    }
    let initialValue = serialize(value); //used for comparison on input change
    let postid: string = data._id;
    const patchTagMutation = useMutation(patchTag, {
        onSuccess: () => {
            queryClient.invalidateQueries('note');
        },
    });
    const putNoteMutation = useMutation(putNote, {
        onSuccess: () => {
            queryClient.invalidateQueries('note');
        },
    });
    const delteNoteMutation = useMutation(deleteNote, {
        onSuccess: () => {
            queryClient.invalidateQueries('note');
            toast({
                title: "Item deleted successfully",
                status: "error",
                isClosable: true,
            })
        },
    });
    const mutations = [patchTagMutation, putNoteMutation];
    useEffect(() => {
        let muTextArr = mutations.map(mutation => mutation.isLoading ? ("Saving") :
            mutation.isError ? "Error" : null
        );
        let loadText = muTextArr.filter(x => x !== null)[0];
        if (loadText) {
            setSave(loadText);
        } else if (isChanged) {
            setSave('Save');
        }
        else {
            setSave("Saved");
        }
    }, [mutations]);
    
    useEffect(() => {
        if(data.language !== language){
            putNoteMutation.mutate({language, postid })
        }
    }, [language]);
    useEffect(() => {
        window.addEventListener('beforeunload', beforeUnloadListener);
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadListener);
        }
    }, [])
    let handleInputChange = (val,isChanged) => {
        setValue(val);
        setIsChanged(isChanged);
        let worker = new window.Worker("/LCS-worker.js");
        let newValue = serialize(val);
        worker.postMessage({ oldStr:initialValue, newStr:newValue });
        worker.onerror = (err) => console.log(err);
        worker.onmessage = (e) => {
            let { changes } = e.data;
            if (changes >= 15) {
                putNoteMutation.mutate({ value: JSON.stringify(val), postid });
                initialValue = newValue;
                setIsChanged(false);
            }
            worker.terminate();
        }
    }
    function handleFav() {
        putNoteMutation.mutate({ favourite: !data.favourite, postid });
    }
    function handleTitle(title) {
        putNoteMutation.mutate({ title, postid });
    }
    const onEnterPressTag = (e) => {
        if (e.keyCode === 13) {
            if (!tags.includes(e.target.value)) {
               setTags([...tags,e.target.value]);
                patchTagMutation.mutate({ newTag: e.target.value, postid }); 
            }
            e.target.value = "";
        }
    }
    let onCloseClick = (value: string) => {
        let newTags = tags.filter(item => item !== value);
        setTags(newTags);
        putNoteMutation.mutate({ tags:newTags,postid});
    }
    let tagElems = tags.map((tag) => {
        return (
            <TagItem key={tag} tagLabel={tag} onCloseClick={onCloseClick} color="blue" />
        );
    });
    let options =()=> Object.entries(PRISM_EXTENSIONS).map(item => <option value={item[0]}>{ item[1]}</option>);
    let onSave = () => {
        putNoteMutation.mutate({ value: JSON.stringify(value), postid });
        setIsChanged(false);
    }
    let EditorSwitch = () => {
        switch (data.type) {
            case 'text':
                return (
                    <SlateText
                        value={value}
                        onValueChange={handleInputChange}/>
                );
            case 'code':
                return (
                    <Flex
                        fontSize="lg"
                        p={{base:"1px",sm:"1.5px",md:"2px",lg:"3px",xl:"4px"}}
                        bg={useColorModeValue('white', 'gray.900')}
                        overflow="hidden"
                        wordBreak="break-word"
                    >
                        <SlateCode
                            value={value}
                            onValueChange={handleInputChange}
                            language={language}
                        />
                    </Flex>
                );
            default:
                return null
        }
    }
    const beforeUnloadListener = (event) => {
        if (isChangedRef.current) {
            event.preventDefault();
            return event.returnValue = "Changes you made are not saved. Are you sure, you want to exit?";
        }
    };
    return (
        <>
            {showTitle ? <TitleInput val={data.title} onSubmit={handleTitle} mb="2px"/> : null}
            <Flex >
                <Flex
                    flexWrap="wrap" justifyContent="center" w="100%"
                    m="2" py="2" px="4"
                    // borderWidth="1px" borderRadius="md" boxShadow="sm"
                >
                    {data.type === "code" ? <Select
                        mr="4"
                        maxW="10em"
                        size="sm"
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        cursor="pointer"
                        >
                        {options()}
                    </Select> : null}
                    <Button my="2px" mr="4" px="5" size="sm" onClick={() => setShowTitle(!showTitle)}>
                        <Icon aria-label="Show/Hide title"
                            as={showTitle ? BiHide : BiShow}
                        />
                        <Text mx="0.5em">Title</Text>
                    </Button>
                    <Menu isLazy>
                        <MenuButton
                            mr="4"
                            my="2px"
                        _focus={{ boxShadow: 'none' }}
                        >
                            <Button size="sm" >
                                <Icon mt={1} aria-label="Modify tags" as={FiTag}/>
                                <Text mx="0.5em">Tags</Text>
                                <FiChevronDown/>
                            </Button>
                        </MenuButton>
                        <MenuList zIndex="11" bg={useColorModeValue('gray.50', 'gray.700')}>
                            <Input
                                bg={useColorModeValue('gray.50', 'gray.700')}
                                variant="filled"
                                placeholder="Add tags here"
                                onKeyDown={onEnterPressTag}
                            />
                            {tagElems.length ?
                            <Wrap m="3" spacing={2} maxW="16em">
                                {tagElems}
                            </Wrap>:
                            <Text m="3">No tags found</Text>}
                        </MenuList>
                    </Menu>
                    <Tooltip bg="yellow.500" hasArrow placement="bottom-end" fontSize="md"
                            label="Toggle favourite" openDelay={200} closeDelay={200} shouldWrapChildren>
                        <Icon
                            mr="4"
                            my="2px"
                            mt="7px"
                            cursor="pointer"
                            boxSize="6"
                            aria-label="Toggle favourite for the note"
                            as={data.favourite ? AiFillStar : AiOutlineStar}
                            color={data.favourite ? "yellow.400" :useColorModeValue('gray.800','gray.50')}
                            onClick={handleFav }
                        />
                    </Tooltip>
                    <Popover
                        message={`This action is irreversible. Are you sure
                        you want to delete this ${data.type}?`}
                        actionTitle="Delete"
                        action={() => {
                            delteNoteMutation.mutate({ postid });
                            router.push('/note');
                            }
                        }
                        colorScheme="red">
                        <Text
                            cursor="pointer"
                            color='red.400'
                            fontSize="18"
                        m="2">
                            <Tooltip hasArrow placement="top-start" fontSize="md"
                                bg="red.400" label="Delete Note" openDelay={200} closeDelay={200}>
                                <Text mr="4" my="2px">
                                    <BsTrash />
                                </Text>
                            </Tooltip>
                        </Text>
                    </Popover>
                    <SaveButton my="2px" state={save} onSave={onSave} />
                </Flex>
            </Flex>
            <Box
                mx={{ base: "2", sm: "3", md: "4", lg: "5" }}
                p={{ base: "2", sm: "3", md: "4", lg: "5" }}
                borderWidth="1px" borderRadius="md" boxShadow="sm">
                {EditorSwitch()}
            </Box>
        </>
    );
}
