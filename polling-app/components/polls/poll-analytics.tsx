"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Vote,
  Calendar,
  Clock,
  Download,
  Share2,
  Eye,
  Target,
  Activity,
  UserCheck,
  Globe,
  Lock,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Poll, Vote as VoteType } from "@/lib/types";

interface PollAnalyticsProps {
  poll: Poll;
  className?: string;
}

interface AnalyticsMetric {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
    period: string;
  };
  icon: React.ComponentType<any>;
  description?: string;
}

interface VotingPattern {
  hour: number;
  votes: number;
  label: string;
}

interface DemographicData {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export function PollAnalytics({ poll, className }: PollAnalyticsProps) {
  const [timeFrame, setTimeFrame] = useState<"24h" | "7d" | "30d" | "all">("7d");
  const [viewType, setViewType] = useState<"overview" | "detailed" | "export">("overview");

  // Calculate analytics data
  const totalVotes = poll.votes?.length || 0;
  const uniqueVoters = new Set(poll.votes?.map(vote => vote.user_id) || []).size;
  const isActive = !poll.expires_at || new Date(poll.expires_at) > new Date();
  const createdDaysAgo = Math.floor(
    (Date.now() - new Date(poll.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Get vote distribution
  const voteDistribution = (poll.poll_options || []).map(option => {
    const votes = (poll.votes || []).filter(vote => vote.option_id === option.id);
    return {
      option: option.option_text,
      votes: votes.length,
      percentage: totalVotes > 0 ? Math.round((votes.length / totalVotes) * 100) : 0,
      voters: votes.map(vote => ({ name: 'Anonymous', avatar: undefined })), // Simplified for now
    };
  }).sort((a: any, b: any) => b.votes - a.votes);

  // Get voting timeline
  const votingTimeline = (poll.votes || [])
    .map(vote => ({
      ...vote,
      hour: new Date(vote.created_at).getHours(),
      day: format(new Date(vote.created_at), 'yyyy-MM-dd'),
    }))
    .reduce((acc, vote) => {
      const key = vote.hour;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

  const hourlyData: VotingPattern[] = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    votes: votingTimeline[hour] || 0,
    label: `${hour.toString().padStart(2, '0')}:00`,
  }));

  // Calculate engagement metrics
  const peakVotingHour = hourlyData.reduce((peak, current) =>
    current.votes > peak.votes ? current : peak
  );

  const averageVotesPerDay = createdDaysAgo > 0 ? Math.round(totalVotes / createdDaysAgo) : totalVotes;

  // Get recent voters
  const recentVoters = (poll.votes || [])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  const metrics: AnalyticsMetric[] = [
    {
      label: "Total Votes",
      value: totalVotes,
      change: {
        value: 12,
        type: "increase",
        period: "vs last week",
      },
      icon: Vote,
      description: "Total number of votes received",
    },
    {
      label: "Unique Voters",
      value: uniqueVoters,
      change: {
        value: 8,
        type: "increase",
        period: "vs last week",
      },
      icon: Users,
      description: "Number of unique participants",
    },
    {
      label: "Engagement Rate",
      value: `${totalVotes > 0 ? Math.round((uniqueVoters / totalVotes) * 100) : 0}%`,
      change: {
        value: 3,
        type: totalVotes > uniqueVoters ? "increase" : "neutral",
        period: "vs last week",
      },
      icon: Target,
      description: "Percentage of unique voters",
    },
    {
      label: "Daily Average",
      value: averageVotesPerDay,
      change: {
        value: 5,
        type: "increase",
        period: "vs last period",
      },
      icon: TrendingUp,
      description: "Average votes per day",
    },
    {
      label: "Views",
      value: "1.2k",
      change: {
        value: 15,
        type: "increase",
        period: "vs last week",
      },
      icon: Eye,
      description: "Poll page views",
    },
    {
      label: "Conversion Rate",
      value: "65%",
      change: {
        value: 2,
        type: "decrease",
        period: "vs last week",
      },
      icon: UserCheck,
      description: "Views to votes conversion",
    },
  ];

  const renderChangeIcon = (type: "increase" | "decrease" | "neutral") => {
    switch (type) {
      case "increase":
        return <ArrowUp className="h-3 w-3 text-green-600" />;
      case "decrease":
        return <ArrowDown className="h-3 w-3 text-red-600" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const renderChangeColor = (type: "increase" | "decrease" | "neutral") => {
    switch (type) {
      case "increase":
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  const exportData = () => {
    const data = {
      poll: {
        title: poll.title,
        created: poll.created_at,
        totalVotes,
        uniqueVoters,
      },
      results: voteDistribution,
      timeline: hourlyData,
      recentActivity: recentVoters.map(vote => ({
        voter: 'Anonymous', // Simplified for now
        option: (poll.poll_options || []).find((o: any) => o.id === vote.option_id)?.option_text,
        timestamp: vote.created_at,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `poll-analytics-${poll.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Poll Analytics</h2>
          <p className="text-muted-foreground">
            Detailed insights and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeFrame} onValueChange={(value: any) => setTimeFrame(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                {metric.change && (
                  <div className={`flex items-center space-x-1 text-xs mt-1 ${renderChangeColor(metric.change.type)}`}>
                    {renderChangeIcon(metric.change.type)}
                    <span>{Math.abs(metric.change.value)}% {metric.change.period}</span>
                  </div>
                )}
                {metric.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.description}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Vote Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Vote Distribution
            </CardTitle>
            <CardDescription>
              How votes are distributed across options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {voteDistribution.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{item.option}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {item.votes} votes
                    </span>
                    <Badge variant={index === 0 ? "default" : "secondary"}>
                      {item.percentage}%
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      index === 0 ? "bg-primary" : "bg-muted-foreground"
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                {item.voters.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      {item.voters.slice(0, 3).map((voter, voterIndex) => (
                        <Avatar key={voterIndex} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={voter.avatar} />
                          <AvatarFallback className="text-xs">
                            {voter.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.voters.length > 3
                        ? `${item.voters[0].name} and ${item.voters.length - 1} others`
                        : item.voters.map(v => v.name).join(", ")
                      }
                    </span>
                  </div>
                )}
                {index < voteDistribution.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Poll Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={isActive ? "default" : "secondary"}>
                  {isActive ? "Active" : "Ended"}
                </Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Visibility</span>
                <div className="flex items-center space-x-1">
                  {poll.is_public ? (
                    <Globe className="h-3 w-3" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                  <span className="text-sm">
                    {poll.is_public ? "Public" : "Private"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm">
                  {formatDistanceToNow(new Date(poll.created_at), { addSuffix: true })}
                </span>
              </div>

              {poll.expires_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {isActive ? "Expires" : "Expired"}
                  </span>
                  <span className="text-sm">
                    {formatDistanceToNow(new Date(poll.expires_at), { addSuffix: true })}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Peak hour</span>
                <span className="text-sm">
                  {peakVotingHour.label} ({peakVotingHour.votes} votes)
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Vote type</span>
                <span className="text-sm">
                  {poll.allow_multiple_votes ? "Multiple choice" : "Single choice"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voting Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Voting Timeline
          </CardTitle>
          <CardDescription>
            When people voted throughout the day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Simple bar chart representation */}
            <div className="grid grid-cols-24 gap-1 mb-4">
              {hourlyData.map((data, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-full bg-primary/20 rounded-sm relative"
                    style={{ height: "60px" }}
                  >
                    <div
                      className="bg-primary rounded-sm absolute bottom-0 w-full transition-all"
                      style={{
                        height: `${Math.max(
                          5,
                          (data.votes / Math.max(...hourlyData.map(d => d.votes))) * 100
                        )}%`,
                      }}
                      title={`${data.label}: ${data.votes} votes`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {data.hour % 6 === 0 ? data.hour : ""}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>11 PM</span>
            </div>
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
            Latest votes and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentVoters.map((vote, index) => (
              <div key={vote.id} className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="text-xs">
                    AN
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    Anonymous
                  </p>
                  <p className="text-xs text-muted-foreground">
                    voted for "{(poll.poll_options || []).find((o: any) => o.id === vote.option_id)?.option_text}"
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(vote.created_at), { addSuffix: true })}
                </div>
              </div>
            ))}

            {recentVoters.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Vote className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No votes yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export & Share</CardTitle>
          <CardDescription>
            Export your poll data or share analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
