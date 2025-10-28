import { View, StyleSheet } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleCreateMemo = () => {
    router.push('/editor/new');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Welcome to Markdown Memo</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Your memos will appear here
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
