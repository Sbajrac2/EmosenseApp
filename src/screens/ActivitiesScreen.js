import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import SpeakerButton from '../components/SpeakerButton';
import TTSToggle from '../components/TTSToggle';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { IMAGES } from '../constants/images';
import TTS from '../utils/textToSpeech';
import { useTTS } from '../contexts/TTSContext';

const getEmotionColor = (emotion) => {
  switch (emotion) {
    case 'happy': return COLORS.yellow;
    case 'sad': return COLORS.lightBlue;
    case 'angry': return '#FFB3B3';
    case 'surprised': return COLORS.pink;
    case 'ai': return '#E8F5E8';
    default: return COLORS.lightGreen;
  }
};

export default function ActivitiesScreen({ navigation }) {
  const { isTTSEnabled } = useTTS();
  const [completedActivityIds, setCompletedActivityIds] = useState([]);
  const generateActivities = () => {
    const teachers = [
      { name: 'Ms. Lisa', avatar: IMAGES.photo_girl },
      { name: 'Mr. John', avatar: IMAGES.photo_boy },
      { name: 'Mrs. Kate', avatar: IMAGES.photo_woman },
      { name: 'Mr. Mike', avatar: IMAGES.photo_man },
    ];

    const activityTypes = [
      { type: 'face_word_matching', title: 'Face-Word Matching', description: 'Match faces to emotion words', icon: '🔗' },
      { type: 'video_emotion_clips', title: 'Video Emotion Clips', description: 'Identify emotions in video scenes', icon: '🎥' },
      { type: 'swipe_emotion_cards', title: 'Swipe Emotion Cards', description: 'Swipe through emotion flashcards', icon: '👆' },
      { type: 'emotion_situation_match', title: 'Situation Matching', description: 'Match emotions to situations', icon: '🎭' },
      { type: 'emoji_face_match', title: 'Emoji-Face Match', description: 'Match emojis to real faces', icon: '😊' },
      { type: 'emotion_intensity_slider', title: 'Intensity Slider', description: 'Rate emotion intensity levels', icon: '🎚️' },
      { type: 'emotion_sorting_bins', title: 'Emotion Sorting', description: 'Sort faces into emotion bins', icon: '🗂️' },
      { type: 'story_sequence_emotions', title: 'Story Emotions', description: 'Complete emotion story sequences', icon: '📖' },
      { type: 'body_language_detective', title: 'Body Language Detective', description: 'Read emotions from body language', icon: '🕵️' },
      { type: 'emotion_intensity_order', title: 'Intensity Ordering', description: 'Order emotions by intensity', icon: '📊' },
      { type: 'build_emotion_faces', title: 'Build-A-Face', description: 'Build faces to match emotions', icon: '🎭' },
      { type: 'ai_personalized_learning', title: 'AI Learning Path', description: 'Personalized AI emotion lessons', icon: '🤖' },
    ];

    const emotions = ['happy', 'sad', 'angry', 'surprised', 'mixed'];
    let activityId = 1;
    const activities = {};

    emotions.forEach(emotion => {
      activities[emotion] = [];
      
      activityTypes.forEach((config, typeIndex) => {
        for (let i = 1; i <= 30; i++) {
          const teacher = teachers[Math.floor(Math.random() * teachers.length)];
          activities[emotion].push({
            id: activityId++,
            title: config.title,
            description: `${config.description} - Level ${i}`,
            fullDescription: `${config.description} for ${emotion} emotions - Level ${i}`,
            type: config.type,
            emotion: emotion,
            level: i,
            assignedBy: teacher.name,
            avatar: teacher.avatar,
            icon: config.icon,
          });
        }
      });
    });

    // Add AI activities
    activities['ai'] = [];
    for (let i = 1; i <= 30; i++) {
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      activities['ai'].push({
        id: activityId++,
        title: 'AI Learning Path',
        description: `Personalized AI lessons - Level ${i}`,
        fullDescription: `AI-powered personalized emotion learning - Level ${i}`,
        type: 'ai_personalized_learning',
        emotion: 'ai',
        level: i,
        assignedBy: 'AI Teacher',
        avatar: IMAGES.photo_girl,
        icon: '🤖',
      });
    }

    return activities;
  };

  const emotionActivities = {
    happy: [
      {
        id: 1,
        title: 'Face-Word Matching',
        description: 'Happy faces',
        fullDescription: 'Identify Happy emotions in photos',
        type: 'picture_emotion',
        emotion: 'happy',
        assignedBy: 'Ms. Lisa',
        avatar: IMAGES.photo_girl,
        icon: '📷',
      },
      {
        id: 2,
        title: 'Video Emotion Clips',
        description: 'Happy videos',
        fullDescription: 'Watch videos and find happy moments',
        type: 'video_emotion',
        emotion: 'happy',
        assignedBy: 'Mr. John',
        avatar: IMAGES.photo_boy,
        icon: '🎥',
      },
      {
        id: 3,
        title: 'Situation Matching',
        description: 'Happy situations',
        fullDescription: 'Match happy faces with situations',
        type: 'emotion_matching',
        emotion: 'happy',
        assignedBy: 'Mrs. Kate',
        avatar: IMAGES.photo_woman,
        icon: '🔗',
      },
      {
        id: 4,
        title: 'Swipe Emotion Cards',
        description: 'Happy emotions',
        fullDescription: 'Swipe through happy emotions',
        type: 'swipe_emotion',
        emotion: 'happy',
        assignedBy: 'Mr. Mike',
        avatar: IMAGES.photo_man,
        icon: '👆',
      },
    ],
    sad: [
      {
        id: 5,
        title: 'Face-Word Matching',
        description: 'Sad faces',
        fullDescription: 'Recognize sad emotions in pictures',
        type: 'picture_emotion',
        emotion: 'sad',
        assignedBy: 'Ms. Lisa',
        avatar: IMAGES.photo_girl,
        icon: '📷',
      },
      {
        id: 6,
        title: 'Video Emotion Clips',
        description: 'Sad videos',
        fullDescription: 'Identify sadness in video clips',
        type: 'video_emotion',
        emotion: 'sad',
        assignedBy: 'Mr. John',
        avatar: IMAGES.photo_boy,
        icon: '🎥',
      },
      {
        id: 7,
        title: 'Situation Matching',
        description: 'Sad situations',
        fullDescription: 'Match sad emotions with causes',
        type: 'emotion_matching',
        emotion: 'sad',
        assignedBy: 'Mrs. Kate',
        avatar: IMAGES.photo_woman,
        icon: '🔗',
      },
      {
        id: 8,
        title: 'Swipe Emotion Cards',
        description: 'Sad emotions',
        fullDescription: 'Swipe through sad emotions',
        type: 'swipe_emotion',
        emotion: 'sad',
        assignedBy: 'Mr. Mike',
        avatar: IMAGES.photo_man,
        icon: '👆',
      },
    ],
    angry: [
      {
        id: 9,
        title: 'Face-Word Matching',
        description: 'Angry faces',
        fullDescription: 'Spot angry expressions in photos',
        type: 'picture_emotion',
        emotion: 'angry',
        assignedBy: 'Mrs. Kate',
        avatar: IMAGES.photo_woman,
        icon: '📷',
      },
      {
        id: 10,
        title: 'Video Emotion Clips',
        description: 'Angry videos',
        fullDescription: 'Recognize anger in video clips',
        type: 'video_emotion',
        emotion: 'angry',
        assignedBy: 'Mr. John',
        avatar: IMAGES.photo_boy,
        icon: '🎥',
      },
      {
        id: 11,
        title: 'Situation Matching',
        description: 'Angry situations',
        fullDescription: 'Match angry emotions with causes',
        type: 'emotion_matching',
        emotion: 'angry',
        assignedBy: 'Mrs. Kate',
        avatar: IMAGES.photo_woman,
        icon: '🔗',
      },
      {
        id: 12,
        title: 'Swipe Emotion Cards',
        description: 'Angry emotions',
        fullDescription: 'Swipe through angry emotions',
        type: 'swipe_emotion',
        emotion: 'angry',
        assignedBy: 'Mr. Mike',
        avatar: IMAGES.photo_man,
        icon: '👆',
      },
    ],
    surprised: [
      {
        id: 13,
        title: 'Face-Word Matching',
        description: 'Surprised faces',
        fullDescription: 'Find surprised faces in pictures',
        type: 'picture_emotion',
        emotion: 'surprised',
        assignedBy: 'Ms. Lisa',
        avatar: IMAGES.photo_girl,
        icon: '📷',
      },
      {
        id: 14,
        title: 'Video Emotion Clips',
        description: 'Surprised videos',
        fullDescription: 'Spot surprise reactions in videos',
        type: 'video_emotion',
        emotion: 'surprised',
        assignedBy: 'Mr. John',
        avatar: IMAGES.photo_boy,
        icon: '🎥',
      },
      {
        id: 15,
        title: 'Situation Matching',
        description: 'Surprised situations',
        fullDescription: 'Match surprise with situations',
        type: 'emotion_matching',
        emotion: 'surprised',
        assignedBy: 'Mrs. Kate',
        avatar: IMAGES.photo_woman,
        icon: '🔗',
      },
      {
        id: 16,
        title: 'Swipe Emotion Cards',
        description: 'Surprised emotions',
        fullDescription: 'Swipe through surprised emotions',
        type: 'swipe_emotion',
        emotion: 'surprised',
        assignedBy: 'Mr. Mike',
        avatar: IMAGES.photo_man,
        icon: '👆',
      },
    ],
    mixed: [
      {
        id: 17,
        title: 'Face-Word Matching',
        description: 'Mixed emotions',
        fullDescription: 'Identify various emotions together',
        type: 'picture_emotion',
        emotion: 'mixed',
        assignedBy: 'Ms. Lisa',
        avatar: IMAGES.photo_girl,
        icon: '📷',
      },
      {
        id: 18,
        title: 'Video Emotion Clips',
        description: 'Social cues',
        fullDescription: 'Understand social emotional cues',
        type: 'video_emotion',
        emotion: 'mixed',
        assignedBy: 'Mr. John',
        avatar: IMAGES.photo_boy,
        icon: '🎥',
      },
      {
        id: 19,
        title: 'Emotion Sorting',
        description: 'Sort emotions',
        fullDescription: 'Sort faces into emotion bins',
        type: 'emotion_sort',
        emotion: 'mixed',
        assignedBy: 'Mrs. Kate',
        avatar: IMAGES.photo_woman,
        icon: '🗂️',
      },
      {
        id: 20,
        title: 'Story Emotions',
        description: 'Story sequences',
        fullDescription: 'Complete emotion story sequences',
        type: 'emotion_story',
        emotion: 'mixed',
        assignedBy: 'Ms. Lisa',
        avatar: IMAGES.photo_girl,
        icon: '📖',
      },
      {
        id: 21,
        title: 'Body Language Detective',
        description: 'Body language',
        fullDescription: 'Identify emotions from body language',
        type: 'body_language',
        emotion: 'mixed',
        assignedBy: 'Mr. John',
        avatar: IMAGES.photo_boy,
        icon: '🕵️',
      },
      {
        id: 22,
        title: 'Intensity Ordering',
        description: 'Emotion intensity',
        fullDescription: 'Order emotions by intensity',
        type: 'emotion_intensity',
        emotion: 'mixed',
        assignedBy: 'Mrs. Kate',
        avatar: IMAGES.photo_woman,
        icon: '📊',
      },
      {
        id: 23,
        title: 'Build-A-Face',
        description: 'Build faces',
        fullDescription: 'Build faces to match emotions',
        type: 'build_face',
        emotion: 'mixed',
        assignedBy: 'Mr. Mike',
        avatar: IMAGES.photo_man,
        icon: '🎭',
      },
    ],
    ai: [
      {
        id: 24,
        title: 'AI Learning Path',
        description: 'AI lessons',
        fullDescription: 'Learn with AI personalized lessons',
        type: 'ai_learning',
        emotion: 'ai',
        assignedBy: 'AI Teacher',
        avatar: IMAGES.photo_girl,
        icon: '🤖',
      },
    ],
  };

  const getAllActivities = () => {
    return Object.values(emotionActivities).flat();
  };

  const completedActivities = getAllActivities().filter(activity => 
    completedActivityIds.includes(activity.id)
  );

  const activeActivities = getAllActivities().filter(activity => 
    !completedActivityIds.includes(activity.id)
  );

  const handleActivityPress = async (activity) => {
    if (isTTSEnabled) await TTS.speak(`Starting ${activity.description}`);
    
    switch (activity.type) {
      case 'picture_emotion':
        navigation.navigate('PictureEmotionActivity', { emotion: activity.emotion, activityId: activity.id });
        break;
      case 'video_emotion':
        navigation.navigate('VideoEmotionActivity', { emotion: activity.emotion, activityId: activity.id });
        break;
      case 'swipe_emotion':
        navigation.navigate('SwipeEmotionActivity', { emotion: activity.emotion, activityId: activity.id });
        break;
      case 'emotion_matching':
        navigation.navigate('EmotionMatchingActivity', { emotion: activity.emotion, activityId: activity.id });
        break;
      case 'ai_learning':
        navigation.navigate('AILearningActivity', { activityId: activity.id });
        break;
      case 'slider_emotion':
        navigation.navigate('SliderEmotionActivity', { emotion: activity.emotion, activityId: activity.id });
        break;
      case 'emotion_sort':
        navigation.navigate('EmotionSortActivity', { emotion: activity.emotion, activityId: activity.id });
        break;
      case 'emotion_story':
        navigation.navigate('EmotionStoryActivity', { emotion: activity.emotion, activityId: activity.id });
        break;
      case 'body_language':
        navigation.navigate('BodyLanguageActivity', { emotion: activity.emotion, activityId: activity.id });
        break;
      case 'emotion_intensity':
        navigation.navigate('EmotionIntensityActivity', { emotion: activity.emotion, activityId: activity.id });
        break;
      case 'build_face':
        navigation.navigate('BuildAFaceActivity', { emotion: activity.emotion, activityId: activity.id });
        break;
      default:
        navigation.navigate('MatchingExercise', { lessonId: activity.id, activityId: activity.id });
    }
  };

  const getActivityIcon = (activity) => {
    return activity.icon || '📝';
  };

  const renderActivityCard = (activity) => (
    <TouchableOpacity
      key={activity.id}
      style={styles.activityCard}
      onPress={() => handleActivityPress(activity)}
    >
      <View style={styles.activityLeft}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityIcon}>{getActivityIcon(activity)}</Text>
          <View style={styles.activityTitleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
            </View>
            <Text style={styles.activityDescription}>{activity.description}</Text>
          </View>
        </View>
        <Text style={styles.activityDueDate}>{activity.dueDate}</Text>
      </View>
      <View style={styles.activityRight}>
        <Text style={styles.assignedByText}>By:</Text>
        <View style={styles.teacherInfo}>
          <Image source={activity.avatar} style={styles.teacherAvatar} />
          <Text style={styles.teacherName}>{activity.assignedBy}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TTSToggle />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Activities</Text>
          </View>

          {Object.entries(emotionActivities).map(([emotion, activities]) => {
            const activeEmotionActivities = activities.filter(activity => 
              !completedActivityIds.includes(activity.id)
            );
            if (activeEmotionActivities.length === 0) return null;
            
            return (
              <View key={emotion} style={[styles.emotionSection, { backgroundColor: getEmotionColor(emotion) }]}>
                <Text style={styles.sectionTitle}>{emotion.charAt(0).toUpperCase() + emotion.slice(1)} Activities</Text>
                {activeEmotionActivities.map(renderActivityCard)}
              </View>
            );
          })}

          {completedActivities.length > 0 && (
            <View style={styles.completedSection}>
              <Text style={styles.sectionTitle}>Completed ({completedActivities.length})</Text>
              {completedActivities.map(renderActivityCard)}
            </View>
          )}


        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGreen },
  scrollView: { flex: 1 },
  content: { flex: 1, paddingHorizontal: SIZES.padding, paddingTop: SIZES.padding, paddingBottom: SIZES.padding },
  header: { backgroundColor: COLORS.lightGreen, paddingBottom: SIZES.padding },
  headerTitle: { fontSize: 32, color: COLORS.black, fontWeight: 'bold', marginBottom: 8 },
  sectionTitle: { fontSize: 22, color: COLORS.black, fontWeight: 'bold', marginBottom: SIZES.margin },
  emotionSection: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.darkBlue,
    padding: SIZES.padding,
    marginBottom: SIZES.margin * 2,
    ...SHADOWS.medium,
  },
  completedSection: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2196F3',
    padding: SIZES.padding,
    marginBottom: SIZES.margin * 2,
    ...SHADOWS.medium,
  },
  activityCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  activityLeft: { flex: 1 },
  activityHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  activityIcon: { fontSize: 24, marginRight: 12 },
  activityTitleContainer: { flex: 1 },
  activityTitle: { fontSize: 16, color: COLORS.black, fontWeight: '500', marginBottom: 2 },
  activityDescription: { fontSize: 12, color: COLORS.grey },
  activityDueDate: { fontSize: 14, color: COLORS.grey },
  activityRight: { alignItems: 'flex-end' },
  assignedByText: { fontSize: 12, color: COLORS.grey, marginBottom: 4 },
  teacherInfo: { alignItems: 'center' },
  teacherAvatar: { width: 40, height: 40, borderRadius: 20, marginBottom: 4 },
  teacherName: { fontSize: 12, color: COLORS.black, fontWeight: '500' },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  activitySpeaker: { marginLeft: 8 },
});
