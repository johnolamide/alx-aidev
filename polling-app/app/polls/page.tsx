import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PollCard } from "@/components/polls/poll-card";
import {
  Search,
  Filter,
  Plus,
  Vote,
  TrendingUp,
  Clock,
  Users,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { getPublicPolls } from "@/lib/actions/get-polls";
import { createClient } from "@/lib/supabase/server";

interface PublicPollsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PublicPollsPage({ searchParams }: PublicPollsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const polls = await getPublicPolls();
  const showSuccess = params?.success === 'true';

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
              {user ? (
                // Authenticated user navigation
                <>
                  <Link href="/polls/create">
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
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
                // Unauthenticated user navigation
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
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Poll created successfully!</h3>
              <p className="text-sm text-green-700 mt-1">
                Your poll has been published and is now available for voting.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between space-y-2 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Public Polls</h1>
            <p className="text-muted-foreground mt-2">
              Discover and vote on polls created by the community
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/polls/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Poll
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search polls..." className="pl-8" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Polls</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most-voted">Most Voted</SelectItem>
              <SelectItem value="least-voted">Least Voted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{polls.length}</div>
              <p className="text-xs text-muted-foreground">
                Available to vote on
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {polls.reduce((total, poll) => total + (poll.total_votes || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Community engagement
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {polls.filter(poll => !poll.expires_at || new Date(poll.expires_at) > new Date()).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently accepting votes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Votes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {polls.length > 0
                  ? Math.round(polls.reduce((total, poll) => total + (poll.total_votes || 0), 0) / polls.length)
                  : 0
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Per poll
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Polls Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {polls.length === 0 ? (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <CardContent>
                  <Vote className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No public polls yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to create a poll and share it with the community.
                  </p>
                  <Link href="/polls/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create the First Poll
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ) : (
            polls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                currentUserId={user?.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
