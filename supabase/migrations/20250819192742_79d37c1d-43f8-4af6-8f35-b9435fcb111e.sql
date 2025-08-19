-- Security Fix 1: Update is_admin_from_auth to only trust app_metadata
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND au.raw_app_meta_data->>'role' = 'admin'
)
$function$;

-- Security Fix 2: Tighten RLS policies for exercises table
-- Drop the overly permissive policy that allows anyone to modify system exercises
DROP POLICY IF EXISTS "users_manage_own_exercises" ON public.exercises;

-- Create more secure policies
CREATE POLICY "public_can_read_exercises" ON public.exercises
FOR SELECT USING (true);

CREATE POLICY "users_can_insert_own_exercises" ON public.exercises
FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "users_can_update_own_exercises" ON public.exercises
FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "users_can_delete_own_exercises" ON public.exercises
FOR DELETE USING (created_by = auth.uid());

-- Security Fix 3: Tighten RLS policies for food_items table
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "users_manage_own_food_items" ON public.food_items;

-- Create more secure policies
CREATE POLICY "public_can_read_food_items" ON public.food_items
FOR SELECT USING (true);

CREATE POLICY "users_can_insert_own_food_items" ON public.food_items
FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "users_can_update_own_food_items" ON public.food_items
FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "users_can_delete_own_food_items" ON public.food_items
FOR DELETE USING (created_by = auth.uid());

-- Security Fix 4: Prevent self-elevation via profiles.role
-- Create trigger to prevent users from changing their own role
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow role changes only if the current user is an admin
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    IF NOT public.is_admin_from_auth() THEN
      RAISE EXCEPTION 'Access denied: Only administrators can change user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS prevent_role_escalation_trigger ON public.profiles;
CREATE TRIGGER prevent_role_escalation_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- Security Fix 5: Ensure profile creation trigger exists
-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();