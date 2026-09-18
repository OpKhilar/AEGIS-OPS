import { Sun, Moon } from 'lucide-react';

/** Light/dark mode switch. Theme state is owned by App via useTheme. */
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  return (
    <button
      onClick={onToggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-lg border transition-all bg-elevated text-ink-3 border-line hover:text-ink hover:border-line-strong"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
