import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Chip, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useMemos } from '@/contexts/MemoContext';
import { format } from 'date-fns';

export default function HomeScreen() {
  const router = useRouter();
  const { memos, loading, error } = useMemos();

  const handleCreateMemo = () => {
    router.push('/editor/new');
  };

  const handleMemoPress = (id: string) => {
    router.push(`/editor/${id}`);
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
      <FlatList
        data={memos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() => handleMemoPress(item.id)}
            mode="elevated"
          >
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium" numberOfLines={1}>
                  {item.title || 'Untitled'}
                </Text>
                {item.isPinned && (
                  <Chip icon="pin" compact>
                    Pinned
                  </Chip>
                )}
              </View>
              {item.content && (
                <Text variant="bodyMedium" numberOfLines={2} style={styles.preview}>
                  {item.content}
                </Text>
              )}
              <View style={styles.cardFooter}>
                <Text variant="bodySmall" style={styles.date}>
                  {format(new Date(item.updatedAt), 'MMM d, yyyy')}
                </Text>
                {item.tags.length > 0 && (
                  <View style={styles.tags}>
                    {item.tags.slice(0, 3).map((tag) => (
                      <Chip key={tag} compact style={styles.tag}>
                        {tag}
                      </Chip>
                    ))}
                    {item.tags.length > 3 && (
                      <Text variant="bodySmall">+{item.tags.length - 3}</Text>
                    )}
                  </View>
                )}
              </View>
            </Card.Content>
          </Card>
        )}
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
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  preview: {
    opacity: 0.7,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  date: {
    opacity: 0.6,
  },
  tags: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  tag: {
    height: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
