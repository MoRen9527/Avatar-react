import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glossary, translateWithLLM } from './llm-client.mjs';

// 在 ESM 中模拟 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const rootDir = path.resolve(__dirname, '..');
const zhDir = path.join(rootDir, 'src', 'locales', 'zh');
const targetLangs = ['en'];

// 递归读取 JSON 文件
function readJson(filePath: string): any {
  if (!fs.existsSync(filePath)) return {};
  const txt = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(txt);
  } catch {
    console.error(`无法解析 JSON: ${filePath}`);
    return {};
  }
}

// 递归遍历对象，收集 key 路径
function collectKeys(obj: any, prefix: string[] = [], out: string[] = []): string[] {
  if (typeof obj !== 'object' || obj === null) return out;
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const newPath = [...prefix, key];
    if (typeof value === 'string') {
      out.push(newPath.join('.'));
    } else if (typeof value === 'object' && value !== null) {
      collectKeys(value, newPath, out);
    }
  }
  return out;
}

// 根据路径设置值
function setByPath(obj: any, pathStr: string, value: any) {
  const parts = pathStr.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (typeof cur[p] !== 'object' || cur[p] === null) {
      cur[p] = {};
    }
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

// 根据路径取值
function getByPath(obj: any, pathStr: string): any {
  const parts = pathStr.split('.');
  let cur = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== 'object') return undefined;
    cur = cur[p];
  }
  return cur;
}

async function main() {
  console.log('=== i18n zh -> en 差异扫描 ===');

  const zhFiles = fs.readdirSync(zhDir).filter((f) => f.endsWith('.json'));

  for (const file of zhFiles) {
    const zhPath = path.join(zhDir, file);
    const zhJson = readJson(zhPath);
    const zhKeys = collectKeys(zhJson);

    for (const lang of targetLangs) {
      const targetDir = path.join(rootDir, 'src', 'locales', lang);
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
      const targetPath = path.join(targetDir, file);
      const targetJson = readJson(targetPath);

      console.log(`\n[文件] zh/${file} -> ${lang}/${file}`);

      let changed = false;

      for (const keyPath of zhKeys) {
        const zhVal = getByPath(zhJson, keyPath);
        const targetVal = getByPath(targetJson, keyPath);
        if (targetVal !== undefined) continue; // 已有翻译，跳过

        console.log(`\n[自动生成候选翻译] 键: ${keyPath}`);
        console.log(`中文: ${zhVal}`);

        // 调用伪 LLM 翻译，未来可替换为真实服务
        const raw = await translateWithLLM({
          sourceText: String(zhVal ?? ''),
          sourceLang: 'zh',
          targetLang: lang as 'en',
          keyPath,
          context: 'i18n UI 文案自动同步'
        });

        let suggested = raw;

        // 简单术语校验：如果中文包含术语，则要求译文包含对应英文术语
        for (const [zhTerm, mapping] of Object.entries(glossary)) {
          if (typeof zhVal === 'string' && zhVal.includes(zhTerm)) {
            const required = mapping[lang as keyof typeof mapping];
            if (typeof required === 'string' && required && !suggested.includes(required)) {
              // 若未包含，则在尾部附加该术语，避免丢失品牌词
              suggested = `${suggested} (${required})`;
            }
          }
        }

        const finalText = `[PENDING] ${suggested}`;
        setByPath(targetJson, keyPath, finalText);
        changed = true;
        console.log(`已写入候选翻译: ${finalText}`);
      }

      if (changed) {
        fs.writeFileSync(targetPath, JSON.stringify(targetJson, null, 2), 'utf8');
        console.log(`\n已更新文件: ${targetPath}`);
      } else {
        console.log('无新增键需要更新。');
      }
    }
  }

  console.log('\n扫描完成。');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
