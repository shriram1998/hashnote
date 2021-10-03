import React, { useCallback, useMemo, useState } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
} from 'slate';

import { withHistory } from 'slate-history';

import { Button } from '@components/SlateTextComponents';

import { GoBold } from 'react-icons/go';
import { FiItalic, FiUnderline } from 'react-icons/fi';
import { AiOutlineOrderedList, AiOutlineUnorderedList } from 'react-icons/ai';
import { BsCodeSlash } from 'react-icons/bs';
import { MdLooksOne, MdLooksTwo,MdFormatQuote } from 'react-icons/md';

import { Heading,Text,Wrap,Flex,Box,HStack } from '@chakra-ui/react';
const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

export default function SlateText({ value,onValueChange}){
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  return (
    <Slate editor={editor}
      value={value}
      onChange={value => {
          if (editor.operations.some(op => 'set_selection' !== op.type)) {
            onValueChange(value, true);
          }
        }
      }
    >
      <Wrap mb="3">
        <MarkButton format="bold" icon={<GoBold/>} />
        <MarkButton format="italic" icon={<FiItalic/>} />
        <MarkButton format="underline" icon={<FiUnderline/>} />
        <MarkButton format="code" icon={ <BsCodeSlash/>} />
        <BlockButton format="heading-one" icon={<MdLooksOne/>} />
        <BlockButton format="heading-two" icon={<MdLooksTwo/>} />
        <BlockButton format="block-quote" icon={<MdFormatQuote/>} />
        <BlockButton format="numbered-list" icon={<AiOutlineOrderedList/>} />
        <BlockButton format="bulleted-list" icon={<AiOutlineUnorderedList/>} />
      </Wrap>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter note here..."
        spellCheck={ false}
        autoFocus
        onKeyDown={event => {
          if (event.key == 'Tab') {
            event.preventDefault();
            editor.insertText('    ');
          } else {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault()
                const mark = HOTKEYS[hotkey]
                toggleMark(editor, mark)
              }
            }
          }
        }}
      />
    </Slate>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
      ),
    split: true,
  })
  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  })

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return (
          <Text {...attributes} as="blockquote" m="2" p="2" pl="4" borderStartWidth="3px">
            {children}
          </Text>
      )
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <Heading size="2xl" as="h1" {...attributes}>{children}</Heading>
    case 'heading-two':
      return <Heading size="xl" as="h2" {...attributes}>{children}</Heading>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      icon={icon}
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    />
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      icon={icon}
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    />
  )
}
