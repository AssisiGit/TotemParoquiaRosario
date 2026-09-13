import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 👇 Adicione este bloco fontFamily
      fontFamily: {
        Asah: ['var(--font-asah)'], // Usa o apelido que criamos no layout
        Bold: ['var(--font-bold)'],
        Light: ['var(--font-light)'],
        Medium: ['var(--font-medium)'],
      },
    },
  },
  plugins: [],
}
export default config