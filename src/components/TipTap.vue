<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { camelCase, pascalCase } from 'change-case'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Placeholder from '@tiptap/extension-placeholder'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import SpanClass from '../tiptap-extensions/span-class'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const editorRef = ref(null)

/**
 * In the world or css we can use `border-image` only,
 * but it is unsupported by html-to-image.
 * So here is the alternative.
 */
onMounted(() => {
  const cornerImage = new Image()
  const cornerImageUrl = new URL('../assets/frame-top-left-corner.svg', import.meta.url).href
  cornerImage.src = cornerImageUrl
  cornerImage.className = 'frame-corner'
  for (let i = 1; i <= 4; i++) {
    editorRef.value.$el.appendChild(cornerImage.cloneNode(true))
  }
})

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    Superscript,
    Subscript,
    TextStyle,
    FontFamily,
    SpanClass,
    TextAlign.configure({
      types: ['paragraph'],
    }),
    Placeholder.configure({
      placeholder: 'Mulai menulis...',
    })
  ],
  onUpdate: () => {
    emit('update:modelValue', editor.value.getHTML())
  }
})

watch(() => props.modelValue, (value) => {
  const isSame = editor.value.getHTML() === value

  if (isSame) return 

  editor.value.commands.setContent(value, false)
})

const isActive = (action, attributes = {}) => {
  if (!editor.value) return false
  let name = action
  if (typeof action === 'string') {
    name = camelCase(action)
  }
  return editor.value.isActive(name, attributes)
}

const format = (action, attributes = {}) => {
  const focus = editor.value.chain().focus()
  if (['undo', 'redo'].includes(action)) {
    focus[action]().run()
  } else if (action.startsWith('set')) {
    focus[camelCase(action)](attributes).run()
  } else if (action.startsWith('unset')) {
    focus[camelCase(action)]().run()
  } else {
    focus['toggle' + pascalCase(action)](attributes).run()
  }
}

const can = (action) => {
  if (!editor.value) return true
  const focus = editor.value.can().chain().focus()
  if (['undo', 'redo'].includes(action)) {
    return focus[action]().run()
  }
  return focus['toggle' + pascalCase(action)]().run()
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
  <div v-if="editor" class="toolbar">
    <div class="menu-group">
      <button
        class="menu-item"
        :class="{ 
          active: editor.getAttributes('textStyle').spanClass?.includes('text-arabic')
        }"
        @click="format('spanClass', 'text-arabic')">
        <img src="../assets/icons/abjad_arabic_icon.svg" height="20" />
      </button>
    </div>
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
        :class="{ active: isActive({ textAlign: 'left' }) }"
        @click="format('set-text-align', 'left')">
        <material-icon name="format_align_left" size="20" />
      </button>
      <button
        class="menu-item"
        :class="{ active: isActive({ textAlign: 'center' }) }"
        @click="format('set-text-align', 'center')">
        <material-icon name="format_align_center" size="20" />
      </button>
      <button
        class="menu-item"
        :class="{ active: isActive({ textAlign: 'right' }) }"
        @click="format('set-text-align', 'right')">
        <material-icon name="format_align_right" size="20" />
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
        @click="format('undo')"
        :disabled="!can('undo')">
        <material-icon name="undo" size="20" />
      </button>
      <button
        class="menu-item"
        @click="format('redo')"
        :disabled="!can('redo')">
        <material-icon name="redo" size="20" />
      </button>
    </div>
  </div>
  <div class="editor-container">
    <editor-content 
      ref="editorRef"
      :editor="editor"
      spellcheck="false"
      class="editor-frame" />
    <footer>
      Dibuat dengan <b>Berbagi Catatan</b><br>
      s.id/berbagi-catatan
    </footer>
  </div>
</template>
