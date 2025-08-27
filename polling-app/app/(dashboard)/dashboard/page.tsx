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
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// Mock data - Replace with real data from API
const mockStats = {
  totalPolls: 12,
  totalVotes: 89,
  totalParticipants: 45,
  activePolls: 8,
};

const mockRecentPolls = [
  {
    id: "poll_1",
    title: "What's your favorite programming language?",
    votes: 23,
    participants: 15,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "active",
    isPublic: true,
  },
  {
    id: "poll_2",
    title: "Best time for team meetings?",
    votes: 18,
    participants: 12,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: "active",
    isPublic: false,
  },
  {
    id: "poll_3",
    title: "Office lunch preferences",
    votes: 31,
    participants: 20,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: "expired",
    isPublic: true,
  },
];

const mockRecentActivity = [
  {
    id: "activity_1",
    type: "vote",
    user: { name: "Sarah Johnson", avatar: "" },
    poll: { title: "What's your favorite programming language?" },
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "activity_2",
    type: "poll_created",
    user: { name: "John Doe", avatar: "" },
    poll: { title: "Best time for team meetings?" },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "activity_3",
    type: "vote",
    user: { name: "Mike Chen", avatar: "" },
    poll: { title: "Office lunch preferences" },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
];

export default function DashboardPage() {
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
            <div className="text-2xl font-bold">{mockStats.totalPolls}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalVotes}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              +5 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activePolls}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.totalPolls - mockStats.activePolls} completed
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
                <CardTitle>Recent Polls</CardTitle>
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
            {mockRecentPolls.map((poll, index) => (
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
                        {poll.votes} votes
                      </span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {poll.participants} participants
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(poll.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={poll.status === "active" ? "default" : "secondary"}
                    >
                      {poll.status === "active" ? "Active" : "Expired"}
                    </Badge>
                    {!poll.isPublic && (
                      <Badge variant="outline">Private</Badge>
                    )}
                  </div>
                </div>
                {index < mockRecentPolls.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
            <div className="pt-2">
              <Link href="/polls">
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View All Polls
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest votes and poll updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecentActivity.map((activity, index) => (
              <div key={activity.id}>
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback>
                      {activity.user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {activity.type === "vote" ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      ) : (
                        <Plus className="h-3 w-3 text-blue-600" />
                      )}
                      <span className="text-sm font-medium">
                        {activity.user.name}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.type === "vote" ? "voted on" : "created"}{" "}
                      <span className="font-medium">{activity.poll.title}</span>
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                </div>
                {index < mockRecentActivity.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
            <div className="pt-2">
              <Link href="/dashboard/activity">
                <Button variant="outline" size="sm" className="w-full">
                  <Activity className="h-4 w-4 mr-2" />
                  View All Activity
                </Button>
              </Link>
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
