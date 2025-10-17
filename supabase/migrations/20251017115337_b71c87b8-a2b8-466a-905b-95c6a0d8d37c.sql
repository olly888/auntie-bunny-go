-- 添加协议签署相关字段到profiles表
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS agreement_signed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS agreement_version TEXT DEFAULT 'v1.0',
  ADD COLUMN IF NOT EXISTS agreement_ip TEXT;

-- 创建申诉工单表
CREATE TABLE IF NOT EXISTS appeal_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id),
  appeal_type TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending/processing/completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  result TEXT,
  notes TEXT
);

-- 启用RLS
ALTER TABLE appeal_tickets ENABLE ROW LEVEL SECURITY;

-- 用户可以查看自己的申诉
CREATE POLICY "Users can view own appeals"
ON appeal_tickets FOR SELECT
USING (auth.uid() = user_id);

-- 用户可以创建自己的申诉
CREATE POLICY "Users can create own appeals"
ON appeal_tickets FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 管理员可以查看所有申诉
CREATE POLICY "Admins can view all appeals"
ON appeal_tickets FOR SELECT
USING (get_current_user_role() IN ('admin', 'manager'));

-- 管理员可以更新申诉状态
CREATE POLICY "Admins can update appeals"
ON appeal_tickets FOR UPDATE
USING (get_current_user_role() IN ('admin', 'manager'));

-- 创建更新触发器
CREATE TRIGGER update_appeal_tickets_updated_at
  BEFORE UPDATE ON appeal_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();