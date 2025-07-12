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
  <div>
    <h1>Create Link</h1>
    
    <div class="form-container">
      <form @submit.prevent="createLink">
        <div class="form-group">
          <input 
            v-model="address"
            type="text" 
            placeholder="Enter your URL here" 
            required
            :disabled="isLoading"
          />
          <!-- Honeypot field - hidden from users but visible to bots -->
          <input type="text" name="website" class="hidden" />
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Creating...' : 'Get Link' }}
        </button>
      </form>
      
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>
