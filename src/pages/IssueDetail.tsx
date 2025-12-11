import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/issues/StatusBadge';
import { IssueMap } from '@/components/map/IssueMap';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, Clock, User, Trash2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

interface Issue {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string | null;
  status: IssueStatus;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    email: string;
  };
}

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && id) {
      fetchIssue();
    }
  }, [user, id]);

  const fetchIssue = async () => {
    const { data, error } = await supabase
      .from('issue_reports')
      .select(`
        *,
        profiles (name, email)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      toast.error('Failed to load issue');
      navigate('/dashboard');
      return;
    }

    if (!data) {
      toast.error('Issue not found');
      navigate('/dashboard');
      return;
    }

    setIssue(data as Issue);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!issue) return;
    
    setDeleting(true);
    
    const { error } = await supabase
      .from('issue_reports')
      .delete()
      .eq('id', issue.id);

    if (error) {
      toast.error('Failed to delete issue');
      setDeleting(false);
      return;
    }

    toast.success('Issue deleted successfully');
    navigate('/dashboard');
  };

  const isOwner = user && issue && user.id === issue.user_id;

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-64 mb-6" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!issue) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={issue.status} />
            </div>
            <h1 className="font-serif text-3xl font-bold">{issue.title}</h1>
          </div>
          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this report?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    issue report.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Image */}
        {issue.image_url && (
          <Card className="overflow-hidden">
            <img
              src={issue.image_url}
              alt={issue.title}
              className="w-full max-h-96 object-cover"
            />
          </Card>
        )}

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {issue.description}
              </p>
              
              <div className="mt-6 pt-4 border-t border-border space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Reported by {issue.profiles?.name || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(issue.created_at), 'PPP')} ({formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <IssueMap
                issues={[issue]}
                center={[issue.latitude, issue.longitude]}
                zoom={15}
                className="h-64 rounded-lg"
                interactive={false}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
