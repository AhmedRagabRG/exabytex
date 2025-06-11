'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencySettings } from '@/lib/currency';

interface CurrencyContextType {
  settings: CurrencySettings;
  updateSettings: (newSettings: CurrencySettings) => void;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CurrencySettings>({
    defaultCurrency: 'SAR',
    currencySymbol: 'ر.س',
    currencyPosition: 'after',
    decimalPlaces: 2
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/currency');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (error) {
      console.error('Error fetching currency settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = (newSettings: CurrencySettings) => {
    setSettings(newSettings);
  };

  return (
    <CurrencyContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrencyContext() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrencyContext must be used within a CurrencyProvider');
  }
  return context;
} 