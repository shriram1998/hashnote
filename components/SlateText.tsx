import { useCallback, useMemo } from 'react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, useSlate, Slate,ReactEditor } from 'slate-react';
import {
  Editor, Transforms, createEditor,
  Element as SlateElement,
} from 'slate';
import { withHistory } from 'slate-history';

import { GoBold } from '@react-icons/all-files/go/GoBold';
import { FiItalic } from '@react-icons/all-files/fi/FiItalic';
import { FiUnderline } from '@react-icons/all-files/fi/FiUnderline';
import { AiOutlineOrderedList } from '@react-icons/all-files/ai/AiOutlineOrderedList';
import { AiOutlineUnorderedList } from '@react-icons/all-files/ai/AiOutlineUnorderedList';
import { BsCodeSlash } from '@react-icons/all-files/bs/BsCodeSlash';
import { MdLooksOne} from '@react-icons/all-files/md/MdLooksOne';
import { MdLooksTwo } from '@react-icons/all-files/md/MdLooksTwo';
import { MdFormatQuote } from '@react-icons/all-files/md/MdFormatQuote';

import { findUrlsInText } from "./withLinks";

import { Heading, Text, Wrap, Tooltip } from '@chakra-ui/react';
import { Button } from '@components/SlateTextComponents';


const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const myDecorator = ([node, path]) => {
  const nodeText = node.text;

  if (!nodeText) return [];

  const urls = findUrlsInText(nodeText);

  return urls.map(([url, index]) => {
    return {
      anchor: {
        path,
        offset: index,
      },
      focus: {
        path,
        offset: index + url.length,
      },
      decoration: "link",
    };
  });
}

export default function SlateText({ value,onValueChange}){
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => (withHistory(withReact(createEditor() as ReactEditor))), [])

  const TEXT_CONTROLS=[
    {'type':'mark','format':'bold','icon':<GoBold/>, 'label':'Bold', 'char':'B' },
    { 'type': 'mark', 'format': 'italic', 'icon': <FiItalic />, 'label': 'Italic', 'char': 'I' },
    { 'type': 'mark', 'format': 'underline', 'icon': <FiUnderline />, 'label': 'Underline', 'char': 'U' },
    { 'type': 'mark', 'format': 'code', 'icon': <BsCodeSlash />, 'label': 'Code', 'char': '`' },
    { 'type': 'block', 'format': 'heading-one', 'icon': <MdLooksOne />, 'label': 'Heading 1' },
    { 'type': 'block', 'format': 'heading-two', 'icon': <MdLooksTwo />, 'label': 'Heading 2' },
    { 'type': 'block', 'format': 'block-quote', 'icon': <MdFormatQuote />, 'label': 'Blockquote' },
    { 'type': 'block', 'format': 'numbered-list', 'icon': <AiOutlineOrderedList />, 'label': 'Numbered List' },
    { 'type': 'block', 'format': 'bulleted-list', 'icon': <AiOutlineUnorderedList />, 'label': 'Bulleted List' },
  ]
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
        {TEXT_CONTROLS.map(val => {
          return (
            <TextButton key={ val.format} {...val}/>
          );
        })}
      </Wrap>
      
      <Editable
        decorate={myDecorator}
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
                const { anchor, focus } = editor.selection;
              // wrapLink(editor, { anchor, focus });
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

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
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
  const editor = useSlate();
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


const TextButton = ({ type, format, icon, label, char="" }) => {
  const BtnType = () => {
    switch (type) {
      case 'mark':
        return <MarkButton format={format} icon={icon} />;
      case 'block':
        return <BlockButton format={format} icon={icon} />;
      default:
        return null;
    }
  }
  return (
    <Tooltip placement="bottom-end" fontSize="md"
      label={<TooltipJSX label={label} char={ char}/>}
      openDelay={1200} closeDelay={300} shouldWrapChildren>
        <BtnType/>
    </Tooltip>
  );
}
const TooltipJSX = ({ label, char=""}: {label:string,char:string}) => {
  return char ?
    <pre>{label} <code>Ctrl/⌘</code> + <code>{char}</code></pre> :
    <pre>{label}</pre>;
}
const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n['type']
      ),
    split: true,
  })
  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  Transforms.setNodes(editor, newProperties as Partial<SlateElement>)

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
  const matches = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n['type'] === format,
  })

  return !!matches[0]
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
  if (leaf.decoration === "link") {
    children = (
      <a
        style={{cursor: "pointer"}}
        href={leaf.text}
        onClick={() => {
          window.open(leaf.text, "_blank", "noopener,noreferrer");
        }}
      >
        {children}
      </a>
    )}

  return <span {...attributes}>{children}</span>
}