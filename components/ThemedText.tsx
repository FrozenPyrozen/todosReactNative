import { useThemeColor } from '@/hooks/useThemeColor';
import { TextProps } from 'react-native';
import styled from 'styled-components/native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  lightColor,
  darkColor,
  type = 'default',
  style,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const getStyledText = () => {
    switch (type) {
      case 'title':
        return StyledTitleText;
      case 'defaultSemiBold':
        return StyledDefaultSemiBoldText;
      case 'subtitle':
        return StyledSubtitleText;
      case 'link':
        return StyledLinkText;
      default:
        return StyledDefaultText;
    }
  };

  const StyledText = getStyledText();

  return <StyledText color={color} style={style} {...rest} />;
}

const StyledDefaultText = styled.Text<{ color: string }>`
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.color};
`;

const StyledDefaultSemiBoldText = styled.Text<{ color: string }>`
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: ${(props) => props.color};
`;

const StyledTitleText = styled.Text<{ color: string }>`
  font-size: 32px;
  line-height: 32px;
  font-weight: bold;
  color: ${(props) => props.color};
`;

const StyledSubtitleText = styled.Text<{ color: string }>`
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => props.color};
`;

const StyledLinkText = styled.Text<{ color: string }>`
  font-size: 16px;
  line-height: 30px;
  color: ${(props) => props.color};
`;
