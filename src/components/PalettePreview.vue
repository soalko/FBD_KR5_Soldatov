<template>
  <div class="preview-mockup" :class="{ 'preview-dark': darkBackground }">
    <div class="preview-content">
      <div class="preview-header">
        <h3>Пример интерфейса</h3>
        <button class="btn btn-secondary" @click="toggleBackground">
          {{ darkBackground ? 'Светлый фон' : 'Темный фон' }}
        </button>
      </div>

      <div class="preview-components">
        <div class="preview-card" :style="{ backgroundColor: colors[0] }">
          <h4 :style="{ color: getContrastColor(colors[0]) }">Заголовок карточки</h4>
          <p :style="{ color: getContrastColor(colors[0]) }">Пример текста на цветном фоне</p>
          <button
              class="preview-btn"
              :style="{
              backgroundColor: colors[1],
              color: getContrastColor(colors[1])
            }"
          >
            Кнопка действия
          </button>
        </div>

        <div class="preview-ui">
          <div class="preview-nav" :style="{ backgroundColor: colors[2] }">
            <span :style="{ color: getContrastColor(colors[2]) }">Навигация</span>
          </div>
          <div class="preview-sidebar" :style="{ backgroundColor: colors[3] }">
            <div
                v-for="(item, index) in sidebarItems"
                :key="index"
                class="preview-sidebar-item"
                :style="{ color: getContrastColor(colors[3]) }"
            >
              {{ item }}
            </div>
          </div>
          <div class="preview-main">
            <h4 :style="{ color: colors[4] }">Основной контент</h4>
            <p :style="{ color: colors[4] }">Текст в основном разделе</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useColorUtils } from '../composables/useColorUtils'

const props = defineProps({
  colors: {
    type: Array,
    default: () => []
  }
})

const { getContrastColor } = useColorUtils()
const darkBackground = ref(false)

const toggleBackground = () => {
  darkBackground.value = !darkBackground.value
}

const sidebarItems = ['Главная', 'Проекты', 'Настройки', 'Помощь']
</script>

<style scoped>
.preview-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.preview-components {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr 2fr;
}

.preview-card {
  padding: 1.5rem;
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-card h4 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.preview-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
  transition: var(--transition);
}

.preview-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.preview-ui {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 60px 1fr;
  gap: 1px;
  background-color: var(--border-color);
  border-radius: var(--radius);
  overflow: hidden;
}

.preview-nav {
  grid-column: 1 / -1;
  padding: 1rem;
  display: flex;
  align-items: center;
}

.preview-sidebar {
  padding: 1rem;
  min-height: 200px;
}

.preview-sidebar-item {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition);
}

.preview-sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.preview-main {
  padding: 1.5rem;
  background-color: var(--bg-secondary);
}

@media (max-width: 768px) {
  .preview-components {
    grid-template-columns: 1fr;
  }
}
</style>