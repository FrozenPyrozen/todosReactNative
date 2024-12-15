import { useThemeColor } from '@/hooks/useThemeColor';
import { ViewProps } from 'react-native';
import styled from 'styled-components/native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  lightColor,
  darkColor,
  style,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  return (
    <StyledView
      backgroundColor={backgroundColor}
      style={style}
      {...otherProps}
    />
  );
}

const StyledView = styled.View<{ backgroundColor: string }>`
  background-color: ${(props) => props.backgroundColor};
`;
