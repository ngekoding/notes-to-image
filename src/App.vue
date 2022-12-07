<script setup>
import { ref, onMounted } from 'vue'
import { toBlob } from 'html-to-image'
import { saveAs } from 'file-saver'
import { useStorage } from '@vueuse/core'
import TipTap from './components/TipTap.vue'
import InstallPrompt from './components/InstallPrompt.vue'
import UAParser from 'ua-parser-js'

const content = useStorage('berbagi-catatan-content', '')

const previews = ref([])
const filename = ref('berbagi-catatan')
const previewsSaving = ref([])

const frameCornerContainer = ref(null)

onMounted(() => {
  frameCornerContainer.value = document.querySelector('.frame-corner-container').outerHTML
})

const buildPreviews = () => {
  const el = document.querySelector('.editor-container .ProseMirror')

  const str = el.innerHTML
  const elements = str.split(/<hr\s+[^>]*>/g)

  previewsSaving.value = Array(elements.length).fill(false)
  previews.value = elements

  // Go to top
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const resetPreviews = () => {
  previews.value = []
}

const save = async (selector, index) => {
  previewsSaving.value[index] = true

  const previewSelector = `${selector}-${index}`
  const attribution = document.querySelector(`${previewSelector} footer`)

  // Show attribution
  attribution.style.display = 'block'

  const name = (filename.value.length ? filename.value : 'berbagi-catatan') +
                (previews.value.length > 1 ? '-' + (index + 1) : '')

  const SCALE = 2.5
  const el = document.querySelector(previewSelector)

  /**
   * We need to run it twice to get arabic font
   * Tested on iOS (Chrome & Safari) - WebKit engine
   */
  const ua = UAParser()

  if (ua.engine.name == 'WebKit') {
    await toBlob(el, {
      pixelRatio: SCALE,
      style: {
        margin: 0,
      }
    })
  }
  
  toBlob(el, {
    pixelRatio: SCALE,
    style: {
      margin: 0,
    }
  }).then((blob) => {
    saveAs(blob, name + '.png')
    previewsSaving.value[index] = false
    
    // Hide attribution
    attribution.style.display = 'none'
  })
}

const reset = () => {
  content.value = ''
}
</script>

<template>
  <!-- Install prompt -->
  <install-prompt />
  <header>
    <material-icon name="sticky_note_2" size="50" />
    <h1>Berbagi Catatan</h1>
    <p class="slogan">Cara lebih mudah untuk berbagi kebaikan</p>
  </header>
  <template v-if="(previews.length == 0)">
    <tip-tap v-model="content" />
    <footer>
      <button class="btn-export" @click="buildPreviews()">
        Generate Gambar
      </button>
      <button class="btn-reset" @click="reset()">
        <material-icon name="restart_alt" size="18" />
        <span>Bersihkan</span>
      </button>
    </footer>
  </template>
  <!-- Result preview -->
  <div v-else class="preview">
    <header class="preview-header">
      <div class="preview-header--title">
        <button class="btn-back" @click="resetPreviews()">
          <material-icon name="arrow_back" size="18" />
        </button>
        <h4 class="title">Pratinjau</h4>
      </div>
      <div class="preview-header--filename-wrap">
        <label>Nama File:</label>
        <input type="text" spellcheck="false" v-model="filename" />
      </div>
    </header>
    <div class="preview-result">
      <div 
        v-for="(item, index) in previews"
        :key="('preview-' + index)"
        class="preview-result-item-container">
        <div :class="['preview-result-item', `preview-result-item-${index}`]">
          <div class="editor-frame">
            <div v-html="frameCornerContainer"></div>
            <div class="preview-item">
              <div v-html="item"></div>
            </div>
          </div>
          <footer>
            Dibuat dengan <b>Berbagi Catatan</b><br>
            s.id/berbagi-catatan
          </footer>
        </div>
        <div class="download-container">
          <button 
            class="btn-download"
            :class="{ loading: previewsSaving[index] }"
            @click="save('.preview-result-item', index)">
            {{ previewsSaving[index] ? 'Loading...' : 'Unduh Gambar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
