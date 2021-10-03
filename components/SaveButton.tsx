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
                rightIcon={<BsCheck />}
                colorScheme="blue"
                spinnerPlacement="end"
                variant="outline"
                borderWidth="0"
                {...rest}
            >
                Saved
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
                rightIcon={<FiSave />}
                colorScheme="blue"
                spinnerPlacement="end"
                variant="outline"
                borderWidth="0"
                onClick={onSave}
                {...rest}
                >
                    Save
                </Button>
        );
        default:return (
            <Button
                size="sm"
                disabled
                rightIcon={<FiSave />}
                colorScheme="blue"
                spinnerPlacement="end"
                variant="outline"
                borderWidth="0"
                {...rest}
                >
                    Saved
                </Button>
        );
    }       
}