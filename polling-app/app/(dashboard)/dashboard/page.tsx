import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart3,
  Vote,
  Users,
  TrendingUp,
  Plus,
  Eye,
  Calendar,
  Activity,
  Clock,
  CheckCircle2,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getUserPolls } from "@/lib/actions/get-polls";
import { createClient } from "@/lib/supabase/server";
import { deletePoll } from "@/lib/actions/create-poll";

interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">You must be logged in to view the dashboard.</p>
          <Link href="/login">
            <Button>Log in</Button>
          </Link>
        </div>
      </div>
    );
  }

  const polls = await getUserPolls();

  // Calculate statistics from real data
  const totalPolls = polls.length;
  const totalVotes = polls.reduce((sum, poll) => sum + poll.total_votes, 0);
  const activePolls = polls.filter(poll =>
    !poll.expires_at || new Date(poll.expires_at) > new Date()
  ).length;
  const totalParticipants = polls.reduce((sum, poll) => {
    // Estimate participants (this is approximate since we don't track unique voters)
    return sum + Math.min(poll.total_votes, poll.poll_options?.length || 0);
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your polls.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPolls}</div>
            <p className="text-xs text-muted-foreground">
              Polls you've created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes}</div>
            <p className="text-xs text-muted-foreground">
              Votes across all polls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              Estimated participants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePolls}</div>
            <p className="text-xs text-muted-foreground">
              {totalPolls - activePolls} completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Polls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Polls</CardTitle>
                <CardDescription>Your latest poll activity</CardDescription>
              </div>
              <Link href="/polls/create">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Poll
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {polls.length === 0 ? (
              <div className="text-center py-8">
                <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No polls yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first poll to get started!
                </p>
                <Link href="/polls/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Poll
                  </Button>
                </Link>
              </div>
            ) : (
              polls.slice(0, 5).map((poll, index) => {
                const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date();
                const status = isExpired ? "expired" : "active";

                return (
                  <div key={poll.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          href={`/polls/${poll.id}`}
                          className="font-medium hover:text-primary cursor-pointer line-clamp-1"
                        >
                          {poll.title}
                        </Link>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Vote className="h-3 w-3 mr-1" />
                            {poll.total_votes} votes
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {poll.poll_options?.length || 0} options
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(poll.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={status === "active" ? "default" : "secondary"}
                        >
                          {status === "active" ? "Active" : "Expired"}
                        </Badge>
                        {!poll.is_public && (
                          <Badge variant="outline">Private</Badge>
                        )}
                        <div className="flex items-center space-x-1">
                          <Link href={`/polls/${poll.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <form action={deletePoll.bind(null, poll.id)} method="post" className="inline">
                            <Button
                              variant="ghost"
                              size="sm"
                              type="submit"
                              title="Delete poll"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                      </div>
                    </div>
                    {index < polls.slice(0, 5).length - 1 && <Separator className="mt-4" />}
                  </div>
                );
              })
            )}
            {polls.length > 5 && (
              <div className="pt-2">
                <Link href="/polls">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Polls
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity - Placeholder for now */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest votes and poll updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Activity Tracking</h3>
              <p className="text-muted-foreground">
                Activity tracking will be available soon.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/polls/create">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center space-x-4 p-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Create Poll</h3>
                    <p className="text-sm text-muted-foreground">
                      Start a new poll
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/polls">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center space-x-4 p-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Vote className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Browse Polls</h3>
                    <p className="text-sm text-muted-foreground">
                      See all active polls
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/analytics">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center space-x-4 p-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">View Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Check poll performance
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
