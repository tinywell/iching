import { useState } from 'react';
import { Box, Container, Input, Button, VStack, Heading } from '@chakra-ui/react';
import HexagramDisplay from '../components/HexagramDisplay';
import Interpretation from '../components/Interpretation';

// 修正后的蓍草法生成卦象函数
const generateHexagramUsingYarrowMethod = () => {
  const generateLine = () => {
    let stalks = 49; // 50根减去1根不用
    console.log('Initial stalks:', stalks);

    const performDivision = () => {
      const leftHand = Math.floor(Math.random() * stalks);
      const rightHand = stalks - leftHand;
      
      // 从右手中取出1根
      const rightHandAfterRemoval = rightHand - 1;
      
      const leftRemainder = leftHand % 4 === 0 ? 4 : leftHand % 4;
      const rightRemainder = rightHandAfterRemoval % 4 === 0 ? 4 : rightHandAfterRemoval % 4;
      
      console.log(`Division: Left ${leftHand}, Right ${rightHand}`);
      console.log(`After removal: Left ${leftHand}, Right ${rightHandAfterRemoval}`);
      console.log(`Remainders: Left ${leftRemainder}, Right ${rightRemainder}`);
      
      return [leftRemainder, rightRemainder, 1]; // 返回两手的余数和取出的1根
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

    let result;
    if (total === 24) result = 6; // 老阴
    else if (total === 28) result = 7; // 少阳
    else if (total === 32) result = 8; // 少阴
    else if (total === 36) result = 9; // 老阳
    else result = 0; // 这种情况不应该发生

    console.log('Generated line:', result);
    return result;
  };

  const hexagram = [];
  for (let i = 0; i < 6; i++) {
    console.log(`Generating line ${i + 1}`);
    hexagram.push(generateLine());
  }

  console.log('Final hexagram:', hexagram);
  return hexagram;
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [hexagram, setHexagram] = useState(null);

  const handleDivination = () => {
    console.log('Starting divination process');
    const generatedHexagram = generateHexagramUsingYarrowMethod();
    setHexagram(generatedHexagram);
  };

  return (
    <Container maxW="container.md" centerContent>
      <VStack spacing={8} my={16}>
        <Heading as="h1" size="xl">I Ching Divination</Heading>
        <Box>
          <Input
            placeholder="Enter your divination query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="lg"
            width="300px"
          />
        </Box>
        <Button
          onClick={handleDivination}
          size="lg"
          colorScheme="teal"
          leftIcon={<TaijiIcon />}
        >
          Generate Hexagram
        </Button>
        {hexagram && (
          <Box mt={8} width="100%">
            <HexagramDisplay hexagram={hexagram} />
          </Box>
        )}
        {hexagram && <Interpretation hexagram={hexagram} />}
      </VStack>
    </Container>
  );
}

const TaijiIcon = () => (
  <Box as="span" mr={2}>
    ☯️
  </Box>
);