import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Memo } from '@/types/memo';
import MemoItem from './MemoItem';

interface MemoListProps {
  memos: Memo[];
  onMemoPress: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function MemoList({
  memos,
  onMemoPress,
  onTogglePin,
  onDelete,
  refreshing = false,
  onRefresh,
}: MemoListProps) {
  return (
    <FlatList
      data={memos}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      renderItem={({ item }) => (
        <MemoItem
          memo={item}
          onPress={onMemoPress}
          onTogglePin={onTogglePin}
          onDelete={onDelete}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
});
