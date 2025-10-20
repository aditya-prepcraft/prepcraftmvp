import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const onboardingSchema = z.object({
  phone: z.string()
    .trim()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (e.g., +919876543210)")
    .max(20, "Phone number too long"),
  college: z.string()
    .trim()
    .min(2, "College name must be at least 2 characters")
    .max(200, "College name must be less than 200 characters"),
  course: z.enum(['btech', 'bca', 'mca', 'mtech', 'bsc', 'msc'], {
    errorMap: () => ({ message: "Please select a valid course" })
  }),
  year: z.number()
    .int("Year must be a whole number")
    .min(1, "Year must be between 1 and 5")
    .max(5, "Year must be between 1 and 5"),
  primaryGoal: z.enum(['product', 'service', 'startup', 'higheredu', 'skills'], {
    errorMap: () => ({ message: "Please select a valid goal" })
  }),
});

export default function Onboarding() {
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Validate input
      const result = onboardingSchema.safeParse({
        phone,
        college,
        course,
        year: parseInt(year),
        primaryGoal,
      });

      if (!result.success) {
        toast.error(result.error.errors[0].message);
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          phone: result.data.phone,
          college: result.data.college,
          course: result.data.course,
          year: result.data.year,
          primary_goal: result.data.primaryGoal,
          profile_complete: true,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Profile completed! Welcome to PrepCraft!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Complete Your Profile</CardTitle>
          <CardDescription>Help us personalize your learning experience</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="college">College/University</Label>
                <Input
                  id="college"
                  type="text"
                  placeholder="Your college name"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select value={course} onValueChange={setCourse} required>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select your course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="btech">B.Tech</SelectItem>
                    <SelectItem value="bca">BCA</SelectItem>
                    <SelectItem value="mca">MCA</SelectItem>
                    <SelectItem value="mtech">M.Tech</SelectItem>
                    <SelectItem value="bsc">B.Sc (CS)</SelectItem>
                    <SelectItem value="msc">M.Sc (CS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Current Year</Label>
                <Select value={year} onValueChange={setYear} required>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                    <SelectItem value="5">5th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Primary Goal</Label>
              <Select value={primaryGoal} onValueChange={setPrimaryGoal} required>
                <SelectTrigger id="goal">
                  <SelectValue placeholder="What's your main goal?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product-based Companies</SelectItem>
                  <SelectItem value="service">Service-based Companies</SelectItem>
                  <SelectItem value="startup">Startups</SelectItem>
                  <SelectItem value="higheredu">Higher Education</SelectItem>
                  <SelectItem value="skills">Skill Development</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}