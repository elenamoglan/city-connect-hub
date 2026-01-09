import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationItem({ notification, onMarkAsRead, onClose }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    if (notification.issue_id) {
      navigate(`/issue/${notification.issue_id}`);
      onClose();
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case "status_change":
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case "new_issue":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex gap-3 p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors",
        !notification.is_read && "bg-primary/5"
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm", !notification.is_read && "font-medium")}>
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.created_at), {
            addSuffix: true,
          })}
        </p>
      </div>
      {!notification.is_read && (
        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
      )}
    </div>
  );
}
