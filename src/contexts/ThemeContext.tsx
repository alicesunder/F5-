import { flushSync } from 'react-dom';
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type DisplayDensity = 'comfortable' | 'standard' | 'compact';
export type FontSizeScale = 'small' | 'normal' | 'large'; // 90%, 100%, 115%

export interface SystemSettingsState {
  // General
  language: 'th' | 'en';
  timezone: string;
  dateFormat: string;
  timeFormat: '24h' | '12h';
  defaultHomePage: string;
  itemsPerPage: number;

  // Appearance
  theme: ThemeMode;
  density: DisplayDensity;
  fontSize: FontSizeScale;
  reducedMotion: boolean;

  // Notifications (Categories with push, inApp, email toggles)
  notifications: {
    missions: { push: boolean; inApp: boolean; email: boolean };
    reports: { push: boolean; inApp: boolean; email: boolean };
    documents: { push: boolean; inApp: boolean; email: boolean };
    deadline: { push: boolean; inApp: boolean; email: boolean };
    kpi: { push: boolean; inApp: boolean; email: boolean };
    news: { push: boolean; inApp: boolean; email: boolean };
    system: { push: boolean; inApp: boolean; email: boolean };
  };

  // Integrations state
  integrations: {
    googleWorkspace: boolean;
    googleMaps: boolean;
    storageBackup: boolean;
    lineNotify: boolean;
    bppIntelligence: boolean;
  };
}

export interface SettingsAuditItem {
  id: string;
  timestamp: string; // ISO or formatted
  actor: string;
  actorRole: string;
  action: string;
  category: string;
  detail: string;
}

interface ThemeContextType {
  // Theme state
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;

  // General settings
  settings: SystemSettingsState;
  updateSettings: (partial: Partial<SystemSettingsState>) => void;
  updateNotificationCategory: (
    category: keyof SystemSettingsState['notifications'],
    channel: 'push' | 'inApp' | 'email',
    val: boolean
  ) => void;
  updateIntegrationStatus: (service: keyof SystemSettingsState['integrations'], status: boolean) => void;
  resetSettingsToDefault: () => void;

  // Audit
  auditLogs: SettingsAuditItem[];
  addAuditLog: (action: string, category: string, detail: string) => void;

  // Save indicator
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

const STORAGE_KEY_THEME = 'fo5-theme';
const STORAGE_KEY_SETTINGS = 'fo5-system-settings';
const STORAGE_KEY_AUDIT = 'fo5-settings-audit';

const DEFAULT_SETTINGS: SystemSettingsState = {
  language: 'th',
  timezone: '(UTC+07:00) Bangkok, Hanoi, Jakarta',
  dateFormat: '13 กันยายน 2569 (พ.ศ.)',
  timeFormat: '24h',
  defaultHomePage: 'dashboard',
  itemsPerPage: 15,

  theme: 'light',
  density: 'standard',
  fontSize: 'normal',
  reducedMotion: false,

  notifications: {
    missions: { push: true, inApp: true, email: true },
    reports: { push: true, inApp: true, email: true },
    documents: { push: false, inApp: true, email: true },
    deadline: { push: true, inApp: true, email: true },
    kpi: { push: false, inApp: true, email: false },
    news: { push: false, inApp: true, email: false },
    system: { push: true, inApp: true, email: true },
  },

  integrations: {
    googleWorkspace: true,
    googleMaps: true,
    storageBackup: true,
    lineNotify: true,
    bppIntelligence: true,
  },
};

const INITIAL_AUDIT_LOGS: SettingsAuditItem[] = [];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** ตำแหน่งที่ผู้ใช้กดล่าสุด (ใช้เป็นจุดกำเนิดของวงกลมเปลี่ยนธีม) */
let lastPointer = { x: typeof window === 'undefined' ? 0 : window.innerWidth - 120, y: 40 };
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', e => (lastPointer = { x: e.clientX, y: e.clientY }), { capture: true, passive: true });
}

export const THEME_FX_EVENT = 'fo5:theme-fx';

function runThemeTransition(to: 'light' | 'dark', change: () => void) {
  const root = document.documentElement;
  const { x, y } = lastPointer;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = (document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }).startViewTransition;
  window.dispatchEvent(new CustomEvent(THEME_FX_EVENT, { detail: { to, x, y } }));
  if (reduce || !start) {
    change();
    return;
  }
  root.dataset.themeFx = to;
  const vt = start.call(document, () => {
    root.classList.toggle('dark', to === 'dark');
    root.classList.toggle('light', to === 'light');
    change();
  });
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  vt.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 900, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => undefined);
  (vt as unknown as { finished?: Promise<void> }).finished?.finally(() => {
    delete root.dataset.themeFx;
  });
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial theme from localStorage
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_THEME) as ThemeMode | null;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        return saved;
      }
    }
    return 'light';
  });

  // Track system OS preference
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Settings state
  const [settings, setSettings] = useState<SystemSettingsState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (saved) {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        }
      } catch (err) {
        console.error('Failed to parse saved settings', err);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Audit logs
  const [auditLogs, setAuditLogs] = useState<SettingsAuditItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_AUDIT);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (err) {
        console.error('Failed to parse audit logs', err);
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Listen to OS system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Listen to reduced motion changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches && !settings.reducedMotion) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
  }, []);

  // Resolve active theme: 'light' | 'dark'
  const resolvedTheme: 'light' | 'dark' = useMemo(() => {
    if (theme === 'system') {
      return systemPrefersDark ? 'dark' : 'light';
    }
    return theme;
  }, [theme, systemPrefersDark]);

  // Apply to document.documentElement with smooth transition class
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Apply dark/light class, data-theme, and colorScheme strictly
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      if (document.body) {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
        document.body.setAttribute('data-theme', 'dark');
      }
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      if (document.body) {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        document.body.setAttribute('data-theme', 'light');
      }
    }

    // Apply density dataset
    root.setAttribute('data-density', settings.density);

    // Apply font-size dataset
    root.setAttribute('data-fontsize', settings.fontSize);

    // Apply reduced motion class
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Persist theme
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [resolvedTheme, theme, settings.density, settings.fontSize, settings.reducedMotion]);

  // Add audit log helper
  const addAuditLog = (action: string, category: string, detail: string) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear() + 543}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: SettingsAuditItem = {
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: formattedDate,
      actor: 'พล.อ. ชาญชัย สุวรรณเวช',
      actorRole: 'ผู้ดูแลระบบสูงสุด (Super Admin)',
      action,
      category,
      detail,
    };
    setAuditLogs(prev => {
      const next = [newLog, ...prev.slice(0, 49)];
      try {
        localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Update theme function
  const setTheme = (mode: ThemeMode) => {
    const next: 'light' | 'dark' = mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;
    if (next !== resolvedTheme) {
      // เปลี่ยนสว่าง↔มืด: เผยธีมใหม่เป็นวงกลมขยายออกจากจุดที่กด (View Transitions) + ส่งสัญญาณให้เอฟเฟกต์ดาว/ประกาย
      runThemeTransition(next, () => {
        flushSync(() => setThemeState(mode));
      });
    } else {
      setThemeState(mode);
    }
    setSettings(prev => ({ ...prev, theme: mode }));
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 350);
    setTimeout(() => setSaveStatus('idle'), 2400);

    const label = mode === 'light' ? 'Light Mode (สว่าง)' : mode === 'dark' ? 'Dark Mode (มืด)' : 'System Mode (ตามอุปกรณ์)';
    addAuditLog(`เปลี่ยนธีมเป็น ${label}`, 'Appearance', `ผู้ใช้งานเลือกการแสดงผลแบบ ${label}`);
  };

  // Toggle theme quick cycle
  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  // Update settings with auto-save & audit
  const updateSettings = (partial: Partial<SystemSettingsState>) => {
    setSaveStatus('saving');
    setSettings(prev => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save settings to localStorage', err);
      }
      return updated;
    });

    setTimeout(() => setSaveStatus('saved'), 400);
    setTimeout(() => setSaveStatus('idle'), 2500);
  };

  const updateNotificationCategory = (
    category: keyof SystemSettingsState['notifications'],
    channel: 'push' | 'inApp' | 'email',
    val: boolean
  ) => {
    setSettings(prev => {
      const cat = { ...prev.notifications[category], [channel]: val };
      const updated = {
        ...prev,
        notifications: {
          ...prev.notifications,
          [category]: cat,
        },
      };
      try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 300);
    setTimeout(() => setSaveStatus('idle'), 2000);
    addAuditLog(`ปรับการแจ้งเตือน ${category} (${channel}: ${val ? 'เปิด' : 'ปิด'})`, 'Notification', `ปรับช่องทาง ${channel} เป็น ${val}`);
  };

  const updateIntegrationStatus = (service: keyof SystemSettingsState['integrations'], status: boolean) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        integrations: {
          ...prev.integrations,
          [service]: status,
        },
      };
      try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 300);
    setTimeout(() => setSaveStatus('idle'), 2000);
    addAuditLog(`สลับสถานะการเชื่อมต่อ ${service}: ${status ? 'เชื่อมต่อ' : 'ตัดการเชื่อมต่อ'}`, 'Integrations', `Service: ${service}`);
  };

  const resetSettingsToDefault = () => {
    setSettings(DEFAULT_SETTINGS);
    setThemeState('light');
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    } catch {
      // ignore
    }
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
    addAuditLog('รีเซ็ตการตั้งค่าระบบเป็นค่าเริ่มต้นโรงงาน', 'System', 'ผู้ใช้งานสั่ง Reset All Configuration');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        settings,
        updateSettings,
        updateNotificationCategory,
        updateIntegrationStatus,
        resetSettingsToDefault,
        auditLogs,
        addAuditLog,
        saveStatus,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
