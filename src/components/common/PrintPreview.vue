<template>
  <div class="print-preview" :class="themeClass">
    <div class="preview-toolbar">
      <h3 class="toolbar-title">Print Preview</h3>

      <div class="toolbar-controls">
        <!-- Print Mode Toggle -->
        <label class="toggle-label">
          <input type="checkbox" v-model="printMode" />
          <span>Print Mode</span>
        </label>

        <!-- Orientation Selector -->
        <select v-model="orientation" class="orientation-select">
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>

        <!-- Theme Selector -->
        <select v-model="printTheme" class="theme-select" @change="setTheme(printTheme)">
          <option value="default">Default Theme</option>
          <option value="minimal">Minimal</option>
          <option value="high-contrast">High Contrast</option>
        </select>
      </div>

      <!-- Print Button -->
      <button class="btn-print" @click="printDocument">
        <span class="print-icon">&#128424;</span> Print
      </button>
    </div>

    <!-- Preview Frame -->
    <div :class="['preview-frame', orientation, { 'print-mode': printMode }]">
      <div class="preview-page">
        <slot>
          <div class="placeholder-content">
            <p class="placeholder-title">Document Preview</p>
            <p class="placeholder-text">Your content will appear here in print layout.</p>
            <div class="placeholder-lines">
              <div v-for="n in 6" :key="n" class="placeholder-line" :style="{ width: (70 + Math.random() * 30) + '%' }"></div>
            </div>
          </div>
        </slot>
      </div>
    </div>

    <div class="preview-footer">
      <span class="page-info">Page 1 of 1</span>
      <span class="orientation-info">{{ orientation }} | {{ isDarkMode ? 'Dark' : 'Light' }}</span>
    </div>
  </div>
</template>

<script>
import printMixin from '@/mixins/printMixin'
import themeMixin from '@/mixins/themeMixin'

export default {
  name: 'PrintPreview',

  mixins: [printMixin, themeMixin],

  data() {
    return {
      printMode: false,
      orientation: 'portrait',
      printTheme: 'default'
    }
  },

  methods: {
    printDocument() {
      if (this.print) {
        this.print()
      } else {
        window.print()
      }
    }
  }
}
</script>

<style scoped>
.print-preview { padding: 1rem; }
.preview-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem;
  padding: 0.75rem; background: #f9fafb; border-radius: 8px;
}
.toolbar-title { font-size: 1rem; font-weight: 600; margin: 0; }
.toolbar-controls { display: flex; align-items: center; gap: 0.75rem; }
.toggle-label { display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; cursor: pointer; }
.orientation-select, .theme-select {
  padding: 0.35rem 0.5rem; border: 1px solid #d1d5db;
  border-radius: 6px; font-size: 0.8rem;
}
.btn-print {
  padding: 0.5rem 1rem; background: #3b82f6; color: white;
  border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem;
}
.preview-frame {
  border: 1px solid #d1d5db; border-radius: 4px; background: white;
  margin-bottom: 0.75rem; overflow: hidden;
}
.preview-frame.portrait { max-width: 595px; min-height: 400px; margin-left: auto; margin-right: auto; }
.preview-frame.landscape { max-width: 842px; min-height: 300px; }
.preview-frame.print-mode { box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.preview-page { padding: 2rem; }
.placeholder-content { text-align: center; color: #9ca3af; }
.placeholder-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
.placeholder-text { font-size: 0.875rem; margin-bottom: 1rem; }
.placeholder-lines { max-width: 400px; margin: 0 auto; }
.placeholder-line { height: 8px; background: #f3f4f6; border-radius: 4px; margin-bottom: 0.5rem; }
.preview-footer {
  display: flex; justify-content: space-between;
  font-size: 0.75rem; color: #9ca3af;
}
</style>
