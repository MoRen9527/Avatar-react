import React from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, Select } from '@mui/material';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  // 取主语言代码，方便多语言扩展
  const value = i18n.language?.split('-')[0] || 'en';

  const handleChange = (e: React.ChangeEvent<{ value: unknown }> | any) => {
    const lang = e.target.value as string;
    void i18n.changeLanguage(lang);
  };

  return (
    <Select
      size="small"
      value={value}
      onChange={handleChange}
      sx={{ minWidth: 92 }}
      aria-label="Language selector"
    >
      <MenuItem value="en">English</MenuItem>
      <MenuItem value="zh">中文</MenuItem>
    </Select>
  );
}
