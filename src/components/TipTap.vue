<script setup>
import { watch } from 'vue'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Placeholder from '@tiptap/extension-placeholder'
import { camelCase, pascalCase } from 'change-case'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    Superscript,
    Subscript,
    Placeholder.configure({
      placeholder: 'Mulai menulis...',
    })
  ],
  onUpdate: () => {
    emit('update:modelValue', editor.value.getHTML())
  }
})

watch(props.modelValue, (value) => {
  const isSame = editor.value.getHTML() === value

  if (isSame) return 

  editor.value.commands.setContent(value, false)
})

const isActive = (action) => {
  if (!editor.value) return false
  const name = camelCase(action)
  return editor.value.isActive(name)
}

const format = (action) => {
  const focus = editor.value.chain().focus()
  if (['undo', 'redo'].includes(action)) {
    focus[action]().run()
  } else {
    focus['toggle' + pascalCase(action)]().run()
  }
}
</script>

<template>
  <!-- bubble menu -->
  <bubble-menu
    v-if="editor"
    :editor="editor"
    :tippy-options="{ duration: 100 }"
    class="bubble-menu">
    <button
      :class="{ active: isActive('bold') }"
      @click="format('bold')">
      <material-icon name="format_bold" size="20" />
    </button>
    <button
      :class="{ active: isActive('italic') }"
      @click="format('italic')">
      <material-icon name="format_italic" size="20" />
    </button>
    <button
      :class="{ active: isActive('underline') }"
      @click="format('underline')">
      <material-icon name="format_underline" size="20" />
    </button>
  </bubble-menu>
  <div class="toolbar">
    <div class="menu-group">
      <button
        class="menu-item"
        :class="{ active: isActive('bold') }"
        @click="format('bold')">
        <material-icon name="format_bold" size="20" />
      </button>
      <button
        class="menu-item"
        :class="{ active: isActive('italic') }"
        @click="format('italic')">
        <material-icon name="format_italic" size="20" />
      </button>
      <button
        class="menu-item"
        :class="{ active: isActive('underline') }"
        @click="format('underline')">
        <material-icon name="format_underline" size="20" />
      </button>
    </div>
    <div class="menu-group">
      <button
        class="menu-item"
        :class="{ active: isActive('superscript') }"
        @click="format('superscript')">
        <material-icon name="superscript" size="20" />
      </button>
      <button
        class="menu-item"
        :class="{ active: isActive('subscript') }"
        @click="format('subscript')">
        <material-icon name="subscript" size="20" />
      </button>
    </div>
    <div class="menu-group">
      <button
        class="menu-item"
        :class="{ active: isActive('bullet-list') }"
        @click="format('bullet-list')">
        <material-icon name="format_list_bulleted" size="20" />
      </button>
      <button
        class="menu-item"
        :class="{ active: isActive('ordered-list') }"
        @click="format('ordered-list')">
        <material-icon name="format_list_numbered" size="20" />
      </button>
    </div>
    <div class="menu-group">
      <button
        class="menu-item"
        :class="{ active: isActive('blockquote') }"
        @click="format('blockquote')">
        <material-icon name="format_quote" size="20" />
      </button>
    </div>
    <div class="menu-group">
      <button
        class="menu-item"
        @click="format('undo')">
        <material-icon name="undo" size="20" />
      </button>
      <button
        class="menu-item"
        @click="format('redo')">
        <material-icon name="redo" size="20" />
      </button>
    </div>
  </div>
  <div class="editor-container">
    <editor-content :editor="editor" spellcheck="false" />
    <footer>
      Dibuat dengan <b>Berbagi Catatan</b><br>
      s.id/berbagi-catatan
    </footer>
  </div>
</template>
