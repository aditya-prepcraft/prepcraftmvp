import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StreakDisplay } from "@/components/StreakDisplay";
import { ProgressRing } from "@/components/ProgressRing";
import { ArrowRight, BookOpen, Target, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { subjects } from "@/subjects";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      updateLastActive();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, progressRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user?.id).single(),
        supabase.from('progress').select('*').eq('user_id', user?.id),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (progressRes.data) setProgress(progressRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLastActive = async () => {
    try {
      // Update streak using the database function
      await supabase.rpc('update_user_streak', { user_id_param: user?.id });
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const totalProgress = progress.length > 0
    ? progress.reduce((acc, p) => acc + (p.percent || 0), 0) / progress.length
    : 0;

  if (loading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'Learner'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Keep up the momentum. You're doing great!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <StreakDisplay days={profile?.streak_days || 0} />
        
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/20 p-4">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">{profile?.points || 0}</div>
              <div className="text-sm text-muted-foreground">total points</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <ProgressRing progress={totalProgress} size={80} strokeWidth={6} />
            <div>
              <div className="text-lg font-semibold">Overall Progress</div>
              <div className="text-sm text-muted-foreground">
                {progress.length} subjects started
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning */}
      {profile?.last_visited && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Continue Learning
            </CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to={profile.last_visited}>
                Resume Learning <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Subject Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Your Progress
          </CardTitle>
          <CardDescription>Track your learning across subjects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjects.map((subject) => {
            const subjectProgress = progress.find(p => p.subject_id === subject.slug);
            const percent = subjectProgress?.percent || 0;
            
            return (
              <Link
                key={subject.slug}
                to={`/learn/${subject.slug}`}
                className="block"
              >
                <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="flex-1">
                    <h3 className="font-semibold">{subject.title}</h3>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-sm font-medium">{Math.round(percent)}%</div>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
