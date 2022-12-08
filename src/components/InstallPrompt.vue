<script setup>
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import 'animate.css'

const defferedPrompt = ref(null)
const installPrompt = useStorage('add-to-home-screen', { expiry: 0 })

const showInstallPrompt = () => {
  return (
    !installPrompt.value ||
    (installPrompt.value && Date.now() > installPrompt.value.expiry)
  )
}

const install = () => {
  defferedPrompt.value?.prompt()
}

const dismiss = () => {
  defferedPrompt.value = null
  installPrompt.value = {
    expiry: Date.now() + (15 * 86400000) // Hide for 15 days
  }
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault()
  if (showInstallPrompt()) {
    defferedPrompt.value = e;
  }
})
</script>

<template>
  <Transition
    enter-active-class="animate__animated animate__fadeInUp"
    leave-active-class="animate__animated animate__fadeOutDown">
    <div v-if="defferedPrompt" class="install-prompt">
      <h3 class="prompt-title">Install Berbagi Catatan</h3>
      <p class="prompt-description">Anda dapat menginstall aplikasi ini seperti aplikasi lain pada umumnya, sehingga lebih mudah untuk digunakan.</p>
      <div class="actions">
        <button class="btn-dismiss" @click="dismiss()">Tutup</button>
        <button class="btn-install" @click="install()">Install</button>
      </div>
    </div>
  </Transition>
</template>