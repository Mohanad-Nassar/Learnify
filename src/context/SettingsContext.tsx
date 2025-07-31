
'use client'

import React, { createContext, useState, ReactNode, useEffect } from 'react';

type SettingsContextType = {
  timezone: string;
  setTimezone: (timezone: string) => void;
};

// Default to UTC if browser timezone is not available
const defaultTimezone = 'UTC+00:00';

export const SettingsContext = createContext<SettingsContextType>({
  timezone: defaultTimezone,
  setTimezone: () => {},
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [timezone, setTimezoneState] = useState<string>(defaultTimezone);

  useEffect(() => {
    // This effect runs only on the client-side
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const storedTimezone = localStorage.getItem('learnify-timezone');
    setTimezoneState(storedTimezone || browserTimezone || defaultTimezone);
  }, []);

  const setTimezone = (newTimezone: string) => {
    setTimezoneState(newTimezone);
    localStorage.setItem('learnify-timezone', newTimezone);
  };

  return (
    <SettingsContext.Provider value={{ timezone, setTimezone }}>
      {children}
    </SettingsContext.Provider>
  );
};
