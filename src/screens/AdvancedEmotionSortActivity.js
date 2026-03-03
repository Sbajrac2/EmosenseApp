import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import TTSToggle from '../components/TTSToggle';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import TTS from '../utils/textToSpeech';
import { useTTS } from '../contexts/TTSContext';
import { useRewards } from '../contexts/RewardContext';

export default function AdvancedEmotionSortActivity({ navigation, route }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [score, setScore] = useState(0);
  const [binFeedback, setBinFeedback] = useState({});
  const { isTTSEnabled } = useTTS();
  const { awardBadge } = useRewards();

  const bins = [
    { id: 'happy', label: '😊 Happy', color: '#FFE082' },
    { id: 'sad', label: '😢 Sad', color: '#B3E5FC' },
    { id: 'angry', label: '😠 Angry', color: '#FFCDD2' },
    { id: 'surprised', label: '😲 Surprised', color: '#E1BEE7' }
  ];

  const emotions = [
    { image: require('../../assets/Images2/Asian Man/AM Happy.png'), emotion: 'happy' },
    { image: require('../../assets/Images2/Black Woman/BW Angry.png'), emotion: 'angry' },
    { image: require('../../assets/Images2/Caucasian Man/CM Sad.png'), emotion: 'sad' },
    { image: require('../../assets/Images2/Old Woman/OW shocked.png'), emotion: 'surprised' },
    { image: require('../../assets/Images2/South Asian Man/SAM Angry.png'), emotion: 'angry' },
    { image: require('../../assets/Images2/Asian Woman/AW Happy.png'), emotion: 'happy' },
    { image: require('../../assets/Images2/Black Man/BM Sad.png'), emotion: 'sad' },
    { image: require('../../assets/Images2/Caucasian Woman/CW Happy.png'), emotion: 'happy' },
    { image: require('../../assets/Images2/Old Man/OM angry.png'), emotion: 'angry' },
    { image: require('../../assets/Images2/South Asian Woman/SAW Happy.png'), emotion: 'happy' },
    { image: require('../../assets/Images2/Asian Man/AM Shocked.png'), emotion: 'surprised' },
    { image: require('../../assets/Images2/Black Woman/BW Shocked.png'), emotion: 'surprised' }
  ];

  const handleDrop = async (binId) => {
    const currentEmotion = emotions[currentCard];
    const isCorrect = currentEmotion.emotion === binId;
    
    if (isCorrect) {
      setScore(score + 1);
      setBinFeedback({ [binId]: 'correct' });
      if (isTTSEnabled) await TTS.speakFeedback('Good!', true);
    } else {
      setBinFeedback({ [binId]: 'incorrect' });
      if (isTTSEnabled) await TTS.speakFeedback('Try again', false);
    }

    setTimeout(() => {
      setBinFeedback({});
      if (currentCard < emotions.length - 1) {
        setCurrentCard(currentCard + 1);
      } else {
        if (score >= 10) {
          awardBadge('advanced_sorter', 'Advanced Sorter', 'Master of emotion sorting!');
        }
        navigation.navigate('LessonSummary', {
          score: score + (isCorrect ? 1 : 0),
          totalQuestions: emotions.length,
          lessonTitle: 'Advanced Emotion Sorting',
          source: route.params?.source || 'lessons'
        });
      }
    }, 1500);
  };

  const getBinStyle = (binId) => {
    const feedback = binFeedback[binId];
    const bin = bins.find(b => b.id === binId);
    
    if (feedback === 'correct') {
      return [styles.bin, { backgroundColor: '#4CAF50', transform: [{ scale: 1.1 }] }];
    }
    if (feedback === 'incorrect') {
      return [styles.bin, { backgroundColor: '#F44336', transform: [{ scale: 0.9 }] }];
    }
    return [styles.bin, { backgroundColor: bin.color }];
  };

  return (
    <SafeAreaView style={styles.container}>
      <TTSToggle />
      <View style={styles.content}>
        <Text style={styles.progress}>Card {currentCard + 1} of {emotions.length}</Text>
        {/* SKIP BUTTON - Comment this line to remove: */}
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.goBack()}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Sort the Emotions</Text>

        <View style={styles.emotionContainer}>
          <Image source={emotions[currentCard].image} style={styles.emotionImage} resizeMode="contain" />
        </View>

        <Text style={styles.instruction}>Tap the correct emotion:</Text>

        <View style={styles.binsContainer}>
          {bins.map(bin => (
            <TouchableOpacity
              key={bin.id}
              style={getBinStyle(bin.id)}
              onPress={() => handleDrop(bin.id)}
            >
              <Text style={styles.binLabel}>{bin.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGreen },
  content: { flex: 1, padding: SIZES.padding, alignItems: 'center' },
  progress: { fontSize: SIZES.base, color: COLORS.grey, marginBottom: 10 },
  title: { fontSize: SIZES.h2, color: COLORS.black, textAlign: 'center', marginBottom: 30, ...FONTS.bold },
  emotionContainer: { width: 200, height: 200, backgroundColor: COLORS.white, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 30, ...SHADOWS.medium },
  emotionImage: { width: 150, height: 150 },
  instruction: { fontSize: SIZES.large, color: COLORS.darkBlue, marginBottom: 20, ...FONTS.medium },
  binsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', width: '100%' },
  bin: { width: 140, height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center', margin: 8, ...SHADOWS.medium },
  binLabel: { fontSize: SIZES.base, color: COLORS.black, textAlign: 'center', ...FONTS.bold },
  skipButton: { position: 'absolute', right: 20, top: 10, backgroundColor: COLORS.grey, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  skipText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12 }
});