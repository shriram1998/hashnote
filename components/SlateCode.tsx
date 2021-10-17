import {tokenize,languages,util} from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-java'
// import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-dart'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-scala'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-css'  
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-powershell'
import 'prismjs/components/prism-batch'
import 'prismjs/components/prism-bash'

import {useCallback, useMemo } from 'react'
import { Slate, Editable, withReact,ReactEditor } from 'slate-react'
import { Text, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { chakra } from '@chakra-ui/react';

export default function SlateCode({value,onValueChange,language}) {
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const renderElement = useCallback(props => <Element {...props} />, [])
    const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), [])
    // decorate function depends on the language selected
    const decorate = useCallback(
        ([node, path]) => {
        const ranges = []
        if (!Text.isText(node)) {
            return ranges
        }
        const tokens =tokenize(node.text,languages[language])
        let start = 0

        for (const token of tokens) {
            const length = getLength(token)
            const end = start + length

            if (typeof token !== 'string') {
            ranges.push({
                [token.type]: true,
                anchor: { path, offset: start },
                focus: { path, offset: end },
            })
            }

            start = end
        }

        return ranges
        },
        [language]
        )
        
        return (
          <Slate
            editor={editor}
            value={value}
            onChange={value => {
                if (editor.operations.some(op => 'set_selection' !== op.type)) {
                  onValueChange(value,true)
                }
              }
            }
          >
                <Editable
              renderElement={renderElement}
              autoFocus
              spellCheck={false}
              decorate={decorate}
              renderLeaf={renderLeaf}
              placeholder="Write code here..."
              onKeyDown={(event) => {
                if (event.key === 'Tab') {
                  event.preventDefault();
                  editor.insertNode({
                    text:'    '
                  })
                }
              }}
                />
            </Slate> 
    )
    }

    const getLength = token => {
    if (typeof token === 'string') {
        return token.length
    } else if (typeof token.content === 'string') {
        return token.content.length
    } else {
        return token.content.reduce((l, t) => l + getLength(t), 0)
    }
    }

    const Element = ({ attributes, children, element }) => {
        return <pre {...attributes}>{children}</pre>
    }
    // different token types, styles found on Prismjs website
    const Leaf = ({ attributes, children, leaf }) => {
      return (
        <chakra.span
          {...attributes}
          fontFamily="monospace"
          color={leaf.comment? "slategray": 
            (leaf.operator || leaf.url)? "#9a6e3a":
            leaf.keyword?"#07a":
            (leaf.variable || leaf.regex)?"#e90":
            (leaf.number ||
            leaf.boolean ||
            leaf.tag ||
            leaf.constant ||
            leaf.symbol ||
            leaf['attr-name'] ||
            leaf.selector)?"#905":
            (leaf.string || leaf.char)?"#690":
            (leaf.function || leaf['class-name'])?"#dd4a68":""}
        >
        {children}
        </chakra.span>
    )
}

// modifications and additions to prism library

languages.python =languages.extend('python', {})
languages.insertBefore('python', 'prolog', {
  comment: { pattern: /##[^\n]*/, alias: 'comment' },
})
languages.javascript =languages.extend('javascript', {})
languages.insertBefore('javascript', 'prolog', {
  comment: { pattern: /\/\/[^\n]*/, alias: 'comment' },
})
languages.html =languages.extend('html', {})
languages.insertBefore('html', 'prolog', {
  comment: { pattern: /<!--[^\n]*-->/, alias: 'comment' },
})
languages.markdown =languages.extend('markup', {})
languages.insertBefore('markdown', 'prolog', {
  blockquote: { pattern: /^>(?:[\t ]*>)*/m, alias: 'punctuation' },
  code: [
    { pattern: /^(?: {4}|\t).+/m, alias: 'keyword' },
    { pattern: /``.+?``|`[^`\n]+`/, alias: 'keyword' },
  ],
  title: [
    {
      pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
      alias: 'important',
      inside: { punctuation: /==+$|--+$/ },
    },
    {
      pattern: /(^\s*)#+.+/m,
      lookbehind: !0,
      alias: 'important',
      inside: { punctuation: /^#+|#+$/ },
    },
  ],
  hr: {
    pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
    lookbehind: !0,
    alias: 'punctuation',
  },
  list: {
    pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
    lookbehind: !0,
    alias: 'punctuation',
  },
  'url-reference': {
    pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
    inside: {
      variable: { pattern: /^(!?\[)[^\]]+/, lookbehind: !0 },
      string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
      punctuation: /^[\[\]!:]|[<>]/,
    },
    alias: 'url',
  },
  bold: {
    pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    lookbehind: !0,
    inside: { punctuation: /^\*\*|^__|\*\*$|__$/ },
  },
  italic: {
    pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    lookbehind: !0,
    inside: { punctuation: /^[*_]|[*_]$/ },
  },
  url: {
    pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
    inside: {
      variable: { pattern: /(!?\[)[^\]]+(?=\]$)/, lookbehind: !0 },
      string: { pattern: /"(?:\\.|[^"\\])*"(?=\)$)/ },
    },
  },
})
languages.markdown.bold.inside.url =util.clone(
 languages.markdown.url
)
languages.markdown.italic.inside.url =util.clone(
 languages.markdown.url
)
languages.markdown.bold.inside.italic =util.clone(
 languages.markdown.italic
)
languages.markdown.italic.inside.bold =util.clone(languages.markdown.bold); // prettier-ignore
