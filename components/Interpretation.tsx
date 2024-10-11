import { Box, Text, VStack, Heading } from '@chakra-ui/react';
import guaciData from '../public/data/guaci.json';

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

  const hexagramKey = hexagram.map(line => line % 2 === 0 ? '0' : '1').reverse().join('');
  const hexagramInfo = guaciData[hexagramKey as keyof typeof guaciData];

  return (
    <Box mt={8}>
      <Heading as="h2" size="lg" mb={4}>
        卦象解释
      </Heading>
      {hexagramInfo ? (
        <VStack align="start" spacing={4}>
          <Text><strong>卦名：</strong>{hexagramInfo.name} <Text as="span" fontSize="3xl">({hexagramInfo.fu})</Text></Text>
          <Text><strong>卦辞：</strong>{hexagramInfo.guaci}</Text>
          <Text><strong>彖辞：</strong>{hexagramInfo.tuan}</Text>
          <Heading as="h3" size="md" mt={2}>爻辞</Heading>
          {hexagram.map((line, index) => (
            <Text key={index}>
              第{index + 1}爻 ({interpretLine(line)}): {hexagramInfo.yaoci[index]}
            </Text>
          ))}
          <Heading as="h3" size="md" mt={2}>象辞</Heading>
          {hexagramInfo.xiang.map((xiang, index) => (
            <Text key={index}>{xiang}</Text>
          ))}
        </VStack>
      ) : (
        <Text>无法找到对应的卦象信息。</Text>
      )}
    </Box>
  );
};

export default Interpretation;