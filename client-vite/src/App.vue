<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark mb-5">
      <div class="container">
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <div class="brand-icon me-2">
            <i class="bi bi-scissors"></i>
          </div>
          <span>CS Linker</span>
        </router-link>
        
        <div class="navbar-nav ms-auto">
          <span class="navbar-text small">
            <i class="bi bi-shield-check me-1"></i>
            Secure • Fast • Reliable
          </span>
        </div>
      </div>
    </nav>
    
    <div class="container-fluid px-3">
      <RouterView />
    </div>
    
    <!-- Floating background elements for visual interest -->
    <div class="floating-elements">
      <div class="floating-circle" style="top: 10%; left: 10%; animation-delay: 0s;"></div>
      <div class="floating-circle" style="top: 20%; right: 15%; animation-delay: 2s;"></div>
      <div class="floating-circle" style="bottom: 15%; left: 20%; animation-delay: 4s;"></div>
      <div class="floating-circle" style="bottom: 25%; right: 10%; animation-delay: 6s;"></div>
    </div>
  </div>
</template>

<style scoped>
.brand-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: var(--transition);
}

.navbar-brand:hover .brand-icon {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(180deg);
}

.floating-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.floating-circle {
  position: absolute;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 50%;
  animation: float 8s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.8;
  }
}

@media (max-width: 768px) {
  .navbar-text {
    display: none;
  }
  
  .floating-circle {
    width: 40px;
    height: 40px;
  }
}
</style>

