import { useState, useRef, useEffect } from 'react';
import { Box, Container, Textarea, VStack, Heading, Button, Text, HStack, Flex, Center } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import HexagramDisplay from '../components/HexagramDisplay';
import Interpretation from '../components/Interpretation';
import guaciData from '../public/data/guaci.json';
import { OpenAI } from 'openai';

type HexagramLine = 6 | 7 | 8 | 9;
type Hexagram = HexagramLine[];

const generateHexagramUsingYarrowMethod = (): Hexagram => {
  const generateLine = (): HexagramLine => {
    let stalks = 49; // 50根减去1根不用
    console.log('Initial stalks:', stalks);

    const performDivision = (): [number, number, number] => {
      const leftHand = Math.floor(Math.random() * stalks);
      const rightHand = stalks - leftHand;
      
      const rightHandAfterRemoval = rightHand - 1;
      
      const leftRemainder = leftHand % 4 === 0 ? 4 : leftHand % 4;
      const rightRemainder = rightHandAfterRemoval % 4 === 0 ? 4 : rightHandAfterRemoval % 4;
      
      console.log(`Division: Left ${leftHand}, Right ${rightHand}`);
      console.log(`After removal: Left ${leftHand}, Right ${rightHandAfterRemoval}`);
      console.log(`Remainders: Left ${leftRemainder}, Right ${rightRemainder}`);
      
      return [leftRemainder, rightRemainder, 1];
    };

    const [first1, first2, firstRemoved] = performDivision();
    stalks -= (first1 + first2 + firstRemoved);
    console.log('Stalks after first division:', stalks);

    const [second1, second2, secondRemoved] = performDivision();
    stalks -= (second1 + second2 + secondRemoved);
    console.log('Stalks after second division:', stalks);

    const [third1, third2, thirdRemoved] = performDivision();
    stalks -= (third1 + third2 + thirdRemoved);
    console.log('Stalks after third division:', stalks);

    const total = 49 - (first1 + first2 + second1 + second2 + third1 + third2 + firstRemoved + secondRemoved + thirdRemoved);
    console.log('Total remainders:', total);

    let result: HexagramLine;
    if (total === 24) result = 6; // 老阴
    else if (total === 28) result = 7; // 少阳
    else if (total === 32) result = 8; // 少阴
    else if (total === 36) result = 9; // 老阳
    else throw new Error('Invalid hexagram line generated');

    console.log('Generated line:', result);
    return result;
  };

  const hexagram: Hexagram = [];
  for (let i = 0; i < 6; i++) {
    console.log(`Generating line ${i + 1}`);
    hexagram.push(generateLine());
  }

  console.log('Final hexagram:', hexagram);
  return hexagram;
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

const getAIInterpretation = async (query: string, hexagram: Hexagram, hexagramInfo: any) => {
  const hexagramLines = hexagram.map(line => line % 2 === 0 ? '0' : '1').reverse().join('');
  const systemPrompt = `
    你是一个专业的易经解读师，你的任务是根据用户输入的问题和卦象，给出详细的解读。
  `;
  const prompt = `
    用户输入: ${query}
    卦象: ${hexagramLines}
    卦辞: ${hexagramInfo.guaci}
    ${hexagramInfo.bianGuaci ? `变卦的卦辞: ${hexagramInfo.bianGuaci}` : ''}
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }],
    max_tokens: 150,
  });

  return response.choices[0].message.content.trim();
};

const generateChangedHexagram = (hexagram: Hexagram): Hexagram => {
  return hexagram.map(line => {
    if (line === 6) return 7; // 老阴变少阳
    if (line === 9) return 8; // 老阳变少阴
    return line; // 少阴和少阳保持不变
  });
};

const hexagramToString = (hexagram: Hexagram): string => {
  return hexagram.map(line => line % 2 === 0 ? '0' : '1').join('');
};

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [hexagram, setHexagram] = useState<Hexagram | null>(null);
  const [changedHexagram, setChangedHexagram] = useState<Hexagram | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showInterpretation, setShowInterpretation] = useState<boolean>(false);
  const [aiInterpretation, setAiInterpretation] = useState<string>('');
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
    setAiInterpretation('');

    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 3000));

    const generatedHexagram = generateHexagramUsingYarrowMethod();
    setHexagram(generatedHexagram);
    
    const newChangedHexagram = generateChangedHexagram(generatedHexagram);
    setChangedHexagram(newChangedHexagram);

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
    const hexagramKey = hexagram.map(line => line % 2 === 0 ? '0' : '1').reverse().join('');
    const hexagramInfo = guaciData[hexagramKey as keyof typeof guaciData];
    const interpretation = await getAIInterpretation(query, hexagram, hexagramInfo);
    setAiInterpretation(interpretation);
  };

  return (
    <Container maxW="container.xl" centerContent>
      <VStack spacing={8} my={16}>
        <Heading as="h1" size="xl">大衍筮法</Heading>
        <Text textAlign="center" fontSize="md" color="gray.600">
          输入你的问题，点击太极图标生成卦象。生成后可查看传统解释或使用AI进行解读。
        </Text>
        <VStack spacing={4} width="100%">
          <Textarea
            ref={textareaRef}
            placeholder="输入你的占卜问题"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="lg"
            width="100%"
            minHeight="40px"
            resize="none"
            overflow="hidden"
          />
          <Center width="100%">
            <Box onClick={handleDivination} cursor="pointer">
              <TaijiIcon isGenerating={isGenerating} />
            </Box>
          </Center>
          <HStack spacing={4} width="100%">
            <Button onClick={handleReset} colorScheme="red" flex={1}>
              重置
            </Button>
            <Button 
              onClick={handleAIInterpretation} 
              colorScheme="blue" 
              flex={1}
              isDisabled={!showInterpretation || !hexagram}
            >
              AI解读
            </Button>
          </HStack>
        </VStack>
        {hexagram && (
          <Box mt={8} width="100%">
            <HexagramDisplay 
              hexagram={hexagram} 
              changedHexagram={changedHexagram} 
            />
          </Box>
        )}
        {showInterpretation && hexagram && (
          <Flex width="100%" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1} mr={4}>
              <Interpretation hexagram={hexagram} />
            </Box>
            {changedHexagram && (
              <Box flex={1} ml={4}>
                <Interpretation hexagram={changedHexagram} isChangedHexagram />
              </Box>
            )}
          </Flex>
        )}
        {aiInterpretation && (
          <Box mt={4} width="100%">
            <Heading as="h3" size="md">AI解读结果</Heading>
            <Text>{aiInterpretation}</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
}

console.log('OPENAI_API_KEY:', process.env.NEXT_PUBLIC_OPENAI_API_KEY);
console.log('OPENAI_BASE_URL:', process.env.NEXT_PUBLIC_OPENAI_BASE_URL);
