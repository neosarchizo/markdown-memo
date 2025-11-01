import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TextInput as RNTextInput } from 'react-native';
import { TextInput, Button, ActivityIndicator, Snackbar, Text, Icon, IconButton, Menu, Dialog, Portal, List } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { useMemos } from '@/contexts/MemoContext';
import { ViewMode, ExportFormat, ExportMethod, Memo } from '@/types/memo';
import { useDebounce } from '@/hooks/useDebounce';
import { useExport } from '@/hooks/useExport';
import ViewToggle from '@/components/Viewer/ViewToggle';
import MarkdownViewer from '@/components/Viewer/MarkdownViewer';
import { EditorToolbar, ToolbarActions } from '@/components/Editor/EditorToolbar';
import { TagInput } from '@/components/Common/TagInput';

export default function EditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { memos, createMemo, updateMemo } = useMemos();
  const { exportMemo } = useExport();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('raw');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [exportMethodDialogVisible, setExportMethodDialogVisible] = useState(false);
  const [exportFormatMenuVisible, setExportFormatMenuVisible] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState<ExportFormat>('markdown');

  const isNewMemo = id === 'new';
  const initialLoadRef = useRef(true);
  const isAutoSavingRef = useRef(false);
  const originalTitleRef = useRef('');
  const originalContentRef = useRef('');
  const originalTagsRef = useRef<string[]>([]);
  const contentInputRef = useRef<RNTextInput>(null);

  // Debounce content for auto-save (1 second)
  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);

  // Load existing memo if editing
  useEffect(() => {
    // Only load on initial mount or when id changes
    if (!isNewMemo) {
      const memo = memos.find((m) => m.id === id);
      if (memo && initialLoadRef.current) {
        setTitle(memo.title);
        setContent(memo.content);
        setTags(memo.tags);
        originalTitleRef.current = memo.title;
        originalContentRef.current = memo.content;
        originalTagsRef.current = memo.tags;
        initialLoadRef.current = false;
      }
    } else {
      initialLoadRef.current = false;
    }
  }, [id, isNewMemo]);

  // Auto-save existing memo when debounced values change
  useEffect(() => {
    // Skip auto-save on initial load or for new memos
    if (initialLoadRef.current || isNewMemo) {
      return;
    }

    // Skip if title is empty (require title for save)
    if (!debouncedTitle.trim()) {
      return;
    }

    // Check if there are actual changes
    const tagsChanged =
      tags.length !== originalTagsRef.current.length ||
      tags.some((tag, index) => tag !== originalTagsRef.current[index]);

    const hasChanges =
      debouncedTitle.trim() !== originalTitleRef.current.trim() ||
      debouncedContent.trim() !== originalContentRef.current.trim() ||
      tagsChanged;

    if (!hasChanges) {
      return;
    }

    const autoSave = async () => {
      isAutoSavingRef.current = true;
      setSaveStatus('saving');
      try {
        await updateMemo(id, {
          title: debouncedTitle.trim(),
          content: debouncedContent.trim(),
          tags: tags,
        });
        // Update original values after successful save
        originalTitleRef.current = debouncedTitle.trim();
        originalContentRef.current = debouncedContent.trim();
        originalTagsRef.current = tags;
        // Show saved icon briefly
        setSaveStatus('saved');
        setTimeout(() => {
          setSaveStatus('idle');
        }, 1500);
      } catch (error) {
        console.error('Error auto-saving memo:', error);
        setSaveStatus('idle');
      } finally {
        // Reset after a short delay to allow memos state to update
        setTimeout(() => {
          isAutoSavingRef.current = false;
        }, 100);
      }
    };

    autoSave();
  }, [debouncedTitle, debouncedContent, tags, id, isNewMemo, updateMemo]);

  // Format insertion helpers
  const insertFormat = (prefix: string, suffix: string = '') => {
    const { start, end } = selection;
    const selectedText = content.substring(start, end);
    const before = content.substring(0, start);
    const after = content.substring(end);

    let newText: string;
    let newCursorPos: number;

    if (selectedText) {
      // Wrap selected text
      newText = `${before}${prefix}${selectedText}${suffix}${after}`;
      newCursorPos = start + prefix.length + selectedText.length + suffix.length;
    } else {
      // Insert at cursor
      newText = `${before}${prefix}${suffix}${after}`;
      newCursorPos = start + prefix.length;
    }

    setContent(newText);

    // Focus and set cursor position
    setTimeout(() => {
      contentInputRef.current?.focus();
      contentInputRef.current?.setNativeProps({
        selection: { start: newCursorPos, end: newCursorPos },
      });
    }, 0);
  };

  const insertLineFormat = (prefix: string) => {
    const { start } = selection;
    const lines = content.split('\n');
    let currentPos = 0;
    let lineIndex = 0;

    // Find which line the cursor is on
    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length + 1; // +1 for newline
      if (currentPos + lineLength > start || i === lines.length - 1) {
        lineIndex = i;
        break;
      }
      currentPos += lineLength;
    }

    // Insert prefix at start of line
    lines[lineIndex] = prefix + lines[lineIndex];
    const newText = lines.join('\n');
    setContent(newText);

    // Move cursor after the prefix
    const newCursorPos = currentPos + prefix.length;
    setTimeout(() => {
      contentInputRef.current?.focus();
      contentInputRef.current?.setNativeProps({
        selection: { start: newCursorPos, end: newCursorPos },
      });
    }, 0);
  };

  const indentLine = (increase: boolean) => {
    const { start } = selection;
    const lines = content.split('\n');
    let currentPos = 0;
    let lineIndex = 0;

    // Find which line the cursor is on
    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length + 1;
      if (currentPos + lineLength > start || i === lines.length - 1) {
        lineIndex = i;
        break;
      }
      currentPos += lineLength;
    }

    const line = lines[lineIndex];
    let newLine: string;
    let cursorOffset = 0;

    if (increase) {
      // Add two spaces at the start
      newLine = '  ' + line;
      cursorOffset = 2;
    } else {
      // Remove up to two spaces from the start
      if (line.startsWith('  ')) {
        newLine = line.substring(2);
        cursorOffset = -2;
      } else if (line.startsWith(' ')) {
        newLine = line.substring(1);
        cursorOffset = -1;
      } else {
        newLine = line;
      }
    }

    lines[lineIndex] = newLine;
    const newText = lines.join('\n');
    setContent(newText);

    const newCursorPos = Math.max(currentPos, start + cursorOffset);
    setTimeout(() => {
      contentInputRef.current?.focus();
      contentInputRef.current?.setNativeProps({
        selection: { start: newCursorPos, end: newCursorPos },
      });
    }, 0);
  };

  // Toolbar actions
  const toolbarActions: ToolbarActions = {
    bold: () => insertFormat('**', '**'),
    italic: () => insertFormat('*', '*'),
    underline: () => insertFormat('<u>', '</u>'),
    strikethrough: () => insertFormat('~~', '~~'),
    heading: (level: number) => insertLineFormat('#'.repeat(level) + ' '),
    bulletList: () => insertLineFormat('- '),
    checkboxList: () => insertLineFormat('- [ ] '),
    numberedList: () => insertLineFormat('1. '),
    indent: () => indentLine(true),
    outdent: () => indentLine(false),
    link: (text: string, url: string) => insertFormat(`[${text}](${url})`),
    codeBlock: (language: string) => {
      const lang = language ? language : '';
      insertFormat('```' + lang + '\n', '\n```');
    },
    table: (rows: number, cols: number) => {
      // Generate markdown table
      let table = '\n';

      // Header row
      table += '| ' + Array(cols).fill('Header').map((h, i) => `${h} ${i + 1}`).join(' | ') + ' |\n';

      // Separator row
      table += '| ' + Array(cols).fill('---').join(' | ') + ' |\n';

      // Data rows
      for (let r = 0; r < rows - 1; r++) {
        table += '| ' + Array(cols).fill('Cell').map((c, i) => `${c} ${r + 1},${i + 1}`).join(' | ') + ' |\n';
      }

      insertFormat(table);
    },
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setSnackbarMessage('Please enter a title');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    try {
      if (isNewMemo) {
        await createMemo({
          title: title.trim(),
          content: content.trim(),
          tags: tags,
          isPinned: false,
        });
        setSnackbarMessage('Memo created!');
      } else {
        await updateMemo(id, {
          title: title.trim(),
          content: content.trim(),
          tags: tags,
        });
        setSnackbarMessage('Memo updated!');
      }
      setSnackbarVisible(true);

      // Navigate back after a short delay
      setTimeout(() => {
        router.back();
      }, 500);
    } catch (error) {
      console.error('Error saving memo:', error);
      setSnackbarMessage('Failed to save memo');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (method: ExportMethod) => {
    setExportMethodDialogVisible(false);
    setExportFormatMenuVisible(false);

    // Create current memo object
    const currentMemo: Memo = {
      id: id,
      title: title.trim() || 'Untitled',
      content: content.trim(),
      tags: tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
    };

    // For existing memo, use actual data
    if (!isNewMemo) {
      const existingMemo = memos.find((m) => m.id === id);
      if (existingMemo) {
        currentMemo.createdAt = existingMemo.createdAt;
        currentMemo.updatedAt = existingMemo.updatedAt;
        currentMemo.isPinned = existingMemo.isPinned;
      }
    }

    try {
      await exportMemo(currentMemo, selectedExportFormat, method);
      setSnackbarMessage(`Exported as ${selectedExportFormat.toUpperCase()}`);
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Export error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
    }
  };

  const openExportMethodDialog = (format: ExportFormat) => {
    setSelectedExportFormat(format);
    setExportFormatMenuVisible(false);
    setExportMethodDialogVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.toggleContainer}>
          <ViewToggle value={viewMode} onValueChange={setViewMode} />
        </View>
        <View style={styles.headerRightContainer}>
          <View style={styles.saveStatusContainer}>
            {saveStatus === 'saving' && (
              <ActivityIndicator size={20} />
            )}
            {saveStatus === 'saved' && (
              <Icon source="check-circle" size={24} color="#4CAF50" />
            )}
          </View>
          <Menu
            visible={exportFormatMenuVisible}
            onDismiss={() => setExportFormatMenuVisible(false)}
            anchor={
              <IconButton
                icon="export-variant"
                size={24}
                onPress={() => setExportFormatMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => openExportMethodDialog('markdown')}
              title="Export as Markdown"
              leadingIcon="language-markdown"
            />
            <Menu.Item
              onPress={() => openExportMethodDialog('pdf')}
              title="Export as PDF"
              leadingIcon="file-pdf-box"
            />
            <Menu.Item
              onPress={() => openExportMethodDialog('text')}
              title="Export as Text"
              leadingIcon="text-box"
            />
          </Menu>
        </View>
      </View>

      {/* Export method dialog */}
      <Portal>
        <Dialog
          visible={exportMethodDialogVisible}
          onDismiss={() => setExportMethodDialogVisible(false)}
        >
          <Dialog.Title>Choose Export Method</Dialog.Title>
          <Dialog.Content>
            <List.Item
              title="Copy to Clipboard"
              description={selectedExportFormat === 'pdf' ? 'Not available for PDF' : 'Copy content to clipboard'}
              left={props => <List.Icon {...props} icon="content-copy" />}
              onPress={() => handleExport('clipboard')}
              disabled={selectedExportFormat === 'pdf'}
            />
            <List.Item
              title="Share"
              description="Share via installed apps"
              left={props => <List.Icon {...props} icon="share-variant" />}
              onPress={() => handleExport('share')}
            />
            <List.Item
              title="Save to Device"
              description="Save file to device storage"
              left={props => <List.Icon {...props} icon="content-save" />}
              onPress={() => handleExport('save')}
            />
            <List.Item
              title="Send via Email"
              description="Open email client with attachment"
              left={props => <List.Icon {...props} icon="email" />}
              onPress={() => handleExport('email')}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setExportMethodDialogVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        {viewMode === 'raw' ? (
          <View style={styles.flex1}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <TextInput
                label="Title"
                value={title}
                onChangeText={setTitle}
                mode="outlined"
                style={styles.titleInput}
                placeholder="Enter memo title"
                disabled={loading}
              />
              <TagInput
                tags={tags}
                onAddTag={(tag) => setTags([...tags, tag])}
                onRemoveTag={(tag) => setTags(tags.filter(t => t !== tag))}
                disabled={loading}
              />
              <TextInput
                ref={contentInputRef}
                label="Content"
                value={content}
                onChangeText={setContent}
                onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
                mode="outlined"
                multiline
                numberOfLines={15}
                style={styles.contentInput}
                placeholder="Write your memo here... (Markdown supported)"
                disabled={loading}
              />
              {isNewMemo && (
                <Button
                  mode="contained"
                  onPress={handleSave}
                  style={styles.saveButton}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              )}
            </ScrollView>
            <EditorToolbar actions={toolbarActions} />
          </View>
        ) : (
          <ScrollView
            style={styles.previewContainer}
            contentContainerStyle={styles.previewContent}
          >
            <Text variant="titleLarge" style={styles.previewTitle}>
              {title || 'Untitled'}
            </Text>
            <MarkdownViewer content={content} />
          </ScrollView>
        )}
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={1500}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  toggleContainer: {
    flex: 1,
    marginRight: 16,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveStatusContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  titleInput: {
    marginBottom: 16,
  },
  contentInput: {
    minHeight: 200,
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
  },
  previewContainer: {
    flex: 1,
  },
  previewContent: {
    padding: 16,
  },
  previewTitle: {
    paddingBottom: 8,
    fontWeight: 'bold',
  },
  snackbar: {
    position: 'absolute',
    bottom: 0,
  },
});
