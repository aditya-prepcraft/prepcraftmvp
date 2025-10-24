import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, School, Target, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      updateStreak();
    }
  }, [user]);

  const updateStreak = async () => {
    try {
      await supabase.rpc('update_user_streak', { user_id_param: user?.id });
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (data) setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-32 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  return (
    <div className="container py-8 max-w-4xl">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{profile?.full_name}</h1>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {profile?.email}
                </span>
                {profile?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {profile?.phone}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">{profile?.points || 0}</div>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5 text-primary" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">College</p>
              <p className="font-semibold">{profile?.college || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Course</p>
              <p className="font-semibold">{profile?.course?.toUpperCase() || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year</p>
              <p className="font-semibold">{profile?.year ? `${profile.year} Year` : 'Not specified'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Goals & Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Primary Goal</p>
              <Badge variant="secondary" className="mt-1">
                {profile?.primary_goal || 'Not set'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold text-accent">{profile?.streak_days || 0} days 🔥</p>
            </div>
            {profile?.last_active && (
              <div>
                <p className="text-sm text-muted-foreground">Last Active</p>
                <p className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4" />
                  {new Date(profile.last_active).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
