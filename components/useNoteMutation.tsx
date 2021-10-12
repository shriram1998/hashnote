import { useToast } from '@chakra-ui/react'
import { useMutation, useQueryClient } from 'react-query'
import { putNote,patchTag,deleteNote} from '@components/NoteMutation';

export default function useNoteMutation() {
    const queryClient = useQueryClient();
    const toast = useToast();
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
    return {
        patchTagMutation,
        putNoteMutation,
        delteNoteMutation
    }
}