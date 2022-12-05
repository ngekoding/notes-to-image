/**
 * This extension is originally from the community
 * https://github.com/ueberdosis/tiptap/issues/1151#issuecomment-1046030306
 */

import {
  Mark,
  getMarkAttributes
} from '@tiptap/core';

export const TextClass = Mark.create({
  name: 'textClass',

  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute('class'),
        renderHTML: (attributes) => {
          if (!attributes.class) {
            return {};
          }
          return {
            class: attributes.class,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },

  addCommands() {
    return {
      removeEmptyTextClass: () => ({ state, commands }) => {
        const attributes = getMarkAttributes(state, this.type)
        const hasClasses = Object.entries(attributes).some(([, value]) => !!value)

        if (hasClasses) {
          return true
        }

        return commands.unsetMark(this.name)
      },
      setTextClass: (className) => ({ commands }) => {
        return commands.setMark(this.name, { class: className })
      },
      toggleTextClass: (className) => ({ editor, chain }) => {
        let textClasses = editor.getAttributes('textClass').class?.split(' ') ?? []

        if ((textClasses).includes(className)) {
          textClasses = textClasses.filter(cls => cls !== className)
        } else {
          textClasses.push(className)
        }

        if (textClasses.length) {
          return chain().setMark(this.name, { class: textClasses.join(' ') }).run()
        } else {
          return chain().setMark(this.name, { class: '' })
            .removeEmptyTextClass()
            .run()
        }
      },
      unsetTextClass: () => ({ commands }) => commands.unsetMark(this.name),
    };
  },
});