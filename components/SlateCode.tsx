import Prism from 'prismjs'
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

import React, {useCallback, useMemo } from 'react'
import { Slate, Editable, withReact,ReactEditor } from 'slate-react'
import { Text, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { css } from '@emotion/css'

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
        const tokens = Prism.tokenize(node.text, Prism.languages[language])
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
        <span
        {...attributes}
        className={css`
                font-family: monospace;
            ${leaf.comment &&
            css`
                color: slategray;
            `} 
            ${(leaf.operator || leaf.url) &&
            css`
                color: #9a6e3a;
            `}
            ${leaf.keyword &&
            css`
                color: #07a;
            `}
            ${(leaf.variable || leaf.regex) &&
            css`
                color: #e90;
            `}
            ${(leaf.number ||
            leaf.boolean ||
            leaf.tag ||
            leaf.constant ||
            leaf.symbol ||
            leaf['attr-name'] ||
            leaf.selector) &&
            css`
                color: #905;
            `}
            ${leaf.punctuation &&
            css`
                color: #999;
            `}
            ${(leaf.string || leaf.char) &&
            css`
                color: #690;
            `}
            ${(leaf.function || leaf['class-name']) &&
            css`
                color: #dd4a68;
            `}
            `}
        >
        {children}
        </span>
    )
}

// modifications and additions to prism library

Prism.languages.python = Prism.languages.extend('python', {})
Prism.languages.insertBefore('python', 'prolog', {
  comment: { pattern: /##[^\n]*/, alias: 'comment' },
})
Prism.languages.javascript = Prism.languages.extend('javascript', {})
Prism.languages.insertBefore('javascript', 'prolog', {
  comment: { pattern: /\/\/[^\n]*/, alias: 'comment' },
})
Prism.languages.html = Prism.languages.extend('html', {})
Prism.languages.insertBefore('html', 'prolog', {
  comment: { pattern: /<!--[^\n]*-->/, alias: 'comment' },
})
Prism.languages.markdown = Prism.languages.extend('markup', {})
Prism.languages.insertBefore('markdown', 'prolog', {
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
Prism.languages.markdown.bold.inside.url = Prism.util.clone(
  Prism.languages.markdown.url
)
Prism.languages.markdown.italic.inside.url = Prism.util.clone(
  Prism.languages.markdown.url
)
Prism.languages.markdown.bold.inside.italic = Prism.util.clone(
  Prism.languages.markdown.italic
)
Prism.languages.markdown.italic.inside.bold = Prism.util.clone(Prism.languages.markdown.bold); // prettier-ignore
