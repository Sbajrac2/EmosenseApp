import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import SimpleIcon from '../components/SimpleIcon';
import SpeakerButton from '../components/SpeakerButton';
import TTSToggle from '../components/TTSToggle';
import { COLORS, SHADOWS } from '../constants/theme';
import { IMAGES } from '../constants/images';
import TTS from '../utils/textToSpeech';
import { useTTS } from '../contexts/TTSContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LessonsScreen({ navigation, route }) {
  const [currentLesson, setCurrentLesson] = useState(1);
  
  // Force update when route params change
  React.useEffect(() => {
    if (route?.params?.lessonCompleted) {
      const nextLesson = Math.min(route.params.lessonCompleted + 1, 6);
      setCurrentLesson(nextLesson);
    }
  }, [route?.params?.lessonCompleted]);
  const { isTTSEnabled } = useTTS();
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route?.params?.lessonCompleted) {
        const nextLesson = Math.min(route.params.lessonCompleted + 1, 6);
        setCurrentLesson(nextLesson);
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route?.params?.lessonCompleted) {
      const nextLesson = Math.min(route.params.lessonCompleted + 1, 6);
      setCurrentLesson(nextLesson);
    }
  }, [route?.params?.lessonCompleted]);

  const lessons = [
    { id: 1, title: '1', type: 'emoji', fullTitle: 'Lesson 1: Basic Emojis' },
    { id: 2, title: '2', type: 'cartoon', fullTitle: 'Lesson 2: Cartoon Emotions' },
    { id: 3, title: '3', type: 'real', fullTitle: 'Lesson 3: Real Photos' },
    { id: 4, title: '4', type: 'video', fullTitle: 'Lesson 4: Video Emotions' },
    { id: 5, title: '5', type: 'bodyLanguage', fullTitle: 'Lesson 5: Body Language' },
    { id: 6, title: '6', type: 'emotionSort', fullTitle: 'Lesson 6: Emotion Sorting' },
    { id: 7, title: '7', type: 'intensity', fullTitle: 'Lesson 7: Emotion Intensity' },
    { id: 8, title: '8', type: 'stories', fullTitle: 'Lesson 8: Emotion Stories' },
    { id: 9, title: '9', type: 'mixed', fullTitle: 'Lesson 9: Mixed Practice' },
    { id: 10, title: '10', type: 'chooseAll', fullTitle: 'Lesson 10: Choose All That Apply' },
    { id: 11, title: 'More Soon', comingSoon: true, fullTitle: 'More lessons coming soon' },
  ];

  // Responsive sizing
  const roadWidth = SCREEN_WIDTH;
  const lessonSize = Math.min(SCREEN_WIDTH * 0.2, 90);
  const lessonSpacing = 200;
  const avatarSize = Math.min(SCREEN_WIDTH * 0.16, 70);

  const roadLeft = 0;
  const scrollHeight = lessons.length * lessonSpacing + 400;

  // Avatar animation
  const avatarY = useRef(new Animated.Value(lessonSpacing / 2)).current;

  useEffect(() => {
    const targetY = (currentLesson - 1) * lessonSpacing + lessonSpacing / 2;
    Animated.timing(avatarY, {
      toValue: targetY,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentLesson]);

  const handleLessonPress = async (lesson) => {
    if (lesson.comingSoon) {
      if (isTTSEnabled) await TTS.speak('More lessons coming soon');
      return;
    }
    if (lesson.id > currentLesson) {
      if (isTTSEnabled) await TTS.speak('Complete previous lessons first');
      return;
    }

    if (isTTSEnabled) await TTS.speak(`Lesson ${lesson.id}`);

    // Navigate to different activities based on lesson type
    const taskNumber = Math.floor(Math.random() * 10) + 1; // Random task 1-10
    switch (lesson.type) {
      case 'emoji':
        navigation.navigate('MatchingExercise', { lessonId: lesson.id, lessonType: 'emoji', source: 'lessons', taskNumber });
        break;
      case 'cartoon':
        navigation.navigate('SwipeEmotionActivity', { lessonType: 'cartoon', source: 'lessons', taskNumber });
        break;
      case 'real':
        navigation.navigate('PictureEmotionActivity', { lessonType: 'real', source: 'lessons', taskNumber });
        break;
      case 'video':
        navigation.navigate('VideoEmotionActivity', { lessonType: 'video', source: 'lessons', taskNumber });
        break;
      case 'mixed':
        navigation.navigate('EmotionMatchingActivity', { lessonType: 'mixed', source: 'lessons', taskNumber });
        break;
      case 'chooseAll':
        navigation.navigate('ChooseAllActivity', { lessonType: 'chooseAll', source: 'lessons', taskNumber });
        break;
      case 'bodyLanguage':
        navigation.navigate('BodyLanguageActivity', { source: 'lessons', taskNumber });
        break;
      case 'emotionSort':
        navigation.navigate('AdvancedEmotionSortActivity', { source: 'lessons', taskNumber });
        break;
      case 'intensity':
        navigation.navigate('EmotionIntensityActivity', { source: 'lessons', taskNumber });
        break;
      case 'stories':
        navigation.navigate('EmotionStoryActivity', { source: 'lessons', taskNumber });
        break;
      default:
        navigation.navigate('MatchingExercise', { lessonId: lesson.id, source: 'lessons', taskNumber });
    }

    // Lesson progress will be updated when returning from completion
  };

  const getLessonIcon = (lesson) => {
    if (lesson.comingSoon) {
      return null;
    } else if (lesson.id < currentLesson) {
      return <SimpleIcon name="checkmark" size={lessonSize * 0.3} color={COLORS.white} />;
    } else if (lesson.id === currentLesson) {
      return <SimpleIcon name="play" size={lessonSize * 0.3} color={COLORS.white} />;
    } else {
      return <SimpleIcon name="lock-closed" size={lessonSize * 0.3} color={COLORS.white} />;
    }
  };

  const getLessonColor = (lesson) => {
    if (lesson.comingSoon) {
      return COLORS.lightBlue;
    } else if (lesson.id < currentLesson) {
      return COLORS.yellow;
    } else if (lesson.id === currentLesson) {
      return COLORS.orange;
    } else {
      return COLORS.grey;
    }
  };

  const getLessonOpacity = (lesson) => {
    if (lesson.comingSoon) {
      return 0.6;
    } else if (lesson.id <= currentLesson) {
      return 1;
    } else {
      return 0.4;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TTSToggle />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lessons</Text>
        {/* SKIP BUTTON - Comment this line to remove: */}
        <TouchableOpacity style={styles.skipButton} onPress={() => setCurrentLesson(currentLesson + 1)}>
          <Text style={styles.skipText}>Skip Lesson</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ height: scrollHeight }}>
        {/* SVG Curved Road */}
        <Svg height={scrollHeight} width={SCREEN_WIDTH} style={styles.roadSvg}>
          <Path
            d={`M ${SCREEN_WIDTH/2} 0 
               Q ${SCREEN_WIDTH - 50} ${lessonSpacing} ${SCREEN_WIDTH/2} ${lessonSpacing * 2}
               Q 50 ${lessonSpacing * 3} ${SCREEN_WIDTH/2} ${lessonSpacing * 4}
               Q ${SCREEN_WIDTH - 50} ${lessonSpacing * 5} ${SCREEN_WIDTH/2} ${lessonSpacing * 6}
               Q 50 ${lessonSpacing * 7} ${SCREEN_WIDTH/2} ${lessonSpacing * 8}
               Q ${SCREEN_WIDTH - 50} ${lessonSpacing * 9} ${SCREEN_WIDTH/2} ${lessonSpacing * 10}
               L ${SCREEN_WIDTH/2} ${scrollHeight}`}
            stroke="#666666"
            strokeWidth="80"
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d={`M ${SCREEN_WIDTH/2} 0 
               Q ${SCREEN_WIDTH - 50} ${lessonSpacing} ${SCREEN_WIDTH/2} ${lessonSpacing * 2}
               Q 50 ${lessonSpacing * 3} ${SCREEN_WIDTH/2} ${lessonSpacing * 4}
               Q ${SCREEN_WIDTH - 50} ${lessonSpacing * 5} ${SCREEN_WIDTH/2} ${lessonSpacing * 6}
               Q 50 ${lessonSpacing * 7} ${SCREEN_WIDTH/2} ${lessonSpacing * 8}
               Q ${SCREEN_WIDTH - 50} ${lessonSpacing * 9} ${SCREEN_WIDTH/2} ${lessonSpacing * 10}
               L ${SCREEN_WIDTH/2} ${scrollHeight}`}
            stroke="#FFFFFF"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="20,15"
          />
        </Svg>

        {/* Lessons */}
        {lessons.map((lesson, index) => {
          const topPosition = index * lessonSpacing + lessonSpacing / 2;
          const isLeft = index % 2 === 0;
          
          const leftPosition = isLeft 
            ? 20
            : SCREEN_WIDTH - lessonSize - 20;

          const signColor = getLessonColor(lesson);
          const icon = getLessonIcon(lesson);
          const opacity = getLessonOpacity(lesson);

          return (
            <TouchableOpacity
              key={lesson.id}
              onPress={() => handleLessonPress(lesson)}
              style={{
                position: 'absolute',
                top: topPosition - lessonSize / 2,
                left: leftPosition,
                width: lessonSize,
                height: lessonSize + lessonSize * 0.6,
                alignItems: 'center',
                opacity,
                zIndex: 10,
              }}
            >
              {/* Pole under the sign */}
              <View
                style={{
                  position: 'absolute',
                  top: lessonSize * 0.7,
                  left: lessonSize / 2 - 3,
                  width: 6,
                  height: lessonSize * 0.5,
                  backgroundColor: '#8B4513',
                  borderRadius: 3,
                  zIndex: 1,
                }}
              />
              
              {/* Diamond sign */}
              <View
                style={[
                  styles.lessonSign,
                  {
                    width: lessonSize,
                    height: lessonSize,
                    backgroundColor: signColor,
                  },
                ]}
              >
                <View style={styles.lessonContent}>
                  <Text style={[styles.lessonText, { fontSize: lessonSize * 0.15 }]}>
                    {lesson.title}
                  </Text>
                </View>
              </View>

              {/* Icon below sign */}
              {icon && (
                <View
                  style={[
                    styles.lessonIcon,
                    {
                      width: lessonSize * 0.6,
                      height: lessonSize * 0.6,
                      borderRadius: lessonSize * 0.3,
                      backgroundColor: signColor,
                      marginTop: 5,
                    },
                  ]}
                >
                  {icon}
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Animated Avatar */}
        <Animated.View
          style={{
            position: 'absolute',
            left: SCREEN_WIDTH / 2 - avatarSize / 2,
            width: avatarSize,
            height: avatarSize,
            transform: [{ translateY: avatarY }],
            zIndex: 20,
          }}
        >
          <Image
            source={IMAGES.userAvatar}
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              borderWidth: 3,
              borderColor: COLORS.white,
            }}
            resizeMode="cover"
            fadeDuration={0}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGreen },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 5, alignItems: 'center' },
  headerTitle: { fontSize: 32, color: COLORS.black, fontWeight: 'bold' },
  skipButton: { position: 'absolute', right: 20, top: 15, backgroundColor: COLORS.orange, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  skipText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 },
  lessonSign: {
    borderWidth: 2,
    borderColor: COLORS.black,
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    ...SHADOWS.medium,
  },
  lessonText: {
    color: COLORS.black,
    fontWeight: 'bold',
    transform: [{ rotate: '-45deg' }],
    textAlign: 'center',
  },
  lessonDescription: {
    color: COLORS.black,
    fontWeight: '500',
    transform: [{ rotate: '-45deg' }],
    textAlign: 'center',
    marginTop: 2,
  },
  lessonIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  lessonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonSpeaker: {
    marginTop: 2,
  },
  roadSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  roadLine: {
    width: 4,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});
