import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPollById } from "@/lib/actions/get-polls";
import { updatePoll } from "@/lib/actions/create-poll";
import { CreatePollForm } from "@/components/polls/create-poll-form";
import { Vote } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EditPollPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPollPage({ params }: EditPollPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  try {
    const poll = await getPollById(id);

    // Check if poll exists and user owns it
    if (!poll || poll.created_by !== user.id) {
      notFound();
    }

    // Convert poll data to form format
    const formData = {
      title: poll.title,
      description: poll.description || "",
      options: poll.poll_options?.map(opt => opt.option_text) || [],
      isPublic: poll.is_public,
      allowMultipleVotes: poll.allow_multiple_votes,
      expirationDays: poll.expires_at
        ? Math.ceil((new Date(poll.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : "never"
    };

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
                <Link href={`/polls/${poll.id}`}>
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Poll
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

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Edit Poll</h1>
              <p className="text-muted-foreground">
                Make changes to your poll. Changes will be reflected immediately.
              </p>
            </div>

            <CreatePollForm
              initialData={formData}
              pollId={poll.id}
              onSubmit={updatePoll}
              submitButtonText="Update Poll"
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching poll for edit:', error);
    notFound();
  }
}
