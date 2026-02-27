import { describe, it, expect, vi } from 'vitest';
import { resolveApiBase } from '../src/services/api';

describe('resolveApiBase()', () => {
  it('development 模式下未配置应告警并回退到 /api', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const base = resolveApiBase('development');
    expect(base).toBe('/api');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('test 模式下未配置应告警并回退到 /api', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const base = resolveApiBase('test');
    expect(base).toBe('/api');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('production 模式下未配置应抛错', () => {
    expect(() => resolveApiBase('production')).toThrow(/VITE_API_URL 未设置/);
  });

  it('production 模式下配置了 VITE_API_URL 应返回该地址', () => {
    const base = resolveApiBase('production', 'https://example.com/api');
    expect(base).toBe('https://example.com/api');
  });
});
