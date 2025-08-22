import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bell, CheckCheck, Trash2, Package, GraduationCap, Settings, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  type: "system" | "order" | "training";
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  important?: boolean;
}

const Notifications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "order",
      title: "新订单提醒",
      content: "您有一个新的清洁服务订单，预约时间：今天下午2:00",
      time: "10分钟前",
      isRead: false,
      important: true
    },
    {
      id: "2",
      type: "system",
      title: "系统维护通知",
      content: "系统将于今晚23:00-01:00进行维护升级",
      time: "2小时前",
      isRead: false
    },
    {
      id: "3",
      type: "training",
      title: "培训提醒",
      content: "您的「母婴护理基础」课程还有2天结束，请及时完成",
      time: "1天前",
      isRead: true
    },
    {
      id: "4",
      type: "order",
      title: "订单完成",
      content: "您的订单已完成，客户给出了5星好评",
      time: "2天前",
      isRead: true
    },
    {
      id: "5",
      type: "system",
      title: "收入到账",
      content: "您有一笔125元的服务费已到账",
      time: "3天前",
      isRead: true
    }
  ]);

  const [activeTab, setActiveTab] = useState("all");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-4 w-4" />;
      case "training":
        return <GraduationCap className="h-4 w-4" />;
      case "system":
        return <Settings className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "order":
        return "text-primary";
      case "training":
        return "text-warning";
      case "system":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  const getFilteredNotifications = () => {
    if (activeTab === "all") return notifications;
    return notifications.filter(n => n.type === activeTab);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast({
      title: "已标记",
      description: "所有消息已标记为已读",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast({
      title: "已删除",
      description: "消息已删除",
    });
  };

  const clearAll = () => {
    setNotifications([]);
    toast({
      title: "已清空",
      description: "所有消息已清空",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card shadow-card p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate("/profile")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">消息通知</h1>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="h-4 w-4" />
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>清空所有消息</AlertDialogTitle>
                    <AlertDialogDescription>
                      此操作将删除所有消息记录，无法恢复。确定要继续吗？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAll}>
                      确定清空
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="system">系统</TabsTrigger>
              <TabsTrigger value="order">订单</TabsTrigger>
              <TabsTrigger value="training">培训</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="all" className="mt-0">
            <NotificationList 
              notifications={getFilteredNotifications()} 
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          </TabsContent>
          <TabsContent value="system" className="mt-0">
            <NotificationList 
              notifications={getFilteredNotifications()} 
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          </TabsContent>
          <TabsContent value="order" className="mt-0">
            <NotificationList 
              notifications={getFilteredNotifications()} 
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          </TabsContent>
          <TabsContent value="training" className="mt-0">
            <NotificationList 
              notifications={getFilteredNotifications()} 
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          </TabsContent>
        </Tabs>

        {getFilteredNotifications().length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">暂无消息</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationList = ({ notifications, onMarkAsRead, onDelete }: NotificationListProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-4 w-4" />;
      case "training":
        return <GraduationCap className="h-4 w-4" />;
      case "system":
        return <Settings className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "order":
        return "text-primary";
      case "training":
        return "text-warning";
      case "system":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-3">
      {notifications.map((notification, index) => (
        <div key={notification.id}>
          <Card 
            className={`cursor-pointer transition-colors ${
              !notification.isRead ? 'bg-accent/30' : ''
            }`}
            onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`mt-1 ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm truncate">
                        {notification.title}
                      </h3>
                      {notification.important && (
                        <Badge variant="destructive" className="text-2xs px-1.5 py-0.5">
                          重要
                        </Badge>
                      )}
                      {!notification.isRead && (
                        <Circle className="h-2 w-2 fill-primary text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {notification.content}
                    </p>
                    <p className="text-2xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notification.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
          {index < notifications.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
};

export default Notifications;