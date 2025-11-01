# Implementation Plan
## Markdown Memo App

### Overview
Phased development approach prioritizing core functionality first, then enhancements.

### Phase 0: Project Setup (Week 1) ✅ COMPLETED

#### 0.1 Initialize Project
- [x] Create Expo project with TypeScript template
- [x] Install React Native Paper and dependencies
- [x] Configure theme provider (light/dark)
- [x] Set up project structure (folders per LLD)
- [x] Configure linting (ESLint, Prettier)
- [x] Initialize git repository

#### 0.2 Core Dependencies
```bash
npm init -y
npm install expo@~51.0.0 react@18.2.0 react-native@0.74.5
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
npx expo install expo-sqlite
npm install react-native-paper
npm install react-native-markdown-display
npm install uuid date-fns
npm install --save-dev @types/uuid typescript @types/react
npm install --save-dev eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-react eslint-plugin-react-native
```

**Note:** Project initialized in existing directory instead of using template.

#### 0.3 Configuration Files
- [x] Configure `app.json` with scheme for deep linking
- [x] Set up TypeScript strict mode in `tsconfig.json`
- [x] Create `app/_layout.tsx` with theme and context providers
- [x] Create `app/index.tsx`, `app/editor/[id].tsx`, `app/settings.tsx`
- [x] Configure ESLint and Prettier
- [x] Update .gitignore for Expo project
- [x] Create README.md

**Deliverable:** ✅ Running Expo app with theme toggle - Successfully tested on Android emulator

**Implementation Notes:**
- Project structure created: app/, src/{types,contexts,services,hooks,components,utils}
- Basic navigation implemented with Expo Router
- Material Design 3 theme configured with React Native Paper
- All core dependencies installed and verified
- App successfully builds and runs on Android emulator (Pixel 9 Pro XL)

---

### Phase 1: Core Data & Storage (Week 2) ✅ COMPLETED

#### 1.1 Type Definitions
- [x] Create `types/memo.ts` with interfaces
- [x] Define all TypeScript types per LLD

#### 1.2 Database Setup
- [x] Create `services/database.ts` helper class
- [x] Implement database connection management
- [x] Create database schema (tables, indexes)
- [x] Test database initialization
- [x] Add database version tracking
- [x] Implement migration framework

#### 1.3 Storage Service
- [x] Implement `services/storage.ts` with SQLite
- [x] Memo CRUD operations (create, read, update, delete)
- [x] Tag operations (add, remove, list)
- [x] Search operations with SQL queries
- [x] Settings persistence (theme, preferences)
- [x] Error handling and transactions

#### 1.4 Memo Context
- [x] Create `MemoContext.tsx`
- [x] Implement memo state management
- [x] Add CRUD operations using StorageService
- [x] Pin/unpin functionality
- [x] Load memos on context initialization

#### 1.5 Theme Context
- [x] Create `ThemeContext.tsx`
- [x] Theme switching logic
- [x] Persist theme preference in SQLite
- [x] Load theme on app startup

#### 1.6 Database Initialization
- [x] Add database init in `app/_layout.tsx`
- [x] Create loading screen for DB initialization
- [x] Handle initialization errors gracefully

**Deliverable:** ✅ Working SQLite storage layer with context providers

**Implementation Notes:**
- Complete TypeScript type system with Memo, Tag, and Setting interfaces
- Database helper with WAL mode, foreign keys, and transaction support
- Full CRUD operations for memos with tag management
- MemoContext provides state management and operations
- ThemeContext with persistent theme switching (light/dark)
- Database initialization with loading screen and error handling
- Updated all screens (index, editor, settings) to use contexts
- Memo list displays with pinned memos, tags, and formatted dates
- Editor supports creating and updating memos with validation
- Theme toggle working in settings with SQLite persistence

**Testing:**
- Database schema creation verified
- Storage CRUD operations tested
- Context providers integrated
- App successfully builds and initializes database
- Ready for Phase 2 UI enhancements

---

### Phase 2: Basic UI & List View (Week 3) ✅ COMPLETED

#### 2.1 Navigation Setup
- [x] Configure Expo Router stack in `app/_layout.tsx`
- [x] Set screen options (titles, headers)
- [x] Test navigation between screens

#### 2.2 Memo List Screen
- [x] Create `app/index.tsx` (main list screen)
- [x] Implement `MemoList` component
- [x] Implement `MemoItem` component
- [x] Display title, preview, date
- [x] Show pinned memos first
- [x] Empty state UI

#### 2.3 List Interactions
- [x] Tap to open memo
- [x] Long-press menu (pin, delete)
- [x] Pull-to-refresh
- [x] FAB for new memo

#### 2.4 Basic Styling
- [x] Apply Paper theme consistently
- [x] Responsive layouts
- [x] Loading states

**Deliverable:** ✅ Functional memo list with basic operations

**Implementation Notes:**
- Created MemoList and MemoItem components in src/components/MemoList/
- Implemented FlatList with RefreshControl for pull-to-refresh functionality
- Added Menu component with pin/unpin and delete options
- FAB positioned at bottom right for creating new memos
- Displays pinned memos with visual indicator
- Shows memo preview (first 2 lines), date, and tags
- Empty state with welcome message and FAB
- Loading state with ActivityIndicator
- Error state with error message display
- Confirmation dialog for memo deletion using Alert
- Material Design 3 styling with React Native Paper components
- Responsive card layout with proper spacing

**Testing:**
- App successfully displays memo list on Android emulator
- Navigation between screens working properly
- Pin/unpin functionality tested
- Delete with confirmation tested
- Pull-to-refresh tested
- Empty state displays correctly when no memos
- Ready for Phase 3: Editor Basic Functionality

---

### Phase 3: Editor - Basic Functionality (Week 4) ✅ COMPLETED

#### 3.1 Editor Screen
- [x] Create `app/editor/[id].tsx` (dynamic route)
- [x] Handle route params (new memo vs existing)
- [x] Title input field
- [x] Content text input (multiline)
- [x] Save button / auto-save
- [x] Navigation back to list using `router.back()`

#### 3.2 Basic Markdown Support
- [x] Integrate markdown renderer
- [x] Create `MarkdownViewer` component
- [x] View mode toggle (raw/rendered)
- [x] Toggle button UI

#### 3.3 Auto-Save
- [x] Debounced save on text change (30 seconds)
- [x] Visual save indicator
- [x] Handle unsaved changes warning

**Deliverable:** ✅ Working editor with view toggle

**Implementation Notes:**
- Created editor screen with dynamic routing in `app/editor/[id].tsx`
- Handles both new memo creation (`id === 'new'`) and existing memo editing
- Title and content input fields with Material Design styling
- Auto-save functionality with 30-second debounce using `useDebounce` hook
- Visual "Saving..." indicator during auto-save
- MarkdownViewer component with comprehensive styling for all markdown elements
- ViewToggle component using SegmentedButtons for raw/rendered mode switching
- KeyboardAvoidingView for proper keyboard handling on iOS/Android
- Smooth navigation back to list after saving
- Snackbar notifications for save confirmation

**Testing:**
- Editor successfully opens for new memos and existing memos
- Title and content input working properly
- Auto-save triggers after 30 seconds of inactivity
- View toggle switches between edit and preview modes
- Markdown rendering displays properly with theme-aware styling
- Ready for Phase 4: Editor Toolbar & Formatting

---

### Phase 4: Editor Toolbar & Formatting (Week 5-6) ✅ COMPLETED

#### 4.1 Toolbar Component
- [x] Create `EditorToolbar.tsx`
- [x] Toolbar positioning (above keyboard)
- [x] Scrollable button list

#### 4.2 Text Formatting Buttons
- [x] Bold button
- [x] Italic button
- [x] Underline button
- [x] Strikethrough button
- [x] Heading picker (H1-H6)

#### 4.3 Format Insertion Logic
- [x] Get cursor position
- [x] Insert syntax at cursor
- [x] Wrap selected text
- [x] Move cursor appropriately

#### 4.4 List Features
- [x] Bullet list button
- [x] Checkbox list button
- [x] Numbered list button
- [x] Indent button
- [x] Outdent button
- [x] List detection and smart formatting

#### 4.5 Advanced Inserts
- [x] Link insertion dialog
  - URL input
  - Link text input
  - Insert at cursor
- [x] Code block insertion
  - Language picker modal
  - Syntax highlighting in preview
- [x] Table generator
  - Row/column picker
  - Generate markdown table template

**Deliverable:** ✅ Full-featured markdown editor with toolbar

**Implementation Notes:**
- Created FormatButton component in `src/components/Editor/FormatButton.tsx` for consistent button styling
- Created EditorToolbar component in `src/components/Editor/EditorToolbar.tsx` with:
  - Horizontally scrollable toolbar with all formatting buttons
  - Material Design 3 styling with React Native Paper components
  - Dialog-based UI for link insertion, code block language selection, and table generation
  - Menu component for heading level selection (H1-H6)
  - Visual dividers between button groups
- Implemented comprehensive format insertion logic in `app/editor/[id].tsx`:
  - `insertFormat()` - Handles inline formatting (bold, italic, underline, strikethrough, link, code block)
  - `insertLineFormat()` - Handles line-based formatting (headings, lists)
  - `indentLine()` - Handles indentation with 2-space increments/decrements
  - Cursor position tracking via `onSelectionChange`
  - Text selection wrapping support
  - Automatic cursor positioning after format insertion
- Toolbar integrated into editor screen, shown only in raw edit mode
- All formatting functions work with both cursor insertion and text selection wrapping
- Table generator creates markdown tables with customizable rows and columns

**Testing:**
- Toolbar displays correctly above keyboard in raw mode
- All formatting buttons functional
- Text formatting (bold, italic, underline, strikethrough) works correctly
- Heading picker allows selection of H1-H6
- List formatting (bullet, checkbox, numbered) inserts correct syntax
- Indent/outdent adjusts line spacing properly
- Link dialog captures URL and optional text
- Code block dialog allows language specification
- Table generator creates properly formatted markdown tables
- Cursor positioning works correctly after all format insertions
- Text selection wrapping works for inline formats
- Ready for Phase 5: Tags & Organization

---

### Phase 5: Tags & Organization (Week 7) ✅ COMPLETED

#### 5.1 Tag Management
- [x] Tag input component
- [x] Add/remove tags
- [x] Tag chip display
- [ ] Tag autocomplete (optional) - Deferred to future enhancement

#### 5.2 Tag Display
- [x] Show tags in memo list
- [x] Tag colors/styles
- [ ] Tag filtering UI (optional) - Deferred to Phase 6 search

#### 5.3 Metadata Display
- [x] Show creation date
- [x] Show last updated date
- [x] Format dates nicely (date-fns)

**Deliverable:** ✅ Tag system integrated

**Implementation Notes:**
- Created TagInput component in `src/components/Common/TagInput.tsx`:
  - Text input with "Add tags (press Enter)" functionality
  - Enter key or plus icon button to add tags
  - Displays added tags using TagChip component
  - Prevents duplicate tags
  - Disabled state support
- Created TagChip component in `src/components/Common/TagChip.tsx`:
  - Reusable chip component with Material Design 3 styling
  - Support for delete (onClose), press actions
  - Selected state support
  - Compact design
- Integrated tags into editor (`app/editor/[id].tsx`):
  - TagInput placed between title and content inputs
  - Tags saved/updated with memo
  - Tags state management
- Updated MemoItem to display tags:
  - Shows up to 3 tags with Chip components
  - "+N" indicator for additional tags beyond 3
  - Proper spacing and layout
- Metadata display already implemented in Phase 2:
  - Updated date with time (MMM d, yyyy HH:mm)
  - Created date without time (MMM d, yyyy)
  - date-fns for formatting
- Improved auto-save UX:
  - Changed auto-save debounce from 30s to 1s for better responsiveness
  - Save status indicator in header: ActivityIndicator (saving) → Check icon (saved)
  - Header layout improved with flexbox: ViewToggle on left, save status on right
  - Save status auto-hides after 1.5s

**Testing:**
- TagInput allows adding tags via Enter key or plus button
- Tags displayed as chips with delete functionality
- Tags persist when saving/updating memos
- MemoItem shows tags (max 3 visible, +N for more)
- Creation and update dates display correctly
- Auto-save triggers after 1s of inactivity
- Save status indicator shows ActivityIndicator during save
- Check icon appears briefly after successful save
- Ready for Phase 6: Search Functionality

---

### Phase 6: Search Functionality (Week 8) ✅ COMPLETED

#### 6.1 Search UI
- [x] Create `SearchBar` component
- [x] Search bar in list header
- [x] Clear button (built-in with React Native Paper Searchbar)
- [x] Search icon (built-in with React Native Paper Searchbar)

#### 6.2 Search Logic (SQLite-based)
- [x] Implement `useSearch` hook
- [x] Use StorageService.searchMemos() with SQL LIKE
- [x] Search in title, content, and tags (JOIN query)
- [x] Debounce input (300ms)
- [x] Handle empty query (return all)

#### 6.3 Search Results
- [x] Display search results from database
- [x] Maintain sort order (pinned first)
- [ ] Highlight search terms (optional) - Deferred to future enhancement
- [x] "No results" state
- [ ] Performance testing with large datasets - To be tested by user

**Deliverable:** ✅ Working SQLite-based search feature

**Implementation Notes:**
- Created SearchBar component in `src/components/Search/SearchBar.tsx`:
  - Uses React Native Paper's Searchbar component
  - Clean, minimal styling with Material Design 3
  - Built-in search icon and clear button
  - Elevation set to 0 for flat appearance
  - Rounded corners (8px border radius)
- Created useSearch hook in `src/hooks/useSearch.ts`:
  - Manages search query state
  - Debounces search query with 300ms delay using useDebounce
  - Calls StorageService.searchMemos() for database query
  - Returns all memos when query is empty
  - Includes isSearching state for loading indicators
  - Updates search results when memos change
- StorageService.searchMemos() already implemented in Phase 1:
  - SQL query with LEFT JOIN on memo_tags and tags tables
  - LIKE pattern matching on title, content, and tag names
  - Maintains sort order (isPinned DESC, updatedAt DESC)
  - Returns distinct results with tags loaded
- Integrated search into home screen (`app/index.tsx`):
  - SearchBar placed at top of screen
  - Search results replace memo list dynamically
  - Empty search state shows "No results found" message
  - Welcome screen only shows when no memos exist and no search query
  - Pull-to-refresh works with search results
- Search features:
  - Real-time search as user types (with 300ms debounce)
  - Searches across title, content, and tags simultaneously
  - Case-insensitive search (SQL LIKE)
  - Maintains pinned memos at top in search results
  - Clear button clears search and shows all memos

**Testing:**
- Search bar displays at top of memo list
- Typing search query filters memos in real-time (300ms delay)
- Search works across title, content, and tags
- Empty query shows all memos
- "No results found" appears for queries with no matches
- Pinned memos appear first in search results
- Clear button (X icon) clears search query
- Pull-to-refresh works while searching
- Ready for Phase 7: Export Functionality

---

### Phase 7: Export Functionality (Week 9-10) ✅ COMPLETED

#### 7.1 Export Service Setup
- [x] Create `services/export.ts`
- [x] Install export dependencies
- [x] Handle permissions

#### 7.2 Clipboard Export
- [x] Copy markdown to clipboard
- [x] Copy plain text to clipboard
- [x] Success feedback

#### 7.3 File Export
- [x] Export as .md file
- [x] Save to device storage
- [x] File naming convention

#### 7.4 Share Export
- [x] Integrate native share sheet
- [x] Share markdown file
- [x] Share plain text

#### 7.5 PDF Export
- [x] Install `expo-print` (instead of react-native-html-to-pdf for Expo compatibility)
- [x] Convert markdown to HTML
- [x] Generate PDF with styling
- [x] Share/save PDF

#### 7.6 Email Export
- [x] Install mail composer (expo-mail-composer)
- [x] Pre-fill email with memo
- [x] Attach file option
- [x] Handle no email client

#### 7.7 Export UI
- [x] Export button in editor
- [x] Export options menu
- [x] Format selection (MD/PDF/Text)
- [x] Method selection (Email/Share/Clipboard/Save)

#### 7.8 Database Backup (Optional)
- [ ] Export entire database file - Deferred to future enhancement
- [ ] Export all memos as JSON - Deferred to future enhancement
- [ ] Import/restore functionality - Deferred to future enhancement

**Deliverable:** ✅ Complete export functionality

**Implementation Notes:**
- Created ExportService in `src/services/export.ts`:
  - Main `export()` method routes to format-specific methods
  - `exportMarkdown()` - Exports memo with metadata in Markdown format
  - `exportText()` - Exports memo as plain text
  - `exportPDF()` - Converts Markdown to HTML and generates PDF using expo-print
  - Supports 4 export methods: clipboard, share, save, email
  - `formatMarkdown()` - Adds title, tags, and metadata to content
  - `markdownToHTML()` - Simple Markdown to HTML converter for PDF generation
  - HTML styling with Material Design 3 colors and typography
  - Filename sanitization for safe file operations
  - Error handling for unavailable features (e.g., no email client)
- Installed dependencies:
  - `@react-native-clipboard/clipboard` - Clipboard operations
  - `expo-sharing` - Native share sheet integration
  - `expo-file-system` - File system access for saving files
  - `expo-print` - PDF generation (Expo-compatible alternative to react-native-html-to-pdf)
  - `expo-mail-composer` - Email composition with attachments
- Created useExport hook in `src/hooks/useExport.ts`:
  - Manages export state (isExporting, error)
  - Wraps ExportService.export() with error handling
  - Provides clean API for UI components
- Integrated export UI into editor (`app/editor/[id].tsx`):
  - Export button (IconButton with "export-variant" icon) in header
  - Two-level menu system:
    1. Format menu: Select Markdown, PDF, or Text
    2. Method menu: Select Clipboard, Share, Save, or Email
  - PDF cannot be copied to clipboard (menu item disabled)
  - Export works for both new and existing memos
  - Success/error feedback via Snackbar
  - Export current memo state (even if not saved yet)
- Export features:
  - Markdown includes title, tags, created/updated dates, and content
  - PDF has styled HTML with proper typography and colors
  - Text format is plain text version of Markdown
  - Share sheet allows saving to various locations (Files, iCloud, etc.)
  - Email integration with file attachments for PDF, inline content for text
  - Clipboard copy for quick sharing
- Bug fixes:
  - Fixed Android IntentResolver crash by using share sheet instead of direct email for Markdown/Text/PDF
  - Added error handling with try-catch for email composition
  - Improved error messages for failed email operations

**Testing:**
- Export button appears in editor header (right side)
- Tapping export button shows format menu (Markdown, PDF, Text)
- Selecting format shows method menu (Clipboard, Share, Save, Email)
- Clipboard export works for Markdown and Text (disabled for PDF)
- Share export opens native share sheet with file
- Save export opens share sheet to save to device
- Email export opens mail composer with content or attachment
- PDF generation creates properly styled document
- Snackbar shows success message after export
- Error handling for unavailable features (e.g., no email app)
- File naming uses sanitized memo title
- Exported content includes metadata (title, tags, dates)
- Ready for Phase 8: Polish & UX Improvements

---

### Phase 8: Polish & UX Improvements (Week 11)

#### 8.1 UI Polish
- [ ] Smooth animations
- [ ] Loading states
- [ ] Error states
- [ ] Confirmation dialogs
- [ ] Toast notifications

#### 8.2 Settings Screen ✅ COMPLETED
- [x] Create `app/settings.tsx`
- [x] Theme toggle
- [x] Sort preferences
- [x] About section
- [x] Export all memos
- [x] Navigate to settings from list screen

**Implementation Notes:**
- Added settings navigation icon to home screen header in `app/_layout.tsx`
- Implemented sort preferences in `MemoContext`:
  - Added `sortType` state and `setSortType` method to MemoContextValue
  - Sort preferences persist to SQLite using StorageService
  - Memos automatically re-sort when sort type changes
  - Pinned memos always appear first regardless of sort type
  - Three sort options: Last Updated (default), Created Date, Title (alphabetical)
- Enhanced Settings screen (`app/settings.tsx`):
  - Appearance section: Dark mode toggle with Switch
  - Sort Order section: RadioButton.Group for sort preference selection
  - Data section: Export all memos functionality
    - Combines all memos into single Markdown file
    - Shows memo count in description
    - Disabled when no memos exist
    - Uses native share sheet for export
    - Confirmation dialog before export
    - Includes memo metadata (title, tags, dates)
  - About section: App name and version number
  - ScrollView for better layout on small screens
  - Snackbar for export success feedback
- StorageService enhancements:
  - Added `saveSortType()` and `loadSortType()` methods
  - Default sort type is 'updatedAt'
- ExportService enhancement:
  - Made `shareContent()` public for use in settings
- Type system updates:
  - Added `sortType` and `setSortType` to MemoContextValue interface

**Testing:**
- Settings icon appears in home screen header
- Tapping settings icon navigates to Settings screen
- Dark mode toggle works and persists across app restarts
- Sort order changes immediately update memo list order
- Sort preferences persist across app restarts
- Pinned memos always appear first regardless of sort type
- "Last Updated" sorts by most recent update (newest first)
- "Created Date" sorts by creation date (newest first)
- "Title" sorts alphabetically (A-Z)
- Export all memos shows correct memo count
- Export all memos button disabled when no memos exist
- Export all memos opens share sheet with combined file
- Export all memos includes all memo metadata (title, tags, dates)
- Export all memos confirmation dialog displays correctly
- Export success snackbar appears after successful export
- About section displays app name and version
- Settings screen scrolls properly on small screens

---

#### 8.3 Gestures
- [ ] Swipe to delete (optional)
- [ ] Pull-to-refresh polish

#### 8.4 Keyboard Handling
- [ ] Keyboard-aware scroll
- [ ] Dismiss keyboard on scroll
- [ ] Toolbar above keyboard

**Deliverable:** Polished user experience

---

### Phase 9: Testing & Bug Fixes (Week 12)

#### 9.1 Testing
- [ ] Unit tests for critical functions
- [ ] Integration tests for flows
- [ ] Manual testing on iOS
- [ ] Manual testing on Android
- [ ] Test edge cases (empty memos, long content)

#### 9.2 Bug Fixes
- [ ] Fix identified bugs
- [ ] Performance optimization
- [ ] Memory leak checks

#### 9.3 Accessibility
- [ ] Add accessibility labels
- [ ] Test with screen reader
- [ ] Keyboard navigation
- [ ] High contrast support

**Deliverable:** Stable, tested app

---

### Phase 10: Build & Deploy (Week 13)

#### 10.1 App Configuration
- [ ] Set app name, icon, splash
- [ ] Configure bundle identifiers
- [ ] Set version number
- [ ] Privacy policy (if required)

#### 10.2 Build
- [ ] EAS Build setup
- [ ] iOS build (if Mac available)
- [ ] Android APK/AAB build
- [ ] Test builds on devices

#### 10.3 Distribution (Optional)
- [ ] TestFlight (iOS)
- [ ] Google Play internal testing
- [ ] Gather feedback

**Deliverable:** Deployable app builds

---

### Development Guidelines

#### Code Quality
- Follow TypeScript strict mode
- Use ESLint and Prettier
- Consistent naming conventions
- Comment complex logic
- Keep components small (<300 lines)

#### Git Workflow
- Feature branches for each phase
- Descriptive commit messages
- PR reviews (if team)
- Tag releases

#### Documentation Updates
**Update documents after each phase:**
- Update PRD if requirements change
- Update LLD if architecture changes
- Update PLAN to track progress
- Add implementation notes

#### Performance Targets
- App launch: <2s
- List scroll: 60fps
- Search response: <200ms
- Save operation: <100ms

#### Testing Strategy
- Write tests alongside features
- Test on both platforms regularly
- Use Expo Go for rapid testing
- Build standalone apps for final testing

---

### Risk Mitigation

#### Technical Risks
| Risk | Mitigation |
|------|------------|
| PDF export complexity | Use proven library, fallback to HTML |
| Markdown rendering performance | Lazy load, optimize re-renders |
| SQLite database corruption | Regular backups, transaction safety, WAL mode |
| SQLite migration failures | Test migrations thoroughly, implement rollback |
| Large database performance | Use indexes, pagination, optimize queries |
| Keyboard handling issues | Use KeyboardAvoidingView, test extensively |

#### Schedule Risks
| Risk | Mitigation |
|------|------------|
| Feature creep | Stick to MVP, defer nice-to-haves |
| Integration issues | Test libraries early in Phase 0 |
| Platform differences | Test on both iOS/Android regularly |

---

### Success Criteria

**MVP Complete When:**
- ✅ Create, edit, delete memos
- ✅ Markdown formatting with toolbar
- ✅ Raw/rendered view toggle
- ✅ Pin memos
- ✅ Search by title/content
- ✅ Tags support
- ✅ Export to MD, PDF, email, clipboard, share
- ✅ Light/dark theme
- ✅ Local storage persistence
- ✅ Stable on iOS and Android

---

### Post-MVP Enhancements

**Priority 2 Features:**
- Cloud sync (iCloud/Drive)
- Folders/notebooks
- Memo templates
- Rich media (images, audio)
- Collaboration
- Web version (React Native Web)

**Priority 3 Features:**
- Handwriting/drawing
- Voice notes
- Calendar integration
- Reminders
- Lock/encrypt memos
- Multiple vaults

---

### Estimated Timeline

**Total: 13 weeks (3 months)**

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| 0. Setup | 1 week | None |
| 1. Data/Storage | 1 week | Phase 0 |
| 2. List UI | 1 week | Phase 1 |
| 3. Basic Editor | 1 week | Phase 2 |
| 4. Toolbar | 2 weeks | Phase 3 |
| 5. Tags | 1 week | Phase 3 |
| 6. Search | 1 week | Phase 2,5 |
| 7. Export | 2 weeks | Phase 3 |
| 8. Polish | 1 week | All above |
| 9. Testing | 1 week | All above |
| 10. Deploy | 1 week | Phase 9 |

**Note:** Timeline assumes 1 developer working full-time. Adjust based on team size and availability.

---

### Next Steps

1. Review this plan with stakeholders
2. Set up development environment
3. Begin Phase 0: Project Setup
4. Schedule weekly progress reviews
5. Update documents as you progress

---

### Document Maintenance

**Keep documents in sync:**
- After completing each phase, update PLAN with actual vs estimated time
- If architecture changes during implementation, update LLD
- If requirements change, update PRD and PLAN
- Add "Implementation Notes" section to track decisions
- Keep todo lists in PLAN updated

**Review cycle:**
- Weekly: Update PLAN progress
- Per phase: Update LLD/PRD if needed
- Pre-release: Final documentation audit
