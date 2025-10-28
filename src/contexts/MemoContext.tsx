import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '@/services/storage';
import type { Memo, MemoContextValue } from '@/types/memo';

const MemoContext = createContext<MemoContextValue | undefined>(undefined);

interface MemoProviderProps {
  children: React.ReactNode;
}

export function MemoProvider({ children }: MemoProviderProps) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load memos on mount
  useEffect(() => {
    loadMemos();
  }, []);

  const loadMemos = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedMemos = await StorageService.loadMemos();
      setMemos(loadedMemos);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load memos';
      setError(errorMessage);
      console.error('Error loading memos:', err);
    } finally {
      setLoading(false);
    }
  };

  const createMemo = useCallback(async (memoData: Partial<Memo>): Promise<Memo> => {
    try {
      const newMemo: Memo = {
        id: uuidv4(),
        title: memoData.title || 'Untitled',
        content: memoData.content || '',
        tags: memoData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: memoData.isPinned || false,
      };

      await StorageService.saveMemo(newMemo);

      // Add to local state
      setMemos((prev) => [newMemo, ...prev]);

      return newMemo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create memo';
      setError(errorMessage);
      console.error('Error creating memo:', err);
      throw err;
    }
  }, []);

  const updateMemo = useCallback(async (id: string, updates: Partial<Memo>): Promise<void> => {
    try {
      await StorageService.updateMemo(id, updates);

      // Update local state
      setMemos((prev) =>
        prev.map((memo) =>
          memo.id === id
            ? {
                ...memo,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : memo
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update memo';
      setError(errorMessage);
      console.error('Error updating memo:', err);
      throw err;
    }
  }, []);

  const deleteMemo = useCallback(async (id: string): Promise<void> => {
    try {
      await StorageService.deleteMemo(id);

      // Remove from local state
      setMemos((prev) => prev.filter((memo) => memo.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete memo';
      setError(errorMessage);
      console.error('Error deleting memo:', err);
      throw err;
    }
  }, []);

  const togglePin = useCallback(async (id: string): Promise<void> => {
    try {
      const memo = memos.find((m) => m.id === id);
      if (!memo) return;

      const isPinned = !memo.isPinned;
      await StorageService.updateMemo(id, { isPinned });

      // Update local state and re-sort
      setMemos((prev) => {
        const updated = prev.map((m) =>
          m.id === id ? { ...m, isPinned } : m
        );
        // Sort: pinned first, then by updatedAt
        return updated.sort((a, b) => {
          if (a.isPinned !== b.isPinned) {
            return a.isPinned ? -1 : 1;
          }
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle pin';
      setError(errorMessage);
      console.error('Error toggling pin:', err);
      throw err;
    }
  }, [memos]);

  const searchMemos = useCallback((query: string): Memo[] => {
    if (!query.trim()) {
      return memos;
    }

    const lowerQuery = query.toLowerCase();
    return memos.filter(
      (memo) =>
        memo.title.toLowerCase().includes(lowerQuery) ||
        memo.content.toLowerCase().includes(lowerQuery) ||
        memo.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }, [memos]);

  const refreshMemos = useCallback(async (): Promise<void> => {
    await loadMemos();
  }, []);

  const value: MemoContextValue = {
    memos,
    loading,
    error,
    createMemo,
    updateMemo,
    deleteMemo,
    togglePin,
    searchMemos,
    refreshMemos,
  };

  return <MemoContext.Provider value={value}>{children}</MemoContext.Provider>;
}

export function useMemos(): MemoContextValue {
  const context = useContext(MemoContext);
  if (context === undefined) {
    throw new Error('useMemos must be used within a MemoProvider');
  }
  return context;
}
