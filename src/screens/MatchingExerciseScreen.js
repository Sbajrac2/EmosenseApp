import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import SimpleIcon from '../components/SimpleIcon';
import TTSToggle from '../components/TTSToggle';
import HomeButton from '../components/HomeButton';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { IMAGES } from '../constants/images';
import TTS from '../utils/textToSpeech';
import { useTTS } from '../contexts/TTSContext';
// import { getRandomFeedback } from '../utils/feedbackMessages';

const { width } = Dimensions.get('window');

export default function MatchingExerciseScreen({ navigation, route }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showHelpMessage, setShowHelpMessage] = useState(false);
  const [showHintMessage, setShowHintMessage] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showSecondChance, setShowSecondChance] = useState(false);
  const { isTTSEnabled } = useTTS();

  // Clean up when leaving the screen - stop TTS
  useEffect(() => {
    return () => {
      TTS.stop();
    };
  }, []);

  const handleGoHome = () => {
    TTS.stop();
    navigation.navigate('LessonsMain');
  };

  const questions = [
    { id: 1, type: 'emoji', image: '😠', correctAnswer: 'Angry', options: ['Angry', 'Happy', 'Sad'], lessonTitle: 'Basic Emotions', hint: 'Look at the eyebrows and mouth' },
    { id: 2, type: 'emoji', image: '😰', correctAnswer: 'Sad', options: ['Angry', 'Happy', 'Sad'], lessonTitle: 'Basic Emotions', hint: 'Notice the downward mouth' },
    { id: 3, type: 'emoji', image: '😄', correctAnswer: 'Happy', options: ['Angry', 'Happy', 'Sad'], lessonTitle: 'Basic Emotions', hint: 'See the big smile' },
    { id: 4, type: 'emoji', image: '😴', correctAnswer: 'Tired', options: ['Tired', 'Sad', 'Angry'], lessonTitle: 'Basic Emotions', hint: 'Eyes are closed for sleep' },
    { id: 5, type: 'emoji', image: '😮', correctAnswer: 'Surprised', options: ['Surprised', 'Happy', 'Angry'], lessonTitle: 'Basic Emotions', hint: 'Look at the wide open mouth' },
    { id: 6, type: 'emoji', image: '😟', correctAnswer: 'Worried', options: ['Worried', 'Happy', 'Excited'], lessonTitle: 'Basic Emotions', hint: 'Notice the concerned expression' },
    { id: 7, type: 'emoji', image: '🤔', correctAnswer: 'Thinking', options: ['Thinking', 'Sleeping', 'Angry'], lessonTitle: 'Basic Emotions', hint: 'See the hand on the chin' },
    { id: 8, type: 'emoji', image: '😊', correctAnswer: 'Content', options: ['Content', 'Sad', 'Angry'], lessonTitle: 'Basic Emotions', hint: 'A gentle, peaceful smile' },
    { id: 9, type: 'emoji', image: '😢', correctAnswer: 'Crying', options: ['Crying', 'Happy', 'Angry'], lessonTitle: 'Basic Emotions', hint: 'See the tear drop' },
    { id: 10, type: 'emoji', image: '🤗', correctAnswer: 'Excited', options: ['Excited', 'Sad', 'Worried'], lessonTitle: 'Basic Emotions', hint: 'Arms open wide with joy' }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = async (answer) => {
    if (selectedAnswer !== null && !showSecondChance) return;
    
    setSelectedAnswer(answer);
    setAttempts(attempts + 1);
    
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      const feedback = ['Well done!', 'That\'s right!', 'Nice work!', 'Correct!', 'Great!'][Math.floor(Math.random() * 5)];
      if (isTTSEnabled) await TTS.speakFeedback(feedback, true);
      setShowSecondChance(false);
    } else {
      if (attempts === 0) {
        if (isTTSEnabled) await TTS.speakFeedback('Try again', false);
        setShowHintMessage(true);
        setShowSecondChance(true);
        setTimeout(() => {
          setSelectedAnswer(null);
        }, 2000);
      } else {
        if (isTTSEnabled) await TTS.speakFeedback('Nice try', false);
        setShowSecondChance(false);
      }
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      navigation.navigate('LessonSummary', { 
        score, 
        totalQuestions: questions.length,
        lessonTitle: `Lesson ${route.params?.lessonId || 1}`,
        source: route.params?.source || 'lessons',
        lessonId: route.params?.lessonId
      });
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAttempts(0);
      setShowSecondChance(false);
      setShowHintMessage(false);
      setShowHelpMessage(false);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setAttempts(0);
      setShowSecondChance(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TTSToggle />
      <HomeButton onPress={handleGoHome} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setShowHintMessage(true)}>
            <Image source={IMAGES.hint} resizeMode="contain" style={styles.topBarIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowHelpMessage(true)}>
            <Image source={IMAGES.help} resizeMode="contain" style={styles.topBarIcon} />
          </TouchableOpacity>
        </View>

        {showHintMessage && (
          <View style={[styles.popupWrapper, { top: 50, left: 20 }]}>
            <View style={styles.hintContainer}>
              <Text style={styles.helpText}>{currentQuestion.hint}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowHintMessage(false)} style={{ marginTop: 5, padding: 5 }}>
              <Text style={{ color: COLORS.darkBlue, fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {showHelpMessage && (
          <View style={[styles.popupWrapper, { top: 50, right: 20 }]}>
            <View style={styles.hintContainer}>
              <Text style={styles.helpText}>Tap the feeling word</Text>
            </View>
            <TouchableOpacity onPress={() => setShowHelpMessage(false)} style={{ marginTop: 5, padding: 5 }}>
              <Text style={{ color: COLORS.darkBlue, fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.progressContainer}>
          <Text style={styles.lessonTitle}>{currentQuestion.lessonTitle}</Text>
          <View style={styles.progressDots}>
            {questions.map((_, index) => (
              <View key={index} style={[styles.progressDot, index <= currentQuestionIndex && styles.progressDotActive]} />
            ))}
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.imageContainer}>
            <Text style={styles.questionImage}>{currentQuestion.image}</Text>
          </View>
          <View style={styles.instructionContainer}>
            <Text style={styles.instruction}>Match the feeling</Text>
          </View>
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === option && option === currentQuestion.correctAnswer && styles.correctOption,
                  selectedAnswer === option && option !== currentQuestion.correctAnswer && styles.incorrectOption,
                ]}
                onPress={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null && !showSecondChance}
              >
                <View style={styles.optionContent}>
                  <Text style={[styles.optionText, selectedAnswer === option && { color: COLORS.white }]}>
                    {option}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
            onPress={handleBack}
            disabled={currentQuestionIndex === 0}
          >
            <SimpleIcon name="chevron-back" size={24} color={COLORS.darkBlue} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, (selectedAnswer === null || showSecondChance) && styles.disabledButton]}
            onPress={handleNext}
            disabled={selectedAnswer === null || showSecondChance}
          >
            {isLastQuestion ? (
              <Text style={styles.doneButtonText}>Done</Text>
            ) : (
              <SimpleIcon name="chevron-forward" size={24} color={COLORS.darkBlue} />
            )}
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGreen },
  scrollView: { flex: 1 },
  content: { padding: SIZES.padding, position: 'relative', paddingBottom: 50 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.margin },
  topBarIcon: { width: 28, height: 28, resizeMode: 'contain' },
  popupWrapper: {
    position: 'absolute',
    maxWidth: width * 0.7,
    backgroundColor: '#ffe6f0',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.small,
    zIndex: 999,
  },
  helpText: { fontSize: SIZES.base, color: COLORS.black, textAlign: 'center', ...FONTS.medium },
  hintContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  instructionContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: SIZES.margin * 2 },
  speakerButton: { marginLeft: 8 },
  optionContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  optionSpeaker: { marginLeft: 8 },
  progressContainer: { alignItems: 'center', marginBottom: SIZES.margin * 2 },
  lessonTitle: { fontSize: SIZES.large, color: COLORS.black, marginBottom: SIZES.margin, ...FONTS.bold },
  progressDots: { flexDirection: 'row', justifyContent: 'center' },
  progressDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.lightGrey, marginHorizontal: 4 },
  progressDotActive: { backgroundColor: COLORS.darkBlue },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { width: 200, height: 200, backgroundColor: COLORS.lightBlue, borderRadius: SIZES.radius * 2, justifyContent: 'center', alignItems: 'center', marginBottom: SIZES.margin * 2, ...SHADOWS.medium },
  questionImage: { fontSize: 80 },
  instruction: { fontSize: SIZES.base, color: COLORS.black, textAlign: 'center', marginBottom: SIZES.margin * 2, ...FONTS.medium },
  optionsContainer: { width: '100%', maxWidth: 300 },
  optionButton: { backgroundColor: COLORS.lightBlue, borderRadius: SIZES.radius, paddingVertical: SIZES.padding, paddingHorizontal: SIZES.padding * 2, marginBottom: SIZES.margin, alignItems: 'center', ...SHADOWS.small },
  correctOption: { backgroundColor: '#4CAF50' },
  incorrectOption: { backgroundColor: '#F44336' },
  optionText: { fontSize: SIZES.large, color: COLORS.darkBlue, ...FONTS.bold },
  navigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SIZES.margin * 2 },
  navButton: { backgroundColor: COLORS.lightBlue, borderRadius: SIZES.radius, padding: SIZES.padding, minWidth: 60, alignItems: 'center', ...SHADOWS.small },
  disabledButton: { opacity: 0.5 },
  doneButtonText: { fontSize: SIZES.base, color: COLORS.darkBlue, ...FONTS.bold },
});