import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const en = require('../lang/en.json')
const vi = require('../lang/vi.json')

i18n
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: en
      },
      vi: {
        translations: vi
      }
    },
    fallbackLng: 'vi',

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ','
    },
    react: {
      useSuspense: true,
    }
  });

export default i18n;
