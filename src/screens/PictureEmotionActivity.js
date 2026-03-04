import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions, ScrollView, Animated } from 'react-native';

import SpeakerButton from '../components/SpeakerButton';
import TTSToggle from '../components/TTSToggle';
import SimpleSlider from '../components/SimpleSlider';
import VisualCue from '../components/VisualCue';
// import AnimatedHighlight from '../components/AnimatedHighlight';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { IMAGES } from '../constants/images';
import TTS from '../utils/textToSpeech';
import { useTTS } from '../contexts/TTSContext';
import { generateVisualCues, getCueStyle } from '../utils/visualCueHelper';
// import { getRandomFeedback } from '../utils/feedbackMessages';

const { width } = Dimensions.get('window');

export default function PictureEmotionActivity({ navigation, route }) {
  const [currentTask, setCurrentTask] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [sliderValue, setSliderValue] = useState(50);
  const [score, setScore] = useState(0);
  const [showHelpMessage, setShowHelpMessage] = useState(false);
  const [showHintMessage, setShowHintMessage] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showSecondChance, setShowSecondChance] = useState(false);
  const [showFeedback, setShowFeedback] = useState(null);
  const [feedbackAnimation] = useState(new Animated.Value(0));
  const { isTTSEnabled } = useTTS();

  // Clean up when leaving the screen - stop TTS
  useEffect(() => {
    return () => {
      TTS.stop();
    };
  }, []);
  
  const getTasksForEmotion = (targetEmotion) => {
    const baseImages = {
      happy: [
        require('../../assets/images/Happy_real.png'),
        require('../../assets/images/Happ2_real.png'),
        require('../../assets/images/Excited_real.png'),
        require('../../assets/Images2/Asian Man/AM Happy.png'),
        require('../../assets/Images2/Asian Woman/AW Happy.png'),
        require('../../assets/Images2/Black Man/BM Happy.png'),
        require('../../assets/Images2/Black Woman/BW Happy.png'),
        require('../../assets/Images2/Caucasian Man/CM Happy.png'),
        require('../../assets/Images2/Caucasian Woman/CW Happy.png'),
        require('../../assets/Images2/Old Man/OM happy.png'),
        require('../../assets/Images2/Old Woman/OW Happy.png'),
        require('../../assets/Images2/South Asian Man/SAM Happy.png'),
        require('../../assets/Images2/South Asian Woman/SAW Happy.png')
      ],
      sad: [
        require('../../assets/images/TIred_real.png'),
        require('../../assets/images/Worried_real.png'),
        require('../../assets/Images2/Asian Man/AM Sad.png'),
        require('../../assets/Images2/Asian Woman/AW Sad.png'),
        require('../../assets/Images2/Black Man/BM Sad.png'),
        require('../../assets/Images2/Caucasian Man/CM Sad.png'),
        require('../../assets/Images2/Caucasian Woman/CW Sad.png'),
        require('../../assets/Images2/Old Man/OM sad.png'),
        require('../../assets/Images2/Old Woman/OW sad.png'),
        require('../../assets/Images2/South Asian Man/SAM Sad.png')
      ],
      angry: [
        IMAGES.angry_female_1,
        IMAGES.angry_female_2,
        IMAGES.angry_male_1,
        IMAGES.angry_male_2,
        IMAGES.angry_female_3,
        require('../../assets/Images2/Asian Man/AM Angry.png'),
        require('../../assets/Images2/Asian Woman/AW Angry.png'),
        require('../../assets/Images2/Black Man/BM Angry.png'),
        require('../../assets/Images2/Black Woman/BW Angry.png'),
        require('../../assets/Images2/Caucasian Man/CM Angry.png'),
        require('../../assets/Images2/Caucasian Woman/CW ANgry.png'),
        require('../../assets/Images2/Old Man/OM angry.png'),
        require('../../assets/Images2/Old Woman/OW Angry.png'),
        require('../../assets/Images2/South Asian Man/SAM Angry.png'),
        require('../../assets/Images2/South Asian Woman/SAW angry.png')
      ],
      surprised: [
        require('../../assets/images/Surprised_real.png'),
        require('../../assets/images/Surprised2_real.png'),
        require('../../assets/Images2/Asian Man/AM Shocked.png'),
        require('../../assets/Images2/Asian Woman/AW Shocked.png'),
        require('../../assets/Images2/Black Man/BM Shocked.png'),
        require('../../assets/Images2/Black Woman/BW Shocked.png'),
        require('../../assets/Images2/Caucasian Man/CM Shocked.png'),
        require('../../assets/Images2/Caucasian Woman/CW Shocked.png'),
        require('../../assets/Images2/Old Woman/OW shocked.png'),
        require('../../assets/Images2/South Asian Man/SAM shockede.png'),
        require('../../assets/Images2/South Asian Woman/SAW shocked.png')
      ],
      mixed: [
        require('../../assets/images/Happy_real.png'),
        require('../../assets/images/Disgusted_real.png'),
        require('../../assets/images/Bored_real.png'),
        require('../../assets/Images2/Asian Man/AM Happy.png'),
        require('../../assets/Images2/Asian Woman/AW Sad.png'),
        require('../../assets/Images2/Black Man/BM Angry.png'),
        require('../../assets/Images2/Caucasian Woman/CW Shocked.png'),
        require('../../assets/Images2/Old Man/OM happy.png'),
        require('../../assets/Images2/South Asian Woman/SAW Happy.png')
      ]
    };

    const emotionOptions = {
      happy: ['Happy', 'Joyful', 'Excited', 'Content'],
      sad: ['Sad', 'Tired', 'Worried', 'Disappointed'],
      angry: ['Angry', 'Frustrated', 'Irritated', 'Mad'],
      surprised: ['Surprised', 'Shocked', 'Amazed', 'Startled'],
      mixed: ['Happy', 'Sad', 'Angry', 'Surprised', 'Disgusted', 'Bored']
    };

    const generateTasks = (emotion) => {
      const images = baseImages[emotion] || baseImages.mixed;
      const options = emotionOptions[emotion] || emotionOptions.mixed;
      const tasks = [];
      
      // Use only unique images - limit to available images
      const maxTasks = Math.min(15, images.length);
      
      for (let i = 0; i < maxTasks; i++) {
        const isSlider = i % 5 === 2;
        
        if (isSlider) {
          tasks.push({
            image: images[i],
            question: '📊',
            fullQuestion: `Rate the ${emotion} intensity`,
            type: 'slider',
            correctRange: [60, 90],
            labels: ['😢', '😐', '😊'],
            hint: `Notice the ${emotion} expression`
          });
        } else {
          const questionTypes = [
            { q: '❓', full: 'What emotion is shown?' },
            { q: '🎭', full: 'How does this person feel?' },
            { q: '😊', full: 'What is their mood?' },
            { q: '🤔', full: 'What emotion do you see?' }
          ];
          
          const questionType = questionTypes[i % questionTypes.length];
          const correctAnswer = options[i % options.length];
          const wrongOptions = options.filter(opt => opt !== correctAnswer).slice(0, 3);
          const allOptions = [correctAnswer, ...wrongOptions];
          
          tasks.push({
            image: images[i],
            question: questionType.q,
            fullQuestion: questionType.full,
            correctAnswer,
            options: allOptions,
            hint: `Look for signs of ${emotion}`
          });
        }
      }
      return tasks;
    };

    return generateTasks(targetEmotion);
  };
  
  const tasks = getTasksForEmotion(route.params?.emotion);

  const showFeedbackAnimation = (isCorrect) => {
    setShowFeedback(isCorrect);
    Animated.sequence([
      Animated.timing(feedbackAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(feedbackAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => setShowFeedback(null));
  };

  const handleAnswerSelect = async (answer) => {
    // If already correct, don't allow changing (lock in the correct answer)
    if (selectedAnswer === tasks[currentTask].correctAnswer) return;
    
    // Allow selecting different options after a wrong answer
    setSelectedAnswer(answer);
    
    if (answer === tasks[currentTask].correctAnswer) {
      showFeedbackAnimation(true);
      if (isTTSEnabled) await TTS.speakFeedback('Great!', true);
      setAttempts(0);
    } else {
      showFeedbackAnimation(false);
      if (isTTSEnabled) await TTS.speakFeedback('Try again', false);
      setAttempts(attempts + 1);
    }
  };



  const handleSliderSubmit = async () => {
    if (selectedAnswer) return;
    
    const [min, max] = tasks[currentTask].correctRange;
    const isCorrect = sliderValue >= min && sliderValue <= max;
    
    setSelectedAnswer(isCorrect ? 'correct' : 'incorrect');
    showFeedbackAnimation(isCorrect);
    
    if (isTTSEnabled) {
      await TTS.speakFeedback(isCorrect ? 'Great!' : 'Try again', isCorrect);
    }
  };

  const handleNext = () => {
    const currentTaskData = tasks[currentTask];
    
    if (currentTaskData.type === 'slider') {
      const [min, max] = currentTaskData.correctRange;
      if (sliderValue >= min && sliderValue <= max) {
        setScore(score + 1);
      }
    } else if (selectedAnswer === currentTaskData.correctAnswer) {
      setScore(score + 1);
    }

    if (currentTask < tasks.length - 1) {
      setCurrentTask(currentTask + 1);
      setSelectedAnswer(null);
      setSliderValue(50);
      setAttempts(0);
      setShowHintMessage(false);
      setShowHelpMessage(false);
      setShowFeedback(null);
    } else {
      navigation.navigate('LessonSummary', { 
        score, 
        totalQuestions: tasks.length, 
        lessonTitle: route.params?.source === 'lessons' ? 'Lesson 3' : 'Picture Emotions',
        source: route.params?.source || (route.params?.emotion ? 'activities' : 'lessons')
      });
    }
  };

  const handleHome = () => {
    navigation.navigate('MainTabs');
  };



  return (
    <SafeAreaView style={styles.container}>
      <TTSToggle />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
            <View style={styles.hintContainer}>
              <Text style={styles.helpText}>{tasks[currentTask].hint}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowHintMessage(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {showHelpMessage && (
          <View style={[styles.popupWrapper, { top: 60, right: 20 }]}>
            <View style={styles.hintContainer}>
              <Text style={styles.helpText}>Look at faces</Text>
            </View>
            <TouchableOpacity onPress={() => setShowHelpMessage(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.progress}>{currentTask + 1}/{tasks.length}</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{tasks[currentTask].question}</Text>
        </View>
        
        <View style={styles.imageContainer}>
          <Image source={tasks[currentTask].image} style={styles.questionImage} resizeMode="contain" />
          {tasks[currentTask].isPlaceholder && (
            <Text style={styles.placeholderText}>Placeholder Image</Text>
          )}
          {showHintMessage && generateVisualCues(tasks[currentTask].hint).map((cue, index) => (
            <View key={index} style={getCueStyle(cue)} />
          ))}
        </View>

        {tasks[currentTask].type === 'slider' ? (
          <View style={styles.sliderContainer}>
            <SimpleSlider
              value={sliderValue}
              onValueChange={setSliderValue}
              labels={tasks[currentTask].labels}
              minimumValue={0}
              maximumValue={100}
              step={5}
              thumbStyle={{ width: 30, height: 30 }}
              trackStyle={{ height: 8 }}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSliderSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        ) : (
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
                <View style={styles.optionContent}>
                  <Text style={styles.optionText}>{option}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.nextButton, !selectedAnswer && styles.disabledButton]}
          onPress={handleNext}
          disabled={!selectedAnswer}
        >
          <Text style={styles.nextButtonText}>
            {currentTask === tasks.length - 1 ? ' Finish' : ' Next'}
          </Text>
        </TouchableOpacity>

        {/* Feedback Animation */}
        {showFeedback !== null && (
          <Animated.View 
            style={[
              styles.feedbackContainer,
              {
                opacity: feedbackAnimation,
                transform: [{
                  scale: feedbackAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1]
                  })
                }]
              }
            ]}
          >
            <Text style={styles.feedbackEmoji}>
              {showFeedback ? '🎉' : '😔'}
            </Text>
            <Text style={styles.feedbackText}>
              {showFeedback ? 'Great!' : 'Try Again'}
            </Text>
          </Animated.View>
        )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGreen },
  scrollView: { flex: 1 },
  content: { padding: SIZES.padding, position: 'relative', paddingBottom: 50 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.margin },
  homeButton: { backgroundColor: COLORS.white, borderRadius: 20, padding: 8 },
  homeIcon: { fontSize: 20 },
  topBarIcon: { width: 28, height: 28, resizeMode: 'contain' },
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
  imageContainer: { width: 250, height: 250, backgroundColor: COLORS.white, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 30, alignSelf: 'center' },
  questionImage: { width: 230, height: 230, borderRadius: 15 },
  placeholderText: { fontSize: 12, color: COLORS.grey, textAlign: 'center', marginTop: 5, position: 'absolute', bottom: 10 },
  optionsContainer: { width: '100%', maxWidth: 300, alignSelf: 'center' },
  optionButton: { backgroundColor: COLORS.lightBlue, borderRadius: SIZES.radius, paddingVertical: SIZES.padding, marginBottom: SIZES.margin, alignItems: 'center' },
  correctOption: { backgroundColor: '#4CAF50' },
  incorrectOption: { backgroundColor: '#F44336' },
  optionText: { fontSize: SIZES.large, color: COLORS.darkBlue },
  nextButton: { backgroundColor: COLORS.orange, borderRadius: SIZES.radius, paddingVertical: SIZES.padding, paddingHorizontal: 40, marginTop: 20, alignSelf: 'center' },
  disabledButton: { opacity: 0.5 },
  nextButtonText: { fontSize: SIZES.large, color: COLORS.white },
  hintContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  titleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  speakerButton: { marginLeft: 8 },
  sliderContainer: { width: '100%', alignItems: 'center', marginBottom: 30 },
  submitButton: { backgroundColor: COLORS.orange, borderRadius: SIZES.radius, paddingVertical: SIZES.padding, paddingHorizontal: 40, marginTop: 20, ...SHADOWS.small },
  submitButtonText: { fontSize: SIZES.large, color: COLORS.white, fontWeight: 'bold' },
  feedbackContainer: {
    position: 'absolute',
    top: '50%',
    right: 20,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
    ...SHADOWS.medium,
    zIndex: 1000,
  },
  feedbackEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkBlue,
  },


});
