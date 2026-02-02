/**
 * Theme management module
 */
const Theme = {
  /**
   * Initialize theme
   */
  async init() {
    await this.applyTheme();
    this.watchSystemTheme();
  },

  /**
   * Apply the current theme based on settings
   */
  async applyTheme() {
    const theme = await Storage.getTheme();
    const effectiveTheme = this.getEffectiveTheme(theme);
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  },

  /**
   * Get the effective theme (resolves 'system' to actual theme)
   * @param {string} theme - 'light', 'dark', or 'system'
   * @returns {string} 'light' or 'dark'
   */
  getEffectiveTheme(theme) {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  },

  /**
   * Watch for system theme changes
   */
  watchSystemTheme() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async () => {
      const theme = await Storage.getTheme();
      if (theme === 'system') {
        await this.applyTheme();
      }
    });
  }
};
