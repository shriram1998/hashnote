import { KeyboardEvent } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { useState, useEffect,useRef } from 'react';
import { BiShow,BiHide } from 'react-icons/bi';
import { BsTrash } from 'react-icons/bs';
import { AiFillStar,AiOutlineStar } from 'react-icons/ai';

import {
    Flex,Box,
    Icon, Text, Tooltip,
    Button,
    useToast,useColorMode,
} from '@chakra-ui/react';

import SaveButton from '@components/SaveButton';
import Popover from '@components/Popover';
import EditorSwitch from '@components/EditorSwitch';
import TagMenu from '@components/Menu';
import TitleInput from '@components/TitleInput';
import SelectComponent from '@components/SelectComponent';
import { putNote,patchTag,deleteNote} from '@components/NoteMutation';

import { serialize } from "@utils/helper";
import { PRISM_EXTENSIONS } from '@utils/constants';

const seed = {
    type: 'paragraph',
    children: [
        { text: '' },
    ]
};
export default function SlateEditor({ data }) {
    const [value, setValue] = useState<object>(data.value?JSON.parse(data.value):seed);
    const [tags, setTags] = useState<Array<string>>(data.tags);
    const [fav, setFav] = useState<boolean>(data.favourite);
    const [showTitle, setShowTitle] = useState<boolean>(data.title ? true : false);
    let [isChanged, _setIsChanged] = useState<boolean>(false);
    const [language, setLanguage] = useState<string>(data.language);
    const [save, setSave] = useState<string>("Saved");

    const isChangedRef = useRef(isChanged);

    const router = useRouter();
    const queryClient = useQueryClient();
    const toast = useToast();
    const { colorMode } = useColorMode();

    const setIsChanged = data => {
        isChangedRef.current = data;
        _setIsChanged(data);
    }
    let initialValue:string = serialize(value); //used for comparison on input change
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
        onSuccess: newNote => {
            console.log(newNote);
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
        let muTextArr:Array<string> = mutations.map(mutation => mutation.isLoading ? ("Saving") :
            mutation.isError ? "Error" : ""
        );
        let loadText:string = muTextArr.filter(x => x !== null)[0];
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
    const handleInputChange = (val:object,isChanged:boolean) => {
        setValue(val);
        setIsChanged(isChanged);
        let worker = new window.Worker("/LCS-worker.js");
        let newValue:string = serialize(val);
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
    const handleFav=()=> {
        setFav(!fav);
        putNoteMutation.mutate({ favourite: !data.favourite, postid });
    }
    const handleTitle=(title:string)=> {
        putNoteMutation.mutate({ title, postid });
    }
    const handleEnterTag = (e:KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (!tags.includes(e.target['value']) && e.target['value']!="") {
               setTags([...tags,e.target['value']]);
                patchTagMutation.mutate({ newTag: e.target['value'], postid }); 
            }
            e.target['value'] = "";
        }
    }
    const handleCloseTag = (value: string) => {
        let newTags:Array<string> = tags.filter(item => item !== value);
        setTags(newTags);
        putNoteMutation.mutate({ tags:newTags,postid});
    }
    const handleDelete=() => {
        delteNoteMutation.mutate({ postid });
        router.push('/note');
    }
    const handleSave = () => {
        putNoteMutation.mutate({ value: JSON.stringify(value), postid });
        setIsChanged(false);
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
                <Flex flexWrap="wrap" justifyContent="center" w="100%"
                    mx={{ base: "3", sm: "4", lg: "5" }}
                    p={{  base: "3", sm: "4", lg: "5"  }}
                >
                    {data.type === "code" ?
                        <SelectComponent value={language} onChange={setLanguage} options={PRISM_EXTENSIONS}/>
                            : null}
                    <Button my="2px" mr="4" px="5" size="sm"
                        onClick={() => setShowTitle(!showTitle)}>
                        <Icon aria-label="Show/Hide title"
                            as={showTitle ? BiHide : BiShow}
                        />
                        <Text mx="0.5em">Title</Text>
                    </Button>
                    <TagMenu elems={tags} handleEnter={handleEnterTag} handleClose={ handleCloseTag}/>
                    <Tooltip bg="yellow.500" placement="bottom-end" fontSize="md"
                            label="Toggle favourite" openDelay={200} closeDelay={200} shouldWrapChildren>
                        <Icon mr="4" my="2px" mt="7px" boxSize="6"
                            cursor="pointer" onClick={handleFav}
                            aria-label="Toggle favourite for the note"
                            as={fav ? AiFillStar : AiOutlineStar}
                            color={fav ? "yellow.400" :colorMode==='light'?'gray.700':'gray.50'}         
                        />
                    </Tooltip>
                    <Popover
                        message={`This action is irreversible. Are you sure
                        you want to delete this ${data.type}?`}
                        actionTitle="Delete" action={handleDelete}
                        colorScheme="red">
                        <Text as="span" tabIndex={ 0}>
                            <Tooltip placement="top-start" fontSize="md"
                                bg="red.400" label="Delete Note" openDelay={200} closeDelay={200}>
                                <Text mr="4"mt="10px" cursor="pointer"
                                    color='red.400' fontSize="18"
                                    >
                                    <BsTrash />
                                </Text>
                            </Tooltip>
                        </Text>
                    </Popover>
                    <Tooltip placement="bottom-end" fontSize="md"
                        label={ save} openDelay={200} closeDelay={200} shouldWrapChildren>
                        <SaveButton m="2px" p="0" state={save} onSave={handleSave} />
                    </Tooltip>
                </Flex>
            </Flex>
            <Box
                mx={{ base: "2", sm: "3", md: "4", lg: "5" }}
                p={{ base: "2", sm: "3", md: "4", lg: "5" }}
                borderWidth="1px" borderRadius="md" boxShadow="sm">
                {<EditorSwitch type={data.type} value={value}
                    handleInputChange={handleInputChange} language={language} />}
            </Box>
        </>
    );
}