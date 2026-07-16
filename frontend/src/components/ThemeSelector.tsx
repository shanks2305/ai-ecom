import { THEMES } from '../lib/theme'
import { useTheme } from '../hooks/useTheme'
import './ThemeSelector.css'

function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="theme-selector" role="group" aria-label="Theme">
      {THEMES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={`theme-selector__option${theme === id ? ' theme-selector__option--active' : ''}`}
          aria-pressed={theme === id}
          onClick={() => setTheme(id)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default ThemeSelector
