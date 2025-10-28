# Low Level Design (LLD)
## Markdown Memo App

### 1. Architecture Overview

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Screens, Components, Navigation)  │
├─────────────────────────────────────┤
│         Business Logic Layer        │
│     (Hooks, Context, Services)      │
├─────────────────────────────────────┤
│          Data Layer                 │
│   (Storage, Models, Serialization)  │
└─────────────────────────────────────┘
```

### 2. Project Structure

```
app/
├── _layout.tsx              # Root layout with providers
├── index.tsx                # Home screen (Memo list)
├── editor/
│   └── [id].tsx             # Memo editor (dynamic route)
└── settings.tsx             # Settings screen

src/
├── types/
│   └── memo.ts              # TypeScript interfaces
├── contexts/
│   ├── ThemeContext.tsx     # Theme state management
│   └── MemoContext.tsx      # Memo CRUD operations
├── services/
│   ├── storage.ts           # Async storage operations
│   ├── markdown.ts          # Markdown parsing/rendering
│   └── export.ts            # Export functionality
├── hooks/
│   ├── useMemos.ts          # Memo data hook
│   ├── useSearch.ts         # Search logic hook
│   └── useExport.ts         # Export logic hook
├── components/
│   ├── MemoList/
│   │   ├── MemoList.tsx
│   │   ├── MemoItem.tsx
│   │   └── MemoListHeader.tsx
│   ├── Editor/
│   │   ├── MarkdownEditor.tsx
│   │   ├── EditorToolbar.tsx
│   │   ├── FormatButton.tsx
│   │   └── CodeLanguagePicker.tsx
│   ├── Viewer/
│   │   ├── MarkdownViewer.tsx
│   │   └── ViewToggle.tsx
│   ├── Search/
│   │   └── SearchBar.tsx
│   └── Common/
│       ├── TagChip.tsx
│       └── ConfirmDialog.tsx
└── utils/
    ├── markdown-helpers.ts
    ├── date-helpers.ts
    └── export-helpers.ts
```

**Note:** Using Expo Router for file-based routing. Screens are defined in `app/` folder.

### 3. Data Models

#### 3.1 Core Types
```typescript
// types/memo.ts
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
```

### 4. Storage Layer

#### 4.1 Database Schema
```sql
-- Memos table
CREATE TABLE IF NOT EXISTS memos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  isPinned INTEGER DEFAULT 0
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

-- MemoTags junction table (many-to-many)
CREATE TABLE IF NOT EXISTS memo_tags (
  memoId TEXT NOT NULL,
  tagId INTEGER NOT NULL,
  PRIMARY KEY (memoId, tagId),
  FOREIGN KEY (memoId) REFERENCES memos(id) ON DELETE CASCADE,
  FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_memos_created ON memos(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_memos_updated ON memos(updatedAt DESC);
CREATE INDEX IF NOT EXISTS idx_memos_pinned ON memos(isPinned DESC, updatedAt DESC);
CREATE INDEX IF NOT EXISTS idx_memo_tags_memo ON memo_tags(memoId);
CREATE INDEX IF NOT EXISTS idx_memo_tags_tag ON memo_tags(tagId);
```

#### 4.2 Storage Service
```typescript
// services/storage.ts
import * as SQLite from 'expo-sqlite';

export class StorageService {
  private static db: SQLite.SQLiteDatabase;

  // Initialize database
  static async init(): Promise<void>

  // Memo operations
  static async loadMemos(): Promise<Memo[]>
  static async getMemo(id: string): Promise<Memo | null>
  static async saveMemo(memo: Memo): Promise<void>
  static async updateMemo(id: string, updates: Partial<Memo>): Promise<void>
  static async deleteMemo(id: string): Promise<void>

  // Search operations
  static async searchMemos(query: string): Promise<Memo[]>
  static async getMemosByTag(tag: string): Promise<Memo[]>

  // Tag operations
  static async getAllTags(): Promise<string[]>
  static async addTagToMemo(memoId: string, tag: string): Promise<void>
  static async removeTagFromMemo(memoId: string, tag: string): Promise<void>

  // Settings operations
  static async saveSetting(key: string, value: string): Promise<void>
  static async loadSetting(key: string): Promise<string | null>
  static async saveTheme(theme: 'light' | 'dark'): Promise<void>
  static async loadTheme(): Promise<'light' | 'dark'>
}
```

#### 4.3 Database Helper
```typescript
// services/database.ts
import * as SQLite from 'expo-sqlite';

export class Database {
  private static instance: SQLite.SQLiteDatabase;
  private static readonly DB_NAME = 'markdown_memo.db';
  private static readonly DB_VERSION = 1;

  static async open(): Promise<SQLite.SQLiteDatabase>
  static async createTables(): Promise<void>
  static async migrate(fromVersion: number, toVersion: number): Promise<void>
  static async executeQuery<T>(sql: string, params?: any[]): Promise<T[]>
  static async executeUpdate(sql: string, params?: any[]): Promise<void>
  static async transaction(callback: () => Promise<void>): Promise<void>
}
```

#### 4.4 Data Migration Strategy
- Database version tracking in settings table
- Migration functions for schema changes (v1 → v2, etc.)
- Automatic migration on app startup
- Backup before migration
- Rollback support on migration failure
- Export/import for manual backup

### 5. Context Providers

#### 5.1 MemoContext
```typescript
// contexts/MemoContext.tsx
interface MemoContextValue {
  memos: Memo[];
  loading: boolean;
  createMemo: (memo: Partial<Memo>) => Promise<Memo>;
  updateMemo: (id: string, updates: Partial<Memo>) => Promise<void>;
  deleteMemo: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  searchMemos: (query: string) => Memo[];
}
```

#### 5.2 ThemeContext
```typescript
// contexts/ThemeContext.tsx
interface ThemeContextValue {
  theme: MD3Theme;
  isDark: boolean;
  toggleTheme: () => void;
}
```

### 6. Component Specifications

#### 6.1 MemoListScreen
**Responsibilities:**
- Display sorted memo list (pinned first)
- Search bar integration
- FAB for new memo
- Pull-to-refresh

**State:**
- Search query
- Filter options
- Sort preference

#### 6.2 MemoEditorScreen
**Responsibilities:**
- Edit title, content, tags
- Toolbar with formatting buttons
- View mode toggle (raw/rendered)
- Auto-save on changes

**State:**
- Current memo
- View mode
- Cursor position
- Undo/redo stack

**Components:**
- `EditorToolbar`: Format buttons
- `MarkdownEditor`: Text input with syntax support
- `MarkdownViewer`: Rendered preview
- `TagInput`: Tag management

#### 6.3 EditorToolbar
**Buttons:**
- Bold, Italic, Underline, Strikethrough
- Heading (H1-H6 picker)
- Bullet list, Checkbox list
- Indent, Outdent
- Code block (with language picker)
- Link insertion dialog
- Table generator dialog

**Implementation:**
- Insert Markdown syntax at cursor
- Wrap selected text with formatting
- Context-aware button states

### 7. Markdown Processing

#### 7.1 Parser Library
**Options:**
- `react-native-markdown-display` - Rendering
- `remark` / `unified` - Advanced parsing
- Custom renderer for special features

#### 7.2 Supported Syntax
- CommonMark standard
- GFM (GitHub Flavored Markdown)
- Custom extensions: underline, highlighting

#### 7.3 Code Highlighting
- `react-syntax-highlighter`
- Support languages: JS, Python, Java, C++, etc.
- Theme matches app theme

### 8. Export Implementation

#### 8.1 Export Service
```typescript
// services/export.ts
export class ExportService {
  static async exportMarkdown(memo: Memo, method: ExportMethod): Promise<void>
  static async exportPDF(memo: Memo, method: ExportMethod): Promise<void>
  static async exportText(memo: Memo, method: ExportMethod): Promise<void>

  private static async shareFile(uri: string, mimeType: string): Promise<void>
  private static async copyToClipboard(content: string): Promise<void>
  private static async sendEmail(attachment: string): Promise<void>
}
```

#### 8.2 PDF Generation
**Library:** `react-native-html-to-pdf`
- Convert Markdown → HTML → PDF
- Apply styling to match rendered view
- Embed fonts for consistency

#### 8.3 Email Integration
**Library:** `react-native-mail` or `Linking.openURL`
- Attach generated file
- Pre-fill subject with memo title
- Handle email client not installed

### 9. Search Implementation

#### 9.1 SQLite-Based Search
```typescript
// services/storage.ts - Search method
static async searchMemos(query: string): Promise<Memo[]> {
  const sql = `
    SELECT DISTINCT m.*
    FROM memos m
    LEFT JOIN memo_tags mt ON m.id = mt.memoId
    LEFT JOIN tags t ON mt.tagId = t.id
    WHERE m.title LIKE ?
       OR m.content LIKE ?
       OR t.name LIKE ?
    ORDER BY m.isPinned DESC, m.updatedAt DESC
  `;

  const searchPattern = `%${query}%`;
  return await Database.executeQuery(sql, [
    searchPattern,
    searchPattern,
    searchPattern
  ]);
}
```

#### 9.2 Advanced Search (Optional Enhancement)
**Full-Text Search (FTS5):**
```sql
-- Create FTS virtual table
CREATE VIRTUAL TABLE IF NOT EXISTS memos_fts
USING fts5(title, content, content=memos, content_rowid=id);

-- Triggers to keep FTS in sync
CREATE TRIGGER IF NOT EXISTS memos_fts_insert AFTER INSERT ON memos BEGIN
  INSERT INTO memos_fts(rowid, title, content)
  VALUES (new.id, new.title, new.content);
END;
```

#### 9.3 Performance Optimization
- Debounce search input (300ms)
- Use SQLite indexes (already defined)
- LIKE with indexes for simple search
- FTS5 for advanced full-text search (Phase 2)
- Limit results with SQL LIMIT clause

### 10. State Management Strategy

**Approach:** Context API + Hooks
- Simple for MVP
- No external dependencies
- Easy to migrate to Redux/Zustand later

**State Structure:**
```typescript
AppState {
  memos: Memo[]
  theme: 'light' | 'dark'
  settings: {
    sortBy: SortType
    autoSave: boolean
  }
}
```

### 11. Navigation

**Library:** Expo Router (file-based routing)

**Route Structure:**
```
app/
├── _layout.tsx           # Root layout (providers, theme)
├── index.tsx             # Route: / (Memo list)
├── editor/
│   └── [id].tsx          # Route: /editor/:id or /editor/new
└── settings.tsx          # Route: /settings
```

**Navigation Examples:**
```typescript
// Navigate to create new memo
router.push('/editor/new');

// Navigate to edit existing memo
router.push(`/editor/${memoId}`);

// Navigate to settings
router.push('/settings');

// Go back
router.back();
```

**Route Params:**
- `/editor/[id]`: Access via `useLocalSearchParams<{ id: string }>()`
  - `id === 'new'` → Create new memo
  - `id === memoId` → Edit existing memo

**Layout Configuration:**
```typescript
// app/_layout.tsx
import { useEffect, useState } from 'react';
import { StorageService } from '@/services/storage';

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    // Initialize database on app startup
    StorageService.init()
      .then(() => setDbReady(true))
      .catch(console.error);
  }, []);

  if (!dbReady) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <MemoProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Memos" }} />
          <Stack.Screen name="editor/[id]" options={{ title: "Edit Memo" }} />
          <Stack.Screen name="settings" options={{ title: "Settings" }} />
        </Stack>
      </MemoProvider>
    </ThemeProvider>
  );
}
```

### 12. Performance Considerations

#### 12.1 List Rendering
- `FlatList` with `getItemLayout` for fixed heights
- `windowSize` optimization
- `removeClippedSubviews` on Android

#### 12.2 Editor Performance
- Debounce auto-save (1000ms)
- Throttle preview updates
- Lazy load Markdown renderer

#### 12.3 Storage Optimization (SQLite)
- Use transactions for batch operations
- Prepared statements for repeated queries
- Connection pooling (single connection for now)
- WAL (Write-Ahead Logging) mode for better concurrency
- VACUUM command for database maintenance
- Paginate queries with LIMIT/OFFSET for large datasets

### 13. Error Handling

**Strategies:**
- Try-catch in async operations
- Error boundaries for React errors
- User-friendly error messages
- Retry logic for storage failures

### 14. Testing Strategy

#### 14.1 Unit Tests
- Storage service CRUD
- Markdown helpers
- Search algorithm
- Export functions

#### 14.2 Integration Tests
- Context providers
- Navigation flow
- Storage persistence

#### 14.3 E2E Tests (Optional)
- Create/Edit/Delete memo flow
- Search functionality
- Export flow

### 15. Dependencies

**Core:**
- expo ~51.0.0
- expo-router ^3.5.0
- expo-sqlite ^14.0.0
- react-native-paper ^5.12.0
- react-native-markdown-display
- expo-linking
- expo-constants

**Export:**
- react-native-html-to-pdf
- @react-native-community/clipboard
- expo-sharing
- expo-mail-composer

**Utilities:**
- uuid (for ID generation)
- date-fns (date formatting)

**Dev:**
- typescript
- @types/react
- eslint
- prettier

### 16. Security Considerations

- No sensitive data encryption (local device trust)
- Sanitize Markdown input (prevent XSS in HTML export)
- Validate file paths for export
- Handle permissions for file system access

### 17. Accessibility

- Screen reader support (labels, hints)
- High contrast theme support
- Font scaling respect
- Keyboard navigation (where applicable)
- Focus management

### 18. Localization (Future)

- i18n structure ready
- Date formatting locale-aware
- RTL support consideration
