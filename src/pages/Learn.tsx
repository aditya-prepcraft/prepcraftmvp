import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  FileText, 
  Code, 
  HelpCircle,
  ArrowLeft,
  Trophy
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgressRing } from "@/components/ProgressRing";

const lessonTypeIcons = {
  video: PlayCircle,
  article: FileText,
  quiz: HelpCircle,
  coding: Code,
};

export default function Learn() {
  const { subject } = useParams<{ subject: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subjectData, setSubjectData] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subject && user) {
      fetchData();
      updateLastVisited();
    }
  }, [subject, user]);

  const fetchData = async () => {
    try {
      const [subjectRes, lessonsRes, progressRes] = await Promise.all([
        supabase.from('subjects').select('*').eq('slug', subject).single(),
        supabase.from('lessons').select('*').eq('subject_id', 
          (await supabase.from('subjects').select('id').eq('slug', subject).single()).data?.id
        ).order('order_index'),
        supabase.from('progress').select('*').eq('user_id', user?.id).eq('subject_id',
          (await supabase.from('subjects').select('id').eq('slug', subject).single()).data?.id
        ).maybeSingle(),
      ]);

      if (subjectRes.data) setSubjectData(subjectRes.data);
      if (lessonsRes.data) setLessons(lessonsRes.data);
      if (progressRes.data) {
        setProgress(progressRes.data);
      } else {
        // Initialize progress if it doesn't exist
        await initializeProgress(subjectRes.data?.id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Failed to load subject data");
    } finally {
      setLoading(false);
    }
  };

  const updateLastVisited = async () => {
    await supabase
      .from('profiles')
      .update({ last_visited: `/learn/${subject}` })
      .eq('id', user?.id);
  };

  const initializeProgress = async (subjectId: string) => {
    const { data } = await supabase
      .from('progress')
      .insert({
        user_id: user?.id,
        subject_id: subjectId,
        completed_lessons: [],
        percent: 0,
      })
      .select()
      .single();

    if (data) setProgress(data);
  };

  const handleLessonComplete = async (lessonId: string, points: number) => {
    if (!progress || !user) return;

    const completedLessons = progress.completed_lessons || [];
    if (completedLessons.includes(lessonId)) {
      toast.info("Lesson already completed");
      return;
    }

    const newCompleted = [...completedLessons, lessonId];
    const newPercent = (newCompleted.length / lessons.length) * 100;

    try {
      const { error: progressError } = await supabase
        .from('progress')
        .update({
          completed_lessons: newCompleted,
          percent: newPercent,
          points_earned: (progress.points_earned || 0) + points,
        })
        .eq('user_id', user.id)
        .eq('subject_id', subjectData.id);

      if (progressError) throw progressError;

      // Fetch current points and update
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single();

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          points: (currentProfile?.points || 0) + points
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast.success(`+${points} points! Lesson completed!`);
      fetchData();
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast.error("Failed to update progress");
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!subjectData) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Subject not found</h2>
        <Button onClick={() => navigate('/explore')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Explore
        </Button>
      </div>
    );
  }

  const completedCount = progress?.completed_lessons?.length || 0;
  const totalLessons = lessons.length;
  const progressPercent = progress?.percent || 0;

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => navigate('/explore')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Explore
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{subjectData.title}</h1>
        <p className="text-muted-foreground">{subjectData.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Lessons List */}
        <div className="md:col-span-2 space-y-4">
          {lessons.map((lesson, index) => {
            const Icon = lessonTypeIcons[lesson.type as keyof typeof lessonTypeIcons] || FileText;
            const isCompleted = progress?.completed_lessons?.includes(lesson.id);

            return (
              <Card key={lesson.id} className={isCompleted ? "border-success/50 bg-success/5" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`rounded-lg p-2 ${isCompleted ? 'bg-success/20' : 'bg-primary/10'}`}>
                          <Icon className={`h-5 w-5 ${isCompleted ? 'text-success' : 'text-primary'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{lesson.title}</CardTitle>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {lesson.type}
                            </Badge>
                            {lesson.difficulty && (
                              <Badge variant="secondary" className="text-xs">
                                {lesson.difficulty}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <CardDescription>{lesson.content}</CardDescription>
                    </div>
                    <div className="ml-4">
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-success" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Trophy className="h-4 w-4" />
                      <span>{lesson.points} points</span>
                    </div>
                    {!isCompleted && (
                      <Button onClick={() => handleLessonComplete(lesson.id, lesson.points)}>
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {lessons.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No lessons available yet</h3>
                <p className="text-muted-foreground">Check back soon for new content!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Progress Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ProgressRing progress={progressPercent} className="mb-4" />
              <p className="text-center text-sm text-muted-foreground">
                {completedCount} of {totalLessons} lessons completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Points Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {progress?.points_earned || 0}
                </div>
                <p className="text-sm text-muted-foreground">points from this subject</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
