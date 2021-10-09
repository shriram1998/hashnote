import { Dispatch,SetStateAction } from 'react';
import { Select } from '@chakra-ui/react';

interface SelectComponentProps{
    value: string;
    options: object;
    onChange: Dispatch<SetStateAction<string>>;
}

export default function SelectComponent({ value, options, onChange }:SelectComponentProps) {
    const Options = () => {
        return (
            <>
            {Object.entries(options).map(item =>
                <option key={item[0]} value={item[0]}>{item[1]}</option>)}
            </>
        );
    }
    return (
        <Select
            mr="4"
            maxW="10em"
            size="sm"
            value={value}
            onChange={e => onChange(e.target.value)}
            cursor="pointer"
            >
            <Options/>
        </Select>
    )
}