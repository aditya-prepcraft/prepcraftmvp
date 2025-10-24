export const Arrays = () => {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold mb-6">Arrays</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What is an Array?</h2>
        <p className="text-base leading-relaxed mb-4">
          An array is a data structure that stores a collection of elements, each identified by an index.
          Arrays allow you to store multiple values in a single variable and access them efficiently.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Array Operations</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Accessing Elements:</strong> Use index to get element (O(1) time complexity)</li>
          <li><strong>Insertion:</strong> Add elements at the end (O(1) amortized) or at specific position (O(n))</li>
          <li><strong>Deletion:</strong> Remove elements from end (O(1)) or from specific position (O(n))</li>
          <li><strong>Searching:</strong> Linear search O(n), Binary search O(log n) for sorted arrays</li>
          <li><strong>Traversal:</strong> Iterate through all elements O(n)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Example: Array Operations</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">{`// Creating an array
const numbers = [1, 2, 3, 4, 5];

// Accessing elements
console.log(numbers[0]); // 1

// Adding elements
numbers.push(6); // [1, 2, 3, 4, 5, 6]

// Removing elements
numbers.pop(); // [1, 2, 3, 4, 5]

// Iterating
numbers.forEach(num => console.log(num));`}</code>
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Common Array Problems</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Find maximum/minimum element</li>
          <li>Reverse an array</li>
          <li>Rotate an array</li>
          <li>Find duplicates</li>
          <li>Merge sorted arrays</li>
        </ul>
      </section>
    </div>
  );
};

export const arraysMeta = {
  id: 'arrays',
  title: 'Arrays',
  difficulty: 'beginner',
  points: 15,
  estimatedTime: '20 min'
};
