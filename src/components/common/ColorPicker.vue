<template>
  <div class="color-picker">
    <h3 class="picker-title">Color Picker</h3>

    <!-- Selected Color Preview -->
    <div class="selected-preview">
      <div class="color-swatch" :style="{ background: selectedColor }"></div>
      <input
        v-model="selectedColor"
        type="text"
        class="hex-input"
        placeholder="#000000"
        @input="onHexInput"
      />
    </div>

    <!-- Color Palette Grid -->
    <div class="palette-grid">
      <button
        v-for="color in paletteColors"
        :key="color"
        :class="['palette-cell', { selected: selectedColor === color }]"
        :style="{ background: color }"
        :title="color"
        @click="selectColor(color)"
      ></button>
    </div>

    <!-- Recent Colors -->
    <div v-if="recentColors.length > 0" class="recent-section">
      <span class="section-label">Recent</span>
      <div class="recent-row">
        <button
          v-for="(color, idx) in recentColors"
          :key="'recent-' + idx"
          class="recent-cell"
          :style="{ background: color }"
          :title="color"
          @click="selectColor(color)"
        ></button>
      </div>
    </div>

    <!-- Custom Color Input -->
    <div class="custom-input">
      <label class="section-label" for="customColor">Custom Color</label>
      <input
        id="customColor"
        type="color"
        v-model="customColorValue"
        class="native-picker"
        @change="selectColor(customColorValue)"
      />
    </div>
  </div>
</template>

<script>
import colorPickerMixin from '@/mixins/colorPickerMixin'

export default {
  name: 'ColorPicker',

  mixins: [colorPickerMixin],

  emits: ['color-change'],

  data() {
    return {
      selectedColor: '#3b82f6',
      customColorValue: '#3b82f6',
      recentColors: [],
      paletteColors: [
        '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
        '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
        '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
        '#f43f5e', '#000000', '#374151', '#6b7280', '#9ca3af',
        '#d1d5db', '#e5e7eb', '#f3f4f6', '#ffffff'
      ]
    }
  },

  methods: {
    selectColor(color) {
      this.selectedColor = color
      this.customColorValue = color
      if (!this.recentColors.includes(color)) {
        this.recentColors.unshift(color)
        if (this.recentColors.length > 8) this.recentColors.pop()
      }
      this.$emit('color-change', color)
    },

    onHexInput() {
      if (/^#[0-9a-fA-F]{6}$/.test(this.selectedColor)) {
        this.customColorValue = this.selectedColor
        this.$emit('color-change', this.selectedColor)
      }
    }
  }
}
</script>

<style scoped>
.color-picker { max-width: 320px; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; background: white; }
.picker-title { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem; }
.selected-preview { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
.color-swatch { width: 2.5rem; height: 2.5rem; border-radius: 6px; border: 2px solid #e5e7eb; }
.hex-input {
  flex: 1; padding: 0.4rem 0.5rem; border: 1px solid #d1d5db;
  border-radius: 6px; font-size: 0.875rem; font-family: monospace;
}
.palette-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; margin-bottom: 1rem; }
.palette-cell {
  width: 100%; aspect-ratio: 1; border: 2px solid transparent;
  border-radius: 4px; cursor: pointer;
}
.palette-cell.selected { border-color: #1d4ed8; box-shadow: 0 0 0 2px rgba(59,130,246,0.3); }
.recent-section { margin-bottom: 1rem; }
.section-label { font-size: 0.75rem; color: #6b7280; display: block; margin-bottom: 0.25rem; }
.recent-row { display: flex; gap: 4px; }
.recent-cell {
  width: 1.5rem; height: 1.5rem; border: 1px solid #d1d5db;
  border-radius: 4px; cursor: pointer;
}
.custom-input { display: flex; align-items: center; gap: 0.5rem; }
.native-picker { width: 2rem; height: 2rem; border: none; cursor: pointer; }
</style>
