import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function readJsonSafe(filePath: string): any {
  if (!fs.existsSync(filePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return {};
  }
}

function collectPending(lang: string) {
  const zhDir = path.join(rootDir, 'src', 'locales', 'zh');
  const langDir = path.join(rootDir, 'src', 'locales', lang);
  const files = fs.existsSync(zhDir) ? fs.readdirSync(zhDir).filter(f => f.endsWith('.json')) : [];
  const result: any[] = [];

  const walk = (obj: any, prefix: string[] = [], cb: (keyPath: string, zhVal: any, val: any, file: string) => void, file: string) => {
    if (typeof obj !== 'object' || obj === null) return;
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      const newPath = [...prefix, key];
      if (typeof value === 'string') {
        cb(newPath.join('.'), value, value, file);
      } else if (typeof value === 'object' && value !== null) {
        walk(value, newPath, cb, file);
      }
    }
  };

  const getByPath = (obj: any, pathStr: string) => {
    const parts = pathStr.split('.');
    let cur = obj;
    for (const p of parts) {
      if (!cur || typeof cur !== 'object') return undefined;
      cur = cur[p];
    }
    return cur;
  };

  for (const file of files) {
    const zhPath = path.join(zhDir, file);
    const langPath = path.join(langDir, file);
    const zhJson = readJsonSafe(zhPath);
    const langJson = readJsonSafe(langPath);

    const collect = (obj: any, prefix: string[] = []) => {
      if (typeof obj !== 'object' || obj === null) return;
      for (const key of Object.keys(obj)) {
        const value = obj[key];
        const newPath = [...prefix, key];
        if (typeof value === 'string') {
          const keyPath = newPath.join('.');
          const targetVal = getByPath(langJson, keyPath);
          if (typeof targetVal === 'string' && targetVal.startsWith('[PENDING]')) {
            result.push({
              file,
              keyPath,
              zh: value,
              value: targetVal
            });
          }
        } else if (typeof value === 'object' && value !== null) {
          collect(value, newPath);
        }
      }
    };

    collect(zhJson, []);
  }

  return result;
}

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

const server = http.createServer((req, res) => {
  if (!req.url) { res.statusCode = 400; res.end('No URL'); return; }

  // 简单路由解析
  const [pathPart, queryPart] = req.url.split('?');
  const urlPath = pathPart || '/';
  const query = new URLSearchParams(queryPart || '');

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }

  if (urlPath === '/i18n/pending' && req.method === 'GET') {
    const lang = query.get('lang') || 'en';
    const items = collectPending(lang);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(items));
    return;
  }

  if (urlPath === '/i18n/update' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const { lang = 'en', file, keyPath, value } = data as { lang: string; file: string; keyPath: string; value: string };
        if (!file || !keyPath) {
          res.statusCode = 400;
          res.end('file and keyPath required');
          return;
        }
        const langDir = path.join(rootDir, 'src', 'locales', lang);
        if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });
        const langPath = path.join(langDir, file);
        const langJson = readJsonSafe(langPath);
        setByPath(langJson, keyPath, value);
        fs.writeFileSync(langPath, JSON.stringify(langJson, null, 2), 'utf8');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.statusCode = 500;
        res.end('error');
      }
    });
    return;
  }

  res.statusCode = 404;
  res.end('Not found');
});

const PORT = process.env.I18N_PORT ? Number(process.env.I18N_PORT) : 4175;
server.listen(PORT, () => {
  console.log(`[i18n-server] listening on http://localhost:${PORT}`);
});
