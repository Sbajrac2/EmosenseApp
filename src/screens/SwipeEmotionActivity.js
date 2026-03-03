import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, PanResponder, Animated, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import SpeakerButton from '../components/SpeakerButton';
import TTSToggle from '../components/TTSToggle';
import HomeButton from '../components/HomeButton';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { IMAGES } from '../constants/images';
import TTS from '../utils/textToSpeech';
import { useTTS } from '../contexts/TTSContext';
import { generateVisualCues, getCueStyle } from '../utils/visualCueHelper';

const { width } = Dimensions.get('window');

export default function SwipeEmotionActivity({ navigation, route }) {
  const { emotion } = route.params || {};
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showHelpMessage, setShowHelpMessage] = useState(false);
  const [showHintMessage, setShowHintMessage] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const pan = new Animated.ValueXY();
  const { isTTSEnabled } = useTTS();

  // Clean up when leaving the screen - stop TTS
  useEffect(() => {
    return () => {
      TTS.stop();
    };
  }, []);

  const getQuestionsForEmotion = (targetEmotion) => {
    const allQuestions = {
      happy: [
        { image: require('../../assets/Images2/Asian Man/AM Happy.png'), emotion: '', correctSide: 'right', hint: 'Look at the smile and bright eyes' },
        { image: require('../../assets/Images2/Asian Woman/AW Happy.png'), emotion: '', correctSide: 'right', hint: 'Notice the joyful expression' },
        { image: require('../../assets/Images2/Black Man/BM Happy.png'), emotion: '', correctSide: 'right', hint: 'See the genuine smile' },
        { image: require('../../assets/Images2/Black Woman/BW Happy.png'), emotion: '', correctSide: 'right', hint: 'Look at the cheerful face' },
        { image: require('../../assets/Images2/Caucasian Man/CM Happy.png'), emotion: '', correctSide: 'right', hint: 'Notice the positive expression' },
        { image: require('../../assets/Images2/Caucasian Woman/CW Happy.png'), emotion: '', correctSide: 'right', hint: 'See the bright smile' },
        { image: require('../../assets/Images2/Old Man/OM happy.png'), emotion: '', correctSide: 'right', hint: 'Look at the content expression' },
        { image: require('../../assets/Images2/Old Woman/OW Happy.png'), emotion: '', correctSide: 'right', hint: 'Notice the warm smile' },
        { image: require('../../assets/Images2/South Asian Man/SAM Happy.png'), emotion: '', correctSide: 'right', hint: 'See the joyful face' },
        { image: require('../../assets/Images2/South Asian Woman/SAW Happy.png'), emotion: '', correctSide: 'right', hint: 'Look at the happy expression' }
      ],
      angry: [
        { image: require('../../assets/Images2/Asian Man/AM Angry.png'), emotion: '', correctSide: 'left', hint: 'Look at the furrowed brows' },
        { image: require('../../assets/Images2/Asian Woman/AW Angry.png'), emotion: '', correctSide: 'left', hint: 'Notice the tense face' },
        { image: require('../../assets/Images2/Black Man/BM Angry.png'), emotion: '', correctSide: 'left', hint: 'See the stern expression' },
        { image: require('../../assets/Images2/Black Woman/BW Angry.png'), emotion: '', correctSide: 'left', hint: 'Look at the angry face' },
        { image: require('../../assets/Images2/Caucasian Man/CM Angry.png'), emotion: '', correctSide: 'left', hint: 'Notice the frustrated look' },
        { image: require('../../assets/Images2/Caucasian Woman/CW ANgry.png'), emotion: '', correctSide: 'left', hint: 'See the upset expression' },
        { image: require('../../assets/Images2/Old Man/OM angry.png'), emotion: '', correctSide: 'left', hint: 'Look at the cross face' },
        { image: require('../../assets/Images2/Old Woman/OW Angry.png'), emotion: '', correctSide: 'left', hint: 'Notice the mad expression' },
        { image: require('../../assets/Images2/South Asian Man/SAM Angry.png'), emotion: '', correctSide: 'left', hint: 'See the angry look' },
        { image: require('../../assets/Images2/South Asian Woman/SAW angry.png'), emotion: '', correctSide: 'left', hint: 'Look at the irritated face' }
      ],
      sad: [
        { image: require('../../assets/Images2/Asian Man/AM Sad.png'), emotion: '', correctSide: 'left', hint: 'Look at the droopy eyes' },
        { image: require('../../assets/Images2/Asian Woman/AW Sad.png'), emotion: '', correctSide: 'left', hint: 'Notice the downturned mouth' },
        { image: require('../../assets/Images2/Black Man/BM Sad.png'), emotion: '', correctSide: 'left', hint: 'See the sad expression' },
        { image: require('../../assets/Images2/Caucasian Man/CM Sad.png'), emotion: '', correctSide: 'left', hint: 'Look at the unhappy face' },
        { image: require('../../assets/Images2/Caucasian Woman/CW Sad.png'), emotion: '', correctSide: 'left', hint: 'Notice the sorrowful look' },
        { image: require('../../assets/Images2/Old Man/OM sad.png'), emotion: '', correctSide: 'left', hint: 'See the melancholy expression' },
        { image: require('../../assets/Images2/Old Woman/OW sad.png'), emotion: '', correctSide: 'left', hint: 'Look at the dejected face' },
        { image: require('../../assets/Images2/South Asian Man/SAM Sad.png'), emotion: '', correctSide: 'left', hint: 'Notice the gloomy expression' },
        { image: require('../../assets/Images2/South Asian Woman/SAW sadpng.png'), emotion: '', correctSide: 'left', hint: 'See the upset look' },
        { image: require('../../assets/Images2/Asian Man/AM Crying.png'), emotion: '', correctSide: 'left', hint: 'Look at the tearful face' }
      ],
      mixed: [
        { image: require('../../assets/Images2/Asian Man/AM Happy.png'), emotion: '', correctSide: 'right', hint: 'Look at the smile and bright eyes' },
        { image: require('../../assets/Images2/Black Woman/BW Angry.png'), emotion: '', correctSide: 'left', hint: 'See the frown and tense muscles' },
        { image: require('../../assets/Images2/Caucasian Man/CM Sad.png'), emotion: '', correctSide: 'left', hint: 'Notice the sad, droopy expression' },
        { image: require('../../assets/Images2/Old Woman/OW Happy.png'), emotion: '', correctSide: 'right', hint: 'See the cheerful, positive face' },
        { image: require('../../assets/Images2/South Asian Man/SAM Angry.png'), emotion: '', correctSide: 'left', hint: 'Look at the stern, angry expression' },
        { image: require('../../assets/Images2/Asian Woman/AW Shocked.png'), emotion: '', correctSide: 'right', hint: 'Notice the surprised, wide eyes - usually positive' },
        { image: require('../../assets/Images2/Black Man/BM Shocked.png'), emotion: '', correctSide: 'right', hint: 'See the amazed expression' },
        { image: require('../../assets/Images2/Caucasian Woman/CW Crying.png'), emotion: '', correctSide: 'left', hint: 'Look at the tearful, sad face' },
        { image: require('../../assets/Images2/Old Man/OM happy.png'), emotion: '', correctSide: 'right', hint: 'Notice the content, peaceful expression' },
        { image: require('../../assets/Images2/South Asian Woman/SAW cry.png.png'), emotion: '', correctSide: 'left', hint: 'See the crying, upset expression' }
      ]
    };
    return allQuestions[targetEmotion] || allQuestions.mixed;
  };
  
  const questions = getQuestionsForEmotion(emotion);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: async (evt, gestureState) => {
      if (Math.abs(gestureState.dx) > 100) {
        const swipeDirection = gestureState.dx > 0 ? 'right' : 'left';
        const isCorrect = swipeDirection === questions[currentQuestion].correctSide;
        
        if (isCorrect) {
          setScore(score + 1);
          const feedback = ['Good!', 'Right!', 'Nice!', 'Correct!', 'Great!'][Math.floor(Math.random() * 5)];
          if (isTTSEnabled) await TTS.speakFeedback(feedback, true);
          
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setAttempts(0);
            setShowHintMessage(false);
            pan.setValue({ x: 0, y: 0 });
          } else {
            navigation.navigate('LessonSummary', { 
              score: score + 1, 
              totalQuestions: questions.length, 
              lessonTitle: route.params?.source === 'lessons' ? 'Lesson 2' : 'Swipe Challenge',
              source: route.params?.source || (emotion ? 'activities' : 'lessons')
            });
          }
        } else {
          if (isTTSEnabled) {
            await TTS.speakFeedback('Try again', false);
          }
          setShowHintMessage(true);
          setAttempts(attempts + 1);
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      } else {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      }
    },
  });

  const handleHome = () => {
    TTS.stop();
    navigation.navigate('LessonsMain');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TTSToggle />
      <HomeButton onPress={handleHome} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setShowHintMessage(true)}>
            <Image source={IMAGES.hint} resizeMode="contain" style={styles.topBarIcon} />
          </TouchableOpacity>
          
          {/* SKIP BUTTON - Comment this line to remove: */}
          <TouchableOpacity style={styles.skipButton} onPress={() => navigation.goBack()}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowHelpMessage(true)}>
            <Image source={IMAGES.help} resizeMode="contain" style={styles.topBarIcon} />
          </TouchableOpacity>
        </View>

        {showHintMessage && (
          <View style={[styles.popupWrapper, { top: 60, left: 20 }]}>
            <Text style={styles.helpText}>{questions[currentQuestion].hint}</Text>
            <TouchableOpacity onPress={() => setShowHintMessage(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        {showHelpMessage && (
          <View style={[styles.popupWrapper, { top: 60, right: 20 }]}>
            <Text style={styles.helpText}>Swipe left for negative emotions, right for positive emotions.</Text>
            <TouchableOpacity onPress={() => setShowHelpMessage(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Swipe cards</Text>
          <SpeakerButton 
            text="Swipe the card to match emotion. Right for positive, left for negative" 
            type="instruction" 
            size={16} 
            style={styles.speakerButton}
          />
        </View>
        
        <View style={styles.sidesContainer}>
          <View style={styles.leftSide}>
            <Text style={styles.sideLabel}>Negative</Text>
          </View>
          <View style={styles.rightSide}>
            <Text style={styles.sideLabel}>Positive</Text>
          </View>
        </View>

        <Animated.View
          style={[styles.questionCard, { transform: [{ translateX: pan.x }, { translateY: pan.y }] }]}
          {...panResponder.panHandlers}
        >
          <Image source={questions[currentQuestion].image} style={styles.emotionImage} resizeMode="contain" />
          {questions[currentQuestion].emotion && <Text style={styles.emotionText}>{questions[currentQuestion].emotion}</Text>}
          {showHintMessage && generateVisualCues(questions[currentQuestion].hint).map((cue, index) => (
            <View key={index} style={getCueStyle(cue)} />
          ))}
        </Animated.View>

        <Text style={styles.instruction}>← Negative | Positive →</Text>
        <Text style={styles.progress}>Card {currentQuestion + 1} of {questions.length}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGreen },
  scrollView: { flex: 1 },
  content: { padding: SIZES.padding, alignItems: 'center', paddingBottom: 50 },
  topBar: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 },
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
  titleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  title: { fontSize: SIZES.large, color: COLORS.black, textAlign: 'center' },
  speakerButton: { marginLeft: 8 },
  sidesContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 50 },
  leftSide: { alignItems: 'center', backgroundColor: COLORS.lightBlue, padding: 15, borderRadius: 15, flex: 0.45 },
  rightSide: { alignItems: 'center', backgroundColor: COLORS.yellow, padding: 15, borderRadius: 15, flex: 0.45 },
  sideLabel: { fontSize: SIZES.base, color: COLORS.black, textAlign: 'center' },
  sideSubtext: { fontSize: SIZES.small, color: COLORS.black, textAlign: 'center', marginTop: 5 },
  questionCard: { width: 220, height: 280, backgroundColor: COLORS.white, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 30, elevation: 5, padding: 20 },
  emotionImage: { width: 150, height: 150, marginBottom: 20 },
  emotionText: { fontSize: SIZES.xlarge, color: COLORS.black },
  instruction: { fontSize: SIZES.base, color: COLORS.grey, textAlign: 'center', marginBottom: 10 },
  progress: { fontSize: SIZES.base, color: COLORS.grey },
  skipButton: { backgroundColor: COLORS.orange, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  skipText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 },
});
