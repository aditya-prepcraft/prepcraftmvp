-- Create function to update user streak
CREATE OR REPLACE FUNCTION public.update_user_streak(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  last_active_date DATE;
  current_date_val DATE;
  current_streak INTEGER;
BEGIN
  -- Get current values
  SELECT 
    DATE(last_active),
    streak_days
  INTO 
    last_active_date,
    current_streak
  FROM profiles
  WHERE id = user_id_param;
  
  current_date_val := CURRENT_DATE;
  
  -- If last_active is NULL (first activity), start streak at 1
  IF last_active_date IS NULL THEN
    UPDATE profiles
    SET 
      streak_days = 1,
      last_active = NOW()
    WHERE id = user_id_param;
    RETURN;
  END IF;
  
  -- If user was active today already, just update timestamp
  IF last_active_date = current_date_val THEN
    UPDATE profiles
    SET last_active = NOW()
    WHERE id = user_id_param;
    RETURN;
  END IF;
  
  -- If user was active yesterday, increment streak
  IF last_active_date = current_date_val - INTERVAL '1 day' THEN
    UPDATE profiles
    SET 
      streak_days = COALESCE(streak_days, 0) + 1,
      last_active = NOW()
    WHERE id = user_id_param;
    RETURN;
  END IF;
  
  -- If more than 1 day gap, reset streak to 1
  IF last_active_date < current_date_val - INTERVAL '1 day' THEN
    UPDATE profiles
    SET 
      streak_days = 1,
      last_active = NOW()
    WHERE id = user_id_param;
    RETURN;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.update_user_streak TO authenticated;