import { Box, Text, VStack, Heading } from '@chakra-ui/react';
import guaciData from '../public/data/guaci.json';
import { HexagramLine, Hexagram, InterpretationContent, createHexagram } from '../types/hexagram';

interface InterpretationProps {
  hexagram: Hexagram;
  changedHexagram: Hexagram | null;
  isChangedHexagram: boolean;
}

export const getInterpretation = (hexagram: Hexagram, changedHexagram: Hexagram | null): InterpretationContent | null => {
  const hexagramKey = hexagram.toString();
  const hexagramInfo = guaciData[hexagramKey as keyof typeof guaciData];

  if (!changedHexagram) return null;

  const changedHexagramKey = changedHexagram.toString();
  const changedHexagramInfo = guaciData[changedHexagramKey as keyof typeof guaciData];

  const getChangingLines = (): number[] => {
    return hexagram.map((line, index) => (line === 6 || line === 9) ? index : -1).filter(index => index !== -1);
  };

  const changingLines = getChangingLines();
  const changingLinesCount = changingLines.length;

  if (changingLinesCount === 0) {
    return { type: '卦辞', content: hexagramInfo.guaci };
  } else if (changingLinesCount === 1) {
    return { type: '爻辞', content: hexagramInfo.yaoci[changingLines[0]] };
  } else if (changingLinesCount === 2) {
    const upperChangingLine = Math.max(...changingLines);
    return { type: '爻辞', content: hexagramInfo.yaoci[upperChangingLine] };
  } else if (changingLinesCount === 3) {
    return { 
      type: '综合解释', 
      content: {
        mainGuaci: hexagramInfo.guaci,
        changedGuaci: changedHexagramInfo.guaci,
        mainTuanci: hexagramInfo.tuan,
        changedTuanci: changedHexagramInfo.tuan
      }
    };
  } else if (changingLinesCount === 4) {
    const unchangedLines = hexagram.map((line, index) => (line === 7 || line === 8) ? index : -1).filter(index => index !== -1);
    const lowerUnchangedLine = Math.min(...unchangedLines);
    const upperUnchangedLine = Math.max(...unchangedLines);
    return { 
      type: '变卦爻辞', 
      content: `下爻：${changedHexagramInfo.yaoci[lowerUnchangedLine]}（主）\n上爻：${changedHexagramInfo.yaoci[upperUnchangedLine]}`
    };
  } else if (changingLinesCount === 5) {
    const unchangedLine = hexagram.findIndex(line => line === 7 || line === 8);
    return { type: '爻辞', content: changedHexagramInfo.yaoci[unchangedLine] };
  } else if (changingLinesCount === 6) {
    if (hexagramKey === '111111') {
      return { type: '用九', content: hexagramInfo.yaoci[6] };
    } else if (hexagramKey === '000000') {
      return { type: '用六', content: hexagramInfo.yaoci[6] };
    } else {
      return { type: '卦辞', content: changedHexagramInfo.guaci };
    }
  }

  return null;
};

const Interpretation: React.FC<InterpretationProps> = ({ hexagram, changedHexagram, isChangedHexagram }) => {
  const interpretLine = (value: HexagramLine): string => {
    switch (value) {
      case 6: return '老阴 (变化)';
      case 7: return '少阳 (不变)';
      case 8: return '少阴 (不变)';
      case 9: return '老阳 (变化)';
      default: return '未知';
    }
  };

  const hexagramKey = hexagram.toString();
  const hexagramInfo = guaciData[hexagramKey as keyof typeof guaciData];

  return (
    <Box mt={8}>
      <Heading as="h2" size="lg" mb={4}>
        {isChangedHexagram ? '变卦' : '本卦'}
      </Heading>
      {hexagramInfo ? (
        <VStack align="start" spacing={4}>
          <Text><strong>卦名：</strong>{hexagramInfo.name} (<Text as="span" fontSize="3xl">{hexagramInfo.fu}</Text>)</Text>
          <Heading as="h3" size="md" mt={2}>卦辞</Heading>
          <Text>{hexagramInfo.guaci}</Text>
          <Heading as="h3" size="md" mt={2}>彖辞</Heading>
          <Text>{hexagramInfo.tuan}</Text>
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
