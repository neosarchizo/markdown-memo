import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useMemos } from '@/contexts/MemoContext';

export default function EditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { memos, createMemo, updateMemo } = useMemos();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const isNewMemo = id === 'new';

  // Load existing memo if editing
  useEffect(() => {
    if (!isNewMemo) {
      const memo = memos.find((m) => m.id === id);
      if (memo) {
        setTitle(memo.title);
        setContent(memo.content);
      }
    }
  }, [id, isNewMemo, memos]);

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
    <View style={styles.container}>
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
          placeholder="Write your memo here..."
          disabled={loading}
        />
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
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
});
