# Implementation Plan
## Markdown Memo App

### Overview
Phased development approach prioritizing core functionality first, then enhancements.

### Phase 0: Project Setup (Week 1)

#### 0.1 Initialize Project
- [ ] Create Expo project with TypeScript template
- [ ] Install React Native Paper and dependencies
- [ ] Configure theme provider (light/dark)
- [ ] Set up project structure (folders per LLD)
- [ ] Configure linting (ESLint, Prettier)
- [ ] Initialize git repository

#### 0.2 Core Dependencies
```bash
npx create-expo-app markdown-memo --template tabs
cd markdown-memo
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
npx expo install expo-sqlite
npm install react-native-paper
npm install react-native-markdown-display
npm install uuid date-fns
npm install --save-dev @types/uuid
```

**Note:** Using `tabs` template provides Expo Router setup out of the box.

#### 0.3 Configuration Files
- [ ] Configure `app.json` / `app.config.js` with scheme for deep linking
- [ ] Set up TypeScript strict mode in `tsconfig.json`
- [ ] Create `app/_layout.tsx` with theme and context providers
- [ ] Clean up default tab structure from template
- [ ] Create `app/index.tsx`, `app/editor/[id].tsx`, `app/settings.tsx`

**Deliverable:** Running Expo app with theme toggle

---

### Phase 1: Core Data & Storage (Week 2)

#### 1.1 Type Definitions
- [ ] Create `types/memo.ts` with interfaces
- [ ] Define all TypeScript types per LLD

#### 1.2 Database Setup
- [ ] Create `services/database.ts` helper class
- [ ] Implement database connection management
- [ ] Create database schema (tables, indexes)
- [ ] Test database initialization
- [ ] Add database version tracking
- [ ] Implement migration framework

#### 1.3 Storage Service
- [ ] Implement `services/storage.ts` with SQLite
- [ ] Memo CRUD operations (create, read, update, delete)
- [ ] Tag operations (add, remove, list)
- [ ] Search operations with SQL queries
- [ ] Settings persistence (theme, preferences)
- [ ] Error handling and transactions

#### 1.4 Memo Context
- [ ] Create `MemoContext.tsx`
- [ ] Implement memo state management
- [ ] Add CRUD operations using StorageService
- [ ] Pin/unpin functionality
- [ ] Load memos on context initialization

#### 1.5 Theme Context
- [ ] Create `ThemeContext.tsx`
- [ ] Theme switching logic
- [ ] Persist theme preference in SQLite
- [ ] Load theme on app startup

#### 1.6 Database Initialization
- [ ] Add database init in `app/_layout.tsx`
- [ ] Create loading screen for DB initialization
- [ ] Handle initialization errors gracefully

**Deliverable:** Working SQLite storage layer with context providers

**Testing:**
- Database schema creation tests
- Storage CRUD operation tests
- Transaction tests
- Context hook tests
- Migration tests

---

### Phase 2: Basic UI & List View (Week 3)

#### 2.1 Navigation Setup
- [ ] Configure Expo Router stack in `app/_layout.tsx`
- [ ] Set screen options (titles, headers)
- [ ] Test navigation between screens

#### 2.2 Memo List Screen
- [ ] Create `app/index.tsx` (main list screen)
- [ ] Implement `MemoList` component
- [ ] Implement `MemoItem` component
- [ ] Display title, preview, date
- [ ] Show pinned memos first
- [ ] Empty state UI

#### 2.3 List Interactions
- [ ] Tap to open memo
- [ ] Long-press menu (pin, delete)
- [ ] Pull-to-refresh
- [ ] FAB for new memo

#### 2.4 Basic Styling
- [ ] Apply Paper theme consistently
- [ ] Responsive layouts
- [ ] Loading states

**Deliverable:** Functional memo list with basic operations

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
