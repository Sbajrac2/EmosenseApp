git remote add origin https://github.com/Sbajrac2/EmosenseApp.gitimport React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import TTSToggle from '../components/TTSToggle';
import HomeButton from '../components/HomeButton';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { IMAGES } from '../constants/images';
import TTS from '../utils/textToSpeech';
import { useTTS } from '../contexts/TTSContext';
import { useRewards } from '../contexts/RewardContext';

export default function EmotionStoryActivity({ navigation, route }) {
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { isTTSEnabled } = useTTS();
  const { awardBadge } = useRewards();
  
  const taskNumber = route.params?.taskNumber || 1;

  // Clean up when leaving the screen
  useEffect(() => {
    return () => {
      // Stop TTS when leaving the screen
      TTS.stop();
    };
  }, []);

  const handleGoHome = () => {
    TTS.stop();
    navigation.navigate('LessonsMain');
  };

  const stories = [
    {
      panels: [
        { image: require('../../assets/story/sam_get_present.png'), text: "Sam gets a present" },
        { image: require('../../assets/story/sam_excited.png'), text: "Sam is excited" }
      ],
      question: "How does Sam feel?",
      options: [
        { image: require('../../assets/story/sam_happy.png'), emotion: 'Happy', correct: true },
        { image: require('../../assets/story/sam_sad.png'), emotion: 'Sad', correct: false },
        { image: require('../../assets/story/sam_angry.png'), emotion: 'Angry', correct: false }
      ]
    },
    {
      panels: [
        { image: require('../../assets/story/sam_present.png'), text: "Sam opens present" },
        { image: require('../../assets/story/sam_like_present.png'), text: "It's his favorite toy" }
      ],
      question: "How does Sam feel?",
      options: [
        { image: require('../../assets/story/sam_excited.png'), emotion: 'Excited', correct: true },
        { image: require('../../assets/story/sam_sad.png'), emotion: 'Sad', correct: false },
        { image: require('../../assets/story/sam_angry.png'), emotion: 'Angry', correct: false }
      ]
    },
    {
      panels: [
        { image: require('../../assets/story/sam_play.png'), text: "Sam plays with toy" },
        { image: require('../../assets/story/sam_toy_break.png'), text: "The toy breaks" }
      ],
      question: "How does Sam feel?",
      options: [
        { image: require('../../assets/story/sam_happy.png'), emotion: 'Happy', correct: false },
        { image: require('../../assets/story/sam_sad.png'), emotion: 'Sad', correct: true },
        { image: require('../../assets/story/sam_surprised.png'), emotion: 'Surprised', correct: false }
      ]
    },
    {
      panels: [
        { image: require('../../assets/story/sam_meet_alec.png'), text: "Sam meets Alex" },
        { image: require('../../assets/story/alex_sam_play.png'), text: "They become friends" }
      ],
      question: "How does Sam feel?",
      options: [
        { image: require('../../assets/story/sam_happy.png'), emotion: 'Happy', correct: true },
        { image: require('../../assets/story/sam_sad.png'), emotion: 'Sad', correct: false },
        { image: require('../../assets/story/sam_angry.png'), emotion: 'Angry', correct: false }
      ]
    },
    {
      panels: [
        { image: require('../../assets/story/alex_sam_present.png'), text: "Alex gives Sam present" },
        { image: require('../../assets/story/alex_present.png'), text: "Sam opens it" }
      ],
      question: "How does Alex feel?",
      options: [
        { image: require('../../assets/story/alex_happy.png'), emotion: 'Happy', correct: true },
        { image: require('../../assets/story/alex_sad.png'), emotion: 'Sad', correct: false },
        { image: require('../../assets/story/alex_worried.png'), emotion: 'Worried', correct: false }
      ]
    },
    {
      panels: [
        { image: require('../../assets/story/alex_snacks.png'), text: "Alex shares snacks" },
        { image: require('../../assets/story/sam_thanks.png'), text: "Sam says thank you" }
      ],
      question: "How does Alex feel?",
      options: [
        { image: require('../../assets/story/alex_happy.png'), emotion: 'Happy', correct: true },
        { image: require('../../assets/story/alex_worried.png'), emotion: 'Worried', correct: false },
        { image: require('../../assets/story/alex_sad.png'), emotion: 'Sad', correct: false }
      ]
    },
    {
      panels: [
        { image: require('../../assets/story/alex_sam_play.png'), text: "Sam and Alex play" },
        { image: require('../../assets/story/ball_hit_sam.png'), text: "Ball hits Sam" }
      ],
      question: "How does Sam feel?",
      options: [
        { image: require('../../assets/story/sam_happy.png'), emotion: 'Happy', correct: false },
        { image: require('../../assets/story/sam_surprised.png'), emotion: 'Surprised', correct: true },
        { image: require('../../assets/story/sam_sad.png'), emotion: 'Sad', correct: false }
      ]
    },
    {
      panels: [
        { image: require('../../assets/story/alex_worried.png'), text: "Alex feels bad" },
        { image: require('../../assets/story/sam_itsok.png'), text: "Sam says it's okay" }
      ],
      question: "How does Alex feel?",
      options: [
        { image: require('../../assets/story/alex_happy.png'), emotion: 'Happy', correct: true },
        { image: require('../../assets/story/alex_worried.png'), emotion: 'Worried', correct: false },
        { image: require('../../assets/story/alex_sad.png'), emotion: 'Sad', correct: false }
      ]
    },
    {
      panels: [
        { image: require('../../assets/story/meet_maya.png'), text: "Sam meets Maya" },
        { image: require('../../assets/story/meet_mayaa.png'), text: "Maya joins them" }
      ],
      question: "How does Sam feel?",
      options: [
        { image: require('../../assets/story/sam_happy.png'), emotion: 'Happy', correct: true },
        { image: require('../../assets/story/sam_sad.png'), emotion: 'Sad', correct: false },
        { image: require('../../assets/story/sam_angry.png'), emotion: 'Angry', correct: false }
      ]
    },
    {
      panels: [
        { image: require('../../assets/story/maya_trick.png'), text: "Maya shows magic trick" },
        { image: require('../../assets/story/sam_surprise.png'), text: "Sam is amazed" }
      ],
      question: "How does Sam feel?",
      options: [
        { image: require('../../assets/story/sam_surprised.png'), emotion: 'Surprised', correct: true },
        { image: require('../../assets/story/sam_sad.png'), emotion: 'Sad', correct: false },
        { image: require('../../assets/story/sam_angry.png'), emotion: 'Angry', correct: false }
      ]
    },
    {
      panels: [
        { image: require('../../assets/story/sam_trick.png'), text: "Alex tries trick" },
        { image: require('../../assets/story/alex_sad.png'), text: "It doesn't work" }
      ],
      question: "How does Alex feel?",
      options: [
        { image: require('../../assets/story/alex_happy.png'), emotion: 'Happy', correct: false },
        { image: require('../../assets/story/alex_sad.png'), emotion: 'Sad', correct: true },
        { image: require('../../assets/story/alex_worried.png'), emotion: 'Worried', correct: false }
      ]
    },
    {
      panels: [
        { image: require('../../assets/story/maya_teach_alex.png'), text: "Maya teaches Alex" },
        { image: require('../../assets/story/alex_happy.png'), text: "Alex learns trick" }
      ],
      question: "How does Alex feel?",
      options: [
        { image: require('../../assets/story/alex_happy.png'), emotion: 'Happy', correct: true },
        { image: require('../../assets/story/alex_sad.png'), emotion: 'Sad', correct: false },
        { image: require('../../assets/story/alex_worried.png'), emotion: 'Worried', correct: false }
      ]
    },
    {
      panels: [
        { image: require('../../assets/story/going-home.png'), text: "Time to go home" },
        { image: require('../../assets/story/saying bye.png'), text: "Friends say goodbye" }
      ],
      question: "How does Sam feel?",
      options: [
        { image: require('../../assets/story/sam_happy.png'), emotion: 'Happy', correct: false },
        { image: require('../../assets/story/sam_sad.png'), emotion: 'Sad', correct: true },
        { image: require('../../assets/story/sam_angry.png'), emotion: 'Angry', correct: false }
      ]
    },
    {
      panels: [
        { image: require('../../assets/story/walking-home.png'), text: "Sam walks home" },
        { image: require('../../assets/story/thinking.png'), text: "Will friends remember?" }
      ],
      question: "How does Sam feel?",
      options: [
        { image: require('../../assets/story/sam_sad.png'), emotion: 'Worried', correct: true },
        { image: require('../../assets/story/sam_happy.png'), emotion: 'Happy', correct: false },
        { image: require('../../assets/story/sam_surprised.png'), emotion: 'Surprised', correct: false }
      ]
    },
    {
      panels: [
        { image: require('../../assets/story/reach_home.png'), text: "Sam reaches home" },
        { image: require('../../assets/story/sam-tired.png'), text: "Long fun day" }
      ],
      question: "How does Sam feel?",
      options: [
        { image: require('../../assets/story/sam-tired.png'), emotion: 'Tired', correct: true },
        { image: require('../../assets/story/sam_sad.png'), emotion: 'Sad', correct: false },
        { image: require('../../assets/story/sam_happy.png'), emotion: 'Happy', correct: false }
      ]
    }
  ];

  const handleAnswerSelect = async (option) => {
    if (showFeedback) return;
    
    setSelectedAnswer(option);
    
    if (option.correct) {
      setScore(score + 1);
      setShowFeedback(true);
      if (isTTSEnabled) await TTS.speakFeedback('Good!', true);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (isTTSEnabled) await TTS.speakFeedback('Try again', false);
      
      if (newAttempts < 2) {
        setTimeout(() => setSelectedAnswer(null), 1500);
      } else {
        setShowFeedback(true);
      }
    }
  };

  const handleNext = () => {
    if (currentStory < stories.length - 1) {
      setCurrentStory(currentStory + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setAttempts(0);
    } else {
      if (score >= Math.floor(stories.length * 0.7)) {
        awardBadge('story_teller', 'Story Expert', 'Understood emotion stories!');
      }
      navigation.navigate('LessonSummary', {
        score,
        totalQuestions: stories.length,
        lessonTitle: `Emotion Stories - Task ${taskNumber}`,
        source: route.params?.source || 'activities'
      });
    }
  };

  const currentStoryData = stories[currentStory];

  return (
    <SafeAreaView style={styles.container}>
      <TTSToggle />
      <HomeButton onPress={handleGoHome} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.progress}>Story {currentStory + 1} of {stories.length}</Text>
        {/* SKIP BUTTON - Comment this line to remove: */}
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.goBack()}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

          <View style={styles.storyContainer}>
            {currentStoryData.panels.map((panel, index) => (
              <View key={index} style={styles.panel}>
                <Image source={panel.image} style={styles.panelImage} resizeMode="contain" />
                <Text style={styles.panelText}>{panel.text}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.question}>{currentStoryData.question}</Text>

          <View style={styles.optionsContainer}>
            {currentStoryData.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  showFeedback && option.correct && styles.correctOption,
                  selectedAnswer === option && !option.correct && styles.incorrectOption
                ]}
                onPress={() => handleAnswerSelect(option)}
                disabled={showFeedback || (selectedAnswer && selectedAnswer !== option)}
              >
                <Image source={option.image} style={styles.optionImage} resizeMode="contain" />
                <Text style={styles.optionText}>{option.emotion}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {showFeedback && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentStory === stories.length - 1 ? 'Finish' : 'Next Story'}
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
  progress: { fontSize: SIZES.base, color: COLORS.grey, marginBottom: 20 },
  storyContainer: { flexDirection: 'row', marginBottom: 25, justifyContent: 'center' },
  panel: { width: 150, margin: 10, alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 15, padding: 15, ...SHADOWS.small },
  panelImage: { width: 100, height: 100, marginBottom: 10 },
  panelText: { fontSize: SIZES.base, textAlign: 'center', color: COLORS.black, ...FONTS.medium },
  question: { fontSize: SIZES.h2, color: COLORS.black, textAlign: 'center', marginBottom: 25, ...FONTS.bold },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 },
  optionButton: { width: 110, margin: 8, alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 15, padding: 15, ...SHADOWS.small },
  correctOption: { backgroundColor: '#E8F5E8', borderWidth: 2, borderColor: '#4CAF50' },
  incorrectOption: { backgroundColor: '#FFCDD2', borderWidth: 3, borderColor: '#F44336', transform: [{ scale: 0.95 }] },
  optionImage: { width: 70, height: 70, marginBottom: 8 },
  optionText: { fontSize: SIZES.base, color: COLORS.black, ...FONTS.medium, textAlign: 'center' },
  nextButton: { backgroundColor: COLORS.orange, borderRadius: SIZES.radius, paddingVertical: SIZES.padding, paddingHorizontal: 40, marginTop: 25, ...SHADOWS.small },
  nextButtonText: { fontSize: SIZES.large, color: COLORS.white, ...FONTS.bold },
  skipButton: { position: 'absolute', right: 20, top: 10, backgroundColor: COLORS.grey, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  skipText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12 }
});