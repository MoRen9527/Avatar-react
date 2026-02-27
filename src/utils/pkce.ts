export function randomUrlSafeString(bytes = 32): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  // base64url
  const b64 = btoa(String.fromCharCode(...arr));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function createCodeVerifier(): string {
  // 43-128 chars per RFC7636
  return randomUrlSafeString(64);
}

export async function createCodeChallengeS256(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  const b64 = btoa(String.fromCharCode(...bytes));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export type PkceState = {
  state: string;
  codeVerifier: string;
  redirectUri: string;
  createdAt: number;
};

const STORAGE_KEY = 'tristaciss_oidc_pkce_v1';

export function savePkceState(v: PkceState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(v));
}

export function loadPkceState(): PkceState | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PkceState;
  } catch {
    return null;
  }
}

export function clearPkceState() {
  sessionStorage.removeItem(STORAGE_KEY);
}
