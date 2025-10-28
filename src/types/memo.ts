// Core Types
export interface Memo {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string; // ISO 8601
  updatedAt: string;
  isPinned: boolean;
}

export interface MemoFilter {
  searchQuery: string;
  tags: string[];
}

export type SortType = 'createdAt' | 'updatedAt' | 'title';
export type ViewMode = 'rendered' | 'raw';
export type ExportFormat = 'markdown' | 'pdf' | 'text';
export type ExportMethod = 'email' | 'clipboard' | 'share' | 'save';

// Database Types
export interface MemoRow {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPinned: number; // SQLite stores boolean as 0 or 1
}

export interface TagRow {
  id: number;
  name: string;
}

export interface MemoTagRow {
  memoId: string;
  tagId: number;
}

export interface SettingRow {
  key: string;
  value: string;
}

// Context Types
export interface MemoContextValue {
  memos: Memo[];
  loading: boolean;
  error: string | null;
  createMemo: (memo: Partial<Memo>) => Promise<Memo>;
  updateMemo: (id: string, updates: Partial<Memo>) => Promise<void>;
  deleteMemo: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  searchMemos: (query: string) => Memo[];
  refreshMemos: () => Promise<void>;
}

export interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => Promise<void>;
}
