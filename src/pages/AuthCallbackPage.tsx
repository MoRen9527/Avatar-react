import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { checkAuth } from '../store/authSlice';
import { getAuthServerBase } from '../services/api';
import { clearPkceState, loadPkceState } from '../utils/pkce';

const OIDC_CLIENT_ID = 'tristaciss-avatar-react';

function parseQuery() {
  const url = new URL(window.location.href);
  return {
    code: url.searchParams.get('code') || '',
    state: url.searchParams.get('state') || '',
    error: url.searchParams.get('error') || '',
    errorDescription: url.searchParams.get('error_description') || '',
  };
}

async function exchangeCode(code: string, redirectUri: string, codeVerifier: string) {
  const authBase = getAuthServerBase();
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: OIDC_CLIENT_ID,
    code_verifier: codeVerifier,
  });

  const res = await fetch(`${authBase}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`token exchange failed: ${res.status} ${text}`);
  }

  return (await res.json()) as {
    access_token: string;
    id_token?: string;
    expires_in?: number;
    token_type?: string;
  };
}

export default function AuthCallbackPage() {
  const nav = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [status, setStatus] = useState<string>('Completing sign-in…');

  useEffect(() => {
    (async () => {
      try {
        const q = parseQuery();
        if (q.error) {
          throw new Error(q.errorDescription || q.error);
        }
        if (!q.code) {
          throw new Error('missing code');
        }

        const pkce = loadPkceState();
        if (!pkce) {
          throw new Error('missing pkce session');
        }
        if (pkce.state !== q.state) {
          throw new Error('state mismatch');
        }

        setStatus('Exchanging code…');
        const tokens = await exchangeCode(q.code, pkce.redirectUri, pkce.codeVerifier);

        // Persist bearer token for axios interceptor
        localStorage.setItem('token', tokens.access_token);
        if (tokens.id_token) localStorage.setItem('id_token', tokens.id_token);

        clearPkceState();

        setStatus('Loading profile…');
        await dispatch(checkAuth());

        nav('/', { replace: true });
      } catch (e: any) {
        clearPkceState();
        console.error(e);
        setStatus(`Sign-in failed: ${e?.message || String(e)}`);
        // stay on page for visibility
      }
    })();
  }, [dispatch, nav]);

  return (
    <div style={{ fontFamily: 'system-ui, Segoe UI, Arial', maxWidth: 720, margin: '12vh auto', padding: 16 }}>
      <h2>Tristaciss Sign-in</h2>
      <p>{status}</p>
      {status.startsWith('Sign-in failed') ? (
        <button onClick={() => nav('/login', { replace: true })} style={{ padding: '8px 12px' }}>
          Back to login
        </button>
      ) : null}
    </div>
  );
}
