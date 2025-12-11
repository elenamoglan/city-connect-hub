import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { IssueMap as Map } from '@/components/map/IssueMap';
import { IssueCard } from '@/components/issues/IssueCard';
import { StatusBadge } from '@/components/issues/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, List, MapIcon, X } from 'lucide-react';

export default function IssueMapPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('map');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);

  const fetchIssues = async () => {
    const { data, error } = await supabase
      .from('issue_reports')
      .select(`
        *,
        profiles (name)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setIssues(data);
    }
    setLoading(false);
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const mapCenter = issues.length > 0
    ? [
        issues.reduce((sum, i) => sum + i.latitude, 0) / issues.length,
        issues.reduce((sum, i) => sum + i.longitude, 0) / issues.length,
      ]
    : [40.7128, -74.006];

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-[600px] rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Filters Bar */}
      <div className="border-b border-border bg-background px-4 py-3">
        <div className="container mx-auto flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''}
            </span>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                  viewMode === 'map'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <MapIcon className="h-4 w-4" />
                Map
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <List className="h-4 w-4" />
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading issues...</p>
            </div>
          </div>
        ) : viewMode === 'map' ? (
          <div className="h-full relative">
            <Map
              issues={filteredIssues}
              center={mapCenter}
              zoom={12}
              className="h-full"
              onIssueClick={(issue) => setSelectedIssue(issue)}
            />
            
            {/* Selected Issue Panel */}
            {selectedIssue && (
              <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-card rounded-lg shadow-lg border border-border animate-slide-up">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold line-clamp-1">{selectedIssue.title}</h3>
                    <button
                      onClick={() => setSelectedIssue(null)}
                      className="p-1 hover:bg-muted rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <StatusBadge status={selectedIssue.status} className="mb-2" />
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {selectedIssue.description}
                  </p>
                  <Button
                    variant="civic"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/issue/${selectedIssue.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-4">
            <div className="container mx-auto">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No issues found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onClick={() => navigate(`/issue/${issue.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}