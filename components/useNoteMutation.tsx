import { useMutation, useQueryClient } from 'react-query'
import { putNote,patchTag,deleteNote} from '@components/NoteMutation';

export default function useNoteMutation() {
    const queryClient = useQueryClient();
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
        },
    });
    return {
        patchTagMutation,
        putNoteMutation,
        delteNoteMutation
    }
}