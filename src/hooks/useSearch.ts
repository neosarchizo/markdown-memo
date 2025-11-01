import { useState, useEffect } from 'react';
import { Memo } from '@/types/memo';
import { StorageService } from '@/services/storage';
import { useDebounce } from './useDebounce';

export function useSearch(allMemos: Memo[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Memo[]>(allMemos);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search query (300ms)
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        // Empty query - return all memos
        setSearchResults(allMemos);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await StorageService.searchMemos(debouncedQuery.trim());
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching memos:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedQuery, allMemos]);

  // Update search results when allMemos changes (and no active search)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(allMemos);
    }
  }, [allMemos, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
  };
}
