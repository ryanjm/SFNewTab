/**
 * Chrome storage wrapper for shortcuts data
 */
const Storage = {
  SHORTCUTS_KEY: 'shortcuts',
  DEFAULT_SHORTCUTS: [null, null, null, null, null],

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
  }
};
