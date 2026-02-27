import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Paper, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { createCodeChallengeS256, createCodeVerifier, randomUrlSafeString, savePkceState } from '../utils/pkce';
import { getAuthServerBase } from '../services/api';

import '../styles/LoginPage.css';

const OIDC_CLIENT_ID = 'tristaciss-avatar-react';
const OIDC_SCOPE = 'openid profile email';

const LoginPage: React.FC = () => {
  const { t } = useTranslation('login');
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { loading, error, isAuthenticated, loginSuccess } = useSelector((state: RootState) => state.auth);

  // 监听登录成功状态，自动跳转
  useEffect(() => {
    if (loginSuccess && isAuthenticated) {
      console.log(t('loginSuccess'));
      navigate('/');
    }
  }, [loginSuccess, isAuthenticated, navigate]);

  const startOidc = async () => {
    try {
      setLocalError(null);
      setStarting(true);

      const authBase = getAuthServerBase();
      const redirectUri = `${window.location.origin}/auth/callback`;
      const state = randomUrlSafeString(24);
      const codeVerifier = createCodeVerifier();
      const codeChallenge = await createCodeChallengeS256(codeVerifier);

      savePkceState({ state, codeVerifier, redirectUri, createdAt: Date.now() });

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: OIDC_CLIENT_ID,
        redirect_uri: redirectUri,
        scope: OIDC_SCOPE,
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      });

      window.location.assign(`${authBase}/oauth/authorize?${params.toString()}`);
    } catch (e: any) {
      console.error(e);
      setLocalError(e?.message || String(e));
      setStarting(false);
    }
  };

  return (
    <div className="login-container">
      {/* 顶部右侧语言切换 */}
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 2000 }}>
        <LanguageSwitcher />
      </Box>
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <Paper 
            elevation={24} 
            sx={{
              padding: 4,
              width: '100%',
              maxWidth: 400,
              backgroundColor: 'rgba(1, 11, 20, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid #39ff14',
              borderRadius: '16px',
              boxShadow: '0 0 30px rgba(57, 255, 20, 0.3), 0 0 60px rgba(0, 255, 255, 0.2)',
            }}
          >
            <Box textAlign="center" mb={4}>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{
                  color: '#39ff14',
                  textShadow: '0 0 20px rgba(57, 255, 20, 0.8)',
                  fontWeight: 'bold',
                  mb: 1,
                }}
              >
                {t('appName')}
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{
                  color: '#00ffff',
                  textShadow: '0 0 10px rgba(0, 255, 255, 0.6)',
                }}
              >
                {t('subtitle')}
              </Typography>
            </Box>

            {(error || localError) && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2,
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  color: '#ff6b6b',
                  border: '1px solid #ff6b6b',
                  '& .MuiAlert-icon': {
                    color: '#ff6b6b',
                  },
                }}
              >
                {error || localError}
              </Alert>
            )}
            <Button
              onClick={startOidc}
              fullWidth
              variant="contained"
              disabled={loading || starting}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: 'linear-gradient(45deg, #00ffff, #39ff14)',
                color: '#000',
                boxShadow: '0 0 20px rgba(57, 255, 20, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 0 30px rgba(57, 255, 20, 0.6), 0 6px 20px rgba(0, 0, 0, 0.4)',
                },
              }}
            >
              {starting ? 'Redirecting…' : 'Sign in with Tristaciss'}
            </Button>

            {/* 测试账户信息提示 */}
            <Box sx={{ mt: 3, p: 2, border: '1px solid rgba(57, 255, 20, 0.3)', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ color: 'secondary.main', mb: 1 }}>
                {t('testInfo')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                {t('testUser')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                {t('testPass')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem', mt: 1 }}>
                提示：用户名/密码是在 Auth Server 的登录页输入（本页面只负责跳转 OIDC 授权）。
              </Typography>
            </Box>

            <Box textAlign="center" mt={3}>
              <Typography 
                variant="body2" 
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textShadow: '0 0 3px rgba(255, 255, 255, 0.3)',
                }}
              >
                {t('copyright')}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default LoginPage;