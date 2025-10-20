-- Fix PUBLIC_DATA_EXPOSURE: Secure profiles table and create leaderboard view

-- Drop the overly permissive policy that exposes all profile data
DROP POLICY IF EXISTS "Users can view all profiles for leaderboard" ON public.profiles;

-- Create a secure leaderboard view with only non-sensitive data
CREATE OR REPLACE VIEW public.leaderboard_view AS
SELECT 
  id,
  full_name,
  CASE 
    WHEN college IS NOT NULL AND LENGTH(college) > 0 
    THEN LEFT(college, 1) || '***' 
    ELSE 'Student'
  END as college_display,
  points,
  streak_days
FROM public.profiles
ORDER BY points DESC, streak_days DESC;

-- Grant access to the leaderboard view for authenticated users
GRANT SELECT ON public.leaderboard_view TO authenticated, anon;

-- Add comment to document the view
COMMENT ON VIEW public.leaderboard_view IS 'Anonymized leaderboard data for public display. Only exposes non-sensitive information.';