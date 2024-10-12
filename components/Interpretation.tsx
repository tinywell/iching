import { Box, Text, VStack, Heading, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import guaciData from '../public/data/guaci.json';
import { HexagramLine, Hexagram, InterpretationContent, createHexagram } from '../types/hexagram';

interface InterpretationProps {
  hexagram: Hexagram;
  changedHexagram: Hexagram | null;
  isChangedHexagram: boolean;
}

export const getInterpretation = (hexagram: Hexagram, changedHexagram: Hexagram | null): InterpretationContent => {
  const hexagramKey = hexagram.toString();
  const hexagramInfo = guaciData[hexagramKey as keyof typeof guaciData];

  if (!changedHexagram) { // 本卦 changingLinesCount === 0
    return { type: '卦辞', content: `本卦卦辞: ${hexagramInfo.guaci}\n本卦彖辞: ${hexagramInfo.tuan}` };
  }

  const changedHexagramKey = changedHexagram.toString();
  const changedHexagramInfo = guaciData[changedHexagramKey as keyof typeof guaciData];

  const getChangingLines = (): number[] => {
    return hexagram.map((line, index) => (line === 6 || line === 9) ? index : -1).filter(index => index !== -1);
  };

  const changingLines = getChangingLines();
  const changingLinesCount = changingLines.length;

  if (changingLinesCount === 1) {
    return { type: '爻辞', content: hexagramInfo.yaoci[changingLines[0]] };
  } else if (changingLinesCount === 2) {
    const upperChangingLine = Math.max(...changingLines);
    const lowerChangingLine = Math.min(...changingLines);
    return { type: '爻辞', content: `上爻（主）：${hexagramInfo.yaoci[upperChangingLine]}\n下爻：${hexagramInfo.yaoci[lowerChangingLine]}` };
  } else if (changingLinesCount === 3) {
    return { 
      type: '综合解释', 
      content: `本卦卦辞（主）: ${hexagramInfo.guaci}\n\n变卦卦辞: ${changedHexagramInfo.guaci}\n本卦彖辞: ${hexagramInfo.tuan}\n变卦彖辞: ${changedHexagramInfo.tuan}`
    };
  } else if (changingLinesCount === 4) {
    const unchangedLines = hexagram.map((line, index) => (line === 7 || line === 8) ? index : -1).filter(index => index !== -1);
    const lowerUnchangedLine = Math.min(...unchangedLines);
    const upperUnchangedLine = Math.max(...unchangedLines);
    return { 
      type: '变卦爻辞', 
      content: `下爻（主）：${changedHexagramInfo.yaoci[lowerUnchangedLine]}\n上爻：${changedHexagramInfo.yaoci[upperUnchangedLine]}`
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
      return { type: '卦辞', content: `变卦卦辞: ${changedHexagramInfo.guaci}\n变卦彖辞: ${changedHexagramInfo.tuan}` };
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
        {isChangedHexagram ? `变卦：${hexagramInfo.name} (${hexagramInfo.fu})` : `本卦：${hexagramInfo.name} (${hexagramInfo.fu})`}
      </Heading>
      {hexagramInfo ? (
        <VStack align="start" spacing={4}>
          <Text><strong>卦辞：</strong>{hexagramInfo.guaci}</Text>
          <Text><strong>彖辞：</strong>{hexagramInfo.tuan}</Text>
          
          <Accordion allowMultiple width="100%">
            <AccordionItem>
              <h3>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <strong>爻辞</strong>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel pb={4}>
                {hexagram.map((line, index) => (
                  <Text key={index}>
                    第{index + 1}爻 ({interpretLine(line)}): {hexagramInfo.yaoci[index]}
                  </Text>
                ))}
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h3>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <strong>象辞</strong>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel pb={4}>
                {hexagramInfo.xiang.map((xiang, index) => (
                  <Text key={index}>{xiang}</Text>
                ))}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </VStack>
      ) : (
        <Text>无法找到对应的卦象信息。</Text>
      )}
    </Box>
  );
};

export default Interpretation;
