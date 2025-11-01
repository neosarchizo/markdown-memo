import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, Switch, RadioButton, Button, Snackbar } from 'react-native-paper';
import { useTheme } from '@/contexts/ThemeContext';
import { useMemos } from '@/contexts/MemoContext';
import { ExportService } from '@/services/export';
import type { SortType } from '@/types/memo';

export default function SettingsScreen() {
  const { isDark, toggleTheme, theme } = useTheme();
  const { sortType, setSortType, memos } = useMemos();
  const [exporting, setExporting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleToggleTheme = async () => {
    try {
      await toggleTheme();
    } catch (error) {
      console.error('Failed to toggle theme:', error);
    }
  };

  const handleSortTypeChange = async (value: string) => {
    try {
      await setSortType(value as SortType);
    } catch (error) {
      console.error('Failed to change sort type:', error);
    }
  };

  const handleExportAllMemos = async () => {
    if (memos.length === 0) {
      Alert.alert('No Memos', 'There are no memos to export.');
      return;
    }

    Alert.alert(
      'Export All Memos',
      `Export ${memos.length} memo(s) as a single Markdown file?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: async () => {
            try {
              setExporting(true);

              // Combine all memos into a single Markdown document
              const content = memos
                .map((memo) => {
                  const tags = memo.tags.length > 0 ? `Tags: ${memo.tags.join(', ')}` : '';
                  const created = `Created: ${new Date(memo.createdAt).toLocaleDateString()}`;
                  const updated = `Updated: ${new Date(memo.updatedAt).toLocaleDateString()}`;

                  return `# ${memo.title}\n\n${tags}\n${created} | ${updated}\n\n---\n\n${memo.content}\n\n`;
                })
                .join('\n\n---\n\n');

              const filename = `all-memos-${new Date().toISOString().split('T')[0]}.md`;

              // Use share method for all memos export
              await ExportService.shareContent(content, filename, 'text/markdown');

              setSnackbarMessage(`Exported ${memos.length} memo(s)`);
              setSnackbarVisible(true);
            } catch (error) {
              console.error('Export all memos error:', error);
              Alert.alert('Export Failed', 'Failed to export memos. Please try again.');
            } finally {
              setExporting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Subheader>Appearance</List.Subheader>
        <List.Item
          title="Dark Mode"
          description="Toggle between light and dark theme"
          right={() => (
            <Switch value={isDark} onValueChange={handleToggleTheme} />
          )}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Sort Order</List.Subheader>
        <RadioButton.Group onValueChange={handleSortTypeChange} value={sortType}>
          <List.Item
            title="Last Updated"
            description="Sort by most recently updated"
            left={() => <RadioButton value="updatedAt" />}
          />
          <List.Item
            title="Created Date"
            description="Sort by creation date"
            left={() => <RadioButton value="createdAt" />}
          />
          <List.Item
            title="Title"
            description="Sort alphabetically by title"
            left={() => <RadioButton value="title" />}
          />
        </RadioButton.Group>
      </List.Section>

      <List.Section>
        <List.Subheader>Data</List.Subheader>
        <List.Item
          title="Export All Memos"
          description={`Export ${memos.length} memo(s) to a file`}
          left={(props) => <List.Icon {...props} icon="export" />}
          onPress={handleExportAllMemos}
          disabled={exporting || memos.length === 0}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>About</List.Subheader>
        <List.Item
          title="Markdown Memo"
          description="A simple and powerful memo app"
        />
        <List.Item
          title="Version"
          description="1.0.0"
        />
      </List.Section>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
