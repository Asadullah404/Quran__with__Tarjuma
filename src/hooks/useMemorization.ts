import { useState, useEffect, useCallback } from 'react';
import { MemorizationState } from '@/types/quran';

const MEMORIZATION_STORAGE_KEY = 'quran_memorization_state';

export const useMemorization = () => {
  const [state, setState] = useState<MemorizationState>({
    bookmarks: [],
    isLooping: false,
  });

  // Load saved memorization state
  useEffect(() => {
    const savedState = localStorage.getItem(MEMORIZATION_STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(parsed);
      } catch (error) {
        console.error('Error loading memorization state:', error);
      }
    }
  }, []);

  // Save state to localStorage
  const saveState = useCallback((newState: MemorizationState) => {
    localStorage.setItem(MEMORIZATION_STORAGE_KEY, JSON.stringify(newState));
    setState(newState);
  }, []);

  const addBookmark = useCallback((surahId: number, timestamp: number, note?: string) => {
    const newBookmark = { surahId, timestamp, note };
    const newState = {
      ...state,
      bookmarks: [...state.bookmarks, newBookmark],
    };
    saveState(newState);
  }, [state, saveState]);

  const removeBookmark = useCallback((index: number) => {
    const newState = {
      ...state,
      bookmarks: state.bookmarks.filter((_, i) => i !== index),
    };
    saveState(newState);
  }, [state, saveState]);

  const setLoop = useCallback((start: number, end: number) => {
    const newState = {
      ...state,
      loopStart: start,
      loopEnd: end,
      isLooping: true,
    };
    saveState(newState);
  }, [state, saveState]);

  const clearLoop = useCallback(() => {
    const newState = {
      ...state,
      loopStart: undefined,
      loopEnd: undefined,
      isLooping: false,
    };
    saveState(newState);
  }, [state, saveState]);

  const toggleLoop = useCallback(() => {
    const newState = {
      ...state,
      isLooping: !state.isLooping,
    };
    saveState(newState);
  }, [state, saveState]);

  return {
    ...state,
    addBookmark,
    removeBookmark,
    setLoop,
    clearLoop,
    toggleLoop,
  };
};