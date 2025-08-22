import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Star, Filter, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Reviews = () => {
  const navigate = useNavigate();
  
  const [filterType, setFilterType] = useState("all");
  
  const overallStats = {
    averageRating: 4.9,
    totalReviews: 248,
    fiveStars: 198,
    fourStars: 35,
    threeStars: 12,
    twoStars: 2,
    oneStar: 1
  };
  
  const reviews = [
    {
      id: 1,
      customerName: "张女士",
      rating: 5,
      comment: "李阿姨服务非常专业，清洁得很仔细，厨房油污都处理得很干净，态度也很好，下次还会预约她的服务。",
      serviceDate: "2024-01-15",
      serviceType: "厨房深清"
    },
    {
      id: 2,
      customerName: "王先生", 
      rating: 5,
      comment: "准时到达，工作认真负责，清洁效果很满意，推荐！",
      serviceDate: "2024-01-12",
      serviceType: "全屋清洁"
    },
    {
      id: 3,
      customerName: "刘阿姨",
      rating: 4,
      comment: "整体服务不错，就是有个别地方可能清理得不够仔细。",
      serviceDate: "2024-01-10",
      serviceType: "日常保洁"
    },
    {
      id: 4,
      customerName: "李女士",
      rating: 5,
      comment: "很专业的阿姨，对老人很有耐心，照顾得很周到。",
      serviceDate: "2024-01-08",
      serviceType: "老人护理"
    }
  ];
  
  const filteredReviews = filterType === "all" 
    ? reviews 
    : reviews.filter(review => 
        filterType === "positive" ? review.rating >= 4 : review.rating <= 3
      );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card shadow-card p-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">我的评价</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Overall Rating */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              整体评价
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">{overallStats.averageRating}</div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(overallStats.averageRating))}
              </div>
              <p className="text-sm text-muted-foreground">基于 {overallStats.totalReviews} 条评价</p>
            </div>
            
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = {
                  5: overallStats.fiveStars,
                  4: overallStats.fourStars,
                  3: overallStats.threeStars,
                  2: overallStats.twoStars,
                  1: overallStats.oneStar
                }[stars] || 0;
                const percentage = (count / overallStats.totalReviews) * 100;
                
                return (
                  <div key={stars} className="flex items-center gap-2 text-sm">
                    <span className="w-8">{stars}星</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部评价</SelectItem>
                  <SelectItem value="positive">好评 (4-5星)</SelectItem>
                  <SelectItem value="negative">差评 (1-3星)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">暂无符合条件的评价</p>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {review.customerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{review.customerName}</span>
                          <Badge variant="secondary" className="text-xs">
                            {review.serviceType}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.serviceDate}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(review.rating)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;