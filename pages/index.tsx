import { useState, useRef, useEffect } from 'react';
import { Box, Container, Input, VStack, Heading, Button, Text, HStack, Center, Flex, Spinner } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import HexagramDisplay from '../components/HexagramDisplay';
import Interpretation, { getInterpretation } from '../components/Interpretation';
import guaciData from '../public/data/guaci.json';
import { OpenAI } from 'openai';
import { HexagramLine, Hexagram, InterpretationContent, createHexagram } from '../types/hexagram';

const generateHexagramUsingYarrowMethod = (): Hexagram => {
  const generateLine = (): HexagramLine => {
    let stalks = 49; // 50根减去1根不用

    const performDivination = (): [number, number, number] => {
      const leftHand = Math.floor(Math.random() * stalks);
      const rightHand = stalks - leftHand;
      
      const rightHandAfterRemoval = rightHand - 1;
      
      const leftRemainder = leftHand % 4 === 0 ? 4 : leftHand % 4;
      const rightRemainder = rightHandAfterRemoval % 4 === 0 ? 4 : rightHandAfterRemoval % 4;
      
      return [leftRemainder, rightRemainder, 1];
    };

    const [first1, first2, firstRemoved] = performDivination();
    stalks -= (first1 + first2 + firstRemoved);

    const [second1, second2, secondRemoved] = performDivination();
    stalks -= (second1 + second2 + secondRemoved);

    const [third1, third2, thirdRemoved] = performDivination();
    stalks -= (third1 + third2 + thirdRemoved);

    const total = 49 - (first1 + first2 + second1 + second2 + third1 + third2 + firstRemoved + secondRemoved + thirdRemoved);

    let result: HexagramLine;
    if (total === 24) result = 6; // 老阴
    else if (total === 28) result = 7; // 少阳
    else if (total === 32) result = 8; // 少阴
    else if (total === 36) result = 9; // 老阳
    else throw new Error('Invalid hexagram line generated');

    return result;
  };

  const hexagram: HexagramLine[] = [];
  for (let i = 0; i < 6; i++) {
    hexagram.push(generateLine());
  }

  console.log('Final hexagram:', hexagram);
  return createHexagram(hexagram);
};

const TaijiIcon = ({ isGenerating }: { isGenerating: boolean }) => (
  <motion.div
    animate={{ rotate: isGenerating ? 360 : 0 }}
    transition={{ duration: 2, repeat: isGenerating ? Infinity : 0, ease: "linear" }}
    style={{ cursor: 'pointer', fontSize: '48px' }}
  >
    ☯️
  </motion.div>
);

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    baseURL: process.env.NEXT_PUBLIC_OPENAI_BASE_URL,
    dangerouslyAllowBrowser: true,
});

const getAIInterpretation = async (query: string, hexagram: Hexagram, hexagramInfo: any, interpretation: InterpretationContent, changingLinesCount: number) => {
  const hexagramLines = hexagram.map(line => line % 2 === 0 ? '0' : '1').reverse().join('');
  const systemPrompt = `
    你是一个专业的易经解读师，你的任务是根据用户输入的问题和卦象，给出详细的解读。
  `;
  const prompt = `
    用户占卜的问题: ${query}
    卦象: ${hexagramInfo.name} (${hexagramInfo.fu})
    解读方式为: ${getInterpretationReason(interpretation.type, changingLinesCount)}
    解卦卦辞: ${typeof interpretation.content === 'string' ? interpretation.content : JSON.stringify(interpretation.content)}
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }],
    max_tokens: 150,
  });

  return response.choices[0].message.content.trim();
};

const generateChangedHexagram = (hexagram: Hexagram): Hexagram | null => {
  const changedLines = hexagram.filter(line => line === 6 || line === 9);
  if (changedLines.length === 0) {
    return null;
  }
  return createHexagram(hexagram.map(line => {
    if (line === 6) return 7; // 老阴变少阳
    if (line === 9) return 8; // 老阳变少阴
    return line; // 少阴和少阳保持不变
  }));
};

const getInterpretationReason = (type: string, changingLinesCount: number): string => {
  switch (type) {
    case '卦辞':
      return changingLinesCount === 0 ? '六爻不变，以本卦的卦辞和《彖辞》进行占断。' : '六爻皆变，以变卦的卦辞和《彖辞》进行占断。';
    case '爻辞':
      if (changingLinesCount === 1) return '一爻变，以本卦中变爻的爻辞进行占断。';
      if (changingLinesCount === 2) return '两爻变，以本卦中两个变爻的爻辞进行占断，以上面的变爻（即位置靠上的变爻）的爻辞为主。';
      if (changingLinesCount === 5) return '五爻变，以变卦中唯一不变爻的爻辞进行占断。';
      return '';
    case '综合解释':
      return '三爻变，需以本卦和变卦的卦辞及《彖辞》进行占断，以本卦的卦辞为主。';
    case '变卦爻辞':
      return '四爻变，以变卦中两个不变爻的爻辞进行占断，以下面的不变爻（即位置靠下的不变爻）的爻辞为主。';
    case '用九':
    case '用六':
      return '六爻皆变，本卦为乾卦或坤卦，分别以乾卦的"用九"或坤卦的"用六"进行占断。';
    default:
      return '';
  }
};

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [hexagram, setHexagram] = useState<Hexagram | null>(null);
  const [changedHexagram, setChangedHexagram] = useState<Hexagram | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showInterpretation, setShowInterpretation] = useState<boolean>(false);
  const [aiInterpretation, setAiInterpretation] = useState<string>('');
  const [interpretation, setInterpretation] = useState<InterpretationContent | null>(null);
  const [changingLinesCount, setChangingLinesCount] = useState<number>(0);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  const handleDivination = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setShowInterpretation(false);
    setHexagram(null);
    setChangedHexagram(null);
    setInterpretation(null);
    setAiInterpretation('');

    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 3000));

    const generatedHexagram = generateHexagramUsingYarrowMethod();
    setHexagram(generatedHexagram);
    
    const newChangedHexagram = generateChangedHexagram(generatedHexagram);
    setChangedHexagram(newChangedHexagram);

    const newChangingLinesCount = generatedHexagram.filter(line => line === 6 || line === 9).length;
    setChangingLinesCount(newChangingLinesCount);

    const newInterpretation = getInterpretation(generatedHexagram, newChangedHexagram);
    setInterpretation(newInterpretation);

    setIsGenerating(false);

    // 等待卦象展示完成后显示解释
    setTimeout(() => setShowInterpretation(true), 6000);
  };

  const handleReset = () => {
    setQuery('');
    setHexagram(null);
    setShowInterpretation(false);
    setAiInterpretation('');
  };

  const handleAIInterpretation = async () => {
    if (!hexagram || !query) return;
    setIsLoadingAI(true);
    setAiInterpretation('');
    const hexagramKey = hexagram.toString();
    const hexagramInfo = guaciData[hexagramKey as keyof typeof guaciData];
    const systemPrompt = `
    你是一个专业的易经解读师，你的任务是根据用户输入的问题和卦象，给出详细的解读。
  `;
  const prompt = `
    用户占卜的问题: ${query}
    卦象: ${hexagramInfo.name} (${hexagramInfo.fu})
    解读方式为: ${getInterpretationReason(interpretation.type, changingLinesCount)}
    解卦卦辞: ${typeof interpretation.content === 'string' ? interpretation.content : JSON.stringify(interpretation.content)}
  `;

    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {role: "system", content: "You are an I Ching expert. Interpret the hexagram and provide insights based on the user's query."},
          {role: "user", content: prompt}
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        setAiInterpretation((prev) => prev + content);
      }
    } catch (error) {
      console.error('Error getting AI interpretation:', error);
      setAiInterpretation('抱歉，获取 AI 解读时出现错误。');
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <Container maxW="container.xl" centerContent>
      <VStack spacing={8} my={16}>
        <Heading as="h1" size="xl">大衍筮法</Heading>
        <Text textAlign="center" fontSize="md" color="gray.600">
          输入你的问题，点击太极图标生成卦象。生成后可查看传统解释或使用AI进行解读。
        </Text>
        <HStack spacing={4} width="100%" justifyContent="center">
          <Input
            placeholder="输入你的占卜问题"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="lg"
            width="50%"
          />
          <Box onClick={handleDivination} cursor="pointer">
            <TaijiIcon isGenerating={isGenerating} />
          </Box>
        </HStack>
        {hexagram && (
          <Box mt={8} width="100%">
            <HexagramDisplay 
              hexagram={hexagram} 
              changedHexagram={changedHexagram} 
            />
          </Box>
        )}
        {showInterpretation && interpretation && (
          <Box 
            mt={4} 
            width="100%" 
            maxWidth="600px" 
            borderWidth={1} 
            borderRadius="lg" 
            p={4} 
            boxShadow="md"
          >
            <Heading as="h3" size="md" mb={2}>解卦依据</Heading>
            <Text fontSize="sm" fontStyle="italic" mb={2}>
              【朱熹解卦法】{getInterpretationReason(interpretation.type, changingLinesCount)}
            </Text>
            <Text mt={2}>{typeof interpretation.content === 'string' ? interpretation.content : JSON.stringify(interpretation.content)}</Text>
          </Box>
        )}
        {(isLoadingAI || aiInterpretation) && (
          <Box 
            mt={4} 
            width="100%" 
            maxWidth="600px" 
            borderWidth={1} 
            borderRadius="lg" 
            p={4} 
            boxShadow="md"
          >
            <Heading as="h3" size="md" mb={2}>AI 解读结果</Heading>
            {isLoadingAI && <Spinner />}
            <Text>{aiInterpretation}</Text>
          </Box>
        )}
        <HStack spacing={4} width="100%" justifyContent="center">
            {/* <Button onClick={handleReset} colorScheme="red" width="33%">
              重置
            </Button> */}
            {showInterpretation && hexagram && (
              <Button 
                onClick={handleAIInterpretation} 
                colorScheme="blue" 
                width="33%"
                isLoading={isLoadingAI}
                loadingText="正在解读"
              >
                AI解读
              </Button>
            )}
          </HStack>
        
        {showInterpretation && hexagram && (
          <Flex width="100%" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1} mr={4}>
              <Interpretation 
                hexagram={hexagram} 
                changedHexagram={changedHexagram}
                isChangedHexagram={false}
              />
            </Box>
            {changedHexagram && (
              <Box flex={1} ml={4}>
                <Interpretation 
                  hexagram={changedHexagram} 
                  changedHexagram={null}
                  isChangedHexagram={true}
                />
              </Box>
            )}
          </Flex>
        )}
       
      </VStack>
    </Container>
  );
}