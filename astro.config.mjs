// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

// The Website presents source without claiming semantic ownership over it. This
// grammar recognizes only lexical forms needed to render authored examples; the
// SDK's TextMate grammar remains the complete editor grammar.
/** @type {import('shiki').LanguageRegistration} */
const tetrodotoxin = {
  name: 'ttx',
  scopeName: 'source.tetrodotoxin',
  aliases: ['tetrodotoxin'],
  patterns: [
    { name: 'comment.line.tetrodotoxin', match: '//.*$' },
    { name: 'string.quoted.double.tetrodotoxin', match: '"[^"]*"' },
    { name: 'constant.numeric.tetrodotoxin', match: '\\b(?:0x[0-9A-Fa-f]+|[0-9]+(?:\\.[0-9]+)?)\\b' },
    { name: 'constant.language.tetrodotoxin', match: '\\b(?:true|false)\\b' },
    { name: 'keyword.other.visibility.tetrodotoxin', match: '\\b(?:public|private|expose)\\b' },
    { name: 'keyword.other.policy.tetrodotoxin', match: '\\b(?:state|const)\\b' },
    { name: 'keyword.control.tetrodotoxin', match: '\\b(?:for|in|match|case|if|else|return|while|break|continue|and|or)\\b' },
    {
      name: 'keyword.other.tetrodotoxin',
      match: '\\b(?:dialect|foreign|func|self|new|object|struct|interface|implementation|enum|alias|namespace|emit|source|package|using|implements|stage|resource|uniform|read|write|bridge|runtime|lifecycle|initial|on|replace|push|pop|exit|signal|product|environment)\\b',
    },
    { name: 'entity.name.type.intrinsic.tetrodotoxin', match: '\\b(?:U(?:8|16|32|64)|S(?:8|16|32|64)|R(?:32|64)|Bool)\\b' },
    { name: 'entity.name.function.tetrodotoxin', match: '\\b[a-z_][a-zA-Z0-9_]*(?=\\s*\\()' },
    { name: 'variable.other.member.tetrodotoxin', match: '(?<=\\.)[a-z_][a-zA-Z0-9_]*' },
    { name: 'entity.name.type.tetrodotoxin', match: '\\b[A-Z][a-zA-Z0-9_]*\\b' },
    { name: 'punctuation.accessor.tetrodotoxin', match: '::|->|(?<!\\.)\\.(?!\\.)|:' },
    { name: 'keyword.operator.tetrodotoxin', match: '\\.\\.|==|!=|<=|>=|\\+=|-=|[+\\-*/%^&|!<>=?]' },
    { name: 'punctuation.tetrodotoxin', match: '[{}()\\[\\];,]' },
  ],
  repository: {},
};

/** @type {import('shiki').ThemeRegistrationRaw} */
const tetrodotoxinTheme = {
  name: 'tetrodotoxin',
  type: 'dark',
  colors: {
    'editor.background': '#08080b',
    'editor.foreground': '#d8d8d8',
  },
  settings: [
    { settings: { foreground: '#d8d8d8', background: '#08080b' } },
    { scope: ['comment'], settings: { foreground: '#787065', fontStyle: 'italic' } },
    { scope: ['keyword.other.visibility'], settings: { foreground: '#d4646a' } },
    { scope: ['keyword.other.policy'], settings: { foreground: '#ad4a52' } },
    { scope: ['keyword', 'entity.name.type.intrinsic'], settings: { foreground: '#dd6d72' } },
    { scope: ['entity.name.type'], settings: { foreground: '#f7a3a7' } },
    { scope: ['variable.other.member'], settings: { foreground: '#c1b6a6' } },
    { scope: ['string', 'constant'], settings: { foreground: '#ebd07b' } },
    { scope: ['entity.name.function'], settings: { foreground: '#e2d693' } },
    { scope: ['keyword.operator'], settings: { foreground: '#988f82' } },
    { scope: ['punctuation.accessor'], settings: { foreground: '#605950' } },
    { scope: ['punctuation'], settings: { foreground: '#4e4840' } },
  ],
};

export default defineConfig({
  output: 'static',
  site: 'https://tetrodotoxin.dev',
  trailingSlash: 'always',
  markdown: {
    processor: unified({
      // Display math is opt-in. Disabling single-dollar inline math keeps TTX
      // concept routes such as `$name` and `$[...]` ordinary authored bytes.
      remarkPlugins: [[remarkMath, { singleDollarTextMath: false }]],
      // Native MathML keeps the published DOM semantic and compact. KaTeX
      // still retains the authored LaTeX in an application/x-tex annotation.
      rehypePlugins: [[rehypeKatex, { output: 'mathml' }]],
    }),
    shikiConfig: {
      langs: [tetrodotoxin],
      theme: tetrodotoxinTheme,
      wrap: false,
    },
  },
});
