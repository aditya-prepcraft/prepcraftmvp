import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StreakDisplayProps {
  days: number;
}

export function StreakDisplay({ days }: StreakDisplayProps) {
  return (
    <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/10 to-transparent">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="rounded-full bg-accent/20 p-4">
          <Flame className="h-8 w-8 text-accent" />
        </div>
        <div>
          <div className="text-3xl font-bold text-accent">{days}</div>
          <div className="text-sm text-muted-foreground">day streak</div>
        </div>
      </CardContent>
    </Card>
  );
}
