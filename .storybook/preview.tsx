import { useEffect } from 'react';
import type { Preview } from '@storybook/react-vite';
import { ThemeProvider, themes, type Theme } from '../src/components/theme';
import '../src/styles.css';

function StoryTheme({
  theme,
  canvasBackground,
  children,
}: {
  theme: Theme;
  canvasBackground?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);
  useEffect(() => {
    if (!canvasBackground) return;
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor = canvasBackground;

    return () => {
      document.body.style.backgroundColor = previous;
    };
  }, [canvasBackground]);

  return (
    <ThemeProvider
      theme={theme}
      className="min-h-40 h-full p-5 sm:p-6"
      style={canvasBackground ? { backgroundColor: canvasBackground } : undefined}
    >
      {children}
    </ThemeProvider>
  );
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Studio palette',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: themes.map((t) => ({ value: t.value, title: t.label })),
      },
    },
  },
  initialGlobals: { theme: 'miami-85' },
  decorators: [
    (Story, context) => (
      <StoryTheme
        theme={context.globals.theme as Theme}
        canvasBackground={context.parameters.canvasBackground}
      >
        <Story />
      </StoryTheme>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { test: 'error' },
    options: {
      storySort: {
        order: [
          'Welcome',
          'Foundations',
          'Layout',
          'Layout recipes',
          'AI',
          'Motion',
          'Media',
          'Forms',
          'Content',
          'Commerce',
          'Navigation',
          'Feedback',
          'Overlays',
          'Examples',
          'Source catalog',
        ],
      },
    },
  },
};

export default preview;
