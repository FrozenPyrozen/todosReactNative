import React, { useCallback, useMemo, useState } from 'react';
import { TextInput, TextInputProps, StyleSheet, Pressable } from 'react-native';
import { useTaskContext } from '@/context/TaskContext';
import TaskItem from '@/components/molecules/TaskItem/TaskItem';
import { Task } from '@/types/taskLogicTypes';
import { FlashList } from '@shopify/flash-list';
import { ThemedView } from '@/components/atoms/ThemedView';
import { ThemedText } from '@/components/atoms/ThemedText';
import { SCREEN_NAMES } from '@/constants/screenNames';

const EmptyComponent = () => (
  <ThemedView style={styles.empty}>
    <ThemedText>"No tasks yet"</ThemedText>
  </ThemedView>
);

export type AddTaskInputProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export const AddTaskInput = ({ value, onChangeText }: AddTaskInputProps) => (
  <TextInput
    placeholder="Add a new task"
    value={value}
    onChangeText={onChangeText}
    style={styles.input}
  />
);

export type AddTaskBtnProps = {
  text: string;
  onPress: () => void;
};

export const AddTaskBtn = ({ text, onPress }: AddTaskBtnProps) => (
  <Pressable onPress={onPress} style={styles.addBtn}>
    <ThemedText style={styles.addBtnText}>{text}</ThemedText>
  </Pressable>
);

const TaskListScreen: React.FC = ({ navigation }: any) => {
  const { tasks, addTask, toggleTaskCompletion, deleteTask } = useTaskContext();
  const [taskTitle, setTaskTitle] = useState('');

  const handleAddTask = useCallback(() => {
    if (taskTitle.trim()) {
      addTask(taskTitle);
      setTaskTitle('');
    }
  }, [taskTitle]);

  const handleChangeTitle = useCallback((title: string) => {
    setTaskTitle(title);
  }, []);

  const goToTaskDetails = useCallback(
    (taskId: Task['id']) =>
      navigation.navigate(SCREEN_NAMES.TASK_DETAILS, { taskId }),
    []
  );

  const renderTaskItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskItem
        task={item}
        onPress={() => goToTaskDetails(item.id)}
        onToggleCompletion={() => toggleTaskCompletion(item.id)}
        onDelete={() => deleteTask(item.id)}
      />
    ),
    [goToTaskDetails, toggleTaskCompletion, deleteTask]
  );

  const keyExtractor = useCallback((item: Task) => item.id.toString(), []);

  const memoizedTasks = useMemo(() => tasks, [tasks]);

  return (
    <ThemedView style={styles.container}>
      <AddTaskInput value={taskTitle} onChangeText={handleChangeTitle} />
      <AddTaskBtn text="Add" onPress={handleAddTask} />
      <FlashList
        data={memoizedTasks}
        keyExtractor={keyExtractor}
        renderItem={renderTaskItem}
        estimatedItemSize={70}
        ListEmptyComponent={EmptyComponent}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  empty: {
    marginTop: 20,
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  addBtnText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TaskListScreen;
