import { ThemedText } from '@/components/atoms/ThemedText';
import { ThemedView } from '@/components/atoms/ThemedView';
import { useTaskContext } from '@/context/TaskContext';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const TaskDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { taskId } = route.params;
  const { tasks, deleteTask, toggleTaskCompletion } = useTaskContext();

  const task = useMemo(
    () => tasks.find((t) => t.id === taskId),
    [tasks, taskId]
  );

  const toggleCompletion = useCallback(() => {
    if (!task) {
      return;
    }
    toggleTaskCompletion(task.id);
  }, [task, toggleTaskCompletion]);

  const removeTask = useCallback(() => {
    if (!task) {
      return;
    }
    deleteTask(task.id);
    navigation.goBack();
  }, [task, deleteTask, navigation]);

  if (!task) {
    return <ThemedText style={styles.errorText}>Task not found!</ThemedText>;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.titleText}>
        {task.title}
      </ThemedText>
      <ThemedText style={styles.statusText}>
        {task.completed ? 'Completed' : 'Incomplete'}
      </ThemedText>

      <ThemedView style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, task.completed && styles.incompleteButton]}
          onPress={toggleCompletion}
        >
          <ThemedText style={styles.buttonText}>
            {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
          </ThemedText>
        </Pressable>

        <Pressable style={styles.deleteButton} onPress={removeTask}>
          <ThemedText style={styles.buttonText}>Delete Task</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 18,
    marginBottom: 24,
    color: 'gray',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  incompleteButton: {
    backgroundColor: '#FF9800',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TaskDetailsScreen;
