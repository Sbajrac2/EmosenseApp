import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../constants/theme';

export default function HomeButton({ onPress, style }) {
  return (
    <TouchableOpacity 
      style={[styles.homeButton, style]} 
      onPress={onPress}
    >
      <Text style={styles.homeText}>🏠 Home</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    position: 'absolute',
    right: 20,
    top: 10,
    backgroundColor: COLORS.darkBlue,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    ...SHADOWS.small,
  },
  homeText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

