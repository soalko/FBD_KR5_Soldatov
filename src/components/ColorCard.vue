<template>
  <div
      class="color-card"
      :style="{ backgroundColor: colorValue }"
      @click="copyToClipboard"
      @contextmenu.prevent="togglePin"
  >
    <div class="color-header">
      <span class="color-index">#{{ index + 1 }}</span>
      <button
          class="btn-icon"
          :style="{
          backgroundColor: contrastColor,
          color: colorValue
        }"
          @click.stop="togglePin"
          :title="isPinned ? 'Открепить цвет' : 'Закрепить цвет'"
      >
        <svg v-if="isPinned" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707l-2.475 2.475a.5.5 0 0 1-.707 0L9.485 4.929 4.929 9.485l-2.475 2.475a.5.5 0 0 1-.707 0L.146 10.172a.5.5 0 0 1 0-.707L4.929 4.93 1.575 1.575a.5.5 0 0 1 0-.707L4.05.146a.5.5 0 0 1 .707 0L9.485 3.5 13.828.146a.5.5 0 0 1 .354-.146z"/>
        </svg>
        <svg v-else width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"/>
        </svg>
      </button>
    </div>

    <div class="color-info" :style="{ color: contrastColor }">
      <div class="color-format">{{ formattedColor }}</div>
      <div class="color-actions">
        <button
            class="btn-icon edit-btn"
            :style="{
            backgroundColor: contrastColor,
            color: colorValue
          }"
            @click.stop="openColorPicker"
            title="Изменить цвет"
        >
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="color-suggestions" v-if="showSuggestions">
      <div
          v-for="suggestion in colorSuggestions"
          :key="suggestion"
          class="suggestion"
          :style="{ backgroundColor: suggestion }"
          @click.stop="emitColorUpdate(suggestion)"
      ></div>
    </div>

    <div class="copied-indicator" v-if="showCopied">
      Скопировано!
    </div>

    <input
        v-if="isEditing"
        ref="colorInput"
        type="color"
        v-model="editColor"
        class="color-edit-input"
        @change="saveColorEdit"
        @blur="closeColorPicker"
    />
  </div>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'
import { useColorUtils } from '../composables/useColorUtils'

const props = defineProps({
  color: String,
  format: String,
  isPinned: Boolean,
  index: Number
})

const emit = defineEmits(['pin-toggle', 'color-updated'])

const { getContrastColor, formatColor, adjustHsl, rgbToHsl, hslToRgb, rgbToHex, hexToRgb } = useColorUtils()

const showCopied = ref(false)
const showSuggestions = ref(false)
const isEditing = ref(false)
const editColor = ref(props.color)
const colorInput = ref(null)

const colorValue = computed(() => props.color)
const contrastColor = computed(() => getContrastColor(props.color))
const formattedColor = computed(() => formatColor(props.color, props.format))

const colorSuggestions = computed(() => {
  const rgb = hexToRgb(props.color)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

  return [
    rgbToHex(...Object.values(hslToRgb(hsl.h, Math.min(100, hsl.s + 20), hsl.l))),
    rgbToHex(...Object.values(hslToRgb(hsl.h, Math.max(0, hsl.s - 20), hsl.l))),
    rgbToHex(...Object.values(hslToRgb(hsl.h, hsl.s, Math.min(100, hsl.l + 15)))),
    rgbToHex(...Object.values(hslToRgb(hsl.h, hsl.s, Math.max(0, hsl.l - 15))))
  ]
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(formattedColor.value)
    showCopied.value = true
    setTimeout(() => {
      showCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Ошибка копирования:', err)
  }
}

const togglePin = () => {
  emit('pin-toggle')
}

const openColorPicker = () => {
  isEditing.value = true
  nextTick(() => {
    colorInput.value?.click()
  })
}

const saveColorEdit = () => {
  emit('color-updated', props.index, editColor.value)
  closeColorPicker()
}

const closeColorPicker = () => {
  isEditing.value = false
}

const emitColorUpdate = (color) => {
  emit('color-updated', props.index, color)
  showSuggestions.value = false
}

const handleMouseEnter = () => {
  showSuggestions.value = true
}

const handleMouseLeave = () => {
  showSuggestions.value = false
}
</script>

<style scoped>
.color-card {
  height: 200px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
}

.color-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.3);
  border-color: white;
}

.color-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.color-index {
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.8;
}

.btn-icon {
  border: none;
  border-radius: 6px;
  padding: 0.375rem;
  cursor: pointer;
  transition: var(--transition);
  opacity: 0.9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  opacity: 1;
  transform: scale(1.1);
}

.color-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.color-format {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875rem;
  font-weight: 600;
  user-select: none;
}

.color-actions {
  display: flex;
  gap: 0.25rem;
}

.edit-btn {
  font-size: 0.75rem;
}

.color-suggestions {
  position: absolute;
  bottom: 4rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transform: translateY(10px);
  transition: var(--transition);
}

.color-card:hover .color-suggestions {
  opacity: 1;
  transform: translateY(0);
}

.suggestion {
  flex: 1;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: var(--transition);
}

.suggestion:hover {
  transform: scale(1.1);
}

.copied-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  z-index: 10;
  animation: fadeInOut 2s ease;
  box-shadow: var(--shadow);
}

.color-edit-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
  10%, 90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
</style>