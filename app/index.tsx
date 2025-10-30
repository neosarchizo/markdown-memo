import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, FAB, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useMemos } from '@/contexts/MemoContext';
import MemoList from '@/components/MemoList/MemoList';

export default function HomeScreen() {
  const router = useRouter();
  const { memos, loading, error, loadMemos, togglePin, deleteMemo } = useMemos();
  const [refreshing, setRefreshing] = useState(false);

  const handleCreateMemo = () => {
    router.push('/editor/new');
  };

  const handleMemoPress = (id: string) => {
    router.push(`/editor/${id}`);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadMemos();
    } finally {
      setRefreshing(false);
    }
  };

  const handleTogglePin = async (id: string) => {
    await togglePin(id);
  };

  const handleDelete = async (id: string) => {
    await deleteMemo(id);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text variant="bodyLarge" style={styles.loadingText}>
          Loading memos...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="titleLarge" style={styles.errorText}>
          Error
        </Text>
        <Text variant="bodyMedium">{error}</Text>
      </View>
    );
  }

  if (memos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="headlineMedium">Welcome to Markdown Memo</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Tap the button below to create your first memo
        </Text>

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={handleCreateMemo}
          label="New Memo"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MemoList
        memos={memos}
        onMemoPress={handleMemoPress}
        onTogglePin={handleTogglePin}
        onDelete={handleDelete}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateMemo}
        label="New Memo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.6,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
