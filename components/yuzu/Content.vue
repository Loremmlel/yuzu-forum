<script lang="ts" setup>
import DOMPurify from "isomorphic-dompurify"

defineProps<{
  content: string
}>()
</script>

<template>
  <div class="yzforum-content" v-html="DOMPurify.sanitize(content, {ADD_ATTR: ['line']})"></div>
</template>

<style lang="scss" scoped>
//@use '~/assets/css/editor/index.scss';
code[class*='language-'],
pre[class*='language-'] {
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  color: var(--yzforum-pink-0);
  font-family: Roboto Mono,
  monospace;
  font-size: 1em;
  line-height: 1.5em;

  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;

  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
}

code[class*='language-']::-moz-selection,
pre[class*='language-']::-moz-selection,
code[class*='language-'] ::-moz-selection,
code[class*='language-']::selection,
pre[class*='language-']::selection,
code[class*='language-'] ::selection,
:not(pre) > code[class*='language-'] {
  white-space: normal;
  border-radius: 0.2em;
  padding: 0.1em;
}

pre[class*='language-'] {
  overflow: auto;
  position: relative;
  margin: 0.5em 0;
  padding: 1.25em 1em;
}

.language-css > code,
.language-sass > code,
.language-scss > code {
  color: var(--yzforum-red-2);
}

[class*='language-'] .namespace {
  opacity: 0.7;
}

.token.atrule {
  color: var(--yzforum-pink-3);
}

.token.attr-name {
  color: var(--yzforum-purple-4);
}

.token.attr-value {
  color: var(--yzforum-green-4);
}

.token.attribute {
  color: var(--yzforum-green-4);
}

.token.boolean {
  color: var(--yzforum-pink-3);
}

.token.builtin {
  color: var(--yzforum-purple-4);
}

.token.cdata {
  color: var(--yzforum-blue-5);
}

.token.char {
  color: var(--yzforum-blue-5);
}

.token.class {
  color: var(--yzforum-purple-4);
}

.token.class-name {
  color: var(--yzforum-yellow-2);
}

.token.comment {
  color: var(--yzforum-font-color-0);
}

.token.constant {
  color: var(--yzforum-pink-3);
}

.token.deleted {
  color: var(--yzforum-red-4);
}

.token.doctype {
  color: var(--yzforum-font-color-0);
}

.token.entity {
  color: var(--yzforum-red-4);
}

.token.function {
  color: var(--yzforum-pink-3);
}

.token.hexcode {
  color: var(--yzforum-yellow-2);
}

.token.id {
  color: var(--yzforum-pink-3);
  font-weight: bold;
}

.token.important {
  color: var(--yzforum-pink-3);
  font-weight: bold;
}

.token.inserted {
  color: var(--yzforum-blue-5);
}

.token.keyword {
  color: var(--yzforum-pink-3);
}

.token.number {
  color: var(--yzforum-red-2);
}

.token.operator {
  color: var(--yzforum-blue-2);
}

.token.prolog {
  color: var(--yzforum-font-color-0);
}

.token.property {
  color: var(--yzforum-blue-5);
}

.token.pseudo-class {
  color: var(--yzforum-green-4);
}

.token.pseudo-element {
  color: var(--yzforum-green-4);
}

.token.punctuation {
  color: var(--yzforum-blue-2);
}

.token.regex {
  color: var(--yzforum-yellow-2);
}

.token.selector {
  color: var(--yzforum-red-4);
}

.token.string {
  color: var(--yzforum-green-4);
}

.token.symbol {
  color: var(--yzforum-pink-3);
}

.token.tag {
  color: var(--yzforum-red-4);
}

.token.unit {
  color: var(--yzforum-red-2);
}

.token.url {
  color: var(--yzforum-red-4);
}

.token.variable {
  color: var(--yzforum-red-4);
}

//@use '~/assets/css/editor/yuzu-content.scss';
.yzforum-content {
  h1,
  h2 {
    padding-top: 16px;
    margin-bottom: 24px;
    margin-top: 48px;
    border-top: 1px solid var(--yzforum-trans-blue-2);
  }

  h3,
  h4 {
    margin-top: 32px;
    margin-bottom: 16px;
  }

  h5,
  h6 {
    margin: 8px 0;
  }

  ul,
  ol {
    line-height: 2rem;
  }

  img {
    max-width: 100%;
  }

  del {
    text-decoration: line-through;
  }

  p {
    margin: 17px 0;
    word-break: break-all;

    code {
      font-family: "JetBrains Mono",
      SF Mono,
      Menlo,
      Consolas,
      Liberation Mono,
      monospace;
      margin: 0 4px;
      background-color: var(--yzforum-trans-blue-1);
      padding: 2px 4px;
      border-radius: 8px;
    }
  }

  blockquote {
    margin: 18px 0;
    padding: 18px;
    border-left: 5px solid var(--yzforum-blue-5);
    border-radius: 10px;
    background-color: var(--yzforum-trans-blue-0);
    color: var(--yzforum-font-color-3);
    line-height: 2rem;

    p {
      margin: 0;
    }
  }

  pre {
    margin: 18px 0;
    border-radius: 5px;
    padding: 18px;
    background-color: var(--yzforum-trans-white-5);
    position: relative;
    box-shadow: var(--shadow);
    overflow-x: auto;

    code {
      font-size: 15px;
      font-family: SF Mono,
      Menlo,
      Consolas,
      Liberation Mono,
      monospace;
      float: left;
      min-width: 100%;

      .code-line {
        display: block;
        padding-left: 16px;
        padding-right: 16px;
        margin-left: -16px;
        margin-right: -16px;
        border-left: 4px solid transparent;
      }

      .code-line.inserted {
        color: var(--yzforum-white-5);
        background-color: var(--yzforum-green-4);
      }

      .code-line.deleted {
        color: var(--yzforum-white-5);
        background-color: var(--yzforum-red-5);
      }

      .highlight-line {
        margin-left: -16px;
        margin-right: -16px;
        background-color: var(--yzforum-trans-blue-1);
        border-left: 4px solid var(--yzforum-blue-5);
      }

      .line-number::before {
        display: inline-block;
        width: 1rem;
        text-align: right;
        margin-right: 16px;
        margin-left: -8px;
        color: var(--yzforum-gray-4);
        content: attr(line);
      }
    }
  }

  a {
    cursor: pointer;
    font-weight: bold;
    color: var(--yzforum-blue-5);
    text-decoration: underline;
    text-underline-offset: 3px;
    word-break: break-word;
  }

  table {
    border: 1px solid var(--yzforum-blue-5);
    white-space: pre-wrap;

    th,
    td {
      border: 1px solid var(--yzforum-blue-5);
      padding: 3px;
      text-align: left;
    }

    tr:nth-child(even) {
      background-color: var(--yzforum-trans-blue-1);
    }
  }
}


.yzforum-content {
  width: calc(100% - 135px);
  padding-top: 10px;
  padding-right: 20px;

  code[class*='language-'],
  pre[class*='language-'] {
    color: var(--yzforum-font-color-3);
  }
}

@media (max-width: 700px) {
  .yzforum-content {
    padding: 10px;
    width: 100%;
    text-wrap: wrap;
    white-space: wrap;
  }
}
</style>