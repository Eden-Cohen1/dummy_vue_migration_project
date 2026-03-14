// Edge case: Multi-line template literals with ${this.xxx} across multiple lines,
// plus string values containing } characters that might confuse brace counters.
export default {
  data() {
    return {
      title: 'Report',
      author: 'System',
      cssTheme: 'default',
      headerContent: 'Project Management Tool'
    }
  },

  computed: {
    compiledTemplate() {
      // Multi-line template literal with this references across lines
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${this.title}</title>
          <style>
            .header { font-size: 24px; }
            .content { padding: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            ${this.headerContent}
          </div>
          <div class="content">
            <p>Author: ${this.author}</p>
          </div>
        </body>
        </html>
      `
    }
  },

  methods: {
    renderTemplate(data) {
      // Multi-line backtick string with this references
      const header = `
        <header>
          <h1>${this.title}</h1>
          <p>By ${this.author}</p>
        </header>
      `
      const body = `
        <main>
          <p>${data.content || 'No content'}</p>
        </main>
      `
      return header + body
    },

    generateCSS() {
      // String containing { } characters that are CSS, not JS
      return `
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: ${this.cssTheme === 'compact' ? '8px' : '16px'};
        }
        .card {
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        @media (max-width: 768px) {
          .container {
            padding: 8px;
          }
        }
      `
    },

    // A string with JSON-like content containing braces
    getJsonExample() {
      return '{ "name": "test", "nested": { "key": "value" } }'
    },

    buildMarkdownTable(rows) {
      const header = `| ${Object.keys(rows[0]).join(' | ')} |`
      const separator = `| ${Object.keys(rows[0]).map(() => '---').join(' | ')} |`
      const body = rows.map(row =>
        `| ${Object.values(row).join(' | ')} |`
      ).join('\n')
      return `${header}\n${separator}\n${body}`
    }
  }
}
