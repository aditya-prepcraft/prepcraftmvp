export const BasicsOfProgramming = () => {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold mb-6">Basics of Programming</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction to Programming</h2>
        <p className="text-base leading-relaxed mb-4">
          Programming is the process of creating a set of instructions that tell a computer how to perform a task.
          It involves writing code in various programming languages to solve problems and automate processes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Variables:</strong> Containers for storing data values</li>
          <li><strong>Data Types:</strong> Classification of data (integers, strings, booleans, etc.)</li>
          <li><strong>Operators:</strong> Symbols that perform operations on variables and values</li>
          <li><strong>Control Structures:</strong> Statements that control the flow of execution</li>
          <li><strong>Functions:</strong> Reusable blocks of code that perform specific tasks</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Example: Hello World</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">{`function helloWorld() {
  console.log("Hello, World!");
}

helloWorld(); // Output: Hello, World!`}</code>
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Practice Exercise</h2>
        <p className="text-base leading-relaxed mb-4">
          Try writing a program that declares variables of different types and prints them to the console.
        </p>
      </section>
    </div>
  );
};

export const basicsOfProgrammingMeta = {
  id: 'basics-of-programming',
  title: 'Basics of Programming',
  difficulty: 'beginner',
  points: 10,
  estimatedTime: '15 min'
};
