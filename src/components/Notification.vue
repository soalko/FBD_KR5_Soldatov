<template>
  <div class="notification" :class="type">
    <span>{{ message }}</span>
  </div>
</template>

<script setup>
defineProps({
  message: String,
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'error'].includes(value)
  }
})
</script>

<style scoped>
.notification {
  padding: 1rem 1.5rem;
  border-radius: var(--radius);
  background-color: var(--bg-secondary);
  border-left: 4px solid;
  box-shadow: var(--shadow);
  animation: slideIn 0.3s ease;
  max-width: 300px;
}

.notification.info {
  border-left-color: #3b82f6;
}

.notification.success {
  border-left-color: #10b981;
}

.notification.error {
  border-left-color: #ef4444;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>