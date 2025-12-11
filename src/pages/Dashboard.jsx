import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { IssueCard } from '@/components/issues/IssueCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, FileText, MapPin } from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserIssues();
    }
  }, [user]);

  const fetchUserIssues = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('issue_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setIssues(data);
    }
    setLoading(false);
  };

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  const statusCounts = {
    OPEN: issues.filter((i) => i.status === 'OPEN').length,
    IN_PROGRESS: issues.filter((i) => i.status === 'IN_PROGRESS').length,
    RESOLVED: issues.filter((i) => i.status === 'RESOLVED').length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">My Reports</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your issue reports
          </p>
        </div>
        <Button variant="civic" onClick={() => navigate('/report')}>
          <Plus className="mr-2 h-4 w-4" />
          Report New Issue
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card-civic p-4 text-center">
          <div className="text-2xl font-bold text-status-open">{statusCounts.OPEN}</div>
          <div className="text-sm text-muted-foreground">Open</div>
        </div>
        <div className="card-civic p-4 text-center">
          <div className="text-2xl font-bold text-status-in-progress">{statusCounts.IN_PROGRESS}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
        <div className="card-civic p-4 text-center">
          <div className="text-2xl font-bold text-status-resolved">{statusCounts.RESOLVED}</div>
          <div className="text-sm text-muted-foreground">Resolved</div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-xl font-semibold mb-2">No reports yet</h2>
          <p className="text-muted-foreground mb-6">
            Start by reporting an issue in your community
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="civic" onClick={() => navigate('/report')}>
              <Plus className="mr-2 h-4 w-4" />
              Report Issue
            </Button>
            <Button variant="outline" onClick={() => navigate('/map')}>
              <MapPin className="mr-2 h-4 w-4" />
              View Map
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onClick={() => navigate(`/issue/${issue.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}