export const ArraysProblems = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Array Practice Problems</h1>
      
      <div className="space-y-4">
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">1. Two Sum</h3>
            <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm">Easy</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Given an array of integers and a target sum, find two numbers that add up to the target.
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-mono">Input: nums = [2,7,11,15], target = 9</p>
            <p className="text-sm font-mono">Output: [0,1]</p>
            <p className="text-sm text-muted-foreground mt-2">Explanation: nums[0] + nums[1] = 2 + 7 = 9</p>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">2. Maximum Subarray</h3>
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">Medium</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Find the contiguous subarray with the largest sum (Kadane's Algorithm).
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-mono">Input: [-2,1,-3,4,-1,2,1,-5,4]</p>
            <p className="text-sm font-mono">Output: 6</p>
            <p className="text-sm text-muted-foreground mt-2">Explanation: [4,-1,2,1] has the largest sum = 6</p>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">3. Rotate Array</h3>
            <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm">Easy</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Rotate an array to the right by k steps.
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-mono">Input: nums = [1,2,3,4,5,6,7], k = 3</p>
            <p className="text-sm font-mono">Output: [5,6,7,1,2,3,4]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const arraysProblemsMetaList = [
  { id: 'two-sum', title: 'Two Sum', difficulty: 'easy', points: 10 },
  { id: 'maximum-subarray', title: 'Maximum Subarray', difficulty: 'medium', points: 15 },
  { id: 'rotate-array', title: 'Rotate Array', difficulty: 'easy', points: 10 },
];
