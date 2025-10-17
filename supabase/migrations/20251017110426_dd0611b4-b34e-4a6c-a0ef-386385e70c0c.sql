-- 为 profiles 表添加学历和技能证书字段
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS education text,
ADD COLUMN IF NOT EXISTS skill_cert_url text,
ADD COLUMN IF NOT EXISTS skill_cert_type text;

-- 添加注释
COMMENT ON COLUMN public.profiles.education IS '学历：如小学、初中、高中、大专、本科等';
COMMENT ON COLUMN public.profiles.skill_cert_url IS '职业技能证书图片URL';
COMMENT ON COLUMN public.profiles.skill_cert_type IS '职业技能证书类型：如家政师资格证、育婴师证等';