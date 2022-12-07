<script setup>
import { ref } from 'vue'
import Cookies from 'js-cookie'
import 'animate.css'

const defferedPrompt = ref(null)

const install = () => {
  defferedPrompt.value?.prompt()
}

const dismiss = () => {
  Cookies.set('add-to-home-screen', null, { expires: 15 })
  defferedPrompt.value = null
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault()
  if (Cookies.get('add-to-home-screen') === undefined) {
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