import { createContext, useContext, type HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export const themes = [
  { value: 'miami-85', label: 'Miami 85' },
  { value: 'matrix', label: 'Matrix' },
  { value: 'calm', label: 'Calm' },
  { value: 'blue-hour', label: 'Blue Hour' },
] as const;

export type Theme = (typeof themes)[number]['value'];
const ThemeContext = createContext<Theme>('miami-85');
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({
  theme = 'miami-85',
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { theme?: Theme }) {
  return (
    <ThemeContext.Provider value={theme}>
      <div {...props} data-theme={theme} className={cn('dg-theme', className)}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
