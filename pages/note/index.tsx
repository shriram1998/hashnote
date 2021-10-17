import { useEffect,useState,useRef,ReactElement } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import {
  Flex, Spacer, VStack,Box,
  Text,Icon,useColorMode,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useSession } from 'next-auth/client'

import {
    FiFilter,
} from '@react-icons/all-files/fi/FiFilter';
import { AiFillStar } from '@react-icons/all-files/ai/AiFillStar';
import { AiOutlineStar } from '@react-icons/all-files/ai/AiOutlineStar';


import axios from '@utils/axios';
import { isSubset, objectCompare } from '@utils/helper';

import FilterTags from '@components/FilterTags';
// import CreateNote from '@components/CreateNote';
// import SkeletonIndex from '@components/SkeletonIndex';
// import SlateThumbnail from '@components/SlateThumbnail';

const CreateNote = dynamic(() => import('@components/CreateNote'));
const SkeletonIndex = dynamic(() => import('@components/SkeletonIndex'));
const SlateThumbnail = dynamic(() => import('@components/SlateThumbnail'));
const NoteChakra = dynamic(() => import('@utils/customSVG').then((mod) => mod.NoteChakra));
const NoNote = dynamic(() => import('@utils/customSVG').then((mod) => mod.NoNote));

const fetchNotes = async () => {
  const notes = await axios.get('/api/note');
  return notes;
}

export default function NotesIndex() {
  const [session, loading] = useSession();
  const router = useRouter();
  const { isLoading, isError, data, error } = useQuery("note", fetchNotes);
  const { colorMode } = useColorMode();
  const isMounted = useRef(false);
  const [tagQuery, setTagQuery] = useState({ tags: [], type: [], fav: false });

  let allTags = [];
  let allType = [];
  let favFlag = false;
  let thumbnailJSX: ReactElement;
  let nullJSX: ReactElement;
  useEffect(() => {
    if (isMounted.current) {
      let selectedTags = router.query.tags;
      let selectedType = router.query.type;
      let selectedFav = router.query.fav;
      setTagQuery({
        tags: selectedTags ? (selectedTags as string).split(",") :
          [],
        type:selectedType?
          [(selectedType as string).split(',').pop()] :
          [],
        fav:selectedFav==='true'?true:false,
      });
    } else {
      isMounted.current = true;
    }
  }, [router.query]);

  const handleFav = () => {
    if (tagQuery.fav !== true) {
      router.push({
        query: { ...router.query, fav: true }
      })
    } else {
      let clone = Object.assign({}, router.query);
      delete clone['fav'];
      router.push(
        {
          query: clone,
        });
    }
  }
  if (session) {
    if (isLoading) {
      return (
        <>
            <SkeletonIndex/>
        </>
      );
    }
    if (isError) {
      return (
        <Flex
          h="100vh"
          justify="center"
          fontSize="24"
        >
          <Box>
            <Text>
              Please contact the team to get the following issue resolved
            </Text>
            <br />
            <Text as="i">Error: {error['message']}</Text>
          </Box>
        </Flex>
      );
    }
    let filteredData = data.data;
    if (data.data.length) {
      if(Object.keys(router.query).length){
        filteredData = data.data.filter(note => {
          return (
            isSubset(note.tags, tagQuery.tags) &&
            (tagQuery.type.length === 0 || note.type === tagQuery.type[0].toLowerCase()) &&
            (tagQuery.fav ? note.favourite === true : true)
          );
        });
      }
      if (!filteredData.length) {
        setTagQuery({ tags: [], type: [], fav: false });
        router.push('/note');
      }
      filteredData = filteredData.sort((a, b) => objectCompare(a, b, 'lastModified'));
      allTags = Array.from(new Set(filteredData.map(note => note.tags).flat()));

      filteredData.some(note => note.type === 'text')?allType.push('Text'):null;
      filteredData.some(note => note.type === 'code')?allType.push('Code'):null;
    
      favFlag = filteredData.some(note => note.favourite === true);

      thumbnailJSX = filteredData.map(data => {
        return (
          <SlateThumbnail key={data._id} data={data} />
        );
      });
      }
      else {
        nullJSX = (
          <Flex w="100%" m="4" justifyContent="center">
            <VStack>
              <Text fontSize="2xl">No notes found. Add them to get started.</Text>
              <NoNote/>
            </VStack>
          </Flex>
        );
      }
    return (
      <>
         <Flex align="center" mb="4" ml="4" flexWrap="wrap">
          <CreateNote/>
          <Spacer />
          <Box boxShadow="sm" borderWidth="1px" borderRadius="md" px="2">
            <Icon as={FiFilter} mr="2" />
            <FilterTags selected={tagQuery.tags} tags={allTags} type="tags" />
            <FilterTags selected={tagQuery.type} tags={allType} type="type" />
            {favFlag ? <Icon
              cursor="pointer"
              boxSize="6"
              aria-label="Toggle favourite note filter"
              as={tagQuery.fav ? AiFillStar : AiOutlineStar}
              color={tagQuery.fav ? "yellow.400" :colorMode==='light'? 'gray.700':'gray.50'}
              onClick={handleFav}
            /> : '\u00A0\u00A0\u00A0\u00A0\u00A0'}
          </Box>
        </Flex>
        {data.data.length === 0 ? nullJSX : (
          <Flex >
                <Flex flexWrap="wrap" justifyContent="center" w="100%"
                    mx={{ base: "3", sm: "4", lg: "5" }}
                    p={{  base: "3", sm: "4", lg: "5"  }}
                >
            {thumbnailJSX}
            </Flex>
          </Flex>
        )}
      </>
    );
  }
  else if (loading) {
    return (
        <Flex height="90vh" overflow="hidden">
          <SkeletonIndex/>
        </Flex>
      );
  }
  else {
      return (<VStack
        justify="center"
        overflow="hidden"
        height="90vh"
      >
        <Text fontSize="26" textAlign="center" mb="2">
          Please login to view and add notes
        </Text>
        <NoteChakra/>
      </VStack> 
      );
    }
}

