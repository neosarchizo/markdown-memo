import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { TagChip } from './TagChip';

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  disabled?: boolean;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    const trimmedTag = inputValue.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onAddTag(trimmedTag);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: any) => {
    // Handle Enter key
    if (e.nativeEvent.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Tags"
        value={inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={handleAddTag}
        onKeyPress={handleKeyPress}
        mode="outlined"
        placeholder="Add tags (press Enter)"
        disabled={disabled}
        style={styles.input}
        right={
          inputValue.trim() ? (
            <TextInput.Icon icon="plus" onPress={handleAddTag} />
          ) : undefined
        }
      />
      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              onDelete={() => onRemoveTag(tag)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
