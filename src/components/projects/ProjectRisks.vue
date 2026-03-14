<!-- ProjectRisks.vue
  Mixins used:
  - tableMixin: Provides sortBy, sortDirection, handleSort for sortable risk table columns
  - filterMixin: Provides activeFilters, applyFilter, clearFilters for filtering risks
  - permissionMixin: Provides hasPermission, canEdit for gating the add-risk form
  This component implements a risk register with a sortable table of risks,
  filter controls for impact/likelihood/status, and a permission-gated form to add risks.
-->
<template>
  <div class="project-risks">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Risk Register</h3>
      <button
        v-if="canEdit"
        @click="showAddForm = !showAddForm"
        class="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        {{ showAddForm ? 'Cancel' : '+ Add Risk' }}
      </button>
    </div>

    <!-- Add risk form (permission-gated) -->
    <div v-if="showAddForm && canEdit" class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div class="grid grid-cols-2 gap-3 mb-3">
        <input v-model="newRisk.title" placeholder="Risk title" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        <select v-model="newRisk.impact" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="">Impact</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select v-model="newRisk.likelihood" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="">Likelihood</option>
          <option value="unlikely">Unlikely</option>
          <option value="possible">Possible</option>
          <option value="likely">Likely</option>
        </select>
        <select v-model="newRisk.status" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="open">Open</option>
          <option value="mitigated">Mitigated</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <textarea v-model="newRisk.description" rows="2" placeholder="Description & mitigation plan..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-3"></textarea>
      <button @click="addRisk" class="px-4 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">Save Risk</button>
    </div>

    <!-- Filter panel -->
    <div class="flex items-center space-x-3 mb-4">
      <select @change="applyFilter('impact', $event.target.value)" class="text-xs border border-gray-300 rounded px-2 py-1.5">
        <option value="">All Impacts</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
      <select @change="applyFilter('status', $event.target.value)" class="text-xs border border-gray-300 rounded px-2 py-1.5">
        <option value="">All Statuses</option>
        <option value="open">Open</option>
        <option value="mitigated">Mitigated</option>
        <option value="closed">Closed</option>
      </select>
      <button @click="clearFilters" class="text-xs text-indigo-600 hover:text-indigo-700">Clear</button>
    </div>

    <!-- Risk table -->
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-gray-200">
          <th class="pb-2 text-left text-xs font-medium text-gray-500 cursor-pointer" @click="handleSort('title')">
            Risk {{ sortBy === 'title' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}
          </th>
          <th class="pb-2 text-left text-xs font-medium text-gray-500 cursor-pointer" @click="handleSort('impact')">
            Impact {{ sortBy === 'impact' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}
          </th>
          <th class="pb-2 text-left text-xs font-medium text-gray-500 cursor-pointer" @click="handleSort('likelihood')">
            Likelihood {{ sortBy === 'likelihood' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}
          </th>
          <th class="pb-2 text-left text-xs font-medium text-gray-500 cursor-pointer" @click="handleSort('status')">
            Status {{ sortBy === 'status' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="risk in risks" :key="risk.id" class="border-b border-gray-100 hover:bg-gray-50">
          <td class="py-2.5 text-gray-900">{{ risk.title }}</td>
          <td class="py-2.5">
            <span class="text-xs px-2 py-0.5 rounded-full" :class="impactClass(risk.impact)">{{ risk.impact }}</span>
          </td>
          <td class="py-2.5 text-gray-600">{{ risk.likelihood }}</td>
          <td class="py-2.5">
            <span class="text-xs px-2 py-0.5 rounded-full" :class="statusClass(risk.status)">{{ risk.status }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="risks.length === 0" class="text-center py-8">
      <p class="text-sm text-gray-400">No risks registered</p>
    </div>
  </div>
</template>

<script>
import tableMixin from '@/mixins/tableMixin'
import filterMixin from '@/mixins/filterMixin'
import permissionMixin from '@/mixins/permissionMixin'

export default {
  name: 'ProjectRisks',

  mixins: [tableMixin, filterMixin, permissionMixin],

  props: {
    projectId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      risks: [],
      showAddForm: false,
      newRisk: { title: '', impact: '', likelihood: '', status: 'open', description: '' }
    }
  },

  methods: {
    addRisk() {
      if (!this.newRisk.title) return
      this.risks.push({ ...this.newRisk, id: Date.now() })
      this.newRisk = { title: '', impact: '', likelihood: '', status: 'open', description: '' }
      this.showAddForm = false
    },

    impactClass(impact) {
      const map = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-orange-100 text-orange-700', critical: 'bg-red-100 text-red-700' }
      return map[impact] || 'bg-gray-100 text-gray-700'
    },

    statusClass(status) {
      const map = { open: 'bg-red-100 text-red-700', mitigated: 'bg-blue-100 text-blue-700', closed: 'bg-gray-100 text-gray-600' }
      return map[status] || 'bg-gray-100 text-gray-700'
    }
  }
}
</script>

<style scoped>
.project-risks {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style>
