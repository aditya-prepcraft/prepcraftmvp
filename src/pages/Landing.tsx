import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, Code2, Rocket, BookOpen, Trophy, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">PrepCraft</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
          Master Your <span className="text-primary">Placement Prep</span>
          <br />
          One Lesson at a Time
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
          Personalized learning paths, gamified progress tracking, and comprehensive resources 
          to ace your placement interviews.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/signup">Start Learning Free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/explore">Explore Subjects</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Why PrepCraft?</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Brain,
              title: "Aptitude & Reasoning",
              description: "Master quantitative and logical reasoning"
            },
            {
              icon: Code2,
              title: "DSA Mastery",
              description: "Practice coding problems and algorithms"
            },
            {
              icon: Rocket,
              title: "Development",
              description: "Build real-world projects"
            },
            {
              icon: BookOpen,
              title: "CS Fundamentals",
              description: "Strengthen core CS concepts"
            }
          ].map((feature, i) => (
            <div key={i} className="rounded-lg border bg-card p-6 text-center transition-shadow hover:shadow-lg">
              <feature.icon className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gamification Preview */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container mx-auto px-6 text-center">
          <Trophy className="mx-auto mb-6 h-16 w-16 text-accent" />
          <h2 className="mb-4 text-3xl font-bold">Stay Motivated with Gamification</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Track your daily streaks, earn points, and compete on the leaderboard. 
            Every lesson completed gets you closer to your placement goals.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="mb-6 text-4xl font-bold">Ready to Begin Your Journey?</h2>
        <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
          Join thousands of students already preparing for their dream placements
        </p>
        <Button size="lg" asChild>
          <Link to="/signup">Create Free Account</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2025 PrepCraft. Built to help you succeed.</p>
        </div>
      </footer>
    </div>
  );
}
