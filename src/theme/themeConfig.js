/**
 * Ant Design Theme Configuration
 * Enterprise Academic ERP Color Scheme with Dark Mode Support
 */

import { theme } from 'antd';

// Light Theme Configuration
export const lightTheme = {
  token: {
    // Primary Colors
    colorPrimary: '#1F3C88',
    colorPrimaryHover: '#2A4FA3',
    colorPrimaryActive: '#162D66',
    colorPrimaryBg: '#E8EDF8',
    colorPrimaryBgHover: '#D1DBF0',
    
    // Success/Accent Color
    colorSuccess: '#00B894',
    colorSuccessBg: '#E6F9F5',
    colorSuccessBorder: '#00B89433',
    
    // Info Color (Secondary)
    colorInfo: '#4E73DF',
    colorInfoBg: '#EEF2FC',
    
    // Layout Colors
    colorBgLayout: '#F8FAFF',
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    
    // Text Colors
    colorText: '#1A1A2E',
    colorTextSecondary: '#6B7280',
    colorTextTertiary: '#9CA3AF',
    colorTextQuaternary: '#D1D5DB',
    
    // Border
    colorBorder: '#E5E7EB',
    colorBorderSecondary: '#F3F4F6',
    
    // Typography
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,
    
    // Border Radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    
    // Shadows
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    
    // Control Heights
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
  },
  components: {
    Button: {
      primaryShadow: '0 2px 4px rgba(31, 60, 136, 0.25)',
      defaultBorderColor: '#E5E7EB',
      fontWeight: 500,
    },
    Card: {
      headerBg: 'transparent',
      paddingLG: 24,
    },
    Table: {
      headerBg: '#1F3C88',
      headerColor: '#FFFFFF',
      headerSortActiveBg: '#162D66',
      headerSortHoverBg: '#2A4FA3',
      rowHoverBg: '#F8FAFF',
      borderColor: '#E5E7EB',
      headerBorderRadius: 8,
    },
    Menu: {
      itemSelectedBg: 'rgba(78, 115, 223, 0.12)',
      itemSelectedColor: '#1F3C88',
      itemHoverBg: 'rgba(78, 115, 223, 0.08)',
      itemActiveBg: 'rgba(78, 115, 223, 0.15)',
      subMenuItemBg: 'transparent',
    },
    Layout: {
      siderBg: '#FFFFFF',
      headerBg: '#FFFFFF',
      bodyBg: '#F8FAFF',
    },
    Input: {
      activeBorderColor: '#4E73DF',
      hoverBorderColor: '#4E73DF',
    },
    Select: {
      optionSelectedBg: 'rgba(78, 115, 223, 0.12)',
    },
    Breadcrumb: {
      linkColor: '#6B7280',
      linkHoverColor: '#1F3C88',
      lastItemColor: '#1A1A2E',
    },
    Modal: {
      headerBg: '#FFFFFF',
      contentBg: '#FFFFFF',
      titleFontSize: 18,
    },
    Notification: {
      width: 400,
    },
    Tag: {
      defaultBg: '#F3F4F6',
      defaultColor: '#4B5563',
    },
  },
};

// Dark Theme Configuration
export const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    // Primary Colors (slightly brighter for dark mode)
    colorPrimary: '#4E73DF',
    colorPrimaryHover: '#6B8AE8',
    colorPrimaryActive: '#3A5FCC',
    colorPrimaryBg: '#1E293B',
    colorPrimaryBgHover: '#2D3B4F',
    
    // Success/Accent Color
    colorSuccess: '#00D9A5',
    colorSuccessBg: '#0D2E27',
    colorSuccessBorder: '#00B89433',
    
    // Info Color (Secondary)
    colorInfo: '#60A5FA',
    colorInfoBg: '#1E2A3B',
    
    // Layout Colors
    colorBgLayout: '#0F172A',
    colorBgContainer: '#1E293B',
    colorBgElevated: '#283548',
    
    // Text Colors
    colorText: '#F1F5F9',
    colorTextSecondary: '#94A3B8',
    colorTextTertiary: '#64748B',
    colorTextQuaternary: '#475569',
    
    // Border
    colorBorder: '#334155',
    colorBorderSecondary: '#1E293B',
    
    // Typography
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    
    // Border Radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // Shadows
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
    
    // Control Heights
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
  },
  components: {
    Button: {
      primaryShadow: '0 2px 4px rgba(78, 115, 223, 0.3)',
      defaultBorderColor: '#334155',
      fontWeight: 500,
    },
    Card: {
      headerBg: 'transparent',
      paddingLG: 24,
      colorBgContainer: '#1E293B',
    },
    Table: {
      headerBg: '#334155',
      headerColor: '#F1F5F9',
      headerSortActiveBg: '#3B4D63',
      headerSortHoverBg: '#3B4D63',
      rowHoverBg: '#283548',
      borderColor: '#334155',
      headerBorderRadius: 8,
      colorBgContainer: '#1E293B',
    },
    Menu: {
      itemSelectedBg: 'rgba(78, 115, 223, 0.2)',
      itemSelectedColor: '#60A5FA',
      itemHoverBg: 'rgba(78, 115, 223, 0.1)',
      itemActiveBg: 'rgba(78, 115, 223, 0.25)',
      subMenuItemBg: 'transparent',
      darkItemBg: '#1E293B',
    },
    Layout: {
      siderBg: '#1E293B',
      headerBg: '#1E293B',
      bodyBg: '#0F172A',
    },
    Input: {
      activeBorderColor: '#60A5FA',
      hoverBorderColor: '#60A5FA',
      colorBgContainer: '#283548',
    },
    Select: {
      optionSelectedBg: 'rgba(78, 115, 223, 0.2)',
      colorBgContainer: '#283548',
    },
    Breadcrumb: {
      linkColor: '#94A3B8',
      linkHoverColor: '#60A5FA',
      lastItemColor: '#F1F5F9',
    },
    Modal: {
      headerBg: '#1E293B',
      contentBg: '#1E293B',
      titleFontSize: 18,
    },
    Notification: {
      width: 400,
      colorBgElevated: '#283548',
    },
    Tag: {
      defaultBg: '#334155',
      defaultColor: '#94A3B8',
    },
  },
};

// For backward compatibility
export const themeConfig = lightTheme;

// Color Constants for use in components
export const colors = {
  primary: '#1F3C88',
  secondary: '#4E73DF',
  accent: '#00B894',
  background: '#F8FAFF',
  success: '#00B894',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#4E73DF',
  text: {
    primary: '#1A1A2E',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    white: '#FFFFFF',
  },
  border: '#E5E7EB',
};

// Dark mode color constants
export const darkColors = {
  primary: '#4E73DF',
  secondary: '#60A5FA',
  accent: '#00D9A5',
  background: '#0F172A',
  success: '#00D9A5',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
  text: {
    primary: '#F1F5F9',
    secondary: '#94A3B8',
    tertiary: '#64748B',
    white: '#FFFFFF',
  },
  border: '#334155',
};

export default themeConfig;
