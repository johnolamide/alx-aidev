import { CreatePollForm } from "@/components/polls/create-poll-form";
import { Vote } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PublicCreatePollPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Vote className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">PollApp</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/polls">
                <Button variant="ghost" size="sm">
                  Browse Polls
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                Welcome, {user.email}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <CreatePollForm />
    </div>
  );
}
