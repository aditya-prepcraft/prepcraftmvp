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
  Trophy,
  ChevronDown
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
import type { Chapter, SubChapter } from "@/subjects";

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
  const [selectedSubChapter, setSelectedSubChapter] = useState<SubChapter | null>(null);

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
    try {
      // Update streak using the database function
      await supabase.rpc('update_user_streak', { user_id_param: user?.id });
      
      // Update last visited page
      await supabase
        .from('profiles')
        .update({ last_visited: `/learn/${subjectSlug}` })
        .eq('id', user?.id);
    } catch (error) {
      console.error('Error updating last visited:', error);
    }
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
      // Update streak
      await supabase.rpc('update_user_streak', { user_id_param: user.id });

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

      toast.success(`+${points} points! Streak updated!`);
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
              {subject.notesStructured && subject.notesStructured.length > 0 ? (
                subject.notesStructured.map((chapter) => (
                  <Collapsible key={chapter.id}>
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                      <span className="text-sm font-semibold">{chapter.title}</span>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-3 space-y-1 mt-1">
                      {chapter.subChapters.map((subChapter) => (
                        <button
                          key={subChapter.id}
                          onClick={() => setSelectedSubChapter(subChapter)}
                          className={`w-full text-left p-2 rounded-lg transition-colors ${
                            selectedSubChapter?.id === subChapter.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{subChapter.title}</span>
                            {isCompleted(subChapter.id) && (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            )}
                          </div>
                        </button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No notes available
                </p>
              )}
            </TabsContent>

            <TabsContent value="practice" className="space-y-2 mt-0">
              {subject.practiceProblemsStructured && subject.practiceProblemsStructured.length > 0 ? (
                subject.practiceProblemsStructured.map((chapter) => (
                  <Collapsible key={chapter.id}>
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                      <span className="text-sm font-semibold">{chapter.title}</span>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-3 space-y-1 mt-1">
                      {chapter.subChapters.map((subChapter) => (
                        <button
                          key={subChapter.id}
                          onClick={() => setSelectedSubChapter(subChapter)}
                          className={`w-full text-left p-2 rounded-lg transition-colors ${
                            selectedSubChapter?.id === subChapter.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{subChapter.title}</span>
                            {isCompleted(subChapter.id) && (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            )}
                          </div>
                        </button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No practice problems available
                </p>
              )}
            </TabsContent>

            <TabsContent value="quiz" className="space-y-2 mt-0">
              {subject.quizzesStructured && subject.quizzesStructured.length > 0 ? (
                subject.quizzesStructured.map((chapter) => (
                  <Collapsible key={chapter.id}>
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                      <span className="text-sm font-semibold">{chapter.title}</span>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-3 space-y-1 mt-1">
                      {chapter.subChapters.map((subChapter) => (
                        <button
                          key={subChapter.id}
                          onClick={() => setSelectedSubChapter(subChapter)}
                          className={`w-full text-left p-2 rounded-lg transition-colors ${
                            selectedSubChapter?.id === subChapter.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{subChapter.title}</span>
                            {isCompleted(subChapter.id) && (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            )}
                          </div>
                        </button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))
              ) : (
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
              {selectedSubChapter ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">{selectedSubChapter.title}</h2>
                    <Badge variant="outline">ID: {selectedSubChapter.id}</Badge>
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="bg-muted/50 rounded-lg p-8 text-center">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                      <p className="text-muted-foreground">
                        This content is currently under development. Check back soon!
                      </p>
                    </div>
                  </div>

                  {!isCompleted(selectedSubChapter.id) && (
                    <div className="mt-8 pt-6 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Trophy className="h-4 w-4" />
                        <span>{selectedSubChapter.points} points</span>
                      </div>
                      <Button onClick={() => handleComplete(selectedSubChapter.id, selectedSubChapter.points)}>
                        Mark Complete
                      </Button>
                    </div>
                  )}
                  {isCompleted(selectedSubChapter.id) && (
                    <div className="mt-8 pt-6 border-t">
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Completed</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a topic from the sidebar to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
