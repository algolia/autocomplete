const darkModeToggle = document.querySelector<HTMLInputElement>('#dark-mode');

function initTheme() {
  if (darkModeToggle) {
    darkModeToggle.checked = isDarkThemeSelected();
    darkModeToggle.addEventListener('change', () => {
      if (darkModeToggle.checked) {
        applyDarkTheme();
      } else {
        applyLightTheme();
      }
    });
  }

  if (isDarkThemeSelected()) {
    applyDarkTheme();
  } else {
    applyLightTheme();
  }
}

export function isDarkThemeSelected() {
  return localStorage.getItem('darkMode') === 'dark';
}

function applyDarkTheme() {
  document.body.setAttribute('data-theme', 'dark');
  localStorage.setItem('darkMode', 'dark');

  if (darkModeToggle) {
    darkModeToggle.checked = true;
  }
}

function applyLightTheme() {
  document.body.removeAttribute('data-theme');
  localStorage.removeItem('darkMode');

  if (darkModeToggle) {
    darkModeToggle.checked = false;
  }
}

export function toggleTheme() {
  if (isDarkThemeSelected()) {
    applyLightTheme();
  } else {
    applyDarkTheme();
  }
}

initTheme();
