import { defineStore } from 'pinia';

const SETTINGS_KEY = 'app-settings';
const THEME_KEY = 'app-theme';

function loadFromLocalStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: loadFromLocalStorage(SETTINGS_KEY, {
      pageSize: 10,
      language: 'en',
    }),
    theme: loadFromLocalStorage(THEME_KEY, 'light'),
    language: 'en',
  }),

  actions: {
    updateSettings(data) {
      this.settings = { ...this.settings, ...data };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    },

    resetSettings() {
      this.settings = { pageSize: 10, language: 'en' };
      this.theme = 'light';
      this.language = 'en';
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
      localStorage.setItem(THEME_KEY, JSON.stringify(this.theme));
    },

    setTheme(theme) {
      this.theme = theme;
      localStorage.setItem(THEME_KEY, JSON.stringify(this.theme));
    },
  },
});
