import { Box, Text, VStack } from '@chakra-ui/react';

type HexagramLine = 6 | 7 | 8 | 9;
type Hexagram = HexagramLine[];

interface InterpretationProps {
  hexagram: Hexagram;
}

const Interpretation: React.FC<InterpretationProps> = ({ hexagram }) => {
  const interpretLine = (value: HexagramLine): string => {
    switch (value) {
      case 6: return '老阴 (可能变化)';
      case 7: return '少阳 (不变)';
      case 8: return '少阴 (不变)';
      case 9: return '老阳 (可能变化)';
      default: return '未知';
    }
  };

  return (
    <Box mt={8}>
      <Text fontSize="xl" fontWeight="bold">
        Interpretation
      </Text>
      <VStack align="start" mt={2}>
        {hexagram.map((line, index) => (
          <Text key={index}>
            第{index + 1}爻: {interpretLine(line)}
          </Text>
        ))}
      </VStack>
      <Text mt={4}>
        This is a placeholder for a more detailed hexagram interpretation.
        In the future, this will be replaced with an AI-generated interpretation
        based on the specific hexagram and its changing lines.
      </Text>
    </Box>
  );
};

export default Interpretation;