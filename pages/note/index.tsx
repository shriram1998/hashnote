import { useEffect,useState } from 'react';
import { useRouter } from 'next/router';
import {
  Flex, Spacer, VStack, HStack, Wrap,Box,Grid,
  Spinner, Text, 
  Button, Icon,IconButton,Checkbox,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';

import {
    FiFilter,
} from 'react-icons/fi';
import { AiFillStar,AiOutlineStar } from 'react-icons/ai';
import axios from '@utils/axios';
import { useSession } from '@utils/useSession';
import { capitalizeFirstLetter, isSubset,objectCompare } from '@utils/helper';
import FilterTags from '@components/FilterTags';
import CreateNote from '@components/CreateNote';
import SkeletonComp from '@components/Skeleton';
import SlateThumbnail from '@components/SlateThumbnail';
const fetchNotes = async () => {
  const notes = await axios.get('/api/note');
  return notes;
}

export default function NotesIndex() {
  const [session, loading] = useSession();
  const router = useRouter();
  const { isLoading, isError, data, error } = useQuery("note", fetchNotes);
  const [tagQuery, setTagQuery] = useState({tags:[],type:[],fav:false});
  useEffect(() => {
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
        <Flex
          h="100vh"
          justify="center"
          fontSize="30"
        >
          <VStack w="100%" spacing="4">
            <HStack mb="4">
              <Text>Almost there</Text>
              <Spinner ml="2" size="md" />
            </HStack>
            {SkeletonComp}
          </VStack>
        </Flex>
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
    let filteredData = data.data.filter(note => {
      return (
        isSubset(note.tags, tagQuery.tags) &&
        (tagQuery.type.length===0 || note.type === tagQuery.type[0].toLowerCase()) &&
        (tagQuery.fav?note.favourite===true:true)
      );
    });
    if (!filteredData.length) {
        setTagQuery({ tags: [], type: [], fav: false });
        router.push('/note');
      }
    
    filteredData = filteredData.sort((a, b) => objectCompare(a, b, 'lastModified'));
    let allTags = Array.from(new Set(filteredData.map(note => note.tags).flat()));

    let textFlag = filteredData.some(note => note.type === 'text');
    let codeFlag = filteredData.some(note => note.type === 'code');
    let allType = [];
    if (textFlag) { allType.push('Text') }
    if (codeFlag) { allType.push('Code') }
    
    let favFlag = filteredData.some(note => note.favourite === true);

    let thumbnaiJSX = filteredData.map(data => {
      return (
        <SlateThumbnail key={data._id} data={data} />
      );
    });
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
              color="yellow.400"
              onClick={handleFav}
            /> : '\u00A0\u00A0\u00A0\u00A0\u00A0'}
          </Box>
        </Flex>
        <Wrap spacing="35px" mt="10"  mx="2">
          {thumbnaiJSX}
        </Wrap>
      </>
    );
  }
  else if (typeof window !== 'undefined' && loading) {
    return (<Flex
        h="100vh"
        justify="center"
        fontSize="30"
      >
      <VStack w="100%" spacing="4">
        <HStack mb="4">
          <Text>Please wait, Loading page</Text>
          <Spinner ml="2" size="md" />
        </HStack>
      </VStack>
      </Flex>
      );
  }
  else {
      return (<Flex
        h="100vh"
        justify="center"
        fontSize="24"
      >
        Please login to view and add notes
      </Flex> 
      );
    }
}

