import { useState,useEffect,MouseEvent } from 'react';
import {useRouter} from 'next/router';
import {
    Wrap,
    Text,Button,
    Menu,MenuButton,MenuList,
    Tag,TagLabel,
    useColorMode,
} from '@chakra-ui/react';
import {
    FiChevronDown,
} from '@react-icons/all-files/fi/FiChevronDown';

import { capitalizeFirstLetter } from '@utils/helper';

interface FilterProps{
    tags: string[];
    selected: string[];
    type: string;
}
export default function FilterTags({ tags,selected,type=''}:FilterProps) {
    const router = useRouter();
    const { colorMode } = useColorMode();
    const [selectedTags, setSelectedTags] = useState<Array<string>>(selected);
    useEffect(() => {
        if (selectedTags.length) {
            router.push(
            {
                query: { ...router.query, [type]: selectedTags.join(',') }
            },undefined,{shallow:true});
        } else {
            let clone = Object.assign({}, router.query);
            delete clone[type];
            router.push(
                {
                    query: clone,
                },undefined,{shallow:true});
        } 
    }, [selectedTags]);

    function toggleSelect(e:MouseEvent<Element>) {
        let tagName:string = e.target['innerText'].slice(2);
        if (!selectedTags.includes(tagName)) {
            switch (type) {
                case 'tags':
                    setSelectedTags([...selectedTags, tagName]);
                    break;
                case 'type':
                    setSelectedTags([tagName]);
                    break;
            }
        } else {
            setSelectedTags(selectedTags.filter(x => x !== tagName));
        }
    }

    let tagElems = tags.map((tag) => {
        if (tags.length) {
            return (
                <Tag key={tag} size="md" cursor="pointer"
                    bg={selectedTags.includes(tag) ? colorMode==='light'?'blue.200':'blue.500' :
                        colorMode==='light'?'gray.200':'gray.600'}
                    onClick={toggleSelect}
                >
                    <TagLabel
                    >
                        {`# ${tag}`}
                    </TagLabel>
                </Tag>
            );
        }
        else {
            return <Text>No tags found</Text>
        }
        }
    );
    let filterNum:string = selected.length ? `( ${selected.length} )` : '\u00A0';
    return (
        <>
          <Menu isLazy>
                <MenuButton
                mx="2"
              py={2}
                >
                    <Button size="sm" as="span" tabIndex={ 0}>
                    <Text fontSize="sm" mr="1">
                        {`${capitalizeFirstLetter(type)} ${filterNum}`}
                    </Text>
                    <FiChevronDown/>
                </Button>
            </MenuButton>
            <MenuList zIndex="11" bg={colorMode==='light'?'gray.50': 'gray.700'}>
                {tagElems.length?
                <Wrap m="2" spacing={2} maxW="16em">
                    {tagElems}
                </Wrap>:
                <Text ml="2">No {type} found</Text>}
            </MenuList>
          </Menu>
        </>
    );
}