<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
      <p class="mt-1 text-sm text-gray-500">Manage your application preferences and configurations.</p>
    </div>

    <form ref="form" @submit.prevent="saveSettings">
      <div class="space-y-6">
        <!-- Appearance Section -->
        <div class="rounded-lg bg-white p-6 shadow">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">Appearance</h2>
          <div class="space-y-4">
            <!-- Theme -->
            <div>
              <label for="theme" class="block text-sm font-medium text-gray-700">Theme</label>
              <select
                id="theme"
                v-model="settings.theme"
                class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
              <p class="mt-1 text-sm text-gray-500">Choose the application color theme.</p>
            </div>
          </div>
        </div>

        <!-- General Section -->
        <div class="rounded-lg bg-white p-6 shadow">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">General</h2>
          <div class="space-y-4">
            <!-- Language -->
            <div>
              <label for="language" class="block text-sm font-medium text-gray-700">Language</label>
              <select
                id="language"
                v-model="settings.language"
                class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
              </select>
              <p class="mt-1 text-sm text-gray-500">Select your preferred language for the interface.</p>
            </div>

            <!-- Page Size -->
            <div>
              <label for="pageSize" class="block text-sm font-medium text-gray-700">Items per Page</label>
              <select
                id="pageSize"
                v-model="settings.pageSize"
                class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
              <p class="mt-1 text-sm text-gray-500">Number of items to display per page in list views.</p>
            </div>
          </div>
        </div>

        <!-- Notifications Section -->
        <div class="rounded-lg bg-white p-6 shadow">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">Notifications</h2>
          <div class="space-y-4">
            <!-- Email Notifications -->
            <div class="flex items-center justify-between">
              <div>
                <label for="emailNotifications" class="text-sm font-medium text-gray-700">Email Notifications</label>
                <p class="text-sm text-gray-500">Receive notifications via email for important updates.</p>
              </div>
              <button
                id="emailNotifications"
                type="button"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                :class="settings.notifications.email ? 'bg-indigo-600' : 'bg-gray-200'"
                role="switch"
                :aria-checked="settings.notifications.email"
                @click="settings.notifications.email = !settings.notifications.email"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="settings.notifications.email ? 'translate-x-5' : 'translate-x-0'"
                ></span>
              </button>
            </div>

            <!-- Push Notifications -->
            <div class="flex items-center justify-between">
              <div>
                <label for="pushNotifications" class="text-sm font-medium text-gray-700">Push Notifications</label>
                <p class="text-sm text-gray-500">Receive browser push notifications for real-time alerts.</p>
              </div>
              <button
                id="pushNotifications"
                type="button"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                :class="settings.notifications.push ? 'bg-indigo-600' : 'bg-gray-200'"
                role="switch"
                :aria-checked="settings.notifications.push"
                @click="settings.notifications.push = !settings.notifications.push"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="settings.notifications.push ? 'translate-x-5' : 'translate-x-0'"
                ></span>
              </button>
            </div>

            <!-- Task Reminders -->
            <div class="flex items-center justify-between">
              <div>
                <label for="taskReminders" class="text-sm font-medium text-gray-700">Task Reminders</label>
                <p class="text-sm text-gray-500">Get reminders before task deadlines.</p>
              </div>
              <button
                id="taskReminders"
                type="button"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                :class="settings.notifications.taskReminders ? 'bg-indigo-600' : 'bg-gray-200'"
                role="switch"
                :aria-checked="settings.notifications.taskReminders"
                @click="settings.notifications.taskReminders = !settings.notifications.taskReminders"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="settings.notifications.taskReminders ? 'translate-x-5' : 'translate-x-0'"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end space-x-3">
          <button
            type="button"
            class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            @click="resetSettings"
          >
            Reset to Defaults
          </button>
          <button
            type="submit"
            class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save Settings
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'
import { useAuthStore } from '@/stores/auth'
import formMixin from '@/mixins/formMixin'
import validationMixin from '@/mixins/validationMixin'
import themeMixin from '@/mixins/themeMixin'

export default {
  name: 'SettingsView',

  mixins: [formMixin, validationMixin, themeMixin],

  data() {
    return {
      settings: {
        theme: 'light',
        language: 'en',
        pageSize: 25,
        notifications: {
          email: true,
          push: false,
          taskReminders: true
        }
      }
    }
  },

  created() {
    this.loadSettings()
  },

  methods: {
    loadSettings() {
      const settingsStore = useSettingsStore()
      if (settingsStore.settings) {
        this.settings = { ...this.settings, ...settingsStore.settings }
      }
    },

    async saveSettings() {
      try {
        const settingsStore = useSettingsStore()
        await settingsStore.updateSettings(this.settings)
      } catch (error) {
        console.error('Failed to save settings:', error)
      }
    },

    resetSettings() {
      this.settings = {
        theme: 'light',
        language: 'en',
        pageSize: 25,
        notifications: {
          email: true,
          push: false,
          taskReminders: true
        }
      }
    }
  }
}
</script>
