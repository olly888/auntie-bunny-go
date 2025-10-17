-- 扩展 profiles 表，添加个人信息字段
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS id_card_number TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('男', '女')),
ADD COLUMN IF NOT EXISTS emergency_contact TEXT,
ADD COLUMN IF NOT EXISTS emergency_phone TEXT,
ADD COLUMN IF NOT EXISTS employment_type TEXT CHECK (employment_type IN ('全职', '兼职')) DEFAULT '兼职',
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS employee_id TEXT;

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_profiles_id_card ON public.profiles(id_card_number);
CREATE INDEX IF NOT EXISTS idx_profiles_employee_id ON public.profiles(employee_id);

-- 创建 provider_certifications 表，存储服务人员认证信息
CREATE TABLE IF NOT EXISTS public.provider_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 身份证信息
  id_card_front_url TEXT,
  id_card_back_url TEXT,
  id_verified BOOLEAN DEFAULT false,
  id_verified_at TIMESTAMPTZ,
  
  -- 健康证信息
  health_cert_url TEXT,
  health_cert_expiry DATE,
  health_verified BOOLEAN DEFAULT false,
  
  -- 其他资质
  professional_cert_url TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(provider_id)
);

-- 启用RLS
ALTER TABLE public.provider_certifications ENABLE ROW LEVEL SECURITY;

-- RLS策略：用户只能查看和修改自己的认证信息
CREATE POLICY "Users can view own certifications"
  ON public.provider_certifications FOR SELECT
  USING (auth.uid() = provider_id);

CREATE POLICY "Users can update own certifications"
  ON public.provider_certifications FOR UPDATE
  USING (auth.uid() = provider_id);

CREATE POLICY "Users can insert own certifications"
  ON public.provider_certifications FOR INSERT
  WITH CHECK (auth.uid() = provider_id);

-- 创建 offline_logs 表，记录下线原因
CREATE TABLE IF NOT EXISTS public.offline_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  offline_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  online_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 启用RLS
ALTER TABLE public.offline_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own offline logs"
  ON public.offline_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own offline logs"
  ON public.offline_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own offline logs"
  ON public.offline_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- 创建更新 updated_at 的触发器函数（如果不存在）
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 provider_certifications 表添加触发器
DROP TRIGGER IF EXISTS update_provider_certifications_updated_at ON public.provider_certifications;
CREATE TRIGGER update_provider_certifications_updated_at
  BEFORE UPDATE ON public.provider_certifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();