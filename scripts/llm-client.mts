import glossaryJson from './glossary.json' assert { type: 'json' };

export type Glossary = Record<string, { en: string; note?: string }>;

export const glossary = glossaryJson as Glossary;

interface TranslateOptions {
  sourceText: string;
  sourceLang: 'zh';
  targetLang: 'en';
  keyPath: string;
  context?: string;
}

// 目前仅返回伪翻译，未来可在此对接真实 LLM/MT 服务
export async function translateWithLLM(opts: TranslateOptions): Promise<string> {
  const { sourceText, targetLang, keyPath } = opts;
  // 简单示意：前缀标记 + 原文，方便在前端做识别
  return `[LLM-${targetLang.toUpperCase()}:${keyPath}] ${sourceText}`;
}
