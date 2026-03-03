import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions } from 'react-native';
import TTSToggle from '../components/TTSToggle';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { IMAGES } from '../constants/images';

const { width } = Dimensions.get('window');

export default function EmotionMatchingActivity({ navigation, route }) {
  const [currentTask, setCurrentTask] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showHelpMessage, setShowHelpMessage] = useState(false);
  const [showHintMessage, setShowHintMessage] = useState(false);
  
  const tasks = [
    {
      leftImage: require('../../assets/images/Happy_real.png'),
      rightImages: [
        { image: require('../../assets/images/Sad.png'), emotion: 'Sad' },
        { image: require('../../assets/images/Happy.png'), emotion: 'Happy' },
        { image: IMAGES.angry_female_1, emotion: 'Angry' },
      ],
      question: 'Which emotion matches the person on the left?',
      correctAnswer: 'Happy',
      hint: 'Look for the same facial expression - smiling!'
    },
    {
      leftImage: require('../../assets/images/Surprised_real.png'),
      rightImages: [
        { image: require('../../assets/images/Excited.png'), emotion: 'Excited' },
        { image: require('../../assets/images/Surprised.png'), emotion: 'Surprised' },
        { image: require('../../assets/images/Happy.png'), emotion: 'Happy' },
      ],
      question: 'Match the real photo with the correct cartoon emotion',
      correctAnswer: 'Surprised',
      hint: 'Notice the wide open eyes and mouth!'
    },
    {
      leftImage: require('../../assets/images/TIred_real.png'),
      rightImages: [
        { image: require('../../assets/images/Happy.png'), emotion: 'Happy' },
        { image: require('../../assets/images/Sad.png'), emotion: 'Sad' },
        { image: require('../../assets/images/Excited.png'), emotion: 'Excited' },
      ],
      question: 'What emotion does this tired person show?',
      correctAnswer: 'Sad',
      hint: 'Look at the low energy and droopy expression'
    },
    {
      leftImage: IMAGES.angry_male_1,
      rightImages: [
        { image: require('../../assets/images/Happy.png'), emotion: 'Happy' },
        { image: IMAGES.angry_female_1, emotion: 'Angry' },
        { image: require('../../assets/images/Surprised.png'), emotion: 'Surprised' },
      ],
      question: 'Match this angry expression',
      correctAnswer: 'Angry',
      hint: 'Notice the tense face and furrowed brows'
    },
    {
      leftImage: require('../../assets/images/Worried_real.png'),
      rightImages: [
        { image: require('../../assets/images/Happy.png'), emotion: 'Happy' },
        { image: require('../../assets/images/Sad.png'), emotion: 'Worried' },
        { image: require('../../assets/images/Excited.png'), emotion: 'Excited' },
      ],
      question: 'What emotion is this person feeling?',
      correctAnswer: 'Worried',
      hint: 'Look at the concerned, anxious expression'
    },
  ];

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer === tasks[currentTask].correctAnswer) {
      setScore(score + 1);
    }

    if (currentTask < tasks.length - 1) {
      setCurrentTask(currentTask + 1);
      setSelectedAnswer(null);
    } else {
      navigation.navigate('LessonSummary', { 
        score, 
        totalQuestions: tasks.length, 
        lessonTitle: route.params?.source === 'lessons' ? 'Lesson 5' : 'Emotion Matching',
        source: route.params?.source || 'activities'
      });
    }
  };

  const handleHome = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TTSToggle />
      <View style={styles.content}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setShowHintMessage(true)}>
            <Image source={IMAGES.hint} resizeMode="contain" style={styles.topBarIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleHome} style={styles.homeButton}>
            <Text style={styles.homeIcon}>🏠</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowHelpMessage(true)}>
            <Image source={IMAGES.help} resizeMode="contain" style={styles.topBarIcon} />
          </TouchableOpacity>
        </View>

        {showHintMessage && (
          <View style={[styles.popupWrapper, { top: 60, left: 20 }]}>
            <Text style={styles.helpText}>{tasks[currentTask].hint}</Text>
            <TouchableOpacity onPress={() => setShowHintMessage(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        {showHelpMessage && (
          <View style={[styles.popupWrapper, { top: 60, right: 20 }]}>
            <Text style={styles.helpText}>Compare the real photo with cartoon options to find the matching emotion.</Text>
            <TouchableOpacity onPress={() => setShowHelpMessage(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.progress}>Task {currentTask + 1} of {tasks.length}</Text>
        <Text style={styles.title}>{tasks[currentTask].question}</Text>
        
        <View style={styles.matchingContainer}>
          <View style={styles.leftContainer}>
            <Text style={styles.sectionLabel}>Real Photo</Text>
            <Image source={tasks[currentTask].leftImage} style={styles.leftImage} resizeMode="contain" />
          </View>

          <View style={styles.rightContainer}>
            <Text style={styles.sectionLabel}>Choose Match</Text>
            {tasks[currentTask].rightImages.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.rightOption,
                  selectedAnswer === item.emotion && item.emotion === tasks[currentTask].correctAnswer && styles.correctOption,
                  selectedAnswer === item.emotion && item.emotion !== tasks[currentTask].correctAnswer && styles.incorrectOption,
                ]}
                onPress={() => handleAnswerSelect(item.emotion)}
              >
                <Image source={item.image} style={styles.rightImage} resizeMode="contain" />
                <Text style={styles.emotionLabel}>{item.emotion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !selectedAnswer && styles.disabledButton]}
          onPress={handleNext}
          disabled={!selectedAnswer}
        >
          <Text style={styles.nextButtonText}>
            {currentTask === tasks.length - 1 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGreen },
  content: { flex: 1, padding: SIZES.padding, position: 'relative' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.margin },
  homeButton: { backgroundColor: COLORS.white, borderRadius: 20, padding: 8 },
  homeIcon: { fontSize: 20 },
  topBarIcon: { width: 28, height: 28 },
  popupWrapper: {
    position: 'absolute',
    maxWidth: width * 0.7,
    backgroundColor: '#ffe6f0',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    zIndex: 999,
  },
  helpText: { fontSize: SIZES.base, color: COLORS.black, textAlign: 'center' },
  closeButton: { marginTop: 10, padding: 5 },
  closeText: { color: COLORS.darkBlue, fontWeight: 'bold' },
  progress: { fontSize: SIZES.base, color: COLORS.grey, textAlign: 'center', marginBottom: 10 },
  title: { fontSize: SIZES.large, color: COLORS.black, marginBottom: 30, textAlign: 'center' },
  matchingContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  leftContainer: { flex: 0.4, alignItems: 'center' },
  rightContainer: { flex: 0.55 },
  sectionLabel: { fontSize: SIZES.base, color: COLORS.darkBlue, marginBottom: 15 },
  leftImage: { width: 120, height: 120, borderRadius: 15 },
  rightOption: { backgroundColor: COLORS.white, borderRadius: 10, padding: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  correctOption: { backgroundColor: '#4CAF50' },
  incorrectOption: { backgroundColor: '#F44336' },
  rightImage: { width: 50, height: 50, marginRight: 15 },
  emotionLabel: { fontSize: SIZES.base, color: COLORS.black },
  nextButton: { backgroundColor: COLORS.orange, borderRadius: SIZES.radius, paddingVertical: SIZES.padding, alignItems: 'center', marginTop: 20 },
  disabledButton: { opacity: 0.5 },
  nextButtonText: { fontSize: SIZES.large, color: COLORS.white },
});
