import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TTSProvider } from "./src/contexts/TTSContext";
import { AccessibilityProvider } from "./src/contexts/AccessibilityContext";
import { RewardProvider } from "./src/contexts/RewardContext";
import { UserProvider } from "./src/contexts/UserContext";
import AppNavigator from "./src/navigation/AppNavigator";

function SimpleTest() {
  const [showApp, setShowApp] = React.useState(false);
  
  if (showApp) {
    return <AppNavigator />;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>EmoSense App</Text>
      <TouchableOpacity style={styles.button} onPress={() => setShowApp(true)}>
        <Text style={styles.buttonText}>Start App</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    color: '#2E5BBA',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#B8D4F8',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#2E5BBA',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default function App() {
  return (
    <UserProvider>
      <TTSProvider>
        <AccessibilityProvider>
          <RewardProvider>
            <SimpleTest />
          </RewardProvider>
        </AccessibilityProvider>
      </TTSProvider>
    </UserProvider>
  );
}