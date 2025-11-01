import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, FAB, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useMemos } from '@/contexts/MemoContext';
import MemoList from '@/components/MemoList/MemoList';
import SearchBar from '@/components/Search/SearchBar';
import { useSearch } from '@/hooks/useSearch';

export default function HomeScreen() {
  const router = useRouter();
  const { memos, loading, error, loadMemos, togglePin, deleteMemo } = useMemos();
  const [refreshing, setRefreshing] = useState(false);
  const { searchQuery, setSearchQuery, searchResults, isSearching } = useSearch(memos);

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

  // Show welcome screen only if there are no memos at all
  if (memos.length === 0 && !searchQuery.trim()) {
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

  // Show empty search results
  const showEmptySearch = searchQuery.trim() && searchResults.length === 0 && !isSearching;

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search memos..."
      />

      {showEmptySearch ? (
        <View style={styles.emptySearchContainer}>
          <Text variant="titleLarge">No results found</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Try a different search term
          </Text>
        </View>
      ) : (
        <MemoList
          memos={searchResults}
          onMemoPress={handleMemoPress}
          onTogglePin={handleTogglePin}
          onDelete={handleDelete}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

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
  emptySearchContainer: {
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
