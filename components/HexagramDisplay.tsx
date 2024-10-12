import { useState, useEffect } from 'react';
import { Box, VStack, HStack } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

type HexagramLine = 6 | 7 | 8 | 9;
type Hexagram = HexagramLine[];

interface HexagramDisplayProps {
  hexagram: Hexagram;
  changedHexagram: Hexagram | null;
}

const HexagramDisplay: React.FC<HexagramDisplayProps> = ({ hexagram, changedHexagram }) => {
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

  const LineComponent: React.FC<{ value: HexagramLine; changed?: boolean }> = ({ value, changed = false }) => {
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
        {changed && (
          <Box
            position="absolute"
            right="-30px"
            top="0"
            bottom="0"
            display="flex"
            alignItems="center"
            fontSize="24px"
          >
            →
          </Box>
        )}
      </Box>
    );
  };

  return (
    <HStack spacing={8} justifyContent="center">
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
              <LineComponent 
                value={line} 
                changed={changedHexagram && line !== changedHexagram[5 - index]}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </VStack>
      {changedHexagram && (
        <VStack spacing={2} mt={8} height="160px" justifyContent="flex-end">
          {changedHexagram.slice(0, visibleLines).reverse().map((line, index) => (
            <Box
              key={index}
              style={{ width: '200px', marginBottom: index === 5 ? 0 : '8px' }}
            >
              <LineComponent value={line} />
            </Box>
          ))}
        </VStack>
      )}
    </HStack>
  );
};

export default HexagramDisplay;
