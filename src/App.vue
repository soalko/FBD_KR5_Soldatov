<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <header class="header">
      <div class="header-title">
        <h1>🎨 Persik or Palitra?)</h1>
        <p>Крутые цвета эщкере</p>
      </div>

      <div class="controls">
        <div class="form-group">
          <label for="colorFormat">Формат</label>
          <select id="colorFormat" v-model="colorFormat" class="form-select">
            <option value="hex">HEX</option>
            <option value="rgb">RGB</option>
          </select>
        </div>

        <div class="form-switch">
          <label for="darkMode">Тёмная тема</label>
          <label class="switch">
            <input type="checkbox" id="darkMode" v-model="darkMode">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </header>

    <main class="grid">
      <div class="card">
        <div class="generator-settings">
          <div class="settings-grid">
            <div class="settings-section">
              <h3>Базовый цвет</h3>
              <ColorPicker
                  v-model="baseColor"
                  @random="setRandomBaseColor"
              />
            </div>

            <div class="settings-section">
              <h3>Настройки генерации</h3>
              <PaletteTypeSelector
                  v-model="paletteType"
                  v-model:moodValue="mood"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="palette-header">
          <h2>Цветовая палитра</h2>
          <div class="palette-actions">
            <button class="btn btn-secondary" @click="copyPalette">
              Копировать палитру
            </button>
            <button class="btn btn-secondary" @click="savePalette">
              Сохранить палитру
            </button>
          </div>
        </div>

        <div class="palette-container">
          <div class="palette-grid">
            <ColorCard
                v-for="(color, index) in palette"
                :key="index"
                :color="color"
                :format="colorFormat"
                :is-pinned="isColorPinned(index)"
                @pin-toggle="() => togglePinColor(color, index)"
            />
          </div>
        </div>

        <div class="pinned-colors" v-if="pinnedColors.length > 0">
          <h3>Закреплённые цвета</h3>
          <div class="pinned-grid">
            <div
                v-for="(pinned, index) in pinnedColors"
                :key="index"
                class="color-badge"
            >
              <div
                  class="color-swatch"
                  :style="{ backgroundColor: pinned.color }"
              ></div>
              <span>{{ formatColor(pinned.color, colorFormat) }}</span>
              <button
                  class="btn-icon"
                  @click="removePinnedColor(pinned.index)"
                  title="Удалить"
              >
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>
            </div>
          </div>
          <button class="btn btn-secondary" @click="clearPinnedColors" style="margin-top: 1rem;">
            Очистить все
          </button>
        </div>
      </div>

      <div class="card">
        <div class="preview-container">
          <div class="preview-header">
            <h2>Предпросмотр интерфейса</h2>
            <p>Посмотрите, как цвета работают вместе в реальном интерфейсе</p>
          </div>
          <PalettePreview :colors="palette.slice(0, 5)" />
        </div>
      </div>

      <div class="card" v-if="savedPalettes.length > 0">
        <div class="saved-palettes">
          <h3>Сохранённые палитры</h3>
          <div class="saved-grid">
            <div
                v-for="(savedPalette, index) in savedPalettes"
                :key="index"
                class="saved-palette-card"
                @click="loadPalette(savedPalette)"
            >
              <div class="saved-preview">
                <div
                    v-for="color in savedPalette.colors.slice(0, 5)"
                    :key="color"
                    class="saved-color"
                    :style="{ backgroundColor: color }"
                ></div>
              </div>
              <div class="saved-info">
                <h4>{{ savedPalette.name || `Палитра ${index + 1}` }}</h4>
                <p>{{ new Date(savedPalette.date).toLocaleDateString() }}</p>
              </div>
              <button
                  class="btn-icon delete-btn"
                  @click.stop="deletePalette(index)"
              >
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div class="notifications">
      <Notification
          v-for="notification in notifications"
          :key="notification.id"
          :message="notification.message"
          :type="notification.type"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ColorCard from './components/ColorCard.vue'
import PalettePreview from './components/PalettePreview.vue'
import Notification from './components/Notification.vue'
import ColorPicker from './components/ColorPicker.vue'
import PaletteTypeSelector from './components/PaletteTypeSelector.vue'
import { usePaletteGenerator } from './composables/usePaletteGenerator'
import { useColorUtils } from './composables/useColorUtils'
import { useLocalStorage } from './composables/useLocalStorage'

const {
  palette,
  pinnedColors,
  colorCount,
  colorFormat,
  baseColor,
  paletteType,
  mood,
  generatePalette,
  togglePinColor,
  isColorPinned,
  clearPinnedColors,
  setRandomBaseColor
} = usePaletteGenerator()

const { formatColor } = useColorUtils()

const darkMode = useLocalStorage('darkMode', false)
const savedPalettes = useLocalStorage('savedPalettes', [])
const notifications = ref([])

const removePinnedColor = (index) => {
  const pinnedIndex = pinnedColors.value.findIndex(p => p.index === index)
  if (pinnedIndex > -1) {
    pinnedColors.value.splice(pinnedIndex, 1)
    generatePalette()
    addNotification('Цвет удалён из закреплённых', 'info')
  }
}

const copyPalette = async () => {
  const paletteText = palette.value.map(color => formatColor(color, colorFormat.value)).join('\n')
  try {
    await navigator.clipboard.writeText(paletteText)
    addNotification('Палитра скопирована в буфер обмена!', 'success')
  } catch (err) {
    addNotification('Ошибка при копировании', 'error')
  }
}

const savePalette = () => {
  const paletteName = prompt('Введите название палитры:', `Палитра ${savedPalettes.value.length + 1}`)
  if (paletteName) {
    savedPalettes.value.push({
      name: paletteName,
      date: new Date().toISOString(),
      colors: [...palette.value],
      baseColor: baseColor.value,
      paletteType: paletteType.value,
      mood: mood.value
    })
    addNotification('Палитра сохранена!', 'success')
  }
}

const loadPalette = (savedPalette) => {
  palette.value = [...savedPalette.colors]
  baseColor.value = savedPalette.baseColor
  paletteType.value = savedPalette.paletteType
  mood.value = savedPalette.mood
  addNotification('Палитра загружена!', 'success')
}

const deletePalette = (index) => {
  if (confirm('Удалить эту палитру?')) {
    savedPalettes.value.splice(index, 1)
    addNotification('Палитра удалена', 'info')
  }
}

const addNotification = (message, type = 'info') => {
  const id = Date.now()
  notifications.value.push({ id, message, type })

  setTimeout(() => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }, 3000)
}

onMounted(() => {
  generatePalette()
})
</script>

<style scoped>
.settings-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr 2fr;
}

.settings-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.palette-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.palette-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
}

.palette-actions {
  display: flex;
  gap: 0.75rem;
}

.saved-palettes h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.saved-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.saved-palette-card {
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  background-color: var(--bg-secondary);
  position: relative;
}

.saved-palette-card:hover {
  transform: translateY(-2px);
  border-color: var(--text-secondary);
  box-shadow: var(--shadow);
}

.saved-preview {
  display: flex;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.75rem;
  border: 1px solid var(--border-color);
}

.saved-color {
  flex: 1;
}

.saved-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.saved-info p {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.delete-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.saved-palette-card:hover .delete-btn {
  opacity: 1;
}

@media (max-width: 1024px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .palette-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .palette-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>