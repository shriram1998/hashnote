import { Flex,Text,Box} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import SlateEditor from '@components/SlateEditor';
import SkeletonComp from '@components/Skeleton';
import axios from '@utils/axios';
import { useSession } from '@utils/useSession';

export default function SingleNote() {
  const router = useRouter();
  const [session, loading] = useSession();
  const { nid } = router.query;
  const { isLoading, isError,isSuccess, data, error } = useQuery(["note",nid], async () => {
    const notes = await axios.get(`/api/note/${nid}`);
    return notes;
  }, {
    enabled:!!nid,
  });

  if (session) {
    if (isLoading) {
      return (
        <Flex
          h="100vh"
          justify="center"
          fontSize="30"
        >
          {SkeletonComp}
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
    if (isSuccess) {
      return (
        <SlateEditor data={data.data?data.data:router.push('/note')} />
      );
    }
  }
  else if (loading) {
    return (<Flex
        h="100vh"
        justify="center"
        fontSize="30"
      >
          {SkeletonComp}
      </Flex>
      );
  }
  else {
      return (<Flex
        h="100vh"
        justify="center"
        fontSize="24"
      >
        Please sign in to view the note
      </Flex>
      );
    }
}

