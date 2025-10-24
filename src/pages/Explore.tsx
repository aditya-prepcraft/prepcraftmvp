import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { subjects } from "@/subjects";

export default function Explore() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      updateStreak();
    }
    fetchProgress();
  }, [user]);

  const updateStreak = async () => {
    try {
      await supabase.rpc('update_user_streak', { user_id_param: user?.id });
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const fetchProgress = async () => {
    try {
      if (user) {
        const progressRes = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', user.id);

        if (progressRes.data) setProgress(progressRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Subjects</h1>
        <p className="text-muted-foreground">
          Choose your learning path and start mastering placement prep
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {subjects.map((subject) => {
          const Icon = subject.icon;
          const subjectProgress = progress.find(p => p.subject_id === subject.slug);
          const percent = subjectProgress?.percent || 0;
          const hasStarted = percent > 0;

          return (
            <Card 
              key={subject.slug} 
              className="group overflow-hidden transition-all hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{subject.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {subject.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasStarted && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round(percent)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )}
                <Button asChild className="w-full">
                  <Link to={`/learn/${subject.slug}`}>
                    {hasStarted ? 'Continue' : 'Start Learning'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
