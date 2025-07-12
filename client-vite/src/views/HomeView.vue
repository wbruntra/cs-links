<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const address = ref('')
const isLoading = ref(false)
const error = ref('')

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

async function createLink() {
  if (!address.value) {
    error.value = 'Please enter a URL'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await fetch(`${API_BASE}/cli`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address: address.value }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Unknown error')
    }

    const data = await response.json()
    
    // Navigate to the link display page
    router.push({
      name: 'link',
      params: { code: data.direct_link.split('/').pop() },
      query: { 
        originalUrl: address.value,
        pageLink: data.page_link,
        directLink: data.direct_link
      }
    })
  } catch (err) {
    error.value = err.message || 'Failed to create link'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-8 col-lg-6">
      <div class="card fade-in-up">
        <div class="card-body text-center">
          <div class="mb-4">
            <i class="bi bi-link-45deg" style="font-size: 3rem; background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"></i>
          </div>
          
          <h1 class="card-title mb-2" style="background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 700;">
            Create Short Link
          </h1>
          <p class="text-muted mb-4">Transform your long URLs into clean, shareable links</p>
          
          <form @submit.prevent="createLink">
            <div class="mb-3 text-start">
              <label for="address" class="form-label">
                <i class="bi bi-globe me-2"></i>
                Enter your URL
              </label>
              <input 
                id="address"
                v-model="address"
                type="url" 
                class="form-control"
                placeholder="https://example.com" 
                required
                :disabled="isLoading"
              />
              <!-- Honeypot field - hidden from users but visible to bots -->
              <input type="text" name="website" class="visually-hidden" />
            </div>
            
            <div class="d-grid">
              <button 
                type="submit" 
                class="btn btn-primary btn-lg"
                :disabled="isLoading"
                :class="{ 'pulse': isLoading }"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <i v-else class="bi bi-scissors me-2"></i>
                {{ isLoading ? 'Creating your link...' : 'Shorten URL' }}
              </button>
            </div>
          </form>
          
          <div v-if="error" class="alert alert-danger mt-3 fade-in-up" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
          </div>
          
          <div class="mt-4 pt-3 border-top">
            <small class="text-muted">
              <i class="bi bi-shield-check me-1"></i>
              Your links are secure and trackable
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
