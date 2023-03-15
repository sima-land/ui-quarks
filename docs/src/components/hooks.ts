import { useCallback, useEffect, useRef, useState } from 'react';

export interface Toast {
  id: string;
  text: string;
  hidden?: boolean;
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const timerIdRef = useRef<number | null>(null);

  const addToast = useCallback((text: string) => {
    setToasts(list =>
      [
        {
          id: Math.random().toString(16),
          text,
          hidden: false,
        },
        ...list,
      ]
        .map((item, index) => (index > 2 ? { ...item, hidden: true } : item))
        .slice(0, 5),
    );

    if (timerIdRef.current !== null) {
      window.clearInterval(timerIdRef.current);
    }

    timerIdRef.current = window.setInterval(() => {
      setToasts(list =>
        list
          .slice(0, -1)
          .map((item, index, { length }) =>
            index === length - 1 ? { ...item, hidden: true } : item,
          ),
      );
    }, 1500);
  }, []);

  return { toasts, addToast };
}

export function useDarkTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  return { theme, setTheme };
}
