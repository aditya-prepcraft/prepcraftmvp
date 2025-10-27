import { BasicsOfProgramming, basicsOfProgrammingMeta } from './BasicsOfProgramming';
import { Arrays, arraysMeta } from './Arrays';
import { SortingTechniques, sortingTechniquesMeta } from './SortingTechniques';

export const dsaNotes = [
  { component: BasicsOfProgramming, meta: basicsOfProgrammingMeta },
  { component: Arrays, meta: arraysMeta },
  { component: SortingTechniques, meta: sortingTechniquesMeta },
];

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

export const dsaNotesStructured: Chapter[] = [
  {
    id: 'chapter-1',
    title: 'Chapter 1: Basics Of Programming',
    subChapters: [
      { id: '1.1', title: 'Variables & Data Types', points: 10 },
      { id: '1.2', title: 'Conditional Statements', points: 10 },
      { id: '1.3', title: 'Operators', points: 10 },
      { id: '1.4', title: 'Loops', points: 10 },
      { id: '1.5', title: 'Functions', points: 10 },
    ],
  },
  {
    id: 'chapter-2',
    title: 'Chapter 2: Arrays',
    subChapters: [
      { id: '2.1', title: 'Array Basics', points: 10 },
      { id: '2.2', title: '2D Arrays', points: 10 },
      { id: '2.3', title: 'Strings', points: 10 },
    ],
  },
  {
    id: 'chapter-3',
    title: 'Chapter 3: Sorting Techniques',
    subChapters: [
      { id: '3.1', title: 'What Is Sorting', points: 10 },
      { id: '3.2', title: 'Bubble Sort', points: 10 },
      { id: '3.3', title: 'Selection Sort', points: 10 },
      { id: '3.4', title: 'Insertion Sort', points: 10 },
      { id: '3.5', title: 'Counting', points: 10 },
    ],
  },
  {
    id: 'chapter-4',
    title: 'Chapter 4: Problem Solving Techniques',
    subChapters: [
      { id: '4.1', title: 'Recursion', points: 10 },
      { id: '4.2', title: 'Backtracking', points: 10 },
      { id: '4.3', title: 'Divide & Conqueror', points: 10 },
      { id: '4.4', title: 'Bit Manipulation', points: 10 },
      { id: '4.5', title: 'Time & Space Complexity', points: 10 },
      { id: '4.6', title: 'Greedy Algorithm', points: 10 },
    ],
  },
  {
    id: 'chapter-5',
    title: 'Chapter 5: Object Oriented Programming',
    subChapters: [
      { id: '5.1', title: 'Basic Of OOPs', points: 10 },
      { id: '5.2', title: 'Advanced OOPs', points: 10 },
    ],
  },
  {
    id: 'chapter-6',
    title: 'Chapter 6: Linear Data Structures',
    subChapters: [
      { id: '6.1', title: 'Array Lists', points: 10 },
      { id: '6.2', title: 'Linked Lists', points: 10 },
      { id: '6.3', title: 'Stacks', points: 10 },
      { id: '6.4', title: 'Queues', points: 10 },
    ],
  },
  {
    id: 'chapter-7',
    title: 'Chapter 7: Trees',
    subChapters: [
      { id: '7.1', title: 'Binary Trees', points: 10 },
      { id: '7.2', title: 'Binary Search Trees (BST)', points: 10 },
    ],
  },
  {
    id: 'chapter-8',
    title: 'Chapter 8: Advanced Data Structures',
    subChapters: [
      { id: '8.1', title: 'Heaps/Priority Queues', points: 10 },
      { id: '8.2', title: 'Hashing (Maps & Sets)', points: 10 },
      { id: '8.3', title: 'Tries', points: 10 },
      { id: '8.4', title: 'Graphs', points: 10 },
      { id: '8.5', title: 'Segment Trees', points: 10 },
    ],
  },
  {
    id: 'chapter-9',
    title: 'Chapter 9: Dynamic Programming',
    subChapters: [
      { id: '9.1', title: 'Basic DP', points: 10 },
      { id: '9.2', title: 'Advance DP', points: 10 },
    ],
  },
];
