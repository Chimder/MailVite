import { Moon, Sun } from 'lucide-react'

import { useTheme } from '../theme-provider'

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <div className="nav_icon ">
      <Sun
        onClick={() => setTheme('dark')}
        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        onClick={() => setTheme('light')}
        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
    </div>
  )
}
