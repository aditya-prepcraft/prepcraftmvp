export const SortingTechniques = () => {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold mb-6">Sorting Techniques</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction to Sorting</h2>
        <p className="text-base leading-relaxed mb-4">
          Sorting is the process of arranging elements in a specific order (ascending or descending).
          It's one of the most fundamental operations in computer science.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Common Sorting Algorithms</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Bubble Sort</h3>
            <p className="mb-2">Time: O(n²) | Space: O(1)</p>
            <p className="text-sm text-muted-foreground">
              Repeatedly steps through the list, compares adjacent elements and swaps them if they're in wrong order.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Selection Sort</h3>
            <p className="mb-2">Time: O(n²) | Space: O(1)</p>
            <p className="text-sm text-muted-foreground">
              Finds the minimum element and places it at the beginning. Repeats for remaining elements.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Merge Sort</h3>
            <p className="mb-2">Time: O(n log n) | Space: O(n)</p>
            <p className="text-sm text-muted-foreground">
              Divide and conquer algorithm that divides array into halves, sorts them, and merges back.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Quick Sort</h3>
            <p className="mb-2">Time: O(n log n) average | Space: O(log n)</p>
            <p className="text-sm text-muted-foreground">
              Picks a pivot element and partitions array around it. Recursively sorts sub-arrays.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Example: Bubble Sort Implementation</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">{`function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}

const numbers = [64, 34, 25, 12, 22];
console.log(bubbleSort(numbers)); // [12, 22, 25, 34, 64]`}</code>
        </pre>
      </section>
    </div>
  );
};

export const sortingTechniquesMeta = {
  id: 'sorting-techniques',
  title: 'Sorting Techniques',
  difficulty: 'intermediate',
  points: 20,
  estimatedTime: '30 min'
};
