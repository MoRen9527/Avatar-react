import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Box,
  Typography,
  Divider,
  Chip,
  Alert,
  IconButton,
  TextField
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as OnlineIcon,
  Cancel as OfflineIcon,
  HelpOutline as UnknownIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { setGroupChatSettings } from '../../store/chatSlice';
import { selectProviders, selectOnlineProviders } from '../../store/providerSlice';
import configManager from '../../services/ConfigManager';
import api from '../../services/api';
import { RootState, AppDispatch } from '../../store';

interface Provider {
  name: string;
  displayName: string;
  description: string;
  status: 'online' | 'offline' | 'unknown';
  hasApiKey?: boolean;
  defaultModel?: string;
  enabled?: boolean;
  features?: string[];
}

interface GroupChatSettingsState {
  selectedProviders: string[];
  replyStrategy: string;
  systemPrompt: string;
}

interface GroupChatSettingsProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: (selectedProviders: string[], settings: GroupChatSettingsState) => Promise<void>;
}

const GroupChatSettings: React.FC<GroupChatSettingsProps> = ({ open, onClose, onConfirm }) => {
  const dispatch = useDispatch<AppDispatch>();
  const groupChatSettings = useSelector((state: RootState) => state.chat.groupChatSettings);
  const providers = useSelector(selectProviders);
  const onlineProviders = useSelector(selectOnlineProviders);
  
  // 本地状态管理
  const [localSettings, setLocalSettings] = useState<GroupChatSettingsState>({
    selectedProviders: groupChatSettings?.selectedProviders || [],
    replyStrategy: groupChatSettings?.replyStrategy || 'discussion',
    systemPrompt: groupChatSettings?.systemPrompt || '你正在参加一场讨论，你可以随机选择一个自己的性格，用自己想要的风格（比如风趣）参与讨论，尽量用简短语言'
  });
  
  // 加载群聊配置
  useEffect(() => {
    const loadGroupChatConfig = async () => {
      try {
        const response = await api.get('/chat/group-settings');
        if (response.data?.success) {
          const serverSettings = response.data?.data;
          setLocalSettings({
            selectedProviders: serverSettings.selectedProviders || [],
            replyStrategy: serverSettings.replyStrategy || 'discussion',
            systemPrompt: serverSettings.systemPrompt || '你正在参加一场讨论，你可以随机选择一个自己的性格，用自己想要的风格（比如风趣）参与讨论，尽量用简短语言'
          });
          
          dispatch(setGroupChatSettings(serverSettings));
        }
      } catch (error) {
        console.warn('加载群聊配置失败，使用本地配置:', error);
        setLocalSettings({
          selectedProviders: groupChatSettings?.selectedProviders || [],
          replyStrategy: groupChatSettings?.replyStrategy || 'discussion',
          systemPrompt: groupChatSettings?.systemPrompt || '你正在参加一场讨论，你可以随机选择一个自己的性格，用自己想要的风格（比如风趣）参与讨论，尽量用简短语言'
        });
      }
    };
    
    if (open) {
      loadGroupChatConfig();
    }
  }, [open, dispatch, groupChatSettings]);

  // 回复策略配置
  const replyStrategies = [
    {
      value: 'exclusive',
      label: '独占模式',
      description: '只有第一个响应的AI会回复，其他AI将被忽略',
      icon: '🎯'
    },
    {
      value: 'discussion',
      label: '讨论模式',
      description: '所有AI都会看到其他AI的回复，形成多轮讨论',
      icon: '💬'
    },
    {
      value: 'supplement',
      label: '补充模式',
      description: '各AI依次回复，后回复的AI会看到前面的回复内容',
      icon: '📝'
    }
  ];

  // 处理Provider选择变化
  const handleProviderToggle = (providerName: string, modelId: string | null = null) => {
    const currentSelected = localSettings.selectedProviders;
    const providerKey = modelId ? `${providerName}:${modelId}` : providerName;
    
    const newSelected = currentSelected.includes(providerKey)
      ? currentSelected.filter(p => p !== providerKey)
      : [...currentSelected, providerKey];
    
    setLocalSettings({
      ...localSettings,
      selectedProviders: newSelected
    });
  };

  // 处理回复策略变化
  const handleStrategyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSettings({
      ...localSettings,
      replyStrategy: event.target.value
    });
  };

  // 处理系统提示词变化
  const handleSystemPromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSettings({
      ...localSettings,
      systemPrompt: event.target.value
    });
  };

  // 保存设置
  const handleSave = async () => {
    try {
      dispatch(setGroupChatSettings(localSettings));
      
      await api.post('/chat/group-settings', {
        selectedProviders: localSettings.selectedProviders,
        replyStrategy: localSettings.replyStrategy,
        systemPrompt: localSettings.systemPrompt,
        enabled: true,
        updatedAt: new Date().toISOString()
      });
      
      configManager.notifyListeners('groupChatConfigUpdated', localSettings);
      
      console.log('群聊设置保存成功:', localSettings);
      
      if (onConfirm) {
        await onConfirm(localSettings.selectedProviders, localSettings);
      }
      
      onClose();
      
    } catch (error) {
      console.error('保存群聊设置失败:', error);
      dispatch(setGroupChatSettings(localSettings));
      onClose();
    }
  };

  // 取消设置
  const handleCancel = () => {
    setLocalSettings({
      selectedProviders: groupChatSettings?.selectedProviders || [],
      replyStrategy: groupChatSettings?.replyStrategy || 'discussion',
      systemPrompt: groupChatSettings?.systemPrompt || '你正在参加一场讨论，你可以随机选择一个自己的性格，用自己想要的风格（比如风趣）参与讨论，尽量用简短语言'
    });
    onClose();
  };

  // 获取Provider状态图标
  const getStatusIcon = (provider: Provider) => {
    switch (provider.status) {
      case 'online':
        return <OnlineIcon sx={{ fontSize: 16, color: 'success.main' }} />;
      case 'offline':
        return <OfflineIcon sx={{ fontSize: 16, color: 'error.main' }} />;
      default:
        return <UnknownIcon sx={{ fontSize: 16, color: 'text.disabled' }} />;
    }
  };

  // 检查设置是否有效
  const isValidSettings = localSettings.selectedProviders.length >= 2;

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'var(--background-dark)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          borderRadius: '12px',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        color: 'var(--primary-color)',
        borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" component="span">
            群聊设置
          </Typography>
          <Chip 
            label="BETA" 
            size="small" 
            color="warning" 
            sx={{ fontSize: '0.6rem', height: 20 }}
          />
        </Box>
        <IconButton onClick={handleCancel} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ color: 'var(--text-color)', mt: 2 }}>
        {/* Provider选择 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, color: 'var(--primary-color)' }}>
            选择参与的AI模型
          </Typography>
          
          {onlineProviders.length === 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              当前没有在线的AI模型。请检查网络连接或稍后再试。
            </Alert>
          )}
          
          {/* Provider选择区域 */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2, 
            mb: 2,
            p: 2,
            backgroundColor: 'rgba(0, 229, 255, 0.03)',
            borderRadius: 2,
            border: '1px solid rgba(0, 229, 255, 0.1)'
          }}>
            {providers.map((provider: Provider) => {
              const isEnabled = provider.enabled && provider.status === 'online';
              let borderColor = 'rgba(128, 128, 128, 0.2)';
              if (isEnabled) {
                borderColor = 'rgba(0, 229, 255, 0.3)';
              }
              if (localSettings.selectedProviders.includes(provider.name)) {
                borderColor = 'var(--primary-color)';
              }
              
              return (
                <Box
                  key={provider.name}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: 120,
                    p: 1.5,
                    backgroundColor: isEnabled 
                      ? 'rgba(0, 229, 255, 0.08)' 
                      : 'rgba(128, 128, 128, 0.05)',
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor,
                    cursor: isEnabled ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    '&:hover': isEnabled ? {
                      backgroundColor: 'rgba(0, 229, 255, 0.12)',
                      borderColor: 'var(--primary-color)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 229, 255, 0.2)'
                    } : {},
                    boxShadow: localSettings.selectedProviders.includes(provider.name)
                      ? '0 0 8px rgba(0, 229, 255, 0.4)'
                      : 'none'
                  }}
                  onClick={() => isEnabled && handleProviderToggle(provider.name)}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 1,
                    position: 'relative'
                  }}>
                    {getStatusIcon(provider)}
                    <Checkbox
                      checked={localSettings.selectedProviders.includes(provider.name)}
                      onChange={() => handleProviderToggle(provider.name)}
                      disabled={!isEnabled}
                      size="small"
                      sx={{
                        ml: 0.5,
                        color: 'var(--primary-color)',
                        '&.Mui-checked': {
                          color: 'var(--primary-color)',
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: 18
                        }
                      }}
                    />
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: isEnabled ? 'var(--text-color)' : 'text.disabled',
                      textAlign: 'center',
                      mb: 0.5,
                      fontSize: '0.8rem'
                    }}
                  >
                    {provider.displayName}
                  </Typography>
                  
                  {provider.features && provider.features.length > 0 && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 0.5, 
                      justifyContent: 'center',
                      mb: 0.5
                    }}>
                      {provider.features.slice(0, 2).map((feature) => (
                        <Chip
                          key={`${provider.name}-${feature}`}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.55rem', 
                            height: 16,
                            '& .MuiChip-label': {
                              px: 0.5
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      textAlign: 'center',
                      fontSize: '0.65rem',
                      lineHeight: 1.2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {provider.description}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          
          {!isValidSettings && (
            <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              <InfoIcon sx={{ fontSize: 14 }} />
              请至少选择2个AI模型进行群聊
            </Typography>
          )}
        </Box>

        <Divider sx={{ borderColor: 'rgba(0, 229, 255, 0.2)', my: 3 }} />

        {/* 回复策略 */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, color: 'var(--primary-color)' }}>
            回复策略
          </Typography>
          
          <FormControl component="fieldset">
            <RadioGroup
              value={localSettings.replyStrategy}
              onChange={handleStrategyChange}
            >
              {replyStrategies.map((strategy) => (
                <Box key={strategy.value} sx={{ mb: 2 }}>
                  <FormControlLabel
                    value={strategy.value}
                    control={
                      <Radio 
                        sx={{
                          color: 'var(--primary-color)',
                          '&.Mui-checked': {
                            color: 'var(--primary-color)',
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {strategy.icon} {strategy.label}
                        </Typography>
                      </Box>
                    }
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary', 
                      ml: 4,
                      display: 'block',
                      lineHeight: 1.4
                    }}
                  >
                    {strategy.description}
                  </Typography>
                </Box>
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        <Divider sx={{ borderColor: 'rgba(0, 229, 255, 0.2)', my: 3 }} />

        {/* 系统提示词 */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, color: 'var(--primary-color)' }}>
            系统提示词
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary', 
              display: 'block',
              mb: 2,
              lineHeight: 1.4
            }}
          >
            为所有参与群聊的AI模型设置统一的系统提示词，定义它们的行为风格和回复方式
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            value={localSettings.systemPrompt}
            onChange={handleSystemPromptChange}
            placeholder="输入系统提示词..."
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(0, 229, 255, 0.03)',
                color: 'var(--text-color)',
                '& fieldset': {
                  borderColor: 'rgba(0, 229, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 229, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--primary-color)',
                },
              },
              '& .MuiInputBase-input': {
                color: 'var(--text-color)',
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)',
                opacity: 1,
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(0, 229, 255, 0.2)' }}>
        <Button 
          onClick={handleCancel}
          sx={{ 
            color: 'text.secondary',
            '&:hover': { backgroundColor: 'rgba(128, 128, 128, 0.1)' }
          }}
        >
          取消
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isValidSettings}
          variant="contained"
          sx={{
            backgroundColor: 'var(--primary-color)',
            color: '#000',
            '&:hover': {
              backgroundColor: 'rgba(0, 229, 255, 0.8)',
            },
            '&:disabled': {
              backgroundColor: 'rgba(0, 229, 255, 0.3)',
              color: 'rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          保存设置
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupChatSettings;