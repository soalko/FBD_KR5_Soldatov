<template>
  <div class="color-picker">
    <div class="color-input-group">
      <label>Базовый цвет</label>
      <div class="color-input-wrapper">
        <input
            type="color"
            v-model="colorValue"
            class="color-input"
            @input="handleColorChange"
        />
        <input
            type="text"
            v-model="colorText"
            class="color-text-input"
            @input="handleTextChange"
            @blur="validateColor"
            placeholder="#000000"
        />
        <button
            class="btn-icon random-color-btn"
            @click="emitRandom"
            title="Случайный цвет"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="color-preview" :style="{ backgroundColor: colorValue }">
      <span :style="{ color: contrastColor }">
        {{ colorName }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useColorUtils } from '../composables/useColorUtils'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue', 'random'])

const { getContrastColor, getColorName, isValidHex } = useColorUtils()
const colorText = ref(props.modelValue)

const colorValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const contrastColor = computed(() => getContrastColor(props.modelValue))
const colorName = computed(() => getColorName(props.modelValue))

const handleColorChange = (event) => {
  colorText.value = event.target.value
  emit('update:modelValue', event.target.value)
}

const handleTextChange = (event) => {
  const value = event.target.value
  if (value.startsWith('#') && isValidHex(value)) {
    emit('update:modelValue', value)
  }
}

const validateColor = () => {
  if (!isValidHex(colorText.value)) {
    colorText.value = props.modelValue
  }
}

const emitRandom = () => {
  emit('random')
}

watch(() => props.modelValue, (newVal) => {
  colorText.value = newVal
})
</script>

<style scoped>
.color-picker {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.color-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.color-input-group label {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.color-input-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.color-input {
  width: 50px;
  height: 40px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 6px;
}

.color-text-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875rem;
}

.color-text-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.random-color-btn {
  padding: 0.75rem;
  background-color: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
}

.random-color-btn:hover {
  background-color: var(--bg-primary);
  transform: rotate(90deg);
}

.color-preview {
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 2px solid var(--border-color);
  overflow: hidden;
}
</style>