import { describe, it, expect } from 'vitest';
import { getEnv } from '@/lib/config/env';

describe('Env loader', () => {
  it('throws when required env is missing', () => {
    const prev = process.env.NEXT_PUBLIC_APP_NAME;
    delete process.env.NEXT_PUBLIC_APP_NAME;
    expect(() => getEnv()).toThrow();
    if (prev !== undefined) process.env.NEXT_PUBLIC_APP_NAME = prev;
  });

  it('parses when required env is present', () => {
    process.env.NEXT_PUBLIC_APP_NAME = 'TestApp';
    const env = getEnv();
    expect(env.NEXT_PUBLIC_APP_NAME).toBe('TestApp');
    expect(['development', 'test', 'production']).toContain(env.NODE_ENV);
  });
});
