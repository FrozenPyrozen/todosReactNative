import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

import TaskItem from '@/app/screens/TaskListScreen/TaskItem';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SCREEN_NAMES } from '@/constants/screenNames';
import { useTaskContext } from '@/context/TaskContext';
import { RootStackParamList } from '@/types/navigation';
import { Task } from '@/types/taskLogicTypes';
import { FlashList } from '@shopify/flash-list';

const EmptyComponent = () => (
  <EmptyContainer>
    <EmptyText>"No tasks yet"</EmptyText>
  </EmptyContainer>
);

export type AddTaskInputProps = {
  value: string;
  onChangeText: (text: string) => void;
};

const AddTaskInput: React.FC<AddTaskInputProps> = React.memo(
  ({ value, onChangeText }) => (
    <StyledTextInput
      placeholder="Add a new task"
      value={value}
      onChangeText={onChangeText}
    />
  )
);

export type AddTaskBtnProps = {
  text: string;
  onPress: () => void;
};

const AddTaskBtn: React.FC<AddTaskBtnProps> = React.memo(
  ({ text, onPress }) => (
    <AddButton onPress={onPress}>
      <AddButtonText>{text}</AddButtonText>
    </AddButton>
  )
);

const TaskListScreen: React.FC = () => {
  const {
    tasks,
    isFetchTasksLoading,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    fetchTasks,
  } = useTaskContext();
  const [taskTitle, setTaskTitle] = useState('');
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const refreshTasks = useCallback(() => {
    fetchTasks();
  }, []);

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
    <Container>
      <AddTaskInput value={taskTitle} onChangeText={handleChangeTitle} />
      <AddTaskBtn text="Add" onPress={handleAddTask} />
      <FlashList
        data={memoizedTasks}
        keyExtractor={keyExtractor}
        renderItem={renderTaskItem}
        estimatedItemSize={70}
        ListEmptyComponent={EmptyComponent}
        onRefresh={refreshTasks}
        refreshing={isFetchTasksLoading}
      />
    </Container>
  );
};

const Container = styled(ThemedView)`
  flex: 1;
  padding: 16px;
  background-color: #f7f7f7;
`;

const StyledTextInput = styled.TextInput`
  padding: 10px;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: white;
`;

const EmptyContainer = styled(ThemedView)`
  margin-top: 20px;
  align-items: center;
`;

const EmptyText = styled(ThemedText)`
  font-size: 16px;
  color: gray;
`;

const AddButton = styled(Pressable)`
  background-color: green;
  padding: 5px;
  border-radius: 5px;
  margin-horizontal: 5px;
`;

const AddButtonText = styled(ThemedText)`
  text-align: center;
  color: white;
  font-weight: bold;
`;

export default TaskListScreen;
