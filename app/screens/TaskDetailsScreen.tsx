import React, { useCallback, useMemo } from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/core';
import { RouteProp } from '@react-navigation/native';

import { RootStackParamList } from '@/types/navigation';
import { ThemedText } from '@/components/atoms/ThemedText';
import { ThemedView } from '@/components/atoms/ThemedView';
import { useTaskContext } from '@/context/TaskContext';

const TaskDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const routeParams = route.params;
  const { tasks, deleteTask, toggleTaskCompletion } = useTaskContext();

  const task = useMemo(
    () => tasks.find((t) => t.id === routeParams?.taskId),
    [tasks, routeParams?.taskId]
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
    return <ErrorText>Task not found!</ErrorText>;
  }

  return (
    <Container>
      <TitleText type="title">{task.title}</TitleText>
      <StatusText>{task.completed ? 'Completed' : 'Incomplete'}</StatusText>

      <ButtonsContainer>
        <Button completed={task.completed} onPress={toggleCompletion}>
          <ButtonText>
            {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
          </ButtonText>
        </Button>

        <DeleteButton onPress={removeTask}>
          <ButtonText>Delete Task</ButtonText>
        </DeleteButton>
      </ButtonsContainer>
    </Container>
  );
};

export default TaskDetailsScreen;

const Container = styled(ThemedView)`
  flex: 1;
  padding: 16px;
  justify-content: center;
  align-items: center;
`;

const TitleText = styled(ThemedText)`
  font-size: 24px;
  margin-bottom: 16px;
  font-weight: bold;
`;

const StatusText = styled(ThemedText)`
  font-size: 18px;
  margin-bottom: 24px;
  color: gray;
`;

const ErrorText = styled(ThemedText)`
  font-size: 18px;
  color: red;
  text-align: center;
  margin-top: 20px;
`;

const ButtonsContainer = styled(ThemedView)`
  width: 100%;
  padding: 0 20px;
  margin-top: 20px;
`;

const Button = styled(Pressable)<{ completed: boolean }>`
  background-color: ${({ completed }) => (completed ? '#FF9800' : '#4CAF50')};
  padding: 12px 0;
  margin-bottom: 12px;
  border-radius: 8px;
  align-items: center;
`;

const DeleteButton = styled(Pressable)`
  background-color: red;
  padding: 12px 0;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText = styled(ThemedText)`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;
