import { useState,useEffect } from 'react';
import {useRouter} from 'next/router';
import {
    HStack,Box,Flex,Wrap,
    Text,Button,Icon,
    Menu,MenuButton,MenuList,MenuItem,
    Tag,TagLabel,
    useColorModeValue,
} from '@chakra-ui/react';
import {
    FiChevronDown,
} from 'react-icons/fi';
import { isSubset,capitalizeFirstLetter } from '@utils/helper';

export default function SearchTags({ tags,selected,type=''}) {
    const router = useRouter();
    const [selectedTags, setSelectedTags] = useState(selected);

    useEffect( () => {
        if (selectedTags.length) {
             router.push(
                {
                    query: { ...router.query, [type]: selectedTags.join(',') }
                });
        } else {
            let clone = Object.assign({}, router.query);
            delete clone[type];
             router.push(
                {
                    query: clone,
                });
        }
    }, [selectedTags]);

    function toggleSelect(e) {
        let tagName = e.target.innerText;
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
                    bg={selectedTags.includes(tag) ? useColorModeValue('blue.200', 'blue.500') :
                        useColorModeValue('gray.200', 'gray.500')}
                    onClick={toggleSelect}
                >
                    <TagLabel
                    >
                        {tag}
                    </TagLabel>
                </Tag>
            );
        }
        else {
            return <Text>No tags found</Text>
        }
        }
    );
    let filterNum = selectedTags.length ? `( ${selectedTags.length} )` : '\u00A0';
    return (
        <>
          <Menu isLazy>
                <MenuButton
                mx="2"
              py={2}
              _focus={{ boxShadow: 'none' }}
                >
                <Button size="sm">
                    <Text fontSize="sm" mr="1">
                        {`${capitalizeFirstLetter(type)} ${filterNum}`}
                    </Text>
                    <FiChevronDown/>
                </Button>
            </MenuButton>
            <MenuList zIndex="11" bg={useColorModeValue('gray.50', 'gray.700')}>
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