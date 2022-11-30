<script setup>
import { ref, computed } from 'vue'
import TipTap from './components/TipTap.vue'
import { toBlob } from 'html-to-image'
import { saveAs } from 'file-saver'

const content = ref('')

const saving = ref(false)
const btnExportText = computed(() => {
  return saving.value ? 'Loading...' : 'Simpan sebagai Gambar'
})

const save = () => {
  saving.value = true

  const el = document.querySelector('.editor-container')
  const attribution = document.querySelector('.editor-container footer')

  // Show attribution
  attribution.style.display = 'block'

  const filename = 'berbagi-catatan-' + new Date().getTime()
  const SCALE = 2.5
  
  const canvasHeight = el.offsetHeight * SCALE
  const canvasWidth = el.offsetWidth * SCALE

  toBlob(el, {
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight,
    style: {
      margin: 0,
    }
  }).then((blob) => {
    saveAs(blob, filename + '.png')
    saving.value = false
    
    // Hide attribution
    attribution.style.display = 'none'
  })
}
</script>

<template>
  <header>
    <material-icon name="sticky_note_2" size="50" />
    <h1>Berbagi Catatan</h1>
    <p>Powered by <a href="https://ngekoding.github.io" target="_blank">Ngekoding</a></p>
  </header>
  <tip-tap v-model="content" />
  <footer>
    <button
      class="btn-export"
      :class="{ loading: saving }"
      @click="save()">
      {{ btnExportText }}
    </button>
  </footer>
</template>

