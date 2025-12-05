import { useState, useCallback } from 'react';

export const useConfirm = () => {
  const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const confirm = useCallback((title, message) => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        title,
        message,
        onConfirm: () => {
          setDialog({ isOpen: false, title: '', message: '', onConfirm: null });
          resolve(true);
        }
      });
    });
  }, []);

  const cancel = useCallback(() => {
    setDialog({ isOpen: false, title: '', message: '', onConfirm: null });
  }, []);

  return { dialog, confirm, cancel };
};