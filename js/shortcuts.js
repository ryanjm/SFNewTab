/**
 * Shortcuts management module
 */
const Shortcuts = {
  container: null,
  modal: null,
  overlay: null,
  form: null,
  currentEditIndex: null,

  /**
   * Initialize shortcuts module
   */
  async init() {
    this.container = document.getElementById('shortcuts');
    this.modal = document.getElementById('shortcut-modal');
    this.overlay = document.getElementById('modal-overlay');
    this.form = document.getElementById('shortcut-form');

    this.bindEvents();
    await this.render();
  },

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveShortcut();
    });

    // Cancel button
    document.getElementById('modal-cancel').addEventListener('click', () => {
      this.closeModal();
    });

    // Delete button
    document.getElementById('modal-delete').addEventListener('click', () => {
      this.deleteShortcut();
    });

    // Close modal on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.closeModal();
      }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
        this.closeModal();
      }
    });
  },

  /**
   * Render all shortcut slots
   */
  async render() {
    const shortcuts = await Storage.getShortcuts();
    this.container.innerHTML = '';

    // Render existing shortcuts
    shortcuts.forEach((shortcut, index) => {
      if (shortcut) {
        const slot = this.createShortcutSlot(shortcut, index);
        this.container.appendChild(slot);
      }
    });

    // Add one "add" button if there's room
    const filledCount = shortcuts.filter(s => s !== null).length;
    if (filledCount < 5) {
      // Find the first empty slot index
      const emptyIndex = shortcuts.findIndex(s => s === null);
      const addButton = this.createAddButton(emptyIndex);
      this.container.appendChild(addButton);
    }
  },

  /**
   * Create a shortcut slot element
   * @param {Object} shortcut - Shortcut data
   * @param {number} index - Slot index
   * @returns {HTMLElement}
   */
  createShortcutSlot(shortcut, index) {
    const slot = document.createElement('div');
    slot.className = 'shortcut-slot';
    slot.dataset.index = index;

    const faviconUrl = this.getFaviconUrl(shortcut.url);
    slot.innerHTML = `
      <a href="${this.escapeHtml(shortcut.url)}" target="_blank" rel="noopener" class="shortcut-link">
        <div class="shortcut-icon">
          <img src="${faviconUrl}" alt="" onerror="this.style.display='none'">
        </div>
        <span class="shortcut-name">${this.escapeHtml(shortcut.name)}</span>
      </a>
    `;

    // Right click to edit
    slot.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.openModal(index, shortcut);
    });

    return slot;
  },

  /**
   * Create the add button
   * @param {number} index - Slot index for the new shortcut
   * @returns {HTMLElement}
   */
  createAddButton(index) {
    const slot = document.createElement('div');
    slot.className = 'shortcut-slot add-button';
    slot.dataset.index = index;

    slot.innerHTML = `
      <div class="shortcut-icon">
        <span class="plus-icon">+</span>
      </div>
    `;

    slot.addEventListener('click', () => {
      this.openModal(index, null);
    });

    return slot;
  },

  /**
   * Get favicon URL for a site
   * @param {string} url - Site URL
   * @returns {string} Favicon URL
   */
  getFaviconUrl(url) {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch {
      return '';
    }
  },

  /**
   * Open the edit modal
   * @param {number} index - Slot index
   * @param {Object|null} shortcut - Existing shortcut data or null
   */
  openModal(index, shortcut) {
    this.currentEditIndex = index;
    const isEditing = shortcut !== null;

    document.getElementById('modal-title').textContent = isEditing ? 'Edit Shortcut' : 'Add Shortcut';
    document.getElementById('shortcut-name').value = shortcut?.name || '';
    document.getElementById('shortcut-url').value = shortcut?.url || '';
    document.getElementById('modal-delete').style.display = isEditing ? 'block' : 'none';

    this.overlay.classList.add('active');
    document.getElementById('shortcut-name').focus();
  },

  /**
   * Close the edit modal
   */
  closeModal() {
    this.overlay.classList.remove('active');
    this.currentEditIndex = null;
    this.form.reset();
  },

  /**
   * Save the current shortcut
   */
  async saveShortcut() {
    const name = document.getElementById('shortcut-name').value.trim();
    let url = document.getElementById('shortcut-url').value.trim();

    // Add https:// if no protocol specified
    if (url && !url.match(/^https?:\/\//i)) {
      url = 'https://' + url;
    }

    if (!name || !url) return;

    const shortcut = { name, url };
    await Storage.updateShortcut(this.currentEditIndex, shortcut);
    this.closeModal();
    await this.render();
  },

  /**
   * Delete the current shortcut
   */
  async deleteShortcut() {
    await Storage.updateShortcut(this.currentEditIndex, null);
    this.closeModal();
    await this.render();
  },

  /**
   * Escape HTML special characters
   * @param {string} str - String to escape
   * @returns {string}
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
