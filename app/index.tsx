import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, FAB, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useMemos } from '@/contexts/MemoContext';
import { useTheme } from '@/contexts/ThemeContext';
import MemoList from '@/components/MemoList/MemoList';
import SearchBar from '@/components/Search/SearchBar';
import { useSearch } from '@/hooks/useSearch';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { memos, loading, error, refreshMemos, togglePin, deleteMemo } = useMemos();
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
      await refreshMemos();
      // Search will automatically re-run via useSearch hook when memos update
    } catch (error) {
      console.error('Error refreshing memos:', error);
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
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ color: theme.colors.onBackground, marginTop: 16 }}>
          Loading memos...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <Text variant="titleLarge" style={{ color: theme.colors.error, marginBottom: 8 }}>
          Error
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onBackground }}>{error}</Text>
      </View>
    );
  }

  // Show welcome screen only if there are no memos at all
  if (memos.length === 0 && !searchQuery.trim()) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>Welcome to Markdown Memo</Text>
        <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onBackground }]}>
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search memos..."
      />

      {showEmptySearch ? (
        <View style={styles.emptySearchContainer}>
          <Text variant="titleLarge" style={{ color: theme.colors.onBackground }}>No results found</Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onBackground }]}>
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
