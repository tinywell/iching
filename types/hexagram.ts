export type HexagramLine = 6 | 7 | 8 | 9;

export interface Hexagram extends Array<HexagramLine> {
  toString(): string;
}

export interface InterpretationContent {
  type: string;
  content: string | {
    mainGuaci: string;
    changedGuaci: string;
    mainTuanci: string;
    changedTuanci: string;
  };
}

export const createHexagram = (lines: HexagramLine[]): Hexagram => {
  const hexagram = lines as Hexagram;
  hexagram.toString = function() {
    return this.map(line => line % 2 === 0 ? '0' : '1').reverse().join('');
  };
  return hexagram;
};
