# 🌍 Translation System — Dukan Machinery

This project uses **Google Translate** to provide automatic translation for **English**, **Amharic (አማርኛ)**, and **Afaan Oromoo (Oromoo)**.

---

## How It Works

### 1. **Google Translate Widget (Hidden)**
The `GoogleTranslate` component (`components/layout/GoogleTranslate.tsx`) injects Google's free translation script into the page. It's configured to support:
- `en` — English (default)
- `am` — Amharic (አማርኛ)
- `om` — Afaan Oromoo (Oromoo)

The widget itself is **hidden** via CSS (`globals.css`). We drive it programmatically from our own UI.

### 2. **Language Context**
`contexts/LanguageContext.tsx` manages the current language state and triggers Google Translate when the user switches languages.

**Key functions:**
- `setLanguage(lang)` — Changes the language and triggers Google Translate by setting the `googtrans` cookie and reloading the page (required for Google Translate to apply).
- `t(key)` — A helper for manually-translated strings (nav labels, CTAs, etc.). Falls back to English if a key is missing.

### 3. **Language Selector UI**
`components/layout/LanguageSelector.tsx` is the dropdown in the header. When a user picks a language:
1. Shows a loading spinner
2. Calls `setLanguage(code)`
3. Google Translate reloads the page with the new language applied

---

## What Gets Translated

### ✅ **Automatically Translated (by Google)**
- All page content (headings, paragraphs, buttons, forms, etc.)
- Machine names and descriptions
- Blog posts and testimonials
- Footer text

### 🔧 **Manually Controlled (via `t()` function)**
Only a few UI strings are manually translated in `LanguageContext.tsx`:
- Navigation labels (`nav.home`, `nav.machines`, etc.)
- Hero CTAs (`hero.cta.machines`, `hero.cta.order`)
- Order form labels (`order.standard`, `order.custom`)

**Why?** These are high-visibility strings where you want precise control. Everything else is handled by Google Translate.

---

## Adding More Manual Translations

If you want to manually translate a specific string (instead of relying on Google Translate), add it to the `translations` object in `LanguageContext.tsx`:

```tsx
const translations: Record<Language, Record<string, string>> = {
  en: {
    'my.new.key': 'Hello World',
  },
  am: {
    'my.new.key': 'ሰላም ዓለም',
  },
  om: {
    'my.new.key': 'Akkam Addunyaa',
  },
}
```

Then use it in any component:

```tsx
import { useLanguage } from '@/contexts/LanguageContext'

export default function MyComponent() {
  const { t } = useLanguage()
  return <h1>{t('my.new.key')}</h1>
}
```

---

## Testing Translations

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open the site** at `http://localhost:3000`

3. **Click the language selector** in the header (🇬🇧 English / 🇪🇹 አማርኛ / 🇪🇹 Afaan Oromoo)

4. **Select Amharic or Oromoo** — the page will reload and all content will be translated.

5. **To return to English**, select English from the dropdown.

---

## Known Limitations

### 1. **Page Reload Required**
Google Translate requires a page reload to apply translations. This is standard behavior for the free widget.

### 2. **Translation Quality**
Google Translate is machine translation — it's ~90% accurate for general content but can struggle with:
- Technical jargon (e.g., "pellet mill", "hammer mill")
- Brand names (e.g., "Dukan Machinery")
- Idioms and colloquialisms

**Solution:** Use the manual `t()` function for critical strings (CTAs, product names, legal text).

### 3. **SEO Impact**
Google Translate translations are **client-side only** — search engines see the original English content. For proper multilingual SEO, you'd need server-side rendering with separate URLs per language (`/en/`, `/am/`, `/om/`).

### 4. **No Offline Support**
Translations require an internet connection to Google's servers.

---

## Upgrading to Google Cloud Translation API (Optional)

For production, you may want to replace the free widget with the **Google Cloud Translation API**. Benefits:
- No page reload required
- Better translation quality (Neural Machine Translation)
- Full control over caching and fallbacks
- No visible "Powered by Google Translate" branding

**Steps:**
1. Sign up for [Google Cloud](https://cloud.google.com/)
2. Enable the **Cloud Translation API**
3. Create an API key
4. Replace `GoogleTranslate.tsx` with a server-side translation fetcher
5. Pre-translate all UI strings and cache them in `translations` object

**Cost:** ~$20 per 1 million characters translated.

---

## File Structure

```
frontend/
├── app/
│   ├── layout.tsx                    # Includes <GoogleTranslate />
│   └── globals.css                   # Hides Google's default UI
├── components/
│   └── layout/
│       ├── GoogleTranslate.tsx       # Injects Google Translate script
│       └── LanguageSelector.tsx      # Language dropdown UI
└── contexts/
    └── LanguageContext.tsx           # Language state + manual translations
```

---

## Troubleshooting

### **Translations not working?**
1. Check browser console for errors
2. Verify the Google Translate script loaded: look for `<script src="https://translate.google.com/...">` in the page source
3. Clear cookies and localStorage, then reload
4. Try a different browser (some ad blockers block Google Translate)

### **Page stuck in wrong language?**
Delete the `googtrans` cookie:
1. Open DevTools → Application → Cookies
2. Delete `googtrans` cookie
3. Reload the page

### **Specific text not translating?**
Some elements are excluded from translation by Google (e.g., `<code>`, `<pre>`, elements with `translate="no"` attribute). If you need them translated, remove the `translate="no"` attribute or wrap them in a translatable container.

---

## Support

For questions or issues with the translation system, contact the development team or refer to:
- [Google Translate Widget Documentation](https://translate.google.com/intl/en/about/website/)
- [Google Cloud Translation API](https://cloud.google.com/translate/docs)

---

**Last Updated:** May 2026  
**Maintained By:** Dukan Machinery Development Team
