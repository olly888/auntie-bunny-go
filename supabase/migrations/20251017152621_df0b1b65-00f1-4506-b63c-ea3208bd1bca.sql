-- 添加 badge_type 字段到 profiles 表
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS badge_type TEXT CHECK (badge_type IN ('founder', 'partner'));

-- 添加注释
COMMENT ON COLUMN public.profiles.badge_type IS '特殊身份徽章：founder=创始管家, partner=社区合伙人';

-- 为现有用户设置默认值（可选）
-- UPDATE public.profiles SET badge_type = NULL WHERE badge_type IS NULL;