import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { MapPin, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IssueCardProps {
  issue: {
    id: string;
    title: string;
    description: string;
    image_url?: string | null;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
    latitude: number;
    longitude: number;
    created_at?: string;
    profiles?: {
      name: string;
    };
  };
  onClick?: () => void;
}

export function IssueCard({ issue, onClick }: IssueCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] group"
      onClick={onClick}
    >
      {issue.image_url && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={issue.image_url}
            alt={issue.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {issue.title}
          </h3>
          <StatusBadge status={issue.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {issue.description}
        </p>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
          </span>
          {issue.created_at && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
            </span>
          )}
          {issue.profiles?.name && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {issue.profiles.name}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
