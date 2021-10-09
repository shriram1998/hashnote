import {
    Menu, MenuButton, MenuList,
    Input, Button, Wrap, Text, Icon,
    useColorMode
} from '@chakra-ui/react';
import { KeyboardEvent } from 'react';

import { FiChevronDown, FiTag } from 'react-icons/fi';

import TagItem from '@components/TagItem';

interface ArrayMenuProps{
    elems: Array<string>;
    handleEnter: (e: KeyboardEvent<HTMLInputElement>) => void;
    handleClose: (value: string) => void;
}

export default function ArrayMenu({ elems, handleEnter,handleClose }:ArrayMenuProps){
    const { colorMode } = useColorMode();

    const elemsJSX = elems.map((tag) => {
        return (
            <TagItem key={tag} tagLabel={tag} onCloseClick={handleClose} color="blue" />
        );
    });

    return (
        <Menu isLazy>
            <MenuButton
                tabIndex={0}
                mr="4"
                my="2px"
                _focus={{ boxShadow: 'var(--chakra-shadows-outline)',borderRadius:"10%" }}

            >
                <Button size="sm" as="span">
                    <Icon mt={1} aria-label="Modify tags" as={FiTag}/>
                    <Text mx="0.5em">Tags</Text>
                    <FiChevronDown/>
                </Button>
            </MenuButton>
            <MenuList zIndex="11">
                <Input
                    variant="filled"
                    backgroundColor={colorMode==='light'?"white":"gray.700"}
                    placeholder="Add tags here"
                    onKeyDown={handleEnter}
                    autoFocus
                />
                {elemsJSX.length ?
                <Wrap m="3" spacing={2} maxW="16em">
                    {elemsJSX}
                </Wrap>:
                <Text m="3">No tags found</Text>}
            </MenuList>
        </Menu>
    )
}