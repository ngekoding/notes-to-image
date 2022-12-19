<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { toBlob } from 'html-to-image'
import { saveAs } from 'file-saver'
import { useStorage, useShare, useElementBounding } from '@vueuse/core'
import TipTap from './components/TipTap.vue'
import InstallPrompt from './components/InstallPrompt.vue'
import PreviewLoader from 'vue-spinner/src/BeatLoader.vue'
import UAParser from 'ua-parser-js'
import scrollLock from 'scroll-lock'

const content = useStorage('berbagi-catatan-content', '')

const previewResultRef = ref(null)
const { top: previewResultTop } = useElementBounding(previewResultRef)

const previewLoadingStyle = computed(() => {
  return {
    top: previewResultTop.value + 'px'
  }
})

const previews = ref([])
const blobPreviews = ref([])
const filename = ref('berbagi-catatan')

const frameCornerContainer = ref(null)

const sortedBlobPreviews = computed(() => {
  return [...blobPreviews.value].sort((a, b) => a.index - b.index)
})

onMounted(() => {
  frameCornerContainer.value = document.querySelector('.frame-corner-container').outerHTML
})

const buildBlob = async (el) => {
  return await toBlob(el, {
    pixelRatio: 2.5,
    style: {
      margin: 0,
    }
  })
}

const buildPreviews = async () => {
  const el = document.querySelector('.editor-container .ProseMirror')

  const str = el.innerHTML
  const elements = str.split(/<hr\s+[^>]*>/g)

  previews.value = elements

  // Go to top
  window.scrollTo(0, 0)

  await nextTick()
  
  // Disable page scroll
  scrollLock.disablePageScroll()
  
  /**
   * For easy download and share
   * We directly generate and store the blob file
   */
  blobPreviews.value = [] // Reset
  for (let index = 0; index < previews.value.length; index++) {
    const previewSelector = `.preview-result-item-${index}`
    const attribution = document.querySelector(`${previewSelector} footer`)

    // Show attribution
    attribution.style.display = 'block'

    const el = document.querySelector(previewSelector)

    /**
     * We need to run it twice to get arabic font
     * Tested on iOS (Chrome & Safari) - WebKit engine
     */
    const ua = UAParser()

    if (ua.engine.name == 'WebKit') {
      buildBlob(el).then(() => {
        buildBlob(el).then(blob => {
          blobPreviews.value.push({
            index,
            blob
          })

          // Hide attribution
          attribution.style.display = 'none'

          // Enable page scroll when completed
          if (index == previews.value.length - 1) {
            scrollLock.enablePageScroll()
          }
        })
      })
    } else {
      buildBlob(el).then(blob => {
        blobPreviews.value.push({
          index,
          blob
        })

        // Hide attribution
        attribution.style.display = 'none'

        // Enable page scroll when completed
        if (index == previews.value.length - 1) {
          scrollLock.enablePageScroll()
        }
      })
    }
  }
}

const resetPreviews = () => {
  previews.value = []
  scrollLock.enablePageScroll()
}

const getFilename = (index) => {
  return (filename.value.length ? filename.value : 'berbagi-catatan') +
          (previews.value.length > 1 ? '-' + (index + 1) : '') +
          '.png'
}

const save = (index) => {
  const name = getFilename(index)
  const preview = blobPreviews.value.find(preview => preview.index == index)
  saveAs(preview.blob, name)
}

const reset = () => {
  content.value = ''
}

const { share, isSupported: isShareSupported } = useShare()

const createFile = (blob, name) => {
  return new File([blob], name, {
    type: blob.type,
    lastModified: new Date().getTime()
  })
}

// Share all when the index is undefined
const doShare = (index = undefined) => {
  const files = []

  if (index !== undefined) {
    const preview = blobPreviews.value.find(preview => preview.index == index)
    const file = createFile(preview.blob, getFilename(index))
    files.push(file)
  } else {
    sortedBlobPreviews.value.forEach(preview => {
      const file = createFile(preview.blob, getFilename(preview.index))
      files.push(file)
    })
  }

  share({ files })
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
  <div v-else class="preview" :class="{ 'with-share-all': previews.length > 1 }">
    <!-- Overlay loading -->
    <div 
      v-if="previews.length != blobPreviews.length"
      class="preview-loading"
      :style="previewLoadingStyle">
      <preview-loader color="#7D7268" />
      <p class="message">Menyiapkan pratinjau...</p>
    </div>
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
    <div ref="previewResultRef" class="preview-result">
      <div 
        v-for="(item, index) in previews"
        :key="('preview-' + index)"
        class="preview-result-item-container">
        <div :class="['preview-result-item', `preview-result-item-${index}`]">
          <div class="editor-frame">
            <div v-html="frameCornerContainer"></div>
            <div class="preview-item" :class="{ 'with-paging': previews.length > 1 }">
              <div v-html="item"></div>
            </div>
            <div v-if="previews.length > 1" class="preview-paging">
              Bagian {{ index + 1 }} dari {{ previews.length }}
            </div>
          </div>
          <footer>
            Dibuat dengan <b>Berbagi Catatan</b><br>
            s.id/berbagi-catatan
          </footer>
        </div>
        <div class="download-container">
          <div :class="{ 'btn-group': isShareSupported }">
            <button class="btn btn-sm" @click="save(index)">
              <material-icon name="download" size="16" />
              <span>Unduh</span>
            </button>
            <button v-if="isShareSupported" class="btn btn-sm" @click="doShare(index)">
              <material-icon name="share" size="16" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Share all -->
    <button 
      v-if="isShareSupported && previews.length > 1" 
      class="btn-share-all"
      @click="doShare()">
      <material-icon name="share" size="20" />
      <span>Bagikan Semua</span>
    </button>
  </div>
</template>
