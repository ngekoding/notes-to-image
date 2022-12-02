/**
 * This extension is originally from the community
 * https://github.com/ueberdosis/tiptap/issues/819#issuecomment-861422382
 */

import { Extension } from '@tiptap/core'
import '@tiptap/extension-text-style'

export const SpanClass = Extension.create({
  name: 'spanClass',
  defaultOptions: {
    types: ['textStyle']
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          spanClass: {
            default: 'none',
            renderHTML: (attributes) => {
              if (!attributes.spanClass) {
                return {}
              }
              return {
                class: attributes.spanClass
              }
            },
            parseHTML: (element) => ({
              spanClass: element.classList.value
            })
          }
        }
      }
    ]
  },
  addCommands() {
    return {
      setSpanClass: (spanClass) => ({ chain }) => {
        return chain().setMark('textStyle', { spanClass }).run()
      },
      toggleSpanClass: (spanClass) => ({ editor, chain }) => {
        if (!editor.isActive('textStyle')) {
          return chain().setMark('textStyle', { spanClass }).run()
        } else {
          let textStyleClasses = editor.getAttributes('textStyle').spanClass.split(' ')

          if ((textStyleClasses).includes(spanClass)) {
            textStyleClasses = textStyleClasses.filter(className => className !== spanClass)
          } else {
            textStyleClasses.push(spanClass)
          }

          if (textStyleClasses.length) {
            return chain().setMark('textStyle', { spanClass: textStyleClasses.join(' ') }).run()
          } else {
            return chain().setMark("textStyle", { spanClass: '' })
              .removeEmptyTextStyle()
              .run()
          }
        }
      },
      unsetSpanClass: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { spanClass: '' })
          .removeEmptyTextStyle()
          .run()
      }
    }
  }
})