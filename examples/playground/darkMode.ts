function initTheme() {
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
}

function applyLightTheme() {
  document.body.removeAttribute('data-theme');
  localStorage.removeItem('darkMode');
}

export function toggleTheme() {
  if (isDarkThemeSelected()) {
    applyLightTheme();
  } else {
    applyDarkTheme();
  }
}

initTheme();
