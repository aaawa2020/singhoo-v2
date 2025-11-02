import { useState, useEffect, useCallback } from 'react';
import { HistoryItem } from '../types';

const HISTORY_STORAGE_KEY = 'singhoo_illustrator_history';

export const useHistory = (): [
  HistoryItem[],
  (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void,
  (id: string) => void,
  () => void
] => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  const addHistoryItem = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newHistoryItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    } as HistoryItem;
    // Prevent duplicate entries if generation is very fast
    setHistory(prev => {
        if (prev.length > 0 && prev[0].imageUrl === newHistoryItem.imageUrl) {
            return prev;
        }
        return [newHistoryItem, ...prev]
    });
  }, []);

  const removeHistoryItem = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return [history, addHistoryItem, removeHistoryItem, clearHistory];
};
