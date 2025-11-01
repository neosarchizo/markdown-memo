import React from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = 'Search memos...' }: SearchBarProps) {
  return (
    <Searchbar
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={styles.searchbar}
      inputStyle={styles.input}
      elevation={0}
    />
  );
}

const styles = StyleSheet.create({
  searchbar: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  input: {
    minHeight: 0,
  },
});
