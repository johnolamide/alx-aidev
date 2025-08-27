"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DetailedStatsCards } from "@/components/dashboard/stats-cards";
import {
  BarChart3,
  TrendingUp,
  Users,
  Vote,
  Calendar,
  Clock,
  Eye,
  Target,
  ArrowUp,
  ArrowDown,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow, format, subDays } from "date-fns";

// Mock analytics data
const mockAnalyticsData = {
  stats: {
    totalPolls: 24,
    activePolls: 18,
    totalVotes: 342,
    totalParticipants: 156,
    pollsThisMonth: 8,
    votesToday: 23,
    averageVotesPerPoll: 14.3,
    completionRate: 78,
  },
  trends: {
    pollsGrowth: { value: 25, period: "vs last month", type: "increase" as const },
    votesGrowth: { value: 12, period: "vs last week", type: "increase" as const },
    participantsGrowth: { value: 8, period: "vs last month", type: "increase" as const },
    engagementGrowth: { value: 3, period: "vs last week", type: "decrease" as const },
  },
  topPolls: [
    {
      id: "poll_1",
      title: "What's your favorite programming language?",
      votes: 45,
      participants: 38,
      engagement: 84,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "active",
    },
    {
      id: "poll_2",
      title: "Best time for team meetings?",
      votes: 32,
      participants: 28,
      engagement: 87,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: "active",
    },
    {
      id: "poll_3",
      title: "Office lunch preferences",
      votes: 28,
      participants: 25,
      engagement: 89,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: "expired",
    },
  ],
  recentActivity: [
    {
      type: "poll_created",
      title: "New poll: What's the best JavaScript framework?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: "You",
    },
    {
      type: "high_engagement",
      title: "Programming language poll reached 40+ votes",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      user: "System",
    },
    {
      type: "poll_expired",
      title: "Office lunch preferences poll has ended",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      user: "System",
    },
  ],
  votingTrends: Array.from({ length: 7 }, (_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'MMM dd'),
    votes: Math.floor(Math.random() * 50) + 10,
    polls: Math.floor(Math.random() * 5) + 1,
  })),
  audienceInsights: {
    topParticipants: [
      { name: "Sarah Johnson", votes: 12, polls: 8, engagement: 95 },
      { name: "Mike Chen", votes: 10, polls: 6, engagement: 88 },
      { name: "Emma Davis", votes: 9, polls: 7, engagement: 82 },
    ],
    engagementByTime: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      engagement: Math.floor(Math.random() * 100),
    })),
  },
};

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const exportData = () => {
    const data = {
      timeframe,
      stats: mockAnalyticsData.stats,
      trends: mockAnalyticsData.trends,
      exported_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${timeframe}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your polling performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <DetailedStatsCards stats={mockAnalyticsData.stats} />

      {/* Charts and Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Voting Trends Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Voting Trends
            </CardTitle>
            <CardDescription>
              Daily voting activity over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Simple line chart representation */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {mockAnalyticsData.votingTrends.map((data, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-full bg-primary/20 rounded-sm relative"
                      style={{ height: "80px" }}
                    >
                      <div
                        className="bg-primary rounded-sm absolute bottom-0 w-full transition-all"
                        style={{
                          height: `${(data.votes / Math.max(...mockAnalyticsData.votingTrends.map(d => d.votes))) * 100}%`,
                        }}
                        title={`${data.date}: ${data.votes} votes, ${data.polls} polls`}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-2 text-center">
                      {data.date}
                    </span>
                    <span className="text-xs font-medium">
                      {data.votes}
                    </span>
                  </div>
                ))}
              </div>

              {/* Trend indicators */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-sm" />
                    <span>Votes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary/50 rounded-sm" />
                    <span>Polls</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <ArrowUp className="h-3 w-3" />
                  <span>+12% vs last period</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Polls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Top Performing
            </CardTitle>
            <CardDescription>
              Your most successful polls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalyticsData.topPolls.map((poll, index) => (
                <div key={poll.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2 mb-1">
                        {poll.title}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Vote className="h-3 w-3 mr-1" />
                          {poll.votes}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {poll.participants}
                        </span>
                        <span>{poll.engagement}% engagement</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(poll.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant={poll.status === "active" ? "default" : "secondary"}>
                        #{index + 1}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {poll.status}
                      </Badge>
                    </div>
                  </div>
                  {index < mockAnalyticsData.topPolls.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audience Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Participants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Top Participants
            </CardTitle>
            <CardDescription>
              Most active users in your polls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalyticsData.audienceInsights.topParticipants.map((participant, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                      <span className="text-sm font-medium">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{participant.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {participant.votes} votes • {participant.polls} polls
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{participant.engagement}%</p>
                    <p className="text-xs text-muted-foreground">engagement</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest events and milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full flex-shrink-0">
                    {activity.type === "poll_created" && <Vote className="h-4 w-4" />}
                    {activity.type === "high_engagement" && <TrendingUp className="h-4 w-4" />}
                    {activity.type === "poll_expired" && <Clock className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">
                      {activity.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {activity.user}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Engagement Heatmap
          </CardTitle>
          <CardDescription>
            When your audience is most active throughout the day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-24 gap-1">
              {mockAnalyticsData.audienceInsights.engagementByTime.map((data, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-sm"
                  style={{
                    backgroundColor: `hsl(var(--primary) / ${data.engagement / 100})`,
                  }}
                  title={`${data.hour}:00 - ${data.engagement}% engagement`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>11 PM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Low activity</span>
              <div className="flex items-center space-x-1">
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor: `hsl(var(--primary) / ${opacity})`,
                    }}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">High activity</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Insights</CardTitle>
          <CardDescription>
            Key performance indicators and growth trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Poll Creation</span>
                <div className="flex items-center space-x-1 text-green-600">
                  <ArrowUp className="h-3 w-3" />
                  <span className="text-xs">+{mockAnalyticsData.trends.pollsGrowth.value}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold">{mockAnalyticsData.stats.pollsThisMonth}</p>
              <p className="text-xs text-muted-foreground">
                polls this month
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Vote Volume</span>
                <div className="flex items-center space-x-1 text-green-600">
                  <ArrowUp className="h-3 w-3" />
                  <span className="text-xs">+{mockAnalyticsData.trends.votesGrowth.value}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold">{mockAnalyticsData.stats.votesToday}</p>
              <p className="text-xs text-muted-foreground">
                votes today
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Audience Growth</span>
                <div className="flex items-center space-x-1 text-green-600">
                  <ArrowUp className="h-3 w-3" />
                  <span className="text-xs">+{mockAnalyticsData.trends.participantsGrowth.value}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold">{mockAnalyticsData.stats.totalParticipants}</p>
              <p className="text-xs text-muted-foreground">
                unique participants
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Engagement</span>
                <div className="flex items-center space-x-1 text-red-600">
                  <ArrowDown className="h-3 w-3" />
                  <span className="text-xs">-{mockAnalyticsData.trends.engagementGrowth.value}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold">{mockAnalyticsData.stats.completionRate}%</p>
              <p className="text-xs text-muted-foreground">
                completion rate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
