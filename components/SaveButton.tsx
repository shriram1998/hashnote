import {Button} from '@chakra-ui/react';
import {
    FiSave
} from 'react-icons/fi';
import { BsCheck } from 'react-icons/bs';

export default function SaveButton({ state,onSave,...rest }) {
    switch (state) {
        case "Saved": return (
            <Button
                size="sm"
                disabled
                colorScheme="blue"
                spinnerPlacement="end"
                variant="outline"
                borderWidth="0"
                {...rest}
            >
                <BsCheck />
            </Button>);
        case "Saving": return (
            <Button
                size="sm"
                isLoading
                // loadingText="Saving"
                colorScheme="blue"
                spinnerPlacement="end"
                variant="outline"
                borderWidth="0"
                {...rest}
            />
        );
        case "Save": return (
            <Button
                size="sm"
                colorScheme="blue"
                spinnerPlacement="end"
                variant="outline"
                borderWidth="0"
                onClick={onSave}
                {...rest}
                >
                    <FiSave />
                </Button>
        );
        default:return (
            <Button
                size="sm"
                disabled
                colorScheme="blue"
                spinnerPlacement="end"
                variant="outline"
                borderWidth="0"
                {...rest}
                >
                    <FiSave />
                </Button>
        );
    }       
}