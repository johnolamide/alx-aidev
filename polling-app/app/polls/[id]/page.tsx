import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPollById } from "@/lib/actions/get-polls";
import { submitVote } from "@/lib/actions/vote";
import { Vote } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Clock,
  Users,
  CheckCircle2,
  BarChart3,
  Circle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PublicPollDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicPollDetailPage({ params }: PublicPollDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  try {
    const poll = await getPollById(id);

    // Check if poll exists and is public
    if (!poll || !poll.is_public) {
      notFound();
    }

    const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date();
    const totalVotes = poll.total_votes;
    const hasVoted = !!poll.userVote;
    const userSelectedOptionId = poll.userVote?.option_id;

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
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Polls
                  </Button>
                </Link>
                {user ? (
                  <>
                    <Link href="/polls/create">
                      <Button variant="ghost" size="sm">
                        Create Poll
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
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm">Sign up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Poll Header */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {poll.creator?.email ? poll.creator.email.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {poll.creator?.email || 'Anonymous User'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(poll.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    <CardTitle className="text-2xl mb-2">{poll.title}</CardTitle>
                    {poll.description && (
                      <CardDescription className="text-base">
                        {poll.description}
                      </CardDescription>
                    )}

                    <div className="flex items-center space-x-4 mt-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                        </span>
                      </div>

                      {poll.expires_at && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {isExpired ? 'Expired' : `Expires ${formatDistanceToNow(new Date(poll.expires_at), { addSuffix: true })}`}
                          </span>
                        </div>
                      )}

                      {!poll.is_public && (
                        <Badge variant="secondary">Private</Badge>
                      )}

                      {poll.allow_multiple_votes && (
                        <Badge variant="outline">Multiple votes allowed</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Poll Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Vote Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {poll.poll_options?.map((option) => {
                  const percentage = totalVotes > 0 ? Math.round((option.vote_count / totalVotes) * 100) : 0;
                  const isUserSelection = hasVoted && userSelectedOptionId === option.id;

                  return (
                    <div key={option.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${isUserSelection ? 'text-primary' : ''}`}>
                            {option.option_text}
                          </span>
                          {isUserSelection && (
                            <Badge variant="secondary" className="text-xs">
                              Your vote
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {option.vote_count} {option.vote_count === 1 ? 'vote' : 'votes'}
                          </span>
                          <span className="text-sm font-medium">
                            {percentage}%
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isUserSelection ? 'bg-primary' : 'bg-primary/60'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {(!poll.poll_options || poll.poll_options.length === 0) && (
                  <p className="text-center text-muted-foreground py-8">
                    No options available for this poll.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Voting Section */}
            {user && !isExpired && (
              <Card className="mt-8">
                {hasVoted ? (
                  <>
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-600">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Thank You for Voting!
                      </CardTitle>
                      <CardDescription>
                        Your vote has been recorded. You can see the current results above.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">
                          Want to change your vote? Contact the poll creator.
                        </p>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <>
                    <CardHeader>
                      <CardTitle>Cast Your Vote</CardTitle>
                      <CardDescription>
                        Select an option below to vote on this poll.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form action={submitVote} className="space-y-3">
                        <input type="hidden" name="pollId" value={poll.id} />
                        {poll.poll_options?.map((option) => (
                          <Button
                            key={option.id}
                            type="submit"
                            name="optionId"
                            value={option.id}
                            variant="outline"
                            className="w-full justify-start h-auto p-4"
                          >
                            <div className="flex items-center space-x-3">
                              <Circle className="h-4 w-4" />
                              <span>{option.option_text}</span>
                            </div>
                          </Button>
                        ))}
                      </form>
                    </CardContent>
                  </>
                )}
              </Card>
            )}

            {/* Message for unauthenticated users */}
            {!user && !isExpired && (
              <Card className="mt-8">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Want to Vote?</h3>
                    <p className="text-muted-foreground mb-4">
                      Sign in to cast your vote on this poll.
                    </p>
                    <div className="flex justify-center space-x-2">
                      <Link href="/login">
                        <Button>Log in</Button>
                      </Link>
                      <Link href="/register">
                        <Button variant="outline">Sign up</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Expired poll message */}
            {isExpired && (
              <Card className="mt-8">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Poll Expired</h3>
                    <p className="text-muted-foreground">
                      This poll has expired and is no longer accepting votes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching poll:', error);
    notFound();
  }
}
