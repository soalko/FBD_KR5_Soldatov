<template>
  <div class="palette-type-selector">
    <div class="section-header">
      <h3>Тип палитры</h3>
      <p>Выберите схему генерации цветов</p>
    </div>

    <div class="palette-types-grid">
      <div
          v-for="type in paletteTypes"
          :key="type.id"
          class="palette-type-card"
          :class="{ active: modelValue === type.id }"
          @click="selectType(type.id)"
      >
        <div class="palette-preview">
          <div
              v-for="(color, index) in type.previewColors"
              :key="index"
              class="preview-color"
              :style="{ backgroundColor: color }"
          ></div>
        </div>
        <div class="palette-info">
          <h4>{{ type.name }}</h4>
          <p>{{ type.description }}</p>
          <div class="palette-tags">
            <span class="tag" v-for="tag in type.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mood-selector">
      <div class="section-header">
        <h3>Настроение палитры</h3>
        <p>Настройте общее впечатление от цветов</p>
      </div>

      <div class="mood-buttons">
        <button
            v-for="moodOption in moodOptions"
            :key="moodOption.id"
            class="mood-btn"
            :class="{ active: moodValue === moodOption.id }"
            @click="selectMood(moodOption.id)"
        >
          <span class="mood-icon">{{ moodOption.icon }}</span>
          <span class="mood-name">{{ moodOption.name }}</span>
          <span class="mood-desc">{{ moodOption.description }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: String,
  moodValue: String
})

const emit = defineEmits(['update:modelValue', 'update:moodValue'])

const paletteTypes = [
  {
    id: 'analogous',
    name: 'Аналогичная',
    description: 'Соседние цвета в цветовом круге',
    tags: ['Гармоничная', 'Естественная'],
    previewColors: ['#3b82f6', '#60a5fa', '#93c5fd', '#38bdf8', '#0ea5e9']
  },
  {
    id: 'monochromatic',
    name: 'Монохромная',
    description: 'Оттенки одного цвета',
    tags: ['Сдержанная', 'Минимализм'],
    previewColors: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']
  },
  {
    id: 'triadic',
    name: 'Триада',
    description: 'Три равноудаленных цвета',
    tags: ['Контрастная', 'Энергичная'],
    previewColors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444']
  },
  {
    id: 'complementary',
    name: 'Комплементарная',
    description: 'Противоположные цвета',
    tags: ['Динамичная', 'Выразительная'],
    previewColors: ['#3b82f6', '#f97316', '#22c55e', '#8b5cf6', '#ec4899']
  },
  {
    id: 'splitComplementary',
    name: 'Раздельная комплементарная',
    description: 'Базовый цвет + два соседних к противоположному',
    tags: ['Сбалансированная', 'Интересная'],
    previewColors: ['#3b82f6', '#f59e0b', '#84cc16', '#06b6d4', '#8b5cf6']
  },
  {
    id: 'square',
    name: 'Квадратная',
    description: 'Четыре равноудаленных цвета',
    tags: ['Разнообразная', 'Богатая'],
    previewColors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1']
  },
  {
    id: 'compound',
    name: 'Составная',
    description: 'Комбинация различных схем',
    tags: ['Сложная', 'Уникальная'],
    previewColors: ['#3b82f6', '#ef4444', '#84cc16', '#8b5cf6', '#f59e0b']
  }
]

const moodOptions = [
  {
    id: 'balanced',
    name: 'Сбалансированная',
    description: 'Нейтральная гармония',
    icon: '⚖️'
  },
  {
    id: 'calm',
    name: 'Спокойная',
    description: 'Мягкие приглушенные тона',
    icon: '🌿'
  },
  {
    id: 'energetic',
    name: 'Энергичная',
    description: 'Яркие насыщенные цвета',
    icon: '⚡'
  },
  {
    id: 'professional',
    name: 'Профессиональная',
    description: 'Сдержанные деловые тона',
    icon: '💼'
  },
  {
    id: 'warm',
    name: 'Теплая',
    description: 'Теплые уютные оттенки',
    icon: '☀️'
  },
  {
    id: 'cool',
    name: 'Холодная',
    description: 'Холодные свежие тона',
    icon: '❄️'
  }
]

const selectType = (typeId) => {
  emit('update:modelValue', typeId)
}

const selectMood = (moodId) => {
  emit('update:moodValue', moodId)
}
</script>

<style scoped>
.palette-type-selector {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-header {
  margin-bottom: 1rem;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.section-header p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.palette-types-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.palette-type-card {
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  background-color: var(--bg-secondary);
}

.palette-type-card:hover {
  transform: translateY(-2px);
  border-color: var(--text-secondary);
  box-shadow: var(--shadow);
}

.palette-type-card.active {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
}

.palette-preview {
  display: flex;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
}

.preview-color {
  flex: 1;
}

.palette-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.palette-info p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.palette-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.25rem 0.5rem;
  background-color: var(--bg-primary);
  color: var(--text-secondary);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.mood-buttons {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.mood-btn {
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}

.mood-btn:hover {
  transform: translateY(-2px);
  border-color: var(--text-secondary);
}

.mood-btn.active {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
}

.mood-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.mood-name {
  font-weight: 600;
  font-size: 0.875rem;
}

.mood-desc {
  color: var(--text-secondary);
  font-size: 0.75rem;
  line-height: 1.3;
}

@media (max-width: 768px) {
  .palette-types-grid {
    grid-template-columns: 1fr;
  }

  .mood-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .mood-buttons {
    grid-template-columns: 1fr;
  }
}
</style>