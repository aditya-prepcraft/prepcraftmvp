-- Step 1: Drop the constraint completely first
ALTER TABLE lessons DROP CONSTRAINT IF EXISTS lessons_type_check;

-- Step 2: Update any 'article' type to 'notes'
UPDATE lessons SET type = 'notes' WHERE type = 'article';

-- Step 3: Add new constraint allowing the correct types
ALTER TABLE lessons ADD CONSTRAINT lessons_type_check 
CHECK (type IN ('video', 'notes', 'quiz', 'coding'));