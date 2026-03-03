import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import TTSToggle from '../components/TTSToggle';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { IMAGES } from '../constants/images';
import TTS from '../utils/textToSpeech';
import { useTTS } from '../contexts/TTSContext';
import { generateVisualCues, getCueStyle } from '../utils/visualCueHelper';

export default function ChooseAllActivity({ navigation, route }) {
  const [currentTask, setCurrentTask] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const { isTTSEnabled } = useTTS();

  const tasks = [
    {
      title: 'Choose all happy faces',
      targetEmotion: 'happy',
      cards: [
        { id: 1, image: require('../../assets/Images2/Asian Man/AM Happy.png'), emotion: 'happy', isCorrect: true },
        { id: 2, image: require('../../assets/Images2/Black Woman/BW Angry.png'), emotion: 'angry', isCorrect: false },
        { id: 3, image: require('../../assets/Images2/Caucasian Woman/CW Happy.png'), emotion: 'happy', isCorrect: true },
        { id: 4, image: require('../../assets/Images2/Old Man/OM sad.png'), emotion: 'sad', isCorrect: false },
        { id: 5, image: require('../../assets/Images2/South Asian Woman/SAW Happy.png'), emotion: 'happy', isCorrect: true },
        { id: 6, image: require('../../assets/Images2/Black Man/BM Sad.png'), emotion: 'sad', isCorrect: false }
      ],
      hint: 'Look for smiles and bright expressions'
    },
    {
      title: 'Choose all sad faces',
      targetEmotion: 'sad',
      cards: [
        { id: 1, image: require('../../assets/Images2/Asian Woman/AW Sad.png'), emotion: 'sad', isCorrect: true },
        { id: 2, image: require('../../assets/Images2/Caucasian Man/CM Happy.png'), emotion: 'happy', isCorrect: false },
        { id: 3, image: require('../../assets/Images2/Old Woman/OW sad.png'), emotion: 'sad', isCorrect: true },
        { id: 4, image: require('../../assets/Images2/South Asian Man/SAM Angry.png'), emotion: 'angry', isCorrect: false },
        { id: 5, image: require('../../assets/Images2/Black Man/BM Happy.png'), emotion: 'happy', isCorrect: false },
        { id: 6, image: require('../../assets/Images2/Caucasian Woman/CW Sad.png'), emotion: 'sad', isCorrect: true }
      ],
      hint: 'Notice downward expressions and droopy eyes'
    },
    {
      title: 'Choose all angry faces',
      targetEmotion: 'angry',
      cards: [
        { id: 1, image: require('../../assets/Images2/Caucasian Woman/CW ANgry.png'), emotion: 'angry', isCorrect: true },
        { id: 2, image: require('../../assets/Images2/Old Woman/OW Happy.png'), emotion: 'happy', isCorrect: false },
        { id: 3, image: require('../../assets/Images2/South Asian Man/SAM Angry.png'), emotion: 'angry', isCorrect: true },
        { id: 4, image: require('../../assets/Images2/Asian Woman/AW Happy.png'), emotion: 'happy', isCorrect: false },
        { id: 5, image: require('../../assets/Images2/Black Woman/BW Angry.png'), emotion: 'angry', isCorrect: true },
        { id: 6, image: require('../../assets/Images2/Caucasian Man/CM Sad.png'), emotion: 'sad', isCorrect: false }
      ],
      hint: 'Look for frowns and tense facial muscles'
    },
    {
      title: 'Choose all shocked faces',
      targetEmotion: 'shocked',
      cards: [
        { id: 1, image: require('../../assets/Images2/Black Woman/BW Happy.png'), emotion: 'happy', isCorrect: false },
        { id: 2, image: require('../../assets/Images2/Asian Man/AM Shocked.png'), emotion: 'shocked', isCorrect: true },
        { id: 3, image: require('../../assets/Images2/Old Woman/OW shocked.png'), emotion: 'shocked', isCorrect: true },
        { id: 4, image: require('../../assets/Images2/Caucasian Man/CM Angry.png'), emotion: 'angry', isCorrect: false },
        { id: 5, image: require('../../assets/Images2/South Asian Woman/SAW shocked.png'), emotion: 'shocked', isCorrect: true },
        { id: 6, image: require('../../assets/Images2/Asian Woman/AW Sad.png'), emotion: 'sad', isCorrect: false }
      ],
      hint: 'Look for wide eyes and open mouths'
    },
    {
      title: 'Choose all crying faces',
      targetEmotion: 'crying',
      cards: [
        { id: 1, image: require('../../assets/Images2/Asian Man/AM Crying.png'), emotion: 'crying', isCorrect: true },
        { id: 2, image: require('../../assets/Images2/Black Man/BM Happy.png'), emotion: 'happy', isCorrect: false },
        { id: 3, image: require('../../assets/Images2/Old Woman/OW Angry.png'), emotion: 'angry', isCorrect: false },
        { id: 4, image: require('../../assets/Images2/Caucasian Woman/CW Crying.png'), emotion: 'crying', isCorrect: true },
        { id: 5, image: require('../../assets/Images2/South Asian Woman/SAW cry.png.png'), emotion: 'crying', isCorrect: true },
        { id: 6, image: require('../../assets/Images2/Asian Woman/AW Happy.png'), emotion: 'happy', isCorrect: false }
      ],
      hint: 'Look for tears and very sad expressions'
    },
    {
      title: 'Choose all positive emotions',
      targetEmotion: 'positive',
      cards: [
        { id: 1, image: require('../../assets/Images2/Asian Man/AM Crying.png'), emotion: 'crying', isCorrect: false },
        { id: 2, image: require('../../assets/Images2/Black Woman/BW Happy.png'), emotion: 'happy', isCorrect: true },
        { id: 3, image: require('../../assets/Images2/Old Man/OM happy.png'), emotion: 'happy', isCorrect: true },
        { id: 4, image: require('../../assets/Images2/Caucasian Woman/CW ANgry.png'), emotion: 'angry', isCorrect: false },
        { id: 5, image: require('../../assets/Images2/South Asian Man/SAM Happy.png'), emotion: 'happy', isCorrect: true },
        { id: 6, image: require('../../assets/Images2/Black Man/BM Sad.png'), emotion: 'sad', isCorrect: false }
      ],
      hint: 'Look for happy and pleasant expressions'
    }
  ];

  const currentTaskData = tasks[currentTask];

  const handleCardSelect = (cardId) => {
    if (showFeedback) return;
    
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleSubmit = async () => {
    if (selectedCards.length === 0) return;
    
    setShowFeedback(true);
    
    const correctCards = currentTaskData.cards.filter(card => card.isCorrect).map(card => card.id);
    const isAllCorrect = correctCards.every(id => selectedCards.includes(id)) && 
                        selectedCards.every(id => correctCards.includes(id));
    
    if (isAllCorrect) {
      setScore(score + 1);
      if (isTTSEnabled) await TTS.speakFeedback('Perfect!', true);
    } else {
      if (isTTSEnabled) await TTS.speakFeedback('Try again', false);
      setShowHint(true);
    }
  };

  const handleNext = () => {
    if (currentTask < tasks.length - 1) {
      setCurrentTask(currentTask + 1);
      setSelectedCards([]);
      setShowFeedback(false);
      setShowHint(false);
    } else {
      navigation.navigate('LessonSummary', {
        score,
        totalQuestions: tasks.length,
        lessonTitle: route.params?.source === 'lessons' ? 'Lesson 6' : 'Choose All Activity',
        source: route.params?.source || 'activities'
      });
    }
  };

  const getCardStyle = (card) => {
    if (!showFeedback) {
      return selectedCards.includes(card.id) ? styles.selectedCard : styles.card;
    }
    
    if (card.isCorrect && selectedCards.includes(card.id)) {
      return styles.correctCard;
    } else if (!card.isCorrect && selectedCards.includes(card.id)) {
      return styles.incorrectCard;
    } else if (card.isCorrect && !selectedCards.includes(card.id)) {
      return styles.missedCard;
    }
    return styles.card;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TTSToggle />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* SKIP BUTTON - Comment this line to remove: */}
          <TouchableOpacity style={styles.skipButton} onPress={() => navigation.goBack()}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          
          <Text style={styles.progress}>Task {currentTask + 1} of {tasks.length}</Text>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{currentTaskData.title}</Text>
          </View>

          <View style={styles.cardsContainer}>
            {currentTaskData.cards.map((card, index) => (
              <TouchableOpacity
                key={card.id}
                style={[styles.cardWrapper, getCardStyle(card)]}
                onPress={() => handleCardSelect(card.id)}
                disabled={showFeedback}
              >
                <View style={styles.imageContainer}>
                  <Image source={card.image} style={styles.cardImage} resizeMode="contain" />
                  {showHint && card.isCorrect && generateVisualCues(currentTaskData.hint).map((cue, cueIndex) => (
                    <View key={cueIndex} style={getCueStyle(cue)} />
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {!showFeedback && selectedCards.length > 0 && (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          )}

          {showFeedback && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentTask === tasks.length - 1 ? 'Finish' : 'Next'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGreen },
  scrollView: { flex: 1 },
  content: { padding: SIZES.padding, alignItems: 'center' },
  progress: { fontSize: SIZES.base, color: COLORS.grey, marginBottom: 10 },
  titleContainer: { marginBottom: 30 },
  title: { fontSize: SIZES.large, color: COLORS.black, textAlign: 'center', ...FONTS.bold },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 320,
    marginBottom: 30
  },
  cardWrapper: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: SIZES.radius,
    ...SHADOWS.small
  },
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.lightGrey
  },
  selectedCard: {
    backgroundColor: COLORS.lightBlue,
    borderWidth: 3,
    borderColor: COLORS.darkBlue
  },
  correctCard: {
    backgroundColor: '#E8F5E8',
    borderWidth: 3,
    borderColor: '#4CAF50'
  },
  incorrectCard: {
    backgroundColor: '#FFEBEE',
    borderWidth: 3,
    borderColor: '#F44336'
  },
  missedCard: {
    backgroundColor: '#FFF3E0',
    borderWidth: 3,
    borderColor: '#FF9800'
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  cardImage: {
    width: '100%',
    height: '100%'
  },
  submitButton: {
    backgroundColor: COLORS.darkBlue,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding,
    paddingHorizontal: 40,
    ...SHADOWS.small
  },
  submitButtonText: {
    fontSize: SIZES.large,
    color: COLORS.white,
    ...FONTS.bold
  },
  nextButton: {
    backgroundColor: COLORS.orange,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding,
    paddingHorizontal: 40,
    ...SHADOWS.small
  },
  nextButtonText: {
    fontSize: SIZES.large,
    color: COLORS.white,
    ...FONTS.bold
  },
  skipButton: { position: 'absolute', right: 20, top: 10, backgroundColor: COLORS.grey, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  skipText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12 }
});