import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  ArrowLeft,
  Menu,
  X,
  FileText,
  Code,
  HelpCircle,
  CheckCircle2,
  Trophy
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { getSubjectBySlug } from "@/subjects";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

export default function Learn() {
  const { subject: subjectSlug } = useParams<{ subject: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [selectedNote, setSelectedNote] = useState(0);
  const [selectedProblem, setSelectedProblem] = useState(0);
  const [selectedQuiz, setSelectedQuiz] = useState(0);
  const [activeTab, setActiveTab] = useState('notes');
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const subject = getSubjectBySlug(subjectSlug || '');

  useEffect(() => {
    if (subjectSlug && user) {
      fetchProgress();
      updateLastVisited();
    }
  }, [subjectSlug, user]);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const fetchProgress = async () => {
    try {
      const { data } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user?.id)
        .eq('subject_id', subjectSlug)
        .maybeSingle();

      if (data) {
        setProgress(data);
      } else {
        // Initialize progress
        const { data: newProgress } = await supabase
          .from('progress')
          .insert({
            user_id: user?.id,
            subject_id: subjectSlug,
            completed_lessons: [],
            percent: 0,
          })
          .select()
          .single();
        setProgress(newProgress);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLastVisited = async () => {
    await supabase
      .from('profiles')
      .update({ last_visited: `/learn/${subjectSlug}` })
      .eq('id', user?.id);
  };

  const handleComplete = async (itemId: string, points: number) => {
    if (!progress || !user) return;

    const completedLessons = progress.completed_lessons || [];
    if (completedLessons.includes(itemId)) {
      toast.info("Already completed");
      return;
    }

    const totalItems = 
      (subject?.notes.length || 0) + 
      (subject?.practiceProblems.reduce((acc, p) => acc + p.meta.items.length, 0) || 0) + 
      (subject?.quizzes.length || 0);

    const newCompleted = [...completedLessons, itemId];
    const newPercent = (newCompleted.length / totalItems) * 100;

    try {
      await supabase
        .from('progress')
        .update({
          completed_lessons: newCompleted,
          percent: newPercent,
          points_earned: (progress.points_earned || 0) + points,
        })
        .eq('user_id', user.id)
        .eq('subject_id', subjectSlug);

      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single();

      await supabase
        .from('profiles')
        .update({
          points: (currentProfile?.points || 0) + points
        })
        .eq('id', user.id);

      toast.success(`+${points} points!`);
      fetchProgress();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to update progress");
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!subject) {
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

  const NoteComponent = subject.notes[selectedNote]?.component;
  const noteMeta = subject.notes[selectedNote]?.meta;
  
  const ProblemComponent = subject.practiceProblems[selectedProblem]?.component;
  const problemMeta = subject.practiceProblems[selectedProblem]?.meta;
  
  const QuizComponent = subject.quizzes[selectedQuiz]?.component;
  const quizMeta = subject.quizzes[selectedQuiz]?.meta;

  const isCompleted = (id: string) => progress?.completed_lessons?.includes(id);

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 border-r bg-card flex-shrink-0 overflow-hidden`}
      >
        <div className="h-full overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg">Contents</h2>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="notes" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="practice" className="text-xs">
                <Code className="h-3 w-3 mr-1" />
                Practice
              </TabsTrigger>
              <TabsTrigger value="quiz" className="text-xs">
                <HelpCircle className="h-3 w-3 mr-1" />
                Quiz
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-2 mt-0">
              {subject.notes.map((note, index) => (
                <button
                  key={note.meta.id}
                  onClick={() => setSelectedNote(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedNote === index
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{note.meta.title}</span>
                    {isCompleted(note.meta.id) && (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    )}
                  </div>
                </button>
              ))}
              {subject.notes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No notes available
                </p>
              )}
            </TabsContent>

            <TabsContent value="practice" className="space-y-2 mt-0">
              {subject.practiceProblems.map((problem, index) => (
                <button
                  key={problem.meta.id}
                  onClick={() => setSelectedProblem(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedProblem === index
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className="text-sm font-medium">{problem.meta.title}</span>
                </button>
              ))}
              {subject.practiceProblems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No practice problems available
                </p>
              )}
            </TabsContent>

            <TabsContent value="quiz" className="space-y-2 mt-0">
              {subject.quizzes.map((quiz, index) => (
                <button
                  key={quiz.meta.id}
                  onClick={() => setSelectedQuiz(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedQuiz === index
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{quiz.meta.title}</span>
                    {isCompleted(quiz.meta.id) && (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    )}
                  </div>
                </button>
              ))}
              {subject.quizzes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No quizzes available
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            {!sidebarOpen && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" onClick={() => navigate('/explore')} size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{subject.title}</h1>
              <p className="text-sm text-muted-foreground">{subject.description}</p>
            </div>
          </div>

          {/* Content Area */}
          <Card>
            <CardContent className="p-6">
              {activeTab === 'notes' && NoteComponent && (
                <div>
                  <NoteComponent />
                  {noteMeta && !isCompleted(noteMeta.id) && (
                    <div className="mt-8 pt-6 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Trophy className="h-4 w-4" />
                        <span>{noteMeta.points} points</span>
                        <Badge variant="secondary">{noteMeta.difficulty}</Badge>
                      </div>
                      <Button onClick={() => handleComplete(noteMeta.id, noteMeta.points)}>
                        Mark Complete
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'practice' && ProblemComponent && (
                <div>
                  <ProblemComponent />
                </div>
              )}

              {activeTab === 'quiz' && QuizComponent && (
                <div>
                  <QuizComponent />
                  {quizMeta && !isCompleted(quizMeta.id) && (
                    <div className="mt-8 pt-6 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Trophy className="h-4 w-4" />
                        <span>{quizMeta.points} points</span>
                      </div>
                      <Button onClick={() => handleComplete(quizMeta.id, quizMeta.points)}>
                        Complete Quiz
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notes' && subject.notes.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notes available yet</p>
                </div>
              )}

              {activeTab === 'practice' && subject.practiceProblems.length === 0 && (
                <div className="text-center py-12">
                  <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No practice problems available yet</p>
                </div>
              )}

              {activeTab === 'quiz' && subject.quizzes.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No quizzes available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
