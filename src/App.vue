<script setup>
import { ref, computed } from 'vue'
import { toBlob } from 'html-to-image'
import { saveAs } from 'file-saver'
import { useStorage } from '@vueuse/core'
import TipTap from './components/TipTap.vue'
import UAParser from 'ua-parser-js'

const content = useStorage('berbagi-catatan-content', '')

const saving = ref(false)
const btnExportText = computed(() => {
  return saving.value ? 'Loading...' : 'Simpan sebagai Gambar'
})

const save = async () => {
  saving.value = true

  const el = document.querySelector('.editor-container')
  const attribution = document.querySelector('.editor-container footer')

  // Show attribution
  attribution.style.display = 'block'

  const filename = 'berbagi-catatan-' + new Date().getTime()
  const SCALE = 2.5
  
  const canvasHeight = el.offsetHeight * SCALE
  const canvasWidth = el.offsetWidth * SCALE

  /**
   * We need to run it twice to get arabic font
   * Tested on iOS (Chrome & Safari) - WebKit engine
   */
  const ua = UAParser()

  if (ua.engine.name == 'WebKit') {
    await toBlob(el, {
      canvasWidth: canvasWidth,
      canvasHeight: canvasHeight,
      style: {
        margin: 0,
      }
    })
  }

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

const reset = () => {
  content.value = ''
}
</script>

<template>
  <header>
    <material-icon name="sticky_note_2" size="50" />
    <h1>Berbagi Catatan</h1>
    <p class="slogan">Cara lebih mudah untuk berbagi kebaikan</p>
  </header>
  <tip-tap v-model="content" />
  <footer>
    <button
      class="btn-export"
      :class="{ loading: saving }"
      @click="save()">
      {{ btnExportText }}
    </button>
    <button class="btn-reset" @click="reset()">
      <material-icon name="restart_alt" size="18" />
      <span>Bersihkan</span>
    </button>
  </footer>
</template>

