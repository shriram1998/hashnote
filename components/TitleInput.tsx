import {
    ButtonGroup, IconButton,
    Flex,
    Editable,EditablePreview,EditableInput,useEditableControls
} from "@chakra-ui/react"
import { useState } from 'react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import {BiEdit} from 'react-icons/bi'
export default function TitleInput({ val = "",onSubmit,...rest }) {
    const [value, setValue] = useState(val);
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls()
    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton aria-label="Save change" icon={<AiOutlineCheck />} {...getSubmitButtonProps()} />
        <IconButton aria-label="Discard change" icon={<AiOutlineClose />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton aria-label="Edit field" size="sm" icon={<BiEdit />} {...getEditButtonProps()} />
      </Flex>
    )
  }
  return (
    <Editable
      onChange={(eVal) => setValue(eVal)}
      onSubmit={(eVal) => {
        eVal !== val ? onSubmit(eVal) : null;
      }
      }
      value={value ? value : ""}
      textAlign="center"
      placeholder="Title"
      fontSize="2xl"
      isPreviewFocusable={false}
      {...rest}
      >
      <EditablePreview
          // display={value ? "inline" : "none"}
      />
      <EditableInput />
      <EditableControls />
    </Editable>
  )
}