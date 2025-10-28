# Product Requirements Document (PRD)
## Markdown Memo App

### 1. Overview
Mobile memo app using Markdown format with rich editing features, local storage, and export capabilities.

### 2. Tech Stack
- TypeScript
- Expo
- React Native Paper (UI)

### 3. Core Features

#### 3.1 Theme Management
- Light/Dark theme toggle
- System theme respect (optional)
- Persistent theme preference

#### 3.2 Memo Data Structure
```typescript
interface Memo {
  id: string;
  title: string;
  content: string; // Markdown format
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
}
```

#### 3.3 Display & Organization
- List view with title, preview, date
- Pinned memos at top, unpinned below
- Sort by: creation date, update date, title
- Grid/List view toggle (optional)

#### 3.4 Search Functionality
- Real-time search
- Search scope: title, content
- Tag filtering
- Search history (optional)

#### 3.5 Editor Features

**Text Formatting:**
- Bold (`**text**`)
- Italic (`*text*`)
- Underline (HTML: `<u>text</u>`)
- Strikethrough (`~~text~~`)

**Lists:**
- Bullet list (`- item`)
- Checkbox list (`- [ ] item`, `- [x] item`)
- Numbered list (`1. item`)
- Indent/outdent support

**Advanced:**
- Table insertion (grid picker or template)
- Link insertion (`[text](url)`)
- Code blocks with language selection
- Image insertion (optional)
- Heading levels

**Editor Toolbar:**
- Quick access buttons for all formatting
- Markdown shortcuts support
- Undo/Redo

#### 3.6 View Modes
- Rendered view (Markdown parsed to rich text)
- Raw view (plain Markdown source)
- Toggle button to switch between views
- Split view (optional enhancement)

#### 3.7 Storage
- Local SQLite database (expo-sqlite)
- Relational schema: memos, tags, memo_tags junction, settings
- Auto-save on edit
- Transactional integrity
- Database migrations for schema updates
- No cloud sync (v1)

#### 3.8 Export Features

**Export Formats:**
- Markdown file (.md)
- PDF document
- Plain text

**Export Methods:**
- Email (with attachment)
- Copy to clipboard
- Share sheet (native share)
- Save to device storage

#### 3.9 Additional Features
- Memo deletion with confirmation
- Bulk operations (delete, export multiple)
- Tag management
- Memo statistics (word count, char count)

### 4. User Flow

#### 4.1 Main Screen
1. Display memo list (pinned + unpinned)
2. Search bar at top
3. FAB for new memo
4. Menu for settings/theme

#### 4.2 Create/Edit Flow
1. Tap FAB or existing memo
2. Enter title
3. Add tags
4. Edit content with toolbar
5. Toggle preview/raw view
6. Auto-save
7. Back to list

#### 4.3 Export Flow
1. Open memo
2. Tap export button
3. Select format (MD/PDF)
4. Choose method (email/share/clipboard/save)
5. Execute export

### 5. Non-Functional Requirements

#### 5.1 Performance
- List renders efficiently (virtualized)
- Search responds <200ms (SQLite indexed queries)
- Editor lag-free for docs <50KB
- Database operations <100ms
- Efficient batch operations via transactions

#### 5.2 UX
- Material Design 3 (via React Native Paper)
- Responsive layouts
- Smooth animations
- Accessibility support

#### 5.3 Data
- No data loss on crash
- Export preserves formatting
- Backward compatible storage

### 6. Future Enhancements (Post-MVP)
- Cloud sync (iCloud/Google Drive)
- Collaboration features
- Voice-to-text
- Folder organization
- Template system
- Drawing/sketching
- Rich media embeds

### 7. Success Metrics
- App launches <2s
- Zero data loss reports
- Export success rate >99%
- User retention >60% (30 days)

### 8. Constraints
- Offline-first architecture
- iOS and Android parity
- Minimum support: iOS 13+, Android 8+
