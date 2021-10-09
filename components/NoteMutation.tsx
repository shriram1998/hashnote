import axios from '@utils/axios';

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

export async function patchTag({ newTag, postid }: AddTagProps) {
    const response = await axios.patch(`/api/note/${postid}`, { tags: newTag });
    return response;
}

export async function deleteNote({ postid }: {postid:string}) {
    const response = await axios.delete(`/api/note/${postid}`);
    return response;
}

export async function putNote({ postid, ...rest }: NoteProps) {
    const response = await axios.put(`/api/note/${postid}`, rest);
    return response;
}