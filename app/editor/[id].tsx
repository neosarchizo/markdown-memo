import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

export default function EditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const isNewMemo = id === 'new';

  const handleSave = () => {
    // TODO: Implement save logic in Phase 1
    console.log('Save memo:', { id, title, content });
    router.back();
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.titleInput}
      />
      <TextInput
        label="Content"
        value={content}
        onChangeText={setContent}
        mode="outlined"
        multiline
        numberOfLines={10}
        style={styles.contentInput}
      />
      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
        Save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    marginBottom: 16,
  },
  contentInput: {
    flex: 1,
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
  },
});
