import React from 'react';
import styled from 'styled-components/native';
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
    <Container>
      <CheckBox onPress={onToggleCompletion}>
        {task.completed ? (
          <Icons name="checkbox-active" size={16} color="black" />
        ) : (
          <Icons name="checkbox-passive" size={16} color="black" />
        )}
      </CheckBox>
      <TitleContainer onPress={onToggleCompletion}>
        <TitleText
          numberOfLines={1}
          ellipsizeMode="tail"
          completed={task.completed}
        >
          {task.title}
        </TitleText>
      </TitleContainer>
      <DetailsButton onPress={onPress}>
        <DetailsButtonText>Details</DetailsButtonText>
      </DetailsButton>
      <DeleteButton onPress={onDelete}>
        <DeleteButtonText>Delete</DeleteButtonText>
      </DeleteButton>
    </Container>
  );
};

export default React.memo(TaskItem);

const Container = styled(ThemedView)`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-bottom-width: 1px;
  border-color: #eee;
  background-color: #fff;
`;

const CheckBox = styled.Pressable`
  margin-right: 10px;
`;

const TitleContainer = styled.Pressable`
  flex: 1;
`;

const TitleText = styled(ThemedText)<{ completed: boolean }>`
  text-decoration-line: ${({ completed }) =>
    completed ? 'line-through' : 'none'};
  color: ${({ completed }) => (completed ? 'gray' : 'black')};
`;

const DetailsButton = styled.Pressable`
  background-color: blue;
  padding: 5px;
  border-radius: 5px;
  margin-horizontal: 5px;
`;

const DetailsButtonText = styled(ThemedText)`
  color: white;
  font-weight: bold;
`;

const DeleteButton = styled.Pressable`
  background-color: red;
  padding: 5px;
  border-radius: 5px;
`;

const DeleteButtonText = styled(ThemedText)`
  color: white;
  font-weight: bold;
`;
