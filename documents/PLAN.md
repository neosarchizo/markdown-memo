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

### Phase 3: Editor - Basic Functionality (Week 4)

#### 3.1 Editor Screen
- [ ] Create `app/editor/[id].tsx` (dynamic route)
- [ ] Handle route params (new memo vs existing)
- [ ] Title input field
- [ ] Content text input (multiline)
- [ ] Save button / auto-save
- [ ] Navigation back to list using `router.back()`

#### 3.2 Basic Markdown Support
- [ ] Integrate markdown renderer
- [ ] Create `MarkdownViewer` component
- [ ] View mode toggle (raw/rendered)
- [ ] Toggle button UI

#### 3.3 Auto-Save
- [ ] Debounced save on text change
- [ ] Visual save indicator
- [ ] Handle unsaved changes warning

**Deliverable:** Working editor with view toggle

---

### Phase 4: Editor Toolbar & Formatting (Week 5-6)

#### 4.1 Toolbar Component
- [ ] Create `EditorToolbar.tsx`
- [ ] Toolbar positioning (above keyboard)
- [ ] Scrollable button list

#### 4.2 Text Formatting Buttons
- [ ] Bold button
- [ ] Italic button
- [ ] Underline button
- [ ] Strikethrough button
- [ ] Heading picker (H1-H6)

#### 4.3 Format Insertion Logic
- [ ] Get cursor position
- [ ] Insert syntax at cursor
- [ ] Wrap selected text
- [ ] Move cursor appropriately

#### 4.4 List Features
- [ ] Bullet list button
- [ ] Checkbox list button
- [ ] Numbered list button
- [ ] Indent button
- [ ] Outdent button
- [ ] List detection and smart formatting

#### 4.5 Advanced Inserts
- [ ] Link insertion dialog
  - URL input
  - Link text input
  - Insert at cursor
- [ ] Code block insertion
  - Language picker modal
  - Syntax highlighting in preview
- [ ] Table generator
  - Row/column picker
  - Generate markdown table template

**Deliverable:** Full-featured markdown editor with toolbar

**Testing:**
- Test each formatting function
- Test cursor position handling
- Test text selection wrapping

---

### Phase 5: Tags & Organization (Week 7)

#### 5.1 Tag Management
- [ ] Tag input component
- [ ] Add/remove tags
- [ ] Tag chip display
- [ ] Tag autocomplete (optional)

#### 5.2 Tag Display
- [ ] Show tags in memo list
- [ ] Tag colors/styles
- [ ] Tag filtering UI (optional)

#### 5.3 Metadata Display
- [ ] Show creation date
- [ ] Show last updated date
- [ ] Format dates nicely (date-fns)

**Deliverable:** Tag system integrated

---

### Phase 6: Search Functionality (Week 8)

#### 6.1 Search UI
- [ ] Create `SearchBar` component
- [ ] Search bar in list header
- [ ] Clear button
- [ ] Search icon

#### 6.2 Search Logic (SQLite-based)
- [ ] Implement `useSearch` hook
- [ ] Use StorageService.searchMemos() with SQL LIKE
- [ ] Search in title, content, and tags (JOIN query)
- [ ] Debounce input (300ms)
- [ ] Handle empty query (return all)

#### 6.3 Search Results
- [ ] Display search results from database
- [ ] Maintain sort order (pinned first)
- [ ] Highlight search terms (optional)
- [ ] "No results" state
- [ ] Performance testing with large datasets

**Deliverable:** Working SQLite-based search feature

---

### Phase 7: Export Functionality (Week 9-10)

#### 7.1 Export Service Setup
- [ ] Create `services/export.ts`
- [ ] Install export dependencies
- [ ] Handle permissions

#### 7.2 Clipboard Export
- [ ] Copy markdown to clipboard
- [ ] Copy plain text to clipboard
- [ ] Success feedback

#### 7.3 File Export
- [ ] Export as .md file
- [ ] Save to device storage
- [ ] File naming convention

#### 7.4 Share Export
- [ ] Integrate native share sheet
- [ ] Share markdown file
- [ ] Share plain text

#### 7.5 PDF Export
- [ ] Install `react-native-html-to-pdf`
- [ ] Convert markdown to HTML
- [ ] Generate PDF with styling
- [ ] Share/save PDF

#### 7.6 Email Export
- [ ] Install mail composer
- [ ] Pre-fill email with memo
- [ ] Attach file option
- [ ] Handle no email client

#### 7.7 Export UI
- [ ] Export button in editor
- [ ] Export options menu
- [ ] Format selection (MD/PDF/Text)
- [ ] Method selection (Email/Share/Clipboard/Save)

#### 7.8 Database Backup (Optional)
- [ ] Export entire database file
- [ ] Export all memos as JSON
- [ ] Import/restore functionality

**Deliverable:** Complete export functionality

**Testing:**
- Test each export method
- Test on iOS and Android
- Verify file formats

---

### Phase 8: Polish & UX Improvements (Week 11)

#### 8.1 UI Polish
- [ ] Smooth animations
- [ ] Loading states
- [ ] Error states
- [ ] Confirmation dialogs
- [ ] Toast notifications

#### 8.2 Settings Screen
- [ ] Create `app/settings.tsx`
- [ ] Theme toggle
- [ ] Sort preferences
- [ ] About section
- [ ] Export all memos
- [ ] Navigate to settings from list screen

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
