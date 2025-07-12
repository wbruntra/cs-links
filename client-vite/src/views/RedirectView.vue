<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const originalUrl = ref('')
const pageLink = ref('')
const directLink = ref('')
const isLoading = ref(true)
const error = ref('')

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

const copyPageStatus = ref('Share Link')
const copyDirectStatus = ref('Share Link')

onMounted(async () => {
  const code = route.params.code
  
  try {
    const response = await fetch(`${API_BASE}/k/${code}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        error.value = 'Link not found'
      } else {
        error.value = 'Error loading link'
      }
      return
    }
    
    // Now we get JSON response instead of HTML
    const data = await response.json()
    
    originalUrl.value = data.originalUrl
    pageLink.value = data.pageLink
    directLink.value = data.directLink
    
  } catch (err) {
    error.value = 'Failed to load link'
  } finally {
    isLoading.value = false
  }
})

async function copyToClipboard(text, buttonType) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      showCopySuccess(buttonType)
    } else {
      // Fallback for non-secure contexts
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      
      const successful = document.execCommand('copy')
      document.body.removeChild(textarea)
      
      if (successful) {
        showCopySuccess(buttonType)
      } else {
        showCopyError(buttonType)
      }
    }
  } catch (error) {
    console.error('Copy failed:', error)
    showCopyError(buttonType)
  }
}

function showCopySuccess(buttonType) {
  if (buttonType === 'page') {
    copyPageStatus.value = 'Copied!'
    setTimeout(() => {
      copyPageStatus.value = 'Share Link'
    }, 2000)
  } else {
    copyDirectStatus.value = 'Copied!'
    setTimeout(() => {
      copyDirectStatus.value = 'Share Link'
    }, 2000)
  }
}

function showCopyError(buttonType) {
  if (buttonType === 'page') {
    copyPageStatus.value = 'Copy Failed'
    setTimeout(() => {
      copyPageStatus.value = 'Share Link'
    }, 2000)
  } else {
    copyDirectStatus.value = 'Copy Failed'
    setTimeout(() => {
      copyDirectStatus.value = 'Share Link'
    }, 2000)
  }
}
</script>

<template>
  <div>
    <div v-if="isLoading">
      <h1>Loading...</h1>
    </div>
    
    <div v-else-if="error">
      <h1>Error</h1>
      <p class="error">{{ error }}</p>
    </div>
    
    <div v-else>
      <h1>Link</h1>
      
      <div class="link-section">
        <p>Here is the link:</p>
        <p>
          <a :href="originalUrl" target="_blank" rel="noopener noreferrer">{{ originalUrl }}</a>
        </p>
        <p>
          <a :href="originalUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            Go!
          </a>
        </p>
      </div>

      <hr style="margin: 30px 0;">

      <div class="copy-section">
        <p><strong>Copy link for sharing:</strong></p>
        <div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">
          <input 
            type="text" 
            :value="pageLink" 
            readonly 
            style="flex: 1; background-color: #f8f9fa;"
          />
          <button 
            @click="copyToClipboard(pageLink, 'page')"
            :class="[
              'btn',
              copyPageStatus === 'Copied!' ? 'btn-success' : 
              copyPageStatus === 'Copy Failed' ? 'btn-error' : 'btn-secondary'
            ]"
          >
            {{ copyPageStatus }}
          </button>
        </div>
      </div>

      <div class="copy-section">
        <p><strong>Copy link but skip this page:</strong></p>
        <div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">
          <input 
            type="text" 
            :value="directLink" 
            readonly 
            style="flex: 1; background-color: #f8f9fa;"
          />
          <button 
            @click="copyToClipboard(directLink, 'direct')"
            :class="[
              'btn',
              copyDirectStatus === 'Copied!' ? 'btn-success' : 
              copyDirectStatus === 'Copy Failed' ? 'btn-error' : 'btn-secondary'
            ]"
          >
            {{ copyDirectStatus }}
          </button>
        </div>
      </div>

      <hr style="margin: 30px 0;">

      <div>
        <p><strong>Create another link:</strong></p>
        <router-link to="/" class="btn btn-primary">Create Another Link</router-link>
      </div>
    </div>
  </div>
</template>
