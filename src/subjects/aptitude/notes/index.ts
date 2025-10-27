export interface SubChapter {
  id: string;
  title: string;
  points: number;
}

export interface Chapter {
  id: string;
  title: string;
  subChapters: SubChapter[];
}

export const aptitudeNotes: Chapter[] = [
  {
    id: 'chapter-1',
    title: 'Chapter 1: Quantitative Aptitude',
    subChapters: [
      { id: '1.1', title: 'Number System', points: 10 },
      { id: '1.2', title: 'LCM & HCF', points: 10 },
      { id: '1.3', title: 'Percentages', points: 10 },
      { id: '1.4', title: 'Profit & Loss', points: 10 },
      { id: '1.5', title: 'Simple & Compound Interest', points: 10 },
      { id: '1.6', title: 'Ratio & Proportion', points: 10 },
      { id: '1.7', title: 'Pipes & Cisterns', points: 10 },
      { id: '1.8', title: 'Time & Work', points: 10 },
      { id: '1.9', title: 'Average', points: 10 },
      { id: '1.10', title: 'Permutations & Combinations', points: 10 },
      { id: '1.11', title: 'Probability', points: 10 },
      { id: '1.12', title: 'Age Problems', points: 10 },
      { id: '1.13', title: 'Partnerships', points: 10 },
      { id: '1.14', title: 'Allegations & Mixtures', points: 10 },
      { id: '1.15', title: 'Chain Rule', points: 10 },
      { id: '1.16', title: 'Train Problems', points: 10 },
      { id: '1.17', title: 'Boats & Streams', points: 10 },
      { id: '1.18', title: 'Data Interpretation', points: 10 },
    ],
  },
  {
    id: 'chapter-2',
    title: 'Chapter 2: Logical Reasoning',
    subChapters: [
      { id: '2.1', title: 'Number Series', points: 10 },
      { id: '2.2', title: 'Seating Arrangements', points: 10 },
      { id: '2.3', title: 'Clock Problems', points: 10 },
      { id: '2.4', title: 'Calendar', points: 10 },
      { id: '2.5', title: 'Blood Relations', points: 10 },
      { id: '2.6', title: 'Directions', points: 10 },
      { id: '2.7', title: 'Word Pattern', points: 10 },
      { id: '2.8', title: 'Coding & Decoding', points: 10 },
      { id: '2.9', title: 'Mathematical Operations', points: 10 },
      { id: '2.10', title: 'Venn Diagrams', points: 10 },
      { id: '2.11', title: 'Visual Reasoning', points: 10 },
      { id: '2.12', title: 'Paper Cutting & Adding', points: 10 },
      { id: '2.13', title: 'Cubes & Dices', points: 10 },
      { id: '2.14', title: 'Data Sufficiency', points: 10 },
    ],
  },
  {
    id: 'chapter-3',
    title: 'Chapter 3: Verbal Ability',
    subChapters: [
      { id: '3.1', title: 'Reading Comprehension', points: 10 },
      { id: '3.2', title: 'Spotting Errors', points: 10 },
      { id: '3.3', title: 'Sentence Formation', points: 10 },
      { id: '3.4', title: 'Synonyms & Antonyms', points: 10 },
      { id: '3.5', title: 'Idioms & Phrases', points: 10 },
    ],
  },
];
