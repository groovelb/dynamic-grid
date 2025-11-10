import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../src/theme/theme';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo"
    },

    options: {
      storySort: {
        order: ['00. Overview', '1. Style', '2. Components', '3. Pages'],
      },
    },
  },

  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <style>{`
          /* Storybook 전용: 스크롤 활성화 */
          html, body, #root, #storybook-root {
            overflow: visible !important;
            height: auto !important;
          }
          /* 스크롤바 표시 */
          * {
            scrollbar-width: auto !important;
          }
          *::-webkit-scrollbar {
            display: block !important;
            width: 8px !important;
          }
          *::-webkit-scrollbar-track {
            background: #f1f1f1 !important;
          }
          *::-webkit-scrollbar-thumb {
            background: #888 !important;
            border-radius: 4px !important;
          }
          *::-webkit-scrollbar-thumb:hover {
            background: #555 !important;
          }
        `}</style>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;