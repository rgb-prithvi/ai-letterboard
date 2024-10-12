import { Inter, Roboto_Mono, Lora, Poppins, Merriweather, Montserrat, Open_Sans, Lato } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})

export const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
})

export const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const montserrat = Montserrat({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const open_sans = Open_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const lato = Lato({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const fontOptions = [
  { name: 'Inter', value: 'inter' },
  { name: 'Roboto Mono', value: 'roboto_mono' },
  { name: 'Lora', value: 'lora' },
  { name: 'Poppins', value: 'poppins' },
  { name: 'Merriweather', value: 'merriweather' },
  { name: 'Montserrat', value: 'montserrat' },
  { name: 'Open Sans', value: 'open_sans' },
  { name: 'Lato', value: 'lato' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { name: 'Courier', value: '"Courier New", Courier, monospace' },
  { name: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
]

export const fonts = {
  inter,
  roboto_mono,
  lora,
  poppins,
  merriweather,
  montserrat,
  open_sans,
  lato,
}
