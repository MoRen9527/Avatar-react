/**
 * Custom detector for i18next-browser-languagedetector.
 * NOTE: The browser detector expects a synchronous `lookup()` method.
 * Here we only read from a prewarmed cache (localStorage) set elsewhere.
 */
export const IP_LANG_CACHE_KEY = 'i18n_ip_lang';

export const ipDetector = {
  name: 'ipDetector',
  lookup: () => {
    try {
      const v = localStorage.getItem(IP_LANG_CACHE_KEY);
      return v || undefined;
    } catch {
      return undefined;
    }
  },
  cacheUserLanguage: () => {}
};

export default ipDetector;
