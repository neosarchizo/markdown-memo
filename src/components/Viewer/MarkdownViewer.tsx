import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Markdown from 'react-native-markdown-display';

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  const theme = useTheme();

  if (!content.trim()) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyMedium" style={styles.emptyText}>
          No content to display
        </Text>
      </View>
    );
  }

  const markdownStyles = {
    body: {
      color: theme.colors.onSurface,
      fontSize: 16,
      lineHeight: 24,
    },
    heading1: {
      color: theme.colors.onSurface,
      fontSize: 32,
      fontWeight: 'bold' as const,
      lineHeight: 40,
      paddingTop: 4,
      marginTop: 16,
      marginBottom: 8,
    },
    heading2: {
      color: theme.colors.onSurface,
      fontSize: 28,
      fontWeight: 'bold' as const,
      lineHeight: 36,
      paddingTop: 4,
      marginTop: 14,
      marginBottom: 7,
    },
    heading3: {
      color: theme.colors.onSurface,
      fontSize: 24,
      fontWeight: 'bold' as const,
      lineHeight: 32,
      paddingTop: 4,
      marginTop: 12,
      marginBottom: 6,
    },
    heading4: {
      color: theme.colors.onSurface,
      fontSize: 20,
      fontWeight: 'bold' as const,
      lineHeight: 28,
      paddingTop: 3,
      marginTop: 10,
      marginBottom: 5,
    },
    heading5: {
      color: theme.colors.onSurface,
      fontSize: 18,
      fontWeight: 'bold' as const,
      lineHeight: 26,
      paddingTop: 3,
      marginTop: 8,
      marginBottom: 4,
    },
    heading6: {
      color: theme.colors.onSurface,
      fontSize: 16,
      fontWeight: 'bold' as const,
      lineHeight: 24,
      paddingTop: 2,
      marginTop: 6,
      marginBottom: 3,
    },
    strong: {
      fontWeight: 'bold' as const,
    },
    em: {
      fontStyle: 'italic' as const,
    },
    code_inline: {
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.onSurfaceVariant,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: 'monospace',
    },
    code_block: {
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.onSurfaceVariant,
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      fontFamily: 'monospace',
    },
    fence: {
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.onSurfaceVariant,
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      fontFamily: 'monospace',
    },
    blockquote: {
      backgroundColor: theme.colors.surfaceVariant,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      paddingLeft: 12,
      paddingVertical: 8,
      marginVertical: 8,
    },
    bullet_list: {
      marginVertical: 8,
    },
    ordered_list: {
      marginVertical: 8,
    },
    list_item: {
      marginVertical: 4,
    },
    link: {
      color: theme.colors.primary,
      textDecorationLine: 'underline' as const,
    },
    hr: {
      backgroundColor: theme.colors.outlineVariant,
      height: 1,
      marginVertical: 16,
    },
    table: {
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 8,
      marginVertical: 8,
    },
    thead: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    th: {
      fontWeight: 'bold' as const,
      padding: 8,
      borderRightWidth: 1,
      borderRightColor: theme.colors.outlineVariant,
    },
    tr: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
    },
    td: {
      padding: 8,
      borderRightWidth: 1,
      borderRightColor: theme.colors.outlineVariant,
    },
  };

  return <Markdown style={markdownStyles}>{content}</Markdown>;
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
    padding: 32,
  },
});
