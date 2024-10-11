import { useState, useEffect } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

type HexagramLine = 6 | 7 | 8 | 9;
type Hexagram = HexagramLine[];

interface HexagramDisplayProps {
  hexagram: Hexagram;
}

const HexagramDisplay: React.FC<HexagramDisplayProps> = ({ hexagram }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev < 6) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getLineColor = (value: HexagramLine): string => {
    return value === 6 || value === 9 ? 'red.500' : 'black';
  };

  const LineComponent: React.FC<{ value: HexagramLine }> = ({ value }) => {
    const isYang = value === 7 || value === 9;
    const color = getLineColor(value);

    return (
      <Box position="relative" height="20px" width="200px">
        {isYang ? (
          <Box h="20px" w="200px" bg={color} borderRadius="full" />
        ) : (
          <>
            <Box h="20px" w="95px" bg={color} borderRadius="full" position="absolute" left={0} />
            <Box h="20px" w="95px" bg={color} borderRadius="full" position="absolute" right={0} />
          </>
        )}
      </Box>
    );
  };

  return (
    <VStack spacing={2} mt={8} height="160px" justifyContent="flex-end">
      <AnimatePresence>
        {hexagram.slice(0, visibleLines).reverse().map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '200px', marginBottom: index === 5 ? 0 : '8px' }}
          >
            <LineComponent value={line} />
          </motion.div>
        ))}
      </AnimatePresence>
    </VStack>
  );
};

export default HexagramDisplay;