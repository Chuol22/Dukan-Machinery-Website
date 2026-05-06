// app/fonts.ts or lib/fonts.ts
import { Changa_One } from 'next/font/google'

export const changaOne = Changa_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-changa-one', // Create a CSS variable
})