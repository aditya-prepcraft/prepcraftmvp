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

export const csFundamentalsNotes: Chapter[] = [
  {
    id: 'chapter-1',
    title: 'Chapter 1: Object-Oriented Programming (OOP)',
    subChapters: [
      { id: '1.1', title: 'Core Concepts (Class, Object, this Keyword)', points: 10 },
      { id: '1.2', title: 'The Four Pillars: Encapsulation', points: 10 },
      { id: '1.3', title: 'The Four Pillars: Abstraction', points: 10 },
      { id: '1.4', title: 'The Four Pillars: Inheritance (Types, super Keyword)', points: 10 },
      { id: '1.5', title: 'The Four Pillars: Polymorphism (Overloading vs. Overriding)', points: 10 },
      { id: '1.6', title: 'Constructors & Destructors', points: 10 },
      { id: '1.7', title: 'Static Keywords, Abstract Classes, and Interfaces', points: 10 },
    ],
  },
  {
    id: 'chapter-2',
    title: 'Chapter 2: Operating Systems (OS)',
    subChapters: [
      { id: '2.1', title: 'Introduction to Operating Systems', points: 10 },
      { id: '2.2', title: 'Process vs. Thread (Process Management)', points: 10 },
      { id: '2.3', title: 'CPU Scheduling Algorithms (FCFS, SJF, Round Robin, Priority)', points: 10 },
      { id: '2.4', title: 'Memory Management (Paging, Segmentation, Virtual Memory)', points: 10 },
      { id: '2.5', title: 'Concurrency & Synchronization (Mutex, Semaphores)', points: 10 },
      { id: '2.6', title: 'Deadlock (Conditions & Prevention)', points: 10 },
      { id: '2.7', title: 'File Systems', points: 10 },
    ],
  },
  {
    id: 'chapter-3',
    title: 'Chapter 3: Database Management Systems (DBMS)',
    subChapters: [
      { id: '3.1', title: 'Database Fundamentals (SQL vs. NoSQL)', points: 10 },
      { id: '3.2', title: 'Relational Model & Keys (Primary, Foreign, Super, Candidate)', points: 10 },
      { id: '3.3', title: 'SQL Queries (SELECT, WHERE, GROUP BY, HAVING)', points: 10 },
      { id: '3.4', title: 'SQL Joins (Inner, Left, Right, Full)', points: 10 },
      { id: '3.5', title: 'Transactions & ACID Properties', points: 10 },
      { id: '3.6', title: 'Normalization (1NF, 2NF, 3NF, BCNF)', points: 10 },
      { id: '3.7', title: 'Indexing in Databases', points: 10 },
    ],
  },
  {
    id: 'chapter-4',
    title: 'Chapter 4: Computer Networks (CN)',
    subChapters: [
      { id: '4.1', title: 'The OSI Model (7 Layers Explained)', points: 10 },
      { id: '4.2', title: 'The TCP/IP Model (4 Layers)', points: 10 },
      { id: '4.3', title: 'Core Protocols (TCP vs. UDP)', points: 10 },
      { id: '4.4', title: 'Application Layer Protocols (HTTP, HTTPS, DNS, FTP)', points: 10 },
      { id: '4.5', title: 'TCP 3-Way Handshake', points: 10 },
      { id: '4.6', title: 'IP Addressing & Subnetting', points: 10 },
    ],
  },
  {
    id: 'chapter-5',
    title: 'Chapter 5: Core Data Structures & Algorithms (DSA Review)',
    subChapters: [
      { id: '5.1', title: 'Algorithm Complexity (Big O Notation)', points: 10 },
      { id: '5.2', title: 'Linear Structures (Arrays, Linked Lists, Stacks, Queues)', points: 10 },
      { id: '5.3', title: 'Non-Linear Structures (Trees, Graphs, Heaps)', points: 10 },
      { id: '5.4', title: 'Hashing (Hash Maps / Dictionaries)', points: 10 },
      { id: '5.5', title: 'Common Sorting Algorithms (Merge Sort, Quick Sort)', points: 10 },
      { id: '5.6', title: 'Common Searching Algorithms (Binary Search, BFS, DFS)', points: 10 },
    ],
  },
  {
    id: 'chapter-6',
    title: 'Chapter 6: Software Engineering Concepts',
    subChapters: [
      { id: '6.1', title: 'Software Development Life Cycle (SDLC)', points: 10 },
      { id: '6.2', title: 'Agile vs. Waterfall Methodologies', points: 10 },
      { id: '6.3', title: 'Introduction to Version Control (Git)', points: 10 },
      { id: '6.4', title: 'Common Git Commands (commit, push, pull, branch, merge)', points: 10 },
    ],
  },
];
