import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './shared/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#F6F3EE', // основной фон
          subtle: '#EFEAE2', // чуть темнее — для hover, полос таблиц
          muted: '#E7E1D7', // ещё темнее — для disabled-bg, скелетонов
        },

        ink: {
          DEFAULT: '#171512',
          muted: '#6B655D',
          subtle: '#9A948C',
          faint: '#B8B2A9',
        },

        line: {
          DEFAULT: '#E5DFD6',
          strong: '#D3CCBF',
          subtle: '#EDE8E0',
        },

        accent: {
          DEFAULT: '#C6462F', // ← из ТЗ
          50: '#FBEEEA',
          100: '#F4E3DE',
          200: '#E9C6BC',
          300: '#DDA294',
          400: '#D07460',
          500: '#C6462F', // = DEFAULT
          600: '#B03D28', // hover для primary
          700: '#983322', // primary по умолчанию
          800: '#7A2819', // active / pressed
          900: '#5C1E13',
          hover: '#983322', // обратная совместимость со старым API
          soft: '#F4E3DE', // мягкий фон бейджей
        },
      },
    },
  },
} satisfies Config;
