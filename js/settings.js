/**
 * Settings page module
 */

// Setup a radio group with save functionality
function setupRadioGroup(containerId, badgeId, getSetting, setSetting) {
  const container = document.getElementById(containerId);
  const options = container.querySelectorAll('.radio-option');
  const badge = document.getElementById(badgeId);
  let fadeTimeout;

  // Load current setting
  async function load() {
    const value = await getSetting();
    options.forEach(option => {
      const input = option.querySelector('input');
      const isSelected = input.value === value;
      input.checked = isSelected;
      option.classList.toggle('selected', isSelected);
    });
  }

  // Save setting when changed
  options.forEach(option => {
    option.addEventListener('click', async () => {
      const input = option.querySelector('input');
      const value = input.value;

      // Update UI
      options.forEach(opt => {
        opt.classList.remove('selected');
        opt.querySelector('input').checked = false;
      });
      option.classList.add('selected');
      input.checked = true;

      // Save to storage
      await setSetting(value);

      // Show saved badge
      clearTimeout(fadeTimeout);
      badge.classList.add('show');
      fadeTimeout = setTimeout(() => {
        badge.classList.remove('show');
      }, 1500);
    });
  });

  load();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize theme
  await Theme.init();

  setupRadioGroup(
    'map-type-options',
    'map-saved-badge',
    () => Storage.getMapType(),
    (v) => Storage.setMapType(v)
  );

  setupRadioGroup(
    'mode-options',
    'mode-saved-badge',
    () => Storage.getMode(),
    (v) => Storage.setMode(v)
  );

  setupRadioGroup(
    'theme-options',
    'theme-saved-badge',
    () => Storage.getTheme(),
    async (v) => {
      await Storage.setTheme(v);
      await Theme.applyTheme();
    }
  );
});
