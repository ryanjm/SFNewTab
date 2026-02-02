/**
 * Chrome storage wrapper for shortcuts data
 */
const Storage = {
  SHORTCUTS_KEY: 'shortcuts',
  MAP_TYPE_KEY: 'mapType',
  MODE_KEY: 'mode',
  THEME_KEY: 'theme',
  QUIZ_HISTORY_KEY: 'quizHistory',
  DEFAULT_SHORTCUTS: [null, null, null, null, null],
  DEFAULT_MAP_TYPE: 'local',
  DEFAULT_MODE: 'standard',
  DEFAULT_THEME: 'system',

  /**
   * Get shortcuts from storage
   * @returns {Promise<Array>} Array of shortcut objects or nulls
   */
  async getShortcuts() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get([this.SHORTCUTS_KEY], (result) => {
          resolve(result[this.SHORTCUTS_KEY] || [...this.DEFAULT_SHORTCUTS]);
        });
      } else {
        // Fallback for development/testing outside Chrome
        const stored = localStorage.getItem(this.SHORTCUTS_KEY);
        resolve(stored ? JSON.parse(stored) : [...this.DEFAULT_SHORTCUTS]);
      }
    });
  },

  /**
   * Save shortcuts to storage
   * @param {Array} shortcuts - Array of shortcut objects or nulls
   * @returns {Promise<void>}
   */
  async saveShortcuts(shortcuts) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ [this.SHORTCUTS_KEY]: shortcuts }, resolve);
      } else {
        // Fallback for development/testing outside Chrome
        localStorage.setItem(this.SHORTCUTS_KEY, JSON.stringify(shortcuts));
        resolve();
      }
    });
  },

  /**
   * Update a single shortcut at index
   * @param {number} index - Slot index (0-4)
   * @param {Object|null} shortcut - Shortcut object { name, url } or null
   * @returns {Promise<Array>} Updated shortcuts array
   */
  async updateShortcut(index, shortcut) {
    const shortcuts = await this.getShortcuts();
    shortcuts[index] = shortcut;
    await this.saveShortcuts(shortcuts);
    return shortcuts;
  },

  /**
   * Get map type from storage
   * @returns {Promise<string>} 'analysis' or 'local'
   */
  async getMapType() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get([this.MAP_TYPE_KEY], (result) => {
          resolve(result[this.MAP_TYPE_KEY] || this.DEFAULT_MAP_TYPE);
        });
      } else {
        const stored = localStorage.getItem(this.MAP_TYPE_KEY);
        resolve(stored || this.DEFAULT_MAP_TYPE);
      }
    });
  },

  /**
   * Set map type in storage
   * @param {string} mapType - 'analysis' or 'local'
   * @returns {Promise<void>}
   */
  async setMapType(mapType) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ [this.MAP_TYPE_KEY]: mapType }, resolve);
      } else {
        localStorage.setItem(this.MAP_TYPE_KEY, mapType);
        resolve();
      }
    });
  },

  /**
   * Get mode from storage
   * @returns {Promise<string>} 'standard' or 'quiz'
   */
  async getMode() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get([this.MODE_KEY], (result) => {
          resolve(result[this.MODE_KEY] || this.DEFAULT_MODE);
        });
      } else {
        const stored = localStorage.getItem(this.MODE_KEY);
        resolve(stored || this.DEFAULT_MODE);
      }
    });
  },

  /**
   * Set mode in storage
   * @param {string} mode - 'standard' or 'quiz'
   * @returns {Promise<void>}
   */
  async setMode(mode) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ [this.MODE_KEY]: mode }, resolve);
      } else {
        localStorage.setItem(this.MODE_KEY, mode);
        resolve();
      }
    });
  },

  /**
   * Get theme from storage
   * @returns {Promise<string>} 'light', 'dark', or 'system'
   */
  async getTheme() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get([this.THEME_KEY], (result) => {
          resolve(result[this.THEME_KEY] || this.DEFAULT_THEME);
        });
      } else {
        const stored = localStorage.getItem(this.THEME_KEY);
        resolve(stored || this.DEFAULT_THEME);
      }
    });
  },

  /**
   * Set theme in storage
   * @param {string} theme - 'light', 'dark', or 'system'
   * @returns {Promise<void>}
   */
  async setTheme(theme) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ [this.THEME_KEY]: theme }, resolve);
      } else {
        localStorage.setItem(this.THEME_KEY, theme);
        resolve();
      }
    });
  },

  /**
   * Get quiz history (last 7 days)
   * @returns {Promise<Array>} Array of {timestamp, correct} objects
   */
  async getQuizHistory() {
    return new Promise((resolve) => {
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get([this.QUIZ_HISTORY_KEY], (result) => {
          const history = result[this.QUIZ_HISTORY_KEY] || [];
          // Filter to last 7 days
          resolve(history.filter(h => h.timestamp > sevenDaysAgo));
        });
      } else {
        const stored = localStorage.getItem(this.QUIZ_HISTORY_KEY);
        const history = stored ? JSON.parse(stored) : [];
        resolve(history.filter(h => h.timestamp > sevenDaysAgo));
      }
    });
  },

  /**
   * Add a quiz result to history
   * @param {boolean} correct - Whether the answer was correct
   * @returns {Promise<void>}
   */
  async addQuizResult(correct) {
    const history = await this.getQuizHistory();
    history.push({ timestamp: Date.now(), correct });

    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ [this.QUIZ_HISTORY_KEY]: history }, resolve);
      } else {
        localStorage.setItem(this.QUIZ_HISTORY_KEY, JSON.stringify(history));
        resolve();
      }
    });
  },

  /**
   * Get quiz stats for last 7 days
   * @returns {Promise<{total: number, correct: number, accuracy: number}>}
   */
  async getQuizStats() {
    const history = await this.getQuizHistory();
    const total = history.length;
    const correct = history.filter(h => h.correct).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { total, correct, accuracy };
  }
};
