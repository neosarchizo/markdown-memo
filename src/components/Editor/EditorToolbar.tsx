import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Surface, useTheme, Portal, Dialog, Button, TextInput, Menu } from 'react-native-paper';
import { FormatButton } from './FormatButton';

export interface ToolbarActions {
  bold: () => void;
  italic: () => void;
  underline: () => void;
  strikethrough: () => void;
  heading: (level: number) => void;
  bulletList: () => void;
  checkboxList: () => void;
  numberedList: () => void;
  indent: () => void;
  outdent: () => void;
  link: (text: string, url: string) => void;
  codeBlock: (language: string) => void;
  table: (rows: number, cols: number) => void;
}

interface EditorToolbarProps {
  actions: ToolbarActions;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ actions }) => {
  const theme = useTheme();

  // Dialog states
  const [linkDialogVisible, setLinkDialogVisible] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const [codeDialogVisible, setCodeDialogVisible] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('');

  const [tableDialogVisible, setTableDialogVisible] = useState(false);
  const [tableRows, setTableRows] = useState('3');
  const [tableCols, setTableCols] = useState('3');

  // Menu states
  const [headingMenuVisible, setHeadingMenuVisible] = useState(false);

  const handleInsertLink = () => {
    if (linkUrl) {
      actions.link(linkText || linkUrl, linkUrl);
      setLinkText('');
      setLinkUrl('');
      setLinkDialogVisible(false);
    }
  };

  const handleInsertCodeBlock = () => {
    actions.codeBlock(codeLanguage);
    setCodeLanguage('');
    setCodeDialogVisible(false);
  };

  const handleInsertTable = () => {
    const rows = parseInt(tableRows, 10) || 3;
    const cols = parseInt(tableCols, 10) || 3;
    actions.table(rows, cols);
    setTableRows('3');
    setTableCols('3');
    setTableDialogVisible(false);
  };

  return (
    <>
      <Surface style={[styles.toolbar, { backgroundColor: theme.colors.elevation.level2, borderTopColor: theme.colors.outlineVariant }]} elevation={2}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Text formatting */}
          <FormatButton icon="format-bold" onPress={actions.bold} />
          <FormatButton icon="format-italic" onPress={actions.italic} />
          <FormatButton icon="format-underline" onPress={actions.underline} />
          <FormatButton icon="format-strikethrough" onPress={actions.strikethrough} />

          <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

          {/* Heading */}
          <Menu
            visible={headingMenuVisible}
            onDismiss={() => setHeadingMenuVisible(false)}
            anchor={
              <FormatButton
                icon="format-header-pound"
                onPress={() => setHeadingMenuVisible(true)}
              />
            }
          >
            <Menu.Item onPress={() => { actions.heading(1); setHeadingMenuVisible(false); }} title="Heading 1" />
            <Menu.Item onPress={() => { actions.heading(2); setHeadingMenuVisible(false); }} title="Heading 2" />
            <Menu.Item onPress={() => { actions.heading(3); setHeadingMenuVisible(false); }} title="Heading 3" />
            <Menu.Item onPress={() => { actions.heading(4); setHeadingMenuVisible(false); }} title="Heading 4" />
            <Menu.Item onPress={() => { actions.heading(5); setHeadingMenuVisible(false); }} title="Heading 5" />
            <Menu.Item onPress={() => { actions.heading(6); setHeadingMenuVisible(false); }} title="Heading 6" />
          </Menu>

          <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

          {/* Lists */}
          <FormatButton icon="format-list-bulleted" onPress={actions.bulletList} />
          <FormatButton icon="format-list-checkbox" onPress={actions.checkboxList} />
          <FormatButton icon="format-list-numbered" onPress={actions.numberedList} />
          <FormatButton icon="format-indent-increase" onPress={actions.indent} />
          <FormatButton icon="format-indent-decrease" onPress={actions.outdent} />

          <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

          {/* Advanced */}
          <FormatButton icon="link-variant" onPress={() => setLinkDialogVisible(true)} />
          <FormatButton icon="code-tags" onPress={() => setCodeDialogVisible(true)} />
          <FormatButton icon="table" onPress={() => setTableDialogVisible(true)} />
        </ScrollView>
      </Surface>

      {/* Link Dialog */}
      <Portal>
        <Dialog visible={linkDialogVisible} onDismiss={() => setLinkDialogVisible(false)}>
          <Dialog.Title>Insert Link</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Link Text (optional)"
              value={linkText}
              onChangeText={setLinkText}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="URL"
              value={linkUrl}
              onChangeText={setLinkUrl}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="url"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLinkDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleInsertLink}>Insert</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Code Block Dialog */}
        <Dialog visible={codeDialogVisible} onDismiss={() => setCodeDialogVisible(false)}>
          <Dialog.Title>Insert Code Block</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Language (optional)"
              value={codeLanguage}
              onChangeText={setCodeLanguage}
              mode="outlined"
              placeholder="javascript, python, etc."
              autoCapitalize="none"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCodeDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleInsertCodeBlock}>Insert</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Table Dialog */}
        <Dialog visible={tableDialogVisible} onDismiss={() => setTableDialogVisible(false)}>
          <Dialog.Title>Insert Table</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Rows"
              value={tableRows}
              onChangeText={setTableRows}
              mode="outlined"
              keyboardType="number-pad"
              style={styles.dialogInput}
            />
            <TextInput
              label="Columns"
              value={tableCols}
              onChangeText={setTableCols}
              mode="outlined"
              keyboardType="number-pad"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setTableDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleInsertTable}>Insert</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    paddingVertical: 8,
    borderTopWidth: 1,
    minHeight: 60,
  },
  scrollContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
    height: 50,
  },
  divider: {
    width: 1,
    height: 30,
    marginHorizontal: 4,
  },
  dialogInput: {
    marginBottom: 8,
  },
});
