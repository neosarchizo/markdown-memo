import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Chip, Menu, IconButton } from 'react-native-paper';
import { useState } from 'react';
import { format } from 'date-fns';
import { Memo } from '@/types/memo';

interface MemoItemProps {
  memo: Memo;
  onPress: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function MemoItem({ memo, onPress, onTogglePin, onDelete }: MemoItemProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleTogglePin = () => {
    closeMenu();
    onTogglePin(memo.id);
  };

  const handleDelete = () => {
    closeMenu();
    Alert.alert(
      'Delete Memo',
      'Are you sure you want to delete this memo? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(memo.id),
        },
      ]
    );
  };

  return (
    <Card style={styles.card} onPress={() => onPress(memo.id)} mode="elevated">
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text variant="titleMedium" numberOfLines={1} style={styles.title}>
              {memo.title || 'Untitled'}
            </Text>
            {memo.isPinned && (
              <Chip icon="pin" compact style={styles.pinnedChip}>
                Pinned
              </Chip>
            )}
          </View>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <IconButton icon="dots-vertical" size={20} onPress={openMenu} />
            }
          >
            <Menu.Item
              onPress={handleTogglePin}
              title={memo.isPinned ? 'Unpin' : 'Pin'}
              leadingIcon={memo.isPinned ? 'pin-off' : 'pin'}
            />
            <Menu.Item
              onPress={handleDelete}
              title="Delete"
              leadingIcon="delete"
            />
          </Menu>
        </View>

        {memo.content && (
          <Text variant="bodyMedium" numberOfLines={2} style={styles.preview}>
            {memo.content}
          </Text>
        )}

        <View style={styles.cardFooter}>
          <Text variant="bodySmall" style={styles.date}>
            {format(new Date(memo.updatedAt), 'MMM d, yyyy')}
          </Text>
          {memo.tags.length > 0 && (
            <View style={styles.tags}>
              {memo.tags.slice(0, 3).map((tag) => (
                <Chip key={tag} compact style={styles.tag}>
                  {tag}
                </Chip>
              ))}
              {memo.tags.length > 3 && (
                <Text variant="bodySmall" style={styles.moreTagsText}>
                  +{memo.tags.length - 3}
                </Text>
              )}
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
  },
  pinnedChip: {
    height: 24,
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
  moreTagsText: {
    opacity: 0.6,
  },
});
