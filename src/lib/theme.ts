// Theme management — class-based dark mode persisted in localStorage.
export type Theme = "light" | "dark";

const STORAGE_KEY = "lumina.theme";

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function persistTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, theme);
}

// Inline script — runs before React hydrates to avoid a flash of wrong theme.
export const themeBootstrapScript = `
(function(){try{
  var k='${STORAGE_KEY}';
  var s=localStorage.getItem(k);
  var t=s==='light'||s==='dark'?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  var r=document.documentElement;
  if(t==='dark')r.classList.add('dark');
  r.style.colorScheme=t;
}catch(e){}})();
`;
