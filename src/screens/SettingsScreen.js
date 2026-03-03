import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Switch,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { IMAGES } from '../constants/images';
import { useTTS } from '../contexts/TTSContext';

const profileImages = [
  IMAGES.userAvatar,
  require('../../assets/Images2/Asian Man/AM Happy.png'),
  require('../../assets/Images2/Asian Woman/AW Happy.png'),
  require('../../assets/Images2/Black Man/BM Happy.png'),
  require('../../assets/Images2/Black Woman/BW Happy.png'),
  require('../../assets/Images2/Caucasian Man/CM Happy.png'),
  require('../../assets/Images2/Caucasian Woman/CW Happy.png')
];

import { useUser } from '../contexts/UserContext';

export default function SettingsScreen({ navigation }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { isTTSEnabled, toggleTTS } = useTTS();
  const { username, setUsername, selectedImage, setSelectedImage, profileImages } = useUser();
  const [showImagePicker, setShowImagePicker] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={() => setShowImagePicker(!showImagePicker)}
          >
            <Image source={profileImages[selectedImage]} style={styles.profileImage} />
            <Text style={styles.changeImageText}>Tap to change</Text>
          </TouchableOpacity>

          {showImagePicker && (
            <View style={styles.imagePicker}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {profileImages.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedImage(index);
                      setShowImagePicker(false);
                    }}
                    style={[
                      styles.imageOption,
                      selectedImage === index && styles.selectedImageOption
                    ]}
                  >
                    <Image source={image} style={styles.imageOptionImg} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.textInput}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your name"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Text to Speech</Text>
            <Switch
              value={isTTSEnabled}
              onValueChange={toggleTTS}
              trackColor={{ false: COLORS.grey, true: COLORS.darkBlue }}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Sound Effects</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: COLORS.grey, true: COLORS.darkBlue }}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.grey, true: COLORS.darkBlue }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGreen },
  scrollView: { flex: 1, padding: SIZES.padding },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { fontSize: 18, color: COLORS.darkBlue, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.black, marginLeft: 20 },
  section: { backgroundColor: COLORS.white, borderRadius: 15, padding: 20, marginBottom: 20, ...SHADOWS.medium },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.darkBlue, marginBottom: 15 },
  profileImageContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: COLORS.darkBlue },
  changeImageText: { fontSize: 12, color: COLORS.grey, marginTop: 5 },
  imagePicker: { marginBottom: 20 },
  imageOption: { marginRight: 10, padding: 2, borderRadius: 25 },
  selectedImageOption: { borderWidth: 3, borderColor: COLORS.orange },
  imageOptionImg: { width: 40, height: 40, borderRadius: 20 },
  inputContainer: { marginBottom: 15 },
  inputLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.black, marginBottom: 5 },
  textInput: { borderWidth: 2, borderColor: COLORS.lightBlue, borderRadius: 10, padding: 15, fontSize: 16, backgroundColor: COLORS.white },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.lightGrey },
  settingText: { fontSize: 16, color: COLORS.black }
});