import { MouseEvent } from "react";
import {
    Tag,
    TagLabel,
    TagCloseButton,
} from "@chakra-ui/react"

interface TagItemProps {
    tagLabel: string;
    onCloseClick: (string) => void;
    color: string;
}

export default function TagItem({ tagLabel,onCloseClick,color }:TagItemProps) {
    return (
        <Tag
            size="md"
            colorScheme={color}
        >
            <TagLabel>{ tagLabel }</TagLabel>
            <TagCloseButton onClick={()=>onCloseClick(tagLabel) }/>
        </Tag>
    );
}