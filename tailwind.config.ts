import type { Config } from 'tailwindcss'


const config: Config = {
  content: [
    './app.vue',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      screens: {
        custom: "1390px",
      },
      colors: {
        primary: '#249225',
        secondary: '#F4C542',
        'light-bg': '#F5F5DC',
        'light-text': '#1F2937',
        'light-border': '#8B4513',
        'light-accent': '#F0D8B6',
        'light-input': '#E5E7EB',
        'dark-bg': '#1F2937',
        'dark-text': '#E5E7EB',
        'dark-border': '#4B5563',
        'dark-accent': '#374151',
        'dark-subtext': '#9CA3AF', 
        'dark-input': '#374151',
        'danger': '#EF4444',
        'success': '#22C55E',
        'info': '#3B82F6',
        'warning': '#FBBF24',
        'accent-orange': '#FF8C00',
        'trust-blue': '#2F4F4F',
        'light-subtext': '#6B7280',
      },
      textColor: {
        inherit: 'inherit',
      }
    },
  },
  darkMode: 'class',
  plugins: [],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#6B8E23",
          secondary: "#F4C542",
          accent: "#ADD8E6",
          neutral: "#F5F5DC",
          "base-100": "#F5F5DC",
          "base-content": "#1F2937",
          "base-border": "#8B4513",
          "base-input": "#E5E7EB",
        },
      },
      {
        dark: {
          primary: "#6B8E23",
          secondary: "#F4C542",
          accent: "#ADD8E6",
          neutral: "#4B5563",
          "base-100": "#1F2937",
          "base-content": "#E5E7EB",
          "base-border": "#4B5563",
          "base-input": "#1F2937",
        },
      },
    ],
  },
}

export default config
