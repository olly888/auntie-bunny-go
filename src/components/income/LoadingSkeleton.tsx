import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 页面标题 */}
        <div className="text-center">
          <Skeleton className="h-8 w-32 mx-auto" />
        </div>

        {/* 时间筛选器 */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 flex-1" />
        </div>

        {/* 核心数据看板 */}
        <div className="bg-gradient-primary rounded-2xl p-6 text-center">
          <Skeleton className="h-4 w-24 mx-auto mb-2 bg-white/20" />
          <Skeleton className="h-12 w-32 mx-auto mb-4 bg-white/20" />
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-12 mx-auto mb-1 bg-white/20" />
                <Skeleton className="h-3 w-16 mx-auto bg-white/20" />
              </div>
            ))}
          </div>
        </div>

        {/* 图表 */}
        <Card className="p-6">
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-64 w-full" />
        </Card>

        {/* 业绩概览 */}
        <div>
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4 text-center">
                <Skeleton className="h-8 w-16 mx-auto mb-1" />
                <Skeleton className="h-4 w-12 mx-auto" />
              </Card>
            ))}
          </div>
        </div>

        {/* 功能入口列表 */}
        <div>
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-5 w-5" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 提现按钮 */}
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}