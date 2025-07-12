<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const originalUrl = ref('')
const pageLink = ref('')
const directLink = ref('')
const code = ref('')

const copyPageStatus = ref('Share Link')
const copyDirectStatus = ref('Share Link')

onMounted(() => {
  code.value = route.params.code
  originalUrl.value = route.query.originalUrl
  pageLink.value = route.query.pageLink
  directLink.value = route.query.directLink
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

function createAnotherLink() {
  router.push('/')
}
</script>

<template>
  <div>
    <h1>Link Created!</h1>
    
    <div class="link-section">
      <p>Here is your original link:</p>
      <p>
        <a :href="originalUrl" target="_blank" rel="noopener noreferrer">{{ originalUrl }}</a>
      </p>
      <p>
        <a :href="originalUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          Go to Original Link
        </a>
      </p>
    </div>

    <hr style="margin: 30px 0;">

    <div class="copy-section">
      <p><strong>Copy link for sharing:</strong></p>
      <p>This link shows this page first, then redirects to your URL.</p>
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
      <p><strong>Copy direct link:</strong></p>
      <p>This link goes directly to your URL without showing this page.</p>
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
      <button @click="createAnotherLink" class="btn btn-primary">
        Create Another Link
      </button>
    </div>
  </div>
</template>
