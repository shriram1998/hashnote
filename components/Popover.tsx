import {
    Popover,PopoverTrigger,PopoverContent,PopoverCloseButton,
    PopoverHeader, PopoverBody, PopoverFooter, PopoverArrow,
    Button, ButtonGroup,
} from "@chakra-ui/react"
import { useRef } from 'react';

export default function ControlledUsage({message,action,actionTitle,colorScheme,children }) {
  const initRef = useRef();
  return (
    <>
      <Popover
        returnFocusOnClose={true}
        placement="left"
        closeOnBlur={false}
        initialFocusRef={initRef}
      >
        {({ isOpen, onClose }) => (
          <>
            <PopoverTrigger>
              {children}
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader fontWeight="semibold">Confirmation</PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                {message}
              </PopoverBody>
              <PopoverFooter d="flex" justifyContent="flex-end">
                <ButtonGroup size="sm">
                  <Button onClick={onClose}
                  ref={initRef} variant="outline">Cancel</Button>
                  <Button onClick={action} colorScheme={colorScheme}>{actionTitle}</Button>
                </ButtonGroup>
              </PopoverFooter>
            </PopoverContent>
          </>
        )}
      </Popover>
    </>
  )
}