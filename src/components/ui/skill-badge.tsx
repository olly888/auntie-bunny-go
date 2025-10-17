import { Badge } from "@/components/ui/badge";
import { Crown, Star, TrendingUp, Award, Users } from "lucide-react";

interface SkillBadgeProps {
  skillLevel?: string;
  badgeType?: string | null;
  className?: string;
}

const skillLevelConfig = {
  junior: {
    label: "初级管家",
    icon: Star,
    variant: "secondary" as const,
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
  },
  mid: {
    label: "中级管家",
    icon: TrendingUp,
    variant: "secondary" as const,
    className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
  },
  senior: {
    label: "高级管家",
    icon: Award,
    variant: "secondary" as const,
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
  },
  expert: {
    label: "高级管家",
    icon: Award,
    variant: "secondary" as const,
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
  }
};

const specialBadgeConfig = {
  founder: {
    label: "创始管家",
    icon: Crown,
    variant: "default" as const,
    className: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30"
  },
  partner: {
    label: "社区合伙人",
    icon: Users,
    variant: "default" as const,
    className: "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-700 dark:text-pink-400 border-pink-500/30"
  }
};

export function SkillBadge({ skillLevel = "junior", badgeType, className }: SkillBadgeProps) {
  // 特殊身份优先显示
  if (badgeType && specialBadgeConfig[badgeType as keyof typeof specialBadgeConfig]) {
    const config = specialBadgeConfig[badgeType as keyof typeof specialBadgeConfig];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className={`${config.className} ${className || ""}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  }

  // 普通等级徽章
  const config = skillLevelConfig[skillLevel as keyof typeof skillLevelConfig] || skillLevelConfig.junior;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`${config.className} ${className || ""}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}
