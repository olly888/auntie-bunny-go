-- 阶段二：数据库架构调整（修正版）
-- 1. 在profiles表新增入驻状态字段
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_status TEXT 
  CHECK (onboarding_status IN ('registered', 'activated'))
  DEFAULT 'registered',
ADD COLUMN IF NOT EXISTS is_id_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_training_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS age INTEGER;

-- 创建复合索引提升查询性能
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
  ON public.profiles(onboarding_status, is_id_verified, is_training_completed);

-- 2. 创建自动激活触发器
CREATE OR REPLACE FUNCTION public.auto_activate_provider()
RETURNS TRIGGER AS $$
BEGIN
  -- 当两个条件都满足时，自动激活
  IF NEW.is_id_verified = true 
     AND NEW.is_training_completed = true 
     AND NEW.onboarding_status = 'registered' THEN
    NEW.onboarding_status := 'activated';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_auto_activate ON public.profiles;
CREATE TRIGGER trigger_auto_activate
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.auto_activate_provider();

-- 3. 添加RLS策略允许新用户注册时创建profile
DROP POLICY IF EXISTS "Users can insert own profile on signup" ON public.profiles;
CREATE POLICY "Users can insert own profile on signup"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- 4. 创建运营数据看板视图
CREATE OR REPLACE VIEW public.onboarding_funnel AS
SELECT
  COUNT(*) FILTER (WHERE onboarding_status = 'registered') as registered_count,
  COUNT(*) FILTER (WHERE is_id_verified = true) as id_verified_count,
  COUNT(*) FILTER (WHERE is_training_completed = true) as training_completed_count,
  COUNT(*) FILTER (WHERE onboarding_status = 'activated') as activated_count,
  ROUND(
    COUNT(*) FILTER (WHERE onboarding_status = 'activated')::numeric / 
    NULLIF(COUNT(*) FILTER (WHERE onboarding_status = 'registered'), 0) * 100,
    2
  ) as activation_rate_percent
FROM public.profiles;