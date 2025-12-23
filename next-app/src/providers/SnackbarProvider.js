'use client';

import { createContext, useState } from 'react';
import { wait } from '@/utils/utile';

export const SnackbarContext = createContext(null);

export default function SnackbarProvider({ children }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success'); 

  const handleSnackbarOpen = async (message, severity = 'success', delay = 0) => {
    if (delay > 0) await wait(delay);
    setMessage(message);
    setSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const value = {
    snackbarOpen,
    message,
    severity,
    handleSnackbarOpen,
    handleSnackbarClose,
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
    </SnackbarContext.Provider>
  );
}
