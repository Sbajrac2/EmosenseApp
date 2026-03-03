import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';

export default function MultiTaskActivity({ navigation }) {
  const [currentTask, setCurrentTask] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const tasks = [
    {
      type: 'picture',
      title: 'Task 1: Identify Emotion in Picture',
      image: require('../../assets/images/Happy_real.png'),
      question: 'What emotion is shown?',
      options: ['Happy', 'Angry', 'Sad'],
      correctAnswer: 'Happy'
    },
    {
      type: 'picture',
      title: 'Task 2: Identify Emotion in Picture',
      image: require('../../assets/images/Angry_real.png'),
      question: 'What emotion is shown?',
      options: ['Happy', 'Angry', 'Sad'],
      correctAnswer: 'Angry'
    },
    {
      type: 'picture',
      title: 'Task 3: Identify Emotion in Picture',
      image: require('../../assets/images/Sad.png'),
      question: 'What emotion is shown?',
      options: ['Happy', 'Angry', 'Sad'],
      correctAnswer: 'Sad'
    }
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
        lessonTitle: 'Multi-Task Activity',
        source: 'activities'
      });
    }
  };

  const renderTask = () => {
    const task = tasks[currentTask];

    return (
      <View style={styles.taskContainer}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        
        {task.type === 'picture' && (
          <View style={styles.imageContainer}>
            <Image source={task.image} style={styles.taskImage} resizeMode="contain" />
          </View>
        )}

        <Text style={styles.question}>{task.question}</Text>

        <View style={styles.optionsContainer}>
          {task.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === option && option === task.correctAnswer && styles.correctOption,
                selectedAnswer === option && option !== task.correctAnswer && styles.incorrectOption,
              ]}
              onPress={() => handleAnswerSelect(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.activityTitle}>Multi-Task Activity</Text>
          <Text style={styles.progress}>Task {currentTask + 1} of {tasks.length}</Text>
        </View>

        {renderTask()}

        <TouchableOpacity
          style={[styles.nextButton, !selectedAnswer && styles.disabledButton]}
          onPress={handleNext}
          disabled={!selectedAnswer}
        >
          <Text style={styles.nextButtonText}>
            {currentTask === tasks.length - 1 ? 'Finish' : 'Next Task'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGreen },
  content: { flex: 1, padding: SIZES.padding },
  header: { alignItems: 'center', marginBottom: 30 },
  activityTitle: { fontSize: SIZES.xlarge, color: COLORS.black, marginBottom: 10, ...FONTS.bold },
  progress: { fontSize: SIZES.base, color: COLORS.grey },
  taskContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  taskTitle: { fontSize: SIZES.large, color: COLORS.darkBlue, marginBottom: 20, textAlign: 'center', ...FONTS.bold },
  imageContainer: { width: 200, height: 200, backgroundColor: COLORS.lightBlue, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20, ...SHADOWS.medium },
  taskImage: { width: 180, height: 180 },
  emojiContainer: { marginBottom: 20 },
  emoji: { fontSize: 100 },
  scenarioContainer: { backgroundColor: COLORS.white, padding: 20, borderRadius: 15, marginBottom: 20, ...SHADOWS.small },
  scenarioText: { fontSize: SIZES.base, color: COLORS.black, textAlign: 'center', ...FONTS.medium },
  question: { fontSize: SIZES.large, color: COLORS.black, marginBottom: 20, textAlign: 'center', ...FONTS.bold },
  optionsContainer: { width: '100%', maxWidth: 300 },
  optionButton: { backgroundColor: COLORS.lightBlue, borderRadius: SIZES.radius, paddingVertical: SIZES.padding, marginBottom: SIZES.margin, alignItems: 'center', ...SHADOWS.small },
  correctOption: { backgroundColor: '#4CAF50' },
  incorrectOption: { backgroundColor: '#F44336' },
  optionText: { fontSize: SIZES.large, color: COLORS.darkBlue, ...FONTS.bold },
  nextButton: { backgroundColor: COLORS.orange, borderRadius: SIZES.radius, paddingVertical: SIZES.padding, alignItems: 'center', marginTop: 20, ...SHADOWS.small },
  disabledButton: { opacity: 0.5 },
  nextButtonText: { fontSize: SIZES.large, color: COLORS.white, ...FONTS.bold },
});
