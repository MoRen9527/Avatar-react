import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { ipDetector, IP_LANG_CACHE_KEY } from './detectors/ipDetector';

import enCommon from '../locales/en/common.json';
import zhCommon from '../locales/zh/common.json';
import enNav from '../locales/en/nav.json';
import zhNav from '../locales/zh/nav.json';
import enLogin from '../locales/en/login.json';
import zhLogin from '../locales/zh/login.json';

const DEFAULT_IP_ENDPOINT = 'https://ipapi.co/json/';

function mapCountryToLang(countryCode?: string): string {
  const c = (countryCode || '').toUpperCase().trim();

  switch (c) {
    // 中国大陆 / China Mainland
    case 'CN':
    // 中国香港 / Hong Kong
    case 'HK':
    // 中国澳门 / Macau
    case 'MO':
    // 中国台湾 / Taiwan
    case 'TW':
      return 'zh';

    // 美国 / United States
    case 'US':
    // 英国 / United Kingdom
    case 'GB':
    // 澳大利亚 / Australia
    case 'AU':
    // 加拿大 / Canada
    case 'CA':
    // 新西兰 / New Zealand
    case 'NZ':
    // 新加坡 / Singapore
    case 'SG':
    // 印度 / India
    case 'IN':
    // 德国 / Germany
    case 'DE':
    // 法国 / France
    case 'FR':
    // 西班牙 / Spain
    case 'ES':
    // 意大利 / Italy
    case 'IT':
    // 日本 / Japan
    case 'JP':
    // 韩国 / South Korea
    case 'KR':
    // 俄罗斯 / Russia
    case 'RU':
    // 巴西 / Brazil
    case 'BR':
    // 墨西哥 / Mexico
    case 'MX':
    // 阿根廷 / Argentina
    case 'AR':
    // 智利 / Chile
    case 'CL':
    // 荷兰 / Netherlands
    case 'NL':
    // 瑞典 / Sweden
    case 'SE':
    // 挪威 / Norway
    case 'NO':
    // 丹麦 / Denmark
    case 'DK':
    // 芬兰 / Finland
    case 'FI':
    // 波兰 / Poland
    case 'PL':
    // 土耳其 / Turkey
    case 'TR':
    // 印度尼西亚 / Indonesia
    case 'ID':
    // 泰国 / Thailand
    case 'TH':
    // 马来西亚 / Malaysia
    case 'MY':
    // 菲律宾 / Philippines
    case 'PH':
    // 越南 / Vietnam
    case 'VN':
      // 目前统一先返回英文，未来可以按国家细分语言
      return 'en';

    // 默认：包括空字符串或未覆盖的国家码
    default:
      return 'en';
  }
}

async function prewarmIpLang(timeoutMs = 1200): Promise<string | undefined> {
  const endpoint = (import.meta as any)?.env?.VITE_IP_DETECTOR_URL || DEFAULT_IP_ENDPOINT;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(endpoint, { signal: controller.signal });
    if (!res.ok) return undefined;
    const data = await res.json();
    const cc = (data?.country_code || data?.country || '').toString();
    const lang = mapCountryToLang(cc);
    try { localStorage.setItem(IP_LANG_CACHE_KEY, lang); } catch {}
    return lang;
  } catch {
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}

// Resources
export const resources = {
  // 中文区
  zh: { common: zhCommon, nav: zhNav, login: zhLogin },

  // 英文区（默认）
  en: { common: enCommon, nav: enNav, login: enLogin },

  // 其他语言区，暂时都用英文资源，方便后续扩展
  ja: { common: enCommon, nav: enNav, login: enLogin }, // 日本
  ko: { common: enCommon, nav: enNav, login: enLogin }, // 韩国
  fr: { common: enCommon, nav: enNav, login: enLogin }, // 法国
  de: { common: enCommon, nav: enNav, login: enLogin }, // 德国
  es: { common: enCommon, nav: enNav, login: enLogin }, // 西班牙
  it: { common: enCommon, nav: enNav, login: enLogin }, // 意大利
  ru: { common: enCommon, nav: enNav, login: enLogin }, // 俄罗斯
  pt: { common: enCommon, nav: enNav, login: enLogin }, // 葡萄牙
  tr: { common: enCommon, nav: enNav, login: enLogin }, // 土耳其
  id: { common: enCommon, nav: enNav, login: enLogin }, // 印尼
  th: { common: enCommon, nav: enNav, login: enLogin }, // 泰国
  ms: { common: enCommon, nav: enNav, login: enLogin }, // 马来西亚
  vi: { common: enCommon, nav: enNav, login: enLogin }, // 越南
  nl: { common: enCommon, nav: enNav, login: enLogin }, // 荷兰
  sv: { common: enCommon, nav: enNav, login: enLogin }, // 瑞典
  no: { common: enCommon, nav: enNav, login: enLogin }, // 挪威
  da: { common: enCommon, nav: enNav, login: enLogin }, // 丹麦
  fi: { common: enCommon, nav: enNav, login: enLogin }, // 芬兰
  pl: { common: enCommon, nav: enNav, login: enLogin }, // 波兰
  ar: { common: enCommon, nav: enNav, login: enLogin }, // 阿根廷（西语）
  mx: { common: enCommon, nav: enNav, login: enLogin }, // 墨西哥（西语）
  cl: { common: enCommon, nav: enNav, login: enLogin }, // 智利（西语）
  br: { common: enCommon, nav: enNav, login: enLogin }, // 巴西（葡语）
} as const;

// Detector: combine browser detector with our IP detector
const browserDetector = new LanguageDetector();
browserDetector.addDetector(ipDetector);

// Init i18n
void i18n
  .use(initReactI18next)
  .use(browserDetector)
  .init({
    resources,
    fallbackLng: 'en',
    load: 'languageOnly', // 让 zh-TW /zh-MO / zh-HK 自动归并为 zh
    ns: ['common', 'nav', 'login'],
    defaultNS: 'common',
    debug: !!import.meta.env.DEV,
    detection: {
      // priority: user explicit -> stored -> browser -> ip -> others
      order: ['querystring', 'localStorage', 'navigator', 'ipDetector', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false }, // React already safes from xss
    react: { useSuspense: false }
  });

i18n.on('languageChanged', (lng) => {
  try {
    // 只取主语言代码（如 zh、en、ja、fr 等），方便多语言扩展
    const mainLang = lng.split('-')[0];
    document.documentElement.setAttribute('lang', mainLang);
  } catch {}
});

// After init, try to refine language via IP if user hasn't explicitly set it.
(async () => {
  try {
    const userPinned = !!localStorage.getItem('i18nextLng');
    if (userPinned) return;
    const ipLangCached = (() => { try { return localStorage.getItem(IP_LANG_CACHE_KEY) || undefined; } catch { return undefined; } })();
    // 取主语言代码，支持多语言扩展
    const current = i18n.language?.split('-')[0] || 'en';
    const ipLang = ipLangCached || await prewarmIpLang();
    if (ipLang && ipLang !== current) {
      await i18n.changeLanguage(ipLang);
    }
  } catch {
    // ignore
  }
})();

export default i18n;
