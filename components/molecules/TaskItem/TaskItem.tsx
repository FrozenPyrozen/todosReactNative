import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Task } from '@/types/taskLogicTypes';
import Icons from '@expo/vector-icons/Fontisto';
import { ThemedText } from '@/components/atoms/ThemedText';
import { ThemedView } from '@/components/atoms/ThemedView';

export type TaskItemProps = {
  task: Task;
  onToggleCompletion: () => void;
  onDelete: () => void;
  onPress: () => void;
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleCompletion,
  onDelete,
  onPress,
}) => {
  return (
    <ThemedView style={styles.container}>
      <Pressable onPress={onToggleCompletion} style={styles.checkBox}>
        {task.completed ? (
          <Icons name="checkbox-active" size={16} color="black" />
        ) : (
          <Icons name="checkbox-passive" size={16} color="black" />
        )}
      </Pressable>
      <Pressable onPress={onPress} style={styles.titleContainer}>
        <ThemedText
          numberOfLines={1}
          ellipsizeMode="tail"
          style={task.completed && styles.completed}
        >
          {task.title}
        </ThemedText>
      </Pressable>
      <Pressable onPress={onPress} style={styles.detailsButton}>
        <ThemedText style={styles.detailsText}>Details</ThemedText>
      </Pressable>
      <Pressable onPress={onDelete} style={styles.deleteButton}>
        <ThemedText style={styles.deleteText}>Delete</ThemedText>
      </Pressable>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  checkBox: {
    marginRight: 10,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  titleContainer: {
    flex: 1,
  },
  detailsButton: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  detailsText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default React.memo(TaskItem);
