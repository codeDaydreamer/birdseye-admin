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
        // Corporate theme: black and white with an 816 Dynamics blue accent
        primary: '#2563EB',
        secondary: '#1D4ED8',
        'light-bg': '#F5F6F8',
        'light-text': '#0A0A0A',
        'light-border': '#E2E8F0',
        'light-accent': '#FFFFFF',
        'light-input': '#F1F5F9',
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
        'light-subtext': '#64748B',
      },
      textColor: {
        inherit: 'inherit',
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}

export default config
