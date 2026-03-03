import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Switch,
} from 'react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { IMAGES } from '../constants/images';
import { useTTS } from '../contexts/TTSContext';
import { useUser } from '../contexts/UserContext';
import { useRewards } from '../contexts/RewardContext';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const { isTTSEnabled, toggleTTS } = useTTS();
  const { badges, streak } = useRewards();
  const { username, getUserImage } = useUser();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User avatar */}
        <View style={styles.avatarContainer}>
          <Image source={getUserImage()} style={styles.avatar} />
          <Text style={styles.name}>{username}</Text>
          <Text style={styles.username}>@janedoe</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{badges.length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>

        {/* TTS Toggle */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Text to Speech</Text>
          <Switch
            value={isTTSEnabled}
            onValueChange={toggleTTS}
            trackColor={{ false: COLORS.lightGrey, true: COLORS.darkBlue }}
            thumbColor={isTTSEnabled ? COLORS.white : COLORS.grey}
          />
        </View>

        {/* Buttons / actions */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('SettingsScreen')}
        >
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('BadgesScreen')}
        >
          <Text style={styles.actionText}>My Badges</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={() => {
            // Add your sign-out logic here
            navigation.replace('Login');
          }}
        >
          <Text style={[styles.actionText, { color: COLORS.red }]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGreen,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
    paddingHorizontal: SIZES.padding,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SIZES.margin * 2,
  },
  avatar: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: (width * 0.35) / 2,
    borderWidth: 3,
    borderColor: COLORS.white,
    ...SHADOWS.medium,
  },
  name: {
    marginTop: SIZES.margin,
    fontSize: SIZES.large,
    color: COLORS.black,
    ...FONTS.bold,
  },
  username: {
    fontSize: SIZES.base,
    color: COLORS.grey,
    ...FONTS.medium,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: SIZES.margin * 2,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: SIZES.xlarge,
    color: COLORS.darkBlue,
    ...FONTS.bold,
  },
  statLabel: {
    fontSize: SIZES.base,
    color: COLORS.black,
    ...FONTS.medium,
  },
  actionButton: {
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding * 1.2,
    paddingHorizontal: SIZES.padding,
    alignItems: 'center',
    marginVertical: SIZES.margin / 2,
    ...SHADOWS.small,
  },
  actionText: {
    fontSize: SIZES.large,
    color: COLORS.black,
    ...FONTS.medium,
  },
  logoutButton: {
    backgroundColor: COLORS.pink,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    marginVertical: SIZES.margin / 2,
    ...SHADOWS.small,
  },
  settingText: {
    fontSize: SIZES.large,
    color: COLORS.black,
    ...FONTS.medium,
  },
});
