<template>
  <div class="w-full border rounded-lg shadow-sm overflow-hidden bg-white">
    <!-- Toolbar -->
    <div class="flex items-center gap-1 p-2 border-b bg-gray-50">
      <button
        @click="insertFormatting('bold')"
        :class="[
          'p-2 rounded text-sm font-bold transition-colors',
          isBold ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
        ]"
        title="Bold"
      >
        B
      </button>
      <button
        @click="insertFormatting('italic')"
        :class="[
          'p-2 rounded text-sm italic transition-colors',
          isItalic ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
        ]"
        title="Italic"
      >
        I
      </button>
      <button
        @click="insertFormatting('underline')"
        class="p-2 rounded text-sm underline text-gray-600 hover:bg-gray-200 transition-colors"
        title="Underline"
      >
        U
      </button>

      <div class="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        @click="insertFormatting('heading')"
        class="p-2 rounded text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors"
        title="Heading"
      >
        H1
      </button>
      <button
        @click="insertFormatting('link')"
        class="p-2 rounded text-gray-600 hover:bg-gray-200 transition-colors"
        title="Link"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </button>
      <button
        @click="insertFormatting('list')"
        class="p-2 rounded text-gray-600 hover:bg-gray-200 transition-colors"
        title="Bullet List"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </button>

      <div class="w-px h-6 bg-gray-300 mx-1"></div>

      <!-- Undo/Redo from undoRedoMixin -->
      <button
        @click="undoContent"
        :disabled="!canUndo"
        class="p-2 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Undo"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </button>
      <button
        @click="redoContent"
        :disabled="!canRedo"
        class="p-2 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Redo"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
        </svg>
      </button>

      <!-- Dirty indicator from formMixin -->
      <div class="ml-auto flex items-center gap-2">
        <span v-if="isDirty" class="text-xs text-amber-500 font-medium">Unsaved</span>
        <span v-if="historyLength > 0" class="text-xs text-gray-400">{{ historyLength }} change(s)</span>
      </div>
    </div>

    <!-- Editor area -->
    <textarea
      ref="editorTextarea"
      v-model="content"
      class="w-full min-h-[200px] p-4 text-sm text-gray-800 leading-relaxed resize-y focus:outline-none"
      placeholder="Start typing here..."
    ></textarea>

    <!-- Character count footer -->
    <div class="flex items-center justify-between px-4 py-2 border-t bg-gray-50 text-xs text-gray-400">
      <span>{{ content.length }} characters</span>
      <span v-if="!isFormValid" class="text-red-400">Validation errors present</span>
    </div>
  </div>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import undoRedoMixin from '@/mixins/undoRedoMixin'

export default {
  name: 'RichTextEditor',

  mixins: [formMixin, undoRedoMixin],

  data() {
    return {
      content: '',
      isBold: false,
      isItalic: false
    }
  },

  emits: ['form-submitted', 'state-changed'],

  methods: {
    insertFormatting(type) {
      const textarea = this.$refs.editorTextarea
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = this.content.substring(start, end)

      let before = ''
      let after = ''

      switch (type) {
        case 'bold':
          before = '**'
          after = '**'
          this.isBold = !this.isBold
          break
        case 'italic':
          before = '_'
          after = '_'
          this.isItalic = !this.isItalic
          break
        case 'underline':
          before = '<u>'
          after = '</u>'
          break
        case 'heading':
          before = '# '
          after = ''
          break
        case 'link':
          before = '['
          after = '](url)'
          break
        case 'list':
          before = '- '
          after = ''
          break
      }

      const newContent =
        this.content.substring(0, start) +
        before +
        (selectedText || 'text') +
        after +
        this.content.substring(end)

      this.pushState(this.content)
      this.content = newContent
      this.isDirty = true
      this.formData = { content: this.content }

      this.$nextTick(() => {
        textarea.focus()
        const cursorPos = start + before.length + (selectedText || 'text').length + after.length
        textarea.setSelectionRange(cursorPos, cursorPos)
      })
    },

    getContent() {
      return this.content
    },

    undoContent() {
      const previousState = this.undo()
      if (previousState !== null) {
        this.content = previousState
        this.formData = { content: this.content }
      }
    },

    redoContent() {
      const nextState = this.redo()
      if (nextState !== null) {
        this.content = nextState
        this.formData = { content: this.content }
      }
    }
  },

  mounted() {
    this.$watch('content', (newVal, oldVal) => {
      if (newVal !== oldVal) {
        this.isDirty = true
        this.formData = { content: newVal }
      }
    })
  }
}
</script>
