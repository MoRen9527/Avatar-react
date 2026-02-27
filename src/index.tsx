import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import store from './store';
import theme from './theme';
import { NotificationProvider } from './hooks/useSciFiNotification';
import './index.css';
import { getApiBase } from './services/api';
import i18n from './i18n';

console.log('Index.tsx 正在加载...');

// 单次获取 root 容器，避免重复查询
const container = document.getElementById('root');

if (!container) {
  const msg = '严重错误：找不到 root 挂载节点，应用无法启动';
  console.error(msg);
  throw new Error(msg);
}

// 封装配置错误渲染，便于后续扩展为 React 组件
function renderConfigError(message: Error) {
  // container 已在上文校验，此处直接使用
  const tr = {
    title: i18n.t('configError.title'),
    desc: i18n.t('configError.desc'),
    dev: i18n.t('configError.dev'),
    prod: i18n.t('configError.prod'),
    tip: i18n.t('configError.tip'),
    action: i18n.t('configError.action')
  };
  container.innerHTML = `
    <div style="font-family:system-ui,Segoe UI,Arial;max-width:880px;margin:8vh auto;padding:28px 32px;border:1px solid #ffd6d6;background:linear-gradient(180deg,#fff7f7,#fff);border-radius:12px;color:#6b1e1e;line-height:1.7;box-shadow:0 8px 24px rgba(0,0,0,.06)">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14h-2v-2h2v2zm0-4h-2V6h2v6z" fill="#C62828"/></svg>
        <h2 style="margin:0;font-size:20px;">${tr.title}</h2>
      </div>
      <p style="margin:.5em 0 1em;">${tr.desc}</p>
      <div style="margin:0 0 1em 0;color:#d32f2f;font-family:monospace;background:#fff0f0;padding:8px 12px;border-radius:6px;border:1px solid #ffcdd2;font-size:14px;">
        Error: ${message.message || String(message)}
      </div>
      <ul style="margin:0 0 1em 1.2em;color:#5a1a1a;">
        <li><code style="background:#ffecec;padding:0 4px;border-radius:4px">${tr.dev}</code></li>
        <li style="margin-top:.5em;"><code style="background:#ffecec;padding:0 4px;border-radius:4px">${tr.prod}</code></li>
      </ul>
      <p style="margin:0 0 16px;color:#8a2a2a;">${tr.tip}</p>
      <div>
        <a href="./README_DEPLOYMENT.md" style="display:inline-block;background:#c62828;color:#fff;text-decoration:none;padding:8px 12px;border-radius:8px;">${tr.action}</a>
      </div>
    </div>
  `;
}

// 前置校验关键环境配置（生产缺失将抛错并中止渲染）
try {
  const apiBase = getApiBase();
  if (import.meta.env.DEV) {
    console.log('[Config] API Base =', apiBase);
  }
} catch (e) {
  renderConfigError(e as Error);
  throw e; // 终止后续渲染
}

if (import.meta.env.DEV) console.log('找到 root 元素，开始渲染...');
const root = ReactDOM.createRoot(container);
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ThemeProvider>
  </Provider>
);
if (import.meta.env.DEV) console.log('App 组件已渲染');