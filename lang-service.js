// Language service for NewsWave application
import fs from 'fs';
import path from 'path';

// Load language configuration
const langConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lang-config.json'), 'utf8'));

class LanguageService {
  constructor() {
    this.translations = langConfig.translations;
    this.supportedLanguages = Object.keys(langConfig.translations);
    this.defaultLanguage = langConfig.default;
  }

  // Get translation for a key in specific language
  getTranslation(lang, keyPath) {
    if (!this.translations[lang]) {
      lang = this.defaultLanguage; // fallback to default language
    }

    const keys = keyPath.split('.');
    let value = this.translations[lang];
    
    for (const key of keys) {
      if (value && value.hasOwnProperty(key)) {
        value = value[key];
      } else {
        // If translation not found, try default language
        const defaultKeys = keyPath.split('.');
        let defaultValue = this.translations[this.defaultLanguage];
        
        for (const defaultKey of defaultKeys) {
          if (defaultValue && defaultValue.hasOwnProperty(defaultKey)) {
            defaultValue = defaultValue[defaultKey];
          } else {
            return keyPath; // Return original key if no translation found
          }
        }
        return defaultValue;
      }
    }
    
    return value;
  }

  // Get all translations for a language
  getLanguageTranslations(lang) {
    return this.translations[lang] || this.translations[this.defaultLanguage];
  }

  // Check if language is supported
  isSupportedLanguage(lang) {
    return this.supportedLanguages.includes(lang);
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.supportedLanguages.map(lang => ({
      code: lang,
      name: langConfig.languages[lang].name,
      direction: langConfig.languages[lang].direction
    }));
  }

  // Get default language
  getDefaultLanguage() {
    return this.defaultLanguage;
  }
}

// Export singleton instance
export const langService = new LanguageService();
export default langService;