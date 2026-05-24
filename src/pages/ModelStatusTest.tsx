import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { chatAPI } from '../services/api';
import SingleChatModelSelector from '../components/chat/SingleChatModelSelector';

const ModelStatusTest: React.FC = () => {
  const [modelsStatus, setModelsStatus] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [error, setError] = useState('');

  const loadModelsStatus = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await chatAPI.getModelsStatus();
      if (response.success) {
        setModelsStatus(response.models);
        console.log('模型状态:', response.models);
      } else {
        setError(response.error || '获取模型状态失败');
      }
    } catch (err: any) {
      setError(err.message || '网络错误');
      console.error('获取模型状态失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModelsStatus();
  }, []);

  const getStatusIcon = (available: boolean) => {
    if (available) {
      return <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />;
    } else {
      return <ErrorIcon sx={{ color: 'error.main', fontSize: 20 }} />;
    }
  };

  const getStatusColor = (available: boolean) => {
    return available ? 'success' : 'error';
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        模型可用性测试
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button 
          variant="contained" 
          onClick={loadModelsStatus}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : '刷新状态'}
        </Button>
        
        {loading && (
          <Typography variant="body2" color="text.secondary">
            正在检查模型状态...
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            模型选择器测试
          </Typography>
          <SingleChatModelSelector
            value={selectedModel}
            onChange={setSelectedModel}
          />
          {selectedModel && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              已选择模型: {selectedModel}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        模型状态详情
      </Typography>

      {Object.keys(modelsStatus).length === 0 && !loading ? (
        <Alert severity="info">
          当前暂无可用模型，请联系平台管理员或稍后再试
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.entries(modelsStatus).map(([modelKey, status]: [string, any]) => (
            <Card key={modelKey} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  {getStatusIcon(status.available)}
                  <Typography variant="h6">
                    {status.model}
                  </Typography>
                  <Chip
                    label={status.available ? '可用' : '不可用'}
                    color={getStatusColor(status.available)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  提供商: {status.provider}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  状态: {status.status}
                </Typography>
                
                <Typography variant="body2" color={status.available ? 'success.main' : 'error.main'}>
                  {status.reason}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ModelStatusTest;