import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Code2, Rocket, BookOpen, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: { [key: string]: any } = {
  Brain,
  Code2,
  Rocket,
  BookOpen,
};

export default function Explore() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const subjectsRes = await supabase
        .from('subjects')
        .select('*')
        .order('order_index');

      if (subjectsRes.data) setSubjects(subjectsRes.data);

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
          const Icon = iconMap[subject.icon] || BookOpen;
          const subjectProgress = progress.find(p => p.subject_id === subject.id);
          const percent = subjectProgress?.percent || 0;
          const hasStarted = percent > 0;

          return (
            <Card 
              key={subject.id} 
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

      {subjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Subjects Available</h2>
          <p className="text-muted-foreground">Check back soon for new learning content!</p>
        </div>
      )}
    </div>
  );
}
