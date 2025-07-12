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
    
    // Add haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(50)
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
  <div class="row justify-content-center">
    <div class="col-md-10 col-lg-8">
      <div class="card fade-in-up">
        <div class="card-body">
          <!-- Success Header -->
          <div class="text-center mb-4">
            <div class="success-icon mb-3">
              <i class="bi bi-check-circle-fill" style="font-size: 4rem; color: #28a745;"></i>
            </div>
            <h1 class="card-title text-success mb-2" style="font-weight: 700;">
              Link Created Successfully!
            </h1>
            <p class="text-muted">Your shortened link is ready to share</p>
          </div>
          
          <!-- Original URL Section -->
          <div class="glass-effect p-4 rounded mb-4">
            <div class="d-flex align-items-center mb-3">
              <i class="bi bi-globe2 me-2 text-primary" style="font-size: 1.2rem;"></i>
              <h5 class="mb-0 text-primary">Original URL</h5>
            </div>
            <p class="mb-3 text-break">
              <a :href="originalUrl" target="_blank" rel="noopener noreferrer" class="text-decoration-none fw-medium">
                {{ originalUrl }}
              </a>
            </p>
            <a :href="originalUrl" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary btn-sm">
              <i class="bi bi-box-arrow-up-right me-1"></i>
              Visit Original Link
            </a>
          </div>

          <!-- Share Link Section -->
          <div class="mb-4">
            <div class="d-flex align-items-center mb-3">
              <i class="bi bi-share me-2" style="color: #667eea; font-size: 1.2rem;"></i>
              <h5 class="mb-0" style="color: #667eea;">Share Link</h5>
              <span class="badge bg-light text-dark ms-2">With Preview</span>
            </div>
            <p class="text-muted small mb-3">
              <i class="bi bi-info-circle me-1"></i>
              Recipients will see a preview page before being redirected
            </p>
            <div class="input-group shadow-sm">
              <input 
                type="text" 
                :value="pageLink" 
                readonly 
                class="form-control bg-light"
                style="font-family: 'Courier New', monospace;"
              />
              <button 
                @click="copyToClipboard(pageLink, 'page')"
                :class="[
                  'btn btn-copy',
                  copyPageStatus === 'Copied!' ? 'btn-success' : 
                  copyPageStatus === 'Copy Failed' ? 'btn-danger' : 'btn-outline-secondary'
                ]"
                type="button"
              >
                <i v-if="copyPageStatus === 'Copied!'" class="bi bi-check2 me-1"></i>
                <i v-else-if="copyPageStatus === 'Copy Failed'" class="bi bi-x-lg me-1"></i>
                <i v-else class="bi bi-clipboard me-1"></i>
                {{ copyPageStatus }}
              </button>
            </div>
          </div>

          <!-- Direct Link Section -->
          <div class="mb-4">
            <div class="d-flex align-items-center mb-3">
              <i class="bi bi-lightning-charge me-2" style="color: #f093fb; font-size: 1.2rem;"></i>
              <h5 class="mb-0" style="color: #f093fb;">Direct Link</h5>
              <span class="badge bg-light text-dark ms-2">Instant Redirect</span>
            </div>
            <p class="text-muted small mb-3">
              <i class="bi bi-info-circle me-1"></i>
              Goes directly to your URL without any preview page
            </p>
            <div class="input-group shadow-sm">
              <input 
                type="text" 
                :value="directLink" 
                readonly 
                class="form-control bg-light"
                style="font-family: 'Courier New', monospace;"
              />
              <button 
                @click="copyToClipboard(directLink, 'direct')"
                :class="[
                  'btn btn-copy',
                  copyDirectStatus === 'Copied!' ? 'btn-success' : 
                  copyDirectStatus === 'Copy Failed' ? 'btn-danger' : 'btn-outline-secondary'
                ]"
                type="button"
              >
                <i v-if="copyDirectStatus === 'Copied!'" class="bi bi-check2 me-1"></i>
                <i v-else-if="copyDirectStatus === 'Copy Failed'" class="bi bi-x-lg me-1"></i>
                <i v-else class="bi bi-clipboard me-1"></i>
                {{ copyDirectStatus }}
              </button>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="glass-effect p-4 rounded">
            <div class="row g-3">
              <div class="col-sm-6">
                <button @click="createAnotherLink" class="btn btn-primary w-100">
                  <i class="bi bi-plus-circle me-2"></i>
                  Create Another Link
                </button>
              </div>
              <div class="col-sm-6">
                <button class="btn btn-outline-secondary w-100" @click="copyToClipboard(pageLink, 'page')">
                  <i class="bi bi-share me-2"></i>
                  Quick Share
                </button>
              </div>
            </div>
            
            <div class="text-center mt-3 pt-3 border-top">
              <small class="text-muted">
                <i class="bi bi-clock me-1"></i>
                Links never expire • 
                <i class="bi bi-graph-up ms-2 me-1"></i>
                Track clicks and analytics
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
