import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import TTSToggle from '../components/TTSToggle';
import HomeButton from '../components/HomeButton';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { IMAGES } from '../constants/images';
import TTS from '../utils/textToSpeech';
import { useTTS } from '../contexts/TTSContext';
import { generateVisualCues, getCueStyle } from '../utils/visualCueHelper';

export default function VideoEmotionActivity({ navigation, route }) {
  const { emotion } = route.params || {};
  const [currentTask, setCurrentTask] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [videoPlayed, setVideoPlayed] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showSecondChance, setShowSecondChance] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { isTTSEnabled } = useTTS();
  const videoRef = useRef(null);
  
  // Clean up when leaving the screen - stop video and TTS
  useEffect(() => {
    return () => {
      // Stop video playback
      if (videoRef.current) {
        videoRef.current.stopAsync();
      }
      // Stop TTS
      TTS.stop();
    };
  }, []);

  const handleGoHome = () => {
    // Stop video and TTS before navigating home
    if (videoRef.current) {
      videoRef.current.stopAsync();
    }
    TTS.stop();
    navigation.navigate('LessonsMain');
  };
  
  const getTasksForEmotion = (targetEmotion) => {
    const baseVideos = {
      happy: [IMAGES.video_autism],
      sad: [IMAGES.video_sad],
      angry: [IMAGES.video_awkward], // Placeholder
      surprised: [IMAGES.video_autism], // Placeholder
      mixed: [IMAGES.video_awkward, IMAGES.video_uninterested, IMAGES.video_autism]
    };

    const emotionOptions = {
      happy: ['Happy', 'Joyful', 'Excited', 'Content'],
      sad: ['Sad', 'Tired', 'Worried', 'Disappointed'],
      angry: ['Angry', 'Frustrated', 'Irritated', 'Mad'],
      surprised: ['Surprised', 'Shocked', 'Amazed', 'Startled'],
      mixed: ['Happy', 'Sad', 'Angry', 'Surprised', 'Uncomfortable', 'Bored', 'Engaged']
    };

    const generateTasks = (emotion) => {
      const tasks = [];
      const videos = baseVideos[emotion] || baseVideos.mixed;
      const options = emotionOptions[emotion] || emotionOptions.mixed;
      
      for (let i = 0; i < 15; i++) {
        const videoIndex = i % videos.length;
        const correctAnswer = options[0]; // Use first option as correct
        const wrongOptions = options.slice(1, 4); // Take next 3 as wrong options
        const allOptions = [correctAnswer, ...wrongOptions]; // Keep order fixed
        
        tasks.push({
          video: videos[videoIndex],
          question: `What ${emotion} emotion?`,
          fullQuestion: `What ${emotion} emotion do you see in this video?`,
          correctAnswer,
          options: allOptions,
          hint: `Look for signs of ${emotion} in facial expressions and body language`,
          isPlaceholder: videoIndex >= videos.length
        });
      }
      return tasks;
    };

    return generateTasks(targetEmotion);
  };
  
  const tasks = getTasksForEmotion(emotion);

  const handlePlayVideo = () => {
    setVideoPlayed(true);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const getRandomFeedback = (type) => {
    const positive = ['Well done!', 'That\'s right!', 'Nice work!', 'Correct!', 'Great!'];
    const tryAgain = ['Try again', 'Give it another try', 'Not quite right', 'Try once more'];
    const encourage = ['Nice try', 'Keep trying', 'Almost there', 'Good effort'];
    
    if (type === 'positive') return positive[Math.floor(Math.random() * positive.length)];
    if (type === 'tryAgain') return tryAgain[Math.floor(Math.random() * tryAgain.length)];
    return encourage[Math.floor(Math.random() * encourage.length)];
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) return;
    
    setAttempts(attempts + 1);
    
    if (selectedAnswer === tasks[currentTask].correctAnswer) {
      const feedback = getRandomFeedback('positive');
      console.log('Speaking:', feedback);
      await TTS.speakFeedback(feedback, true);
      setShowSecondChance(false);
    } else {
      if (attempts === 0) {
        const feedback = getRandomFeedback('tryAgain');
        console.log('Speaking:', feedback);
        await TTS.speakFeedback(feedback, false);
        setShowSecondChance(true);
        setShowHint(true);
        setTimeout(() => {
          setSelectedAnswer(null);
          setShowHint(false);
        }, 5000);
      } else {
        const feedback = getRandomFeedback('encourage');
        console.log('Speaking:', feedback);
        await TTS.speakFeedback(feedback, false);
        setShowSecondChance(false);
      }
    }
  };

  const handleNext = () => {
    if (selectedAnswer === tasks[currentTask].correctAnswer) {
      setScore(score + 1);
    }

    if (currentTask < tasks.length - 1) {
      setCurrentTask(currentTask + 1);
      setSelectedAnswer(null);
      setVideoPlayed(false);
      setAttempts(0);
      setShowSecondChance(false);
      setShowHint(false);
    } else {
      navigation.navigate('LessonSummary', { 
        score, 
        totalQuestions: tasks.length, 
        lessonTitle: route.params?.source === 'lessons' ? 'Lesson 4' : 'Video Emotions',
        source: route.params?.source || (route.params?.activityId ? 'activities' : 'lessons'),
        activityId: route.params?.activityId
      });
    }
  };

  // Use the original working video dimensions
  const screenWidth = Dimensions.get('window').width;
  const videoWidth = screenWidth < 600 ? screenWidth * 0.9 : screenWidth * 0.7;
  const videoHeight = screenWidth < 600 ? 200 : videoWidth * (9/16);

  return (
    <SafeAreaView style={styles.container}>
      <TTSToggle />
      <HomeButton onPress={handleGoHome} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
        <Text style={styles.progress}>Task {currentTask + 1} of {tasks.length}</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Watch the video</Text>
        </View>
        
        <View style={styles.videoWrapper}>
          <Video
            ref={videoRef}
            source={tasks[currentTask].video}
            style={{
              width: videoWidth,
              height: videoHeight,
              backgroundColor: 'black'
            }}
            resizeMode="contain"
            useNativeControls
            shouldPlay={true}
            isLooping={true}
            isMuted={false}
            onLoad={() => {
              setVideoPlayed(true);
            }}
            onError={(error) => {
              console.log('Video error:', error);
            }}
          />
          {tasks[currentTask].isPlaceholder && (
            <View style={styles.placeholderOverlay}>
              <Text style={styles.placeholderText}>Placeholder Video</Text>
            </View>
          )}
          {showHint && (
            <View style={[styles.hintsOverlay, { width: videoWidth, height: videoHeight }]}>
              {generateVisualCues(tasks[currentTask].hint).map((cue, index) => (
                <View key={index} style={getCueStyle(cue)} />
              ))}
            </View>
          )}
        </View>

        {
          <>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{tasks[currentTask].question}</Text>
            </View>
            <View style={styles.optionsContainer}>
              {tasks[currentTask].options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && option === tasks[currentTask].correctAnswer && styles.correctOption,
                    selectedAnswer === option && option !== tasks[currentTask].correctAnswer && styles.incorrectOption,
                  ]}
                  onPress={() => handleAnswerSelect(option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedAnswer && attempts === 0 && (
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            )}

            {attempts > 0 && (
              <TouchableOpacity
                style={[styles.nextButton, showSecondChance && styles.disabledButton]}
                onPress={handleNext}
                disabled={showSecondChance}
              >
                <Text style={styles.nextButtonText}>
                  {currentTask === tasks.length - 1 ? 'Finish' : 'Next'}
                </Text>
              </TouchableOpacity>
            )}
          </>
}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGreen },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: SIZES.padding, paddingVertical: 10, alignItems: 'center' },
  progress: { fontSize: SIZES.base, color: COLORS.grey, marginBottom: 10 },
  title: { fontSize: SIZES.large, color: COLORS.black, marginBottom: 30, textAlign: 'center', ...FONTS.bold },
  videoPlaceholder: { width: 230, height: 180, borderRadius: 10 },
  playButton: { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 30, padding: 15 },
  playIcon: { fontSize: 30 },
  videoStatus: { color: COLORS.white, fontSize: SIZES.base },
  questionText: { fontSize: SIZES.large, color: COLORS.black, marginBottom: 20, textAlign: 'center', ...FONTS.bold },
  optionsContainer: { width: '100%', maxWidth: 300 },
  optionButton: { backgroundColor: COLORS.lightBlue, borderRadius: SIZES.radius, paddingVertical: SIZES.padding, marginBottom: SIZES.margin, alignItems: 'center', ...SHADOWS.small },
  correctOption: { backgroundColor: '#4CAF50' },
  incorrectOption: { backgroundColor: '#F44336' },
  optionText: { fontSize: SIZES.large, color: COLORS.darkBlue, ...FONTS.bold },
  nextButton: { backgroundColor: COLORS.orange, borderRadius: SIZES.radius, paddingVertical: SIZES.padding, paddingHorizontal: 40, marginTop: 20, ...SHADOWS.small },
  disabledButton: { opacity: 0.5 },
  nextButtonText: { fontSize: SIZES.large, color: COLORS.white, ...FONTS.bold },
  submitButton: { backgroundColor: COLORS.darkBlue, borderRadius: SIZES.radius, paddingVertical: SIZES.padding, paddingHorizontal: 40, marginTop: 20, ...SHADOWS.small },
  submitButtonText: { fontSize: SIZES.large, color: COLORS.white, ...FONTS.bold },
  titleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  questionContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  speakerButton: { marginLeft: 8 },
  videoWrapper: {
    alignSelf: 'center',
    marginVertical: 10,
    position: 'relative'
  },
  hintsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none'
  },
  placeholderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderText: {
    color: COLORS.white,
    fontSize: SIZES.base,
    fontWeight: 'bold'
  }
});