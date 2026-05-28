export type SocialPlatform = 'whatsapp' | 'telegram' | 'tiktok' | 'email'


export type SocialLinkConfig = {
  [K in SocialPlatform]: {
    label: string
    href: string
  }
}

// Central place to update social URLs/usernames later.
// Keep this file framework-agnostic and use absolute links.
export const socialLinks: SocialLinkConfig = {
  whatsapp: {
    label: 'WhatsApp',
    href: 'https://wa.me/251912713823',
  },
  telegram: {
    label: 'Telegram',
    href: 'https://t.me/DukanmachineryEt',
  },
  tiktok: {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@dukanmachinery?_r=1&_t=ZS-96Xyddw3DIT',
  },
  email: {
    label: 'Email',
    href: 'mailto:geletupro@gmail.com',
  },
}


 