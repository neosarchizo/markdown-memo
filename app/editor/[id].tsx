import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, ActivityIndicator, Snackbar, Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { useMemos } from '@/contexts/MemoContext';
import { ViewMode } from '@/types/memo';
import { useDebounce } from '@/hooks/useDebounce';
import ViewToggle from '@/components/Viewer/ViewToggle';
import MarkdownViewer from '@/components/Viewer/MarkdownViewer';

export default function EditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { memos, createMemo, updateMemo } = useMemos();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('raw');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isNewMemo = id === 'new';
  const initialLoadRef = useRef(true);
  const isAutoSavingRef = useRef(false);
  const originalTitleRef = useRef('');
  const originalContentRef = useRef('');

  // Debounce content for auto-save (30 seconds)
  const debouncedTitle = useDebounce(title, 30000);
  const debouncedContent = useDebounce(content, 30000);

  // Load existing memo if editing
  useEffect(() => {
    // Skip if auto-saving to prevent focus loss
    if (isAutoSavingRef.current) {
      return;
    }

    if (!isNewMemo) {
      const memo = memos.find((m) => m.id === id);
      if (memo) {
        setTitle(memo.title);
        setContent(memo.content);
        originalTitleRef.current = memo.title;
        originalContentRef.current = memo.content;
        initialLoadRef.current = false;
      }
    } else {
      initialLoadRef.current = false;
    }
  }, [id, isNewMemo, memos]);

  // Auto-save existing memo when debounced values change
  useEffect(() => {
    // Skip auto-save on initial load or for new memos
    if (initialLoadRef.current || isNewMemo) {
      return;
    }

    // Skip if title and content are both empty
    if (!debouncedTitle.trim() && !debouncedContent.trim()) {
      return;
    }

    // Check if there are actual changes
    const hasChanges =
      debouncedTitle.trim() !== originalTitleRef.current.trim() ||
      debouncedContent.trim() !== originalContentRef.current.trim();

    if (!hasChanges) {
      return;
    }

    const autoSave = async () => {
      isAutoSavingRef.current = true;
      setIsSaving(true);
      try {
        await updateMemo(id, {
          title: debouncedTitle.trim() || 'Untitled',
          content: debouncedContent.trim(),
        });
        // Update original values after successful save
        originalTitleRef.current = debouncedTitle.trim() || 'Untitled';
        originalContentRef.current = debouncedContent.trim();
        // Show toast without stealing focus
        setSnackbarMessage('Auto-saved');
        setSnackbarVisible(true);
      } catch (error) {
        console.error('Error auto-saving memo:', error);
      } finally {
        setIsSaving(false);
        // Reset after a short delay to allow memos state to update
        setTimeout(() => {
          isAutoSavingRef.current = false;
        }, 100);
      }
    };

    autoSave();
  }, [debouncedTitle, debouncedContent, id, isNewMemo, updateMemo]);

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
          tags: [],
          isPinned: false,
        });
        setSnackbarMessage('Memo created!');
      } else {
        await updateMemo(id, {
          title: title.trim(),
          content: content.trim(),
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <ViewToggle value={viewMode} onValueChange={setViewMode} />
          {isSaving && (
            <Text variant="bodySmall" style={styles.savingText}>
              Saving...
            </Text>
          )}
        </View>

        {viewMode === 'raw' ? (
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
            <TextInput
              label="Content"
              value={content}
              onChangeText={setContent}
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

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={1500}
          style={styles.snackbar}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  savingText: {
    opacity: 0.6,
    fontStyle: 'italic',
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
