import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, PanResponder, Animated, Image, TouchableOpacity, Dimensions } from 'react-native';
import TTSToggle from '../components/TTSToggle';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import TTS from '../utils/textToSpeech';
import { useTTS } from '../contexts/TTSContext';
import { useRewards } from '../contexts/RewardContext';

const { width } = Dimensions.get('window');

export default function EmotionSortActivity({ navigation, route }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [score, setScore] = useState(0);
  const [binFeedback, setBinFeedback] = useState('');
  const pan = new Animated.ValueXY();
  const { isTTSEnabled } = useTTS();
  const { awardBadge } = useRewards();

  const emotions = [
    { image: require('../../assets/Images2/Asian Man/AM Happy.png'), type: 'positive' },
    { image: require('../../assets/Images2/Black Woman/BW Angry.png'), type: 'negative' },
    { image: require('../../assets/Images2/Caucasian Man/CM Sad.png'), type: 'negative' },
    { image: require('../../assets/Images2/Old Woman/OW Happy.png'), type: 'positive' },
    { image: require('../../assets/Images2/South Asian Man/SAM Angry.png'), type: 'negative' },
    { image: require('../../assets/Images2/Asian Woman/AW Happy.png'), type: 'positive' },
    { image: require('../../assets/Images2/Black Man/BM Sad.png'), type: 'negative' },
    { image: require('../../assets/Images2/Caucasian Woman/CW Happy.png'), type: 'positive' },
    { image: require('../../assets/Images2/Old Man/OM angry.png'), type: 'negative' },
    { image: require('../../assets/Images2/South Asian Woman/SAW Happy.png'), type: 'positive' }
  ];

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: async (evt, gestureState) => {
      if (Math.abs(gestureState.dx) > 100) {
        const swipeDirection = gestureState.dx > 0 ? 'right' : 'left';
        const correctSide = emotions[currentCard].type === 'positive' ? 'right' : 'left';
        const isCorrect = swipeDirection === correctSide;
        
        if (isCorrect) {
          setScore(score + 1);
          setBinFeedback('correct');
          if (isTTSEnabled) await TTS.speakFeedback('Good!', true);
        } else {
          setBinFeedback('incorrect');
          if (isTTSEnabled) await TTS.speakFeedback('Try again', false);
        }

        setTimeout(() => {
          setBinFeedback('');
          if (currentCard < emotions.length - 1) {
            setCurrentCard(currentCard + 1);
            pan.setValue({ x: 0, y: 0 });
          } else {
            if (score >= 8) {
              awardBadge('emotion_sorter', 'Emotion Expert', 'Great at sorting emotions!');
            }
            navigation.navigate('LessonSummary', {
              score: score + (isCorrect ? 1 : 0),
              totalQuestions: emotions.length,
              lessonTitle: 'Emotion Sorting',
              source: route.params?.source || 'activities'
            });
          }
        }, 1500);
      } else {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      }
    },
  });

  const getBinStyle = (side) => {
    if (binFeedback === 'correct') {
      return emotions[currentCard].type === 'positive' && side === 'right' || 
             emotions[currentCard].type === 'negative' && side === 'left'
        ? [styles.bin, styles.correctBin] : styles.bin;
    }
    if (binFeedback === 'incorrect') {
      return emotions[currentCard].type === 'positive' && side === 'left' || 
             emotions[currentCard].type === 'negative' && side === 'right'
        ? [styles.bin, styles.incorrectBin] : styles.bin;
    }
    return styles.bin;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TTSToggle />
      <View style={styles.content}>
        {/* SKIP BUTTON - Comment this line to remove: */}
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.goBack()}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        
        <Text style={styles.progress}>Card {currentCard + 1} of {emotions.length}</Text>
        <Text style={styles.title}>Sort the Emotions</Text>

        <View style={styles.binsContainer}>
          <View style={getBinStyle('left')}>
            <Text style={styles.binLabel}>😢 Negative</Text>
          </View>
          <View style={getBinStyle('right')}>
            <Text style={styles.binLabel}>😊 Positive</Text>
          </View>
        </View>

        <Animated.View
          style={[styles.emotionCard, { transform: [{ translateX: pan.x }, { translateY: pan.y }] }]}
          {...panResponder.panHandlers}
        >
          <Image source={emotions[currentCard].image} style={styles.emotionImage} resizeMode="contain" />
        </Animated.View>

        <Text style={styles.instruction}>Swipe left or right</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGreen },
  content: { flex: 1, padding: SIZES.padding, alignItems: 'center' },
  progress: { fontSize: SIZES.base, color: COLORS.grey, marginBottom: 10 },
  title: { fontSize: SIZES.h2, color: COLORS.black, textAlign: 'center', marginBottom: 30, ...FONTS.bold },
  binsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 40 },
  bin: { width: 140, height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white, ...SHADOWS.medium },
  correctBin: { backgroundColor: '#4CAF50', transform: [{ scale: 1.1 }] },
  incorrectBin: { backgroundColor: '#F44336', transform: [{ scale: 0.9 }] },
  binLabel: { fontSize: SIZES.large, color: COLORS.black, textAlign: 'center', ...FONTS.bold },
  emotionCard: { width: 200, height: 250, backgroundColor: COLORS.white, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 30, ...SHADOWS.medium },
  emotionImage: { width: 150, height: 150 },
  instruction: { fontSize: SIZES.base, color: COLORS.grey, textAlign: 'center' },
  skipButton: { position: 'absolute', right: 20, top: 10, backgroundColor: COLORS.orange, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, zIndex: 100 },
  skipText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 }
});