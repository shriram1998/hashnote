import { Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
// import SlateCode from "@components/SlateCode";
// import SlateText from "@components/SlateText";
const SlateCode = dynamic(() => import('@components/SlateCode'));
const SlateText = dynamic(() => import('@components/SlateText'));
interface EditorSwitchProps{
    type: string;
    value: object;
    handleInputChange: (val:object,isChanged:boolean) => void,
    language?: string;
}
export default function EditorSwitch({type, value, handleInputChange, language}:EditorSwitchProps) {
    switch (type) {
        case 'text':
            return (
                <SlateText
                    value={value}
                    onValueChange={handleInputChange}/>
            );
        case 'code':
            return (
                <Flex
                    fontSize="lg"
                    p={{base:"1px",sm:"1.5px",md:"2px",lg:"3px",xl:"4px"}}
                    overflow="hidden"
                    wordBreak="break-word"
                >
                    <SlateCode
                        value={value}
                        onValueChange={handleInputChange}
                        language={language}
                    />
                </Flex>
            );
        default:
            return null
    }
}