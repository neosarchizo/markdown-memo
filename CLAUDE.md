# Claude Code Context - Markdown Memo App

## Project Overview

Mobile memo application built with **TypeScript, Expo and React Native Paper**. Stores memos in Markdown format with rich editing capabilities, local storage, and comprehensive export features.

---

## Critical Documents

@documents/PRD.md
@documents/LLD.md
@documents/PLAN.md

### 📋 [documents/PRD.md](documents/PRD.md)
**Product Requirements Document**
- Complete feature specifications
- User flows
- Success metrics
- Non-functional requirements

**When to reference:**
- Starting new features
- Clarifying feature scope
- Validating implementation against requirements

**When to update:**
- Requirements change
- New features added
- Constraints modified

---

### 🏗️ [documents/LLD.md](documents/LLD.md)
**Low Level Design**
- Architecture diagrams
- Component structure
- Data models
- Technical specifications
- Dependencies list

**When to reference:**
- Implementing new components
- Understanding data flow
- Resolving architecture questions
- Choosing libraries

**When to update:**
- Architecture changes
- New components added
- Data models modified
- Dependencies updated

---

### 📅 [documents/PLAN.md](documents/PLAN.md)
**Implementation Plan**
- Phased development roadmap (Phase 0-10)
- Task checklists
- Timeline estimates
- Risk mitigation

**When to reference:**
- Planning work sessions
- Checking next tasks
- Tracking progress
- Understanding dependencies

**When to update:**
- After completing each phase
- When timeline shifts
- When tasks are added/removed
- After each development session (mark checkboxes)

---

## Development Workflow

### Starting a Development Session

1. **Review PLAN.md**: Check current phase and pending tasks
2. **Reference LLD.md**: Understand components to implement
3. **Validate against PRD.md**: Ensure meeting requirements
4. **Check project structure**: Verify files match LLD layout

### During Development

1. **Follow LLD architecture**: Component placement, naming conventions
2. **Implement per PLAN phase order**: Don't skip phases
3. **Test as you build**: Unit tests alongside features
4. **Maintain TypeScript strictness**: No `any` types
5. **Use React Native Paper components**: Consistent UI

### After Each Task/Phase

1. **Update PLAN.md**: Check completed tasks, note issues
2. **Update LLD.md if needed**: Document architectural changes
3. **Update PRD.md if needed**: Capture requirement changes
4. **Commit with clear messages**: Reference phase/task

### Code Quality Standards

- TypeScript strict mode enabled
- ESLint + Prettier configured
- Components < 300 lines
- Hooks for reusable logic
- Meaningful variable names
- Comments for complex logic

---

## Project Structure (Per LLD)

```
app/
├── _layout.tsx      # Root layout (providers, theme)
├── index.tsx        # Home screen (Memo list)
├── editor/
│   └── [id].tsx     # Memo editor (dynamic route)
└── settings.tsx     # Settings screen

src/
├── types/           # TypeScript interfaces
├── contexts/        # React Context providers
├── services/        # Business logic (storage, export, markdown)
├── hooks/           # Custom React hooks
├── components/      # Reusable UI components
└── utils/           # Helper functions
```

**Note:** Using Expo Router file-based routing. Screens are in `app/` folder.

---

## Key Technical Decisions

### State Management
**Context API + Hooks** (not Redux)
- Simpler for MVP
- See LLD Section 10

### Storage
**SQLite** (expo-sqlite) for relational data
- Full database with tables for memos, tags, settings
- Supports complex queries, joins, transactions
- Better performance for large datasets
- See `services/storage.ts` and `services/database.ts` in LLD Section 4

### Navigation
**Expo Router** (file-based routing)
- Routes defined by file structure in `app/`
- Dynamic routes with `[id].tsx`
- See LLD Section 11 for full examples

### Markdown
**react-native-markdown-display** for rendering
- See LLD Section 7

### Export
**react-native-html-to-pdf** for PDF generation
- See LLD Section 8.2

---

## Current Phase Tracking

**Update this section as you progress:**

### Current Phase: Phase 0 - Project Setup
**Status:** Not Started
**Next Tasks:**
- Initialize Expo project
- Install dependencies
- Configure theme
- Set up folder structure

**Completed Phases:**
- None yet

---

## Common Commands

### Development
```bash
# Start development server
npx expo start

# Start with specific platform
npx expo start --ios
npx expo start --android

# Clear cache
npx expo start --clear
```

### Dependencies
```bash
# Install package
npm install <package>

# Install dev dependency
npm install --save-dev <package>
```

### Testing
```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

### Build
```bash
# EAS build setup
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Database Management
```bash
# View database (development)
# Database located at: App's Documents directory
# Use Expo SQLite Studio or similar tools

# Reset database (for testing)
# Delete app and reinstall, or:
# Add reset function in dev menu
```

**Database Schema:**
- `memos` table: id, title, content, createdAt, updatedAt, isPinned
- `tags` table: id, name
- `memo_tags` junction table: memoId, tagId
- `settings` table: key, value

**Key Operations:**
- Always use transactions for batch operations
- Use prepared statements via Database helper
- Initialize database in `app/_layout.tsx`
- Handle migration on version changes

---

## Implementation Guidelines

### When Implementing Features

1. **Check PLAN.md phase order**: Don't implement Phase 5 before Phase 1
2. **Follow LLD component specs**: Use defined interfaces and structures
3. **Validate against PRD requirements**: Ensure feature completeness
4. **Write tests**: Unit tests for services, integration tests for flows
5. **Update docs**: Mark tasks complete, document changes

### When Making Architectural Changes

1. **Update LLD.md first**: Document the change
2. **Get validation**: Ensure change doesn't break existing design
3. **Update affected components**: Refactor consistently
4. **Update PLAN.md**: Adjust tasks if needed

### When Adding Dependencies

1. **Check LLD Section 15**: Verify it's planned or necessary
2. **Install via npm**: Keep package.json updated
3. **Document in LLD.md**: Add to dependencies section
4. **Test compatibility**: Ensure works with Expo

---

## Performance Targets (From PRD)

- App launch: **< 2s**
- List scroll: **60fps**
- Search response: **< 200ms**
- Save operation: **< 100ms**

Test against these benchmarks regularly.

---

## Platform Support

- **iOS:** 13+
- **Android:** 8+ (API 26+)
- **Parity:** Features must work identically on both platforms

---

## Document Update Checklist

Use this checklist when updating documents:

### PRD Updates Required When:
- [ ] New feature requested
- [ ] Existing feature scope changes
- [ ] Success metrics modified
- [ ] Constraints added/removed

### LLD Updates Required When:
- [ ] New component/service created
- [ ] Data model changes
- [ ] Dependency added/removed
- [ ] Architecture pattern changes

### PLAN Updates Required When:
- [ ] Task completed (check checkbox)
- [ ] Phase completed
- [ ] Timeline adjusted
- [ ] New risks identified
- [ ] Tasks added/removed

---

## Troubleshooting

### Common Issues

**Metro bundler cache issues:**
```bash
npx expo start --clear
```

**iOS build fails:**
- Check Xcode version
- Clean build folder
- Check CocoaPods

**Android build fails:**
- Check Android SDK version
- Clear Gradle cache
- Check `android/build.gradle`

**Type errors:**
- Ensure all types defined in `src/types/`
- Check imports
- Run `tsc --noEmit` to check types

**Database errors:**
- Check if database initialized in `_layout.tsx`
- Verify table schema matches LLD
- Check SQL syntax in queries
- Use transactions for multi-step operations
- Check foreign key constraints

**Database corruption:**
- Delete app and reinstall
- Check logs for migration errors
- Verify WAL mode enabled
- Test backup/restore functionality

---

## Testing Strategy (Per LLD Section 14)

### Unit Tests
- Database: schema creation, CRUD operations, queries
- Services: storage, export, markdown helpers
- Hooks: useMemos, useSearch
- Utilities: date helpers, markdown helpers

### Integration Tests
- Context providers with components
- Navigation flows
- Database transactions and migrations
- Storage persistence across app restarts

### Manual Testing
- Test on both iOS and Android
- Test on physical devices
- Test edge cases (empty states, long content, many memos)

---

## Future Enhancements (Post-MVP)

See PLAN.md "Post-MVP Enhancements" section for:
- Cloud sync
- Folders/notebooks
- Templates
- Rich media
- Collaboration features

**Do not implement these in MVP phases.**

---

## Quick Reference Links

- **Expo Docs:** https://docs.expo.dev/
- **Expo Router:** https://docs.expo.dev/router/introduction/
- **React Native Paper:** https://callstack.github.io/react-native-paper/
- **TypeScript:** https://www.typescriptlang.org/

---

## Communication Protocol

### When Asking for Clarification

If requirements unclear, ask with context:
- Which feature (reference PRD section)
- Which phase (reference PLAN phase)
- What you've tried
- Specific question

### When Reporting Issues

Include:
- Error message
- Stack trace
- Steps to reproduce
- Expected vs actual behavior
- Platform (iOS/Android)

---

## Summary for AI Assistants

**Before implementing anything:**
1. Read PLAN.md to understand current phase
2. Read LLD.md to understand architecture
3. Read PRD.md to understand requirements

**While implementing:**
- Follow LLD structure and patterns
- Implement in PLAN phase order
- Validate against PRD requirements
- Write clean, typed code

**After implementing:**
- Update PLAN.md checkboxes
- Update LLD.md if architecture changed
- Update PRD.md if requirements changed
- Commit with clear messages

**Always:**
- Maintain token-efficient communication
- Provide code references with line numbers
- Suggest improvements when seeing issues
- Ask for clarification when uncertain

---

## Document Maintenance Schedule

**Daily (During Active Development):**
- Update PLAN.md task checkboxes
- Note implementation challenges

**Weekly:**
- Review all three documents for accuracy
- Update progress tracking
- Adjust timeline estimates

**Per Phase Completion:**
- Full review of all documents
- Document lessons learned
- Update next phase estimates

**Pre-Release:**
- Final documentation audit
- Ensure all sections current
- Add final implementation notes

---

## Contact & Resources

**Project Repository:** [Add when available]
**Issue Tracker:** [Add when available]
**Design Files:** [Add when available]

---

*Last Updated: 2025-10-28*
*Current Phase: 0 (Setup)*
*Documents Version: 1.0*

각 단계를 완료하고 완료한 단계는 PLAN에 표시해줘
테스트는 내가 할테니까 각 단계 작업을 완료하면 어떤 걸 테스트해야하는지 정리해서 알려줘
작업을 완료하면 git을 통해 저장해줘