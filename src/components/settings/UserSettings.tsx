import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Tabs, 
  Tab, 
  Box, 
  Typography,
  IconButton,
  Alert
} from '@mui/material';
import { 
  Close as CloseIcon
} from '@mui/icons-material';
import InterfaceSettings from './InterfaceSettings';
import PrivacySettings from './PrivacySettings';


interface UserSettingsProps {
  open: boolean;
  onClose: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ open, onClose }) => {
  const [currentTab, setCurrentTab] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
    setCurrentTab(newValue);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)',
          borderRadius: '12px',
          color: '#fff',
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
        pb: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h6" sx={{ color: '#00ffff' }}>
          ⚙️ 用户设置
        </Typography>
        <IconButton 
          onClick={onClose}
          sx={{ 
            color: '#00ffff',
            '&:hover': {
              backgroundColor: 'rgba(0, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Alert
          severity="info"
          sx={{
            m: 3,
            backgroundColor: 'rgba(0, 255, 255, 0.08)',
            color: '#d8ffff',
            border: '1px solid rgba(0, 255, 255, 0.2)'
          }}
        >
          AI 模型与提供商配置已转为平台管理员统一维护，不再对用户开放前端配置入口。
        </Alert>

        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          sx={{
            borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#00ffff'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#00ffff'
            }
          }}
        >
          <Tab label="🎨 界面设置" />
          <Tab label="🔒 隐私设置" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {currentTab === 0 && <InterfaceSettings />}
          {currentTab === 1 && <PrivacySettings />}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettings;