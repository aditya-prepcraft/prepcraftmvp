import { Brain, Code2, Rocket, BookOpen } from 'lucide-react';
import { dsaNotes } from './dsa/notes';
import { dsaPracticeProblems } from './dsa/practice-problems';
import { dsaQuizzes } from './dsa/quiz';

export interface SubjectConfig {
  slug: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  notes: any[];
  practiceProblems: any[];
  quizzes: any[];
}

export const subjects: SubjectConfig[] = [
  {
    slug: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Master fundamental data structures and algorithmic problem-solving techniques',
    icon: Brain,
    color: 'hsl(var(--primary))',
    notes: dsaNotes,
    practiceProblems: dsaPracticeProblems,
    quizzes: dsaQuizzes,
  },
  {
    slug: 'aptitude',
    title: 'Aptitude',
    description: 'Enhance logical reasoning, quantitative abilities, and analytical skills',
    icon: Code2,
    color: 'hsl(var(--accent))',
    notes: [],
    practiceProblems: [],
    quizzes: [],
  },
  {
    slug: 'development',
    title: 'Development',
    description: 'Learn modern web development, frameworks, and best practices',
    icon: Rocket,
    color: 'hsl(var(--success))',
    notes: [],
    practiceProblems: [],
    quizzes: [],
  },
  {
    slug: 'cs-fundamentals',
    title: 'CS Fundamentals',
    description: 'Core computer science concepts including OS, DBMS, Networks, and more',
    icon: BookOpen,
    color: 'hsl(var(--chart-4))',
    notes: [],
    practiceProblems: [],
    quizzes: [],
  },
];

export const getSubjectBySlug = (slug: string) => {
  return subjects.find(s => s.slug === slug);
};
