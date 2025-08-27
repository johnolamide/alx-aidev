"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Vote,
  Users,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<any>;
  trend?: {
    value: number;
    label: string;
    type: "increase" | "decrease" | "neutral";
  };
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  className?: string;
}

interface DashboardStats {
  totalPolls: number;
  activePolls: number;
  totalVotes: number;
  totalParticipants: number;
  pollsThisMonth: number;
  votesToday: number;
  averageVotesPerPoll: number;
  completionRate: number;
}

interface StatsCardsProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

function StatsCard({ title, value, description, icon: Icon, trend, badge, className }: StatsCardProps) {
  const getTrendIcon = () => {
    switch (trend?.type) {
      case "increase":
        return <ArrowUpRight className="h-3 w-3" />;
      case "decrease":
        return <ArrowDownRight className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = () => {
    switch (trend?.type) {
      case "increase":
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {badge && (
            <Badge variant={badge.variant || "secondary"} className="text-xs">
              {badge.text}
            </Badge>
          )}
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className={`flex items-center space-x-1 text-xs mt-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{Math.abs(trend.value)}% {trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2" />
        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

export function StatsCards({ stats, isLoading = false }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const statsConfig = [
    {
      title: "Total Polls",
      value: formatNumber(stats.totalPolls),
      description: `${stats.activePolls} currently active`,
      icon: Vote,
      trend: {
        value: 12,
        label: "from last month",
        type: "increase" as const,
      },
      badge: stats.totalPolls > 50 ? { text: "Popular", variant: "default" as const } : undefined,
    },
    {
      title: "Total Votes",
      value: formatNumber(stats.totalVotes),
      description: `${stats.votesToday} votes today`,
      icon: BarChart3,
      trend: {
        value: 8,
        label: "from last week",
        type: "increase" as const,
      },
    },
    {
      title: "Participants",
      value: formatNumber(stats.totalParticipants),
      description: "Unique voters across all polls",
      icon: Users,
      trend: {
        value: 15,
        label: "from last month",
        type: "increase" as const,
      },
      badge: stats.totalParticipants > 100 ? { text: "Growing", variant: "secondary" as const } : undefined,
    },
    {
      title: "Engagement Rate",
      value: `${stats.completionRate}%`,
      description: "Average poll completion rate",
      icon: TrendingUp,
      trend: {
        value: 3,
        label: "from last month",
        type: stats.completionRate >= 75 ? "increase" as const : "decrease" as const,
      },
      badge: stats.completionRate >= 80 ? { text: "Excellent", variant: "default" as const } : undefined,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((config, index) => (
        <StatsCard key={index} {...config} />
      ))}
    </div>
  );
}

// Extended stats cards for detailed analytics
export function DetailedStatsCards({ stats, isLoading = false }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const detailedStatsConfig = [
    {
      title: "Total Polls",
      value: formatNumber(stats.totalPolls),
      description: "All time polls created",
      icon: Vote,
      trend: {
        value: 12,
        label: "vs last month",
        type: "increase" as const,
      },
    },
    {
      title: "Active Polls",
      value: formatNumber(stats.activePolls),
      description: "Currently accepting votes",
      icon: CheckCircle2,
      badge: { text: "Live", variant: "default" as const },
    },
    {
      title: "Total Votes",
      value: formatNumber(stats.totalVotes),
      description: "Across all polls",
      icon: BarChart3,
      trend: {
        value: 8,
        label: "vs last week",
        type: "increase" as const,
      },
    },
    {
      title: "Participants",
      value: formatNumber(stats.totalParticipants),
      description: "Unique voters",
      icon: Users,
      trend: {
        value: 15,
        label: "vs last month",
        type: "increase" as const,
      },
    },
    {
      title: "This Month",
      value: formatNumber(stats.pollsThisMonth),
      description: "Polls created this month",
      icon: Calendar,
      trend: {
        value: 25,
        label: "vs last month",
        type: "increase" as const,
      },
    },
    {
      title: "Avg. Votes/Poll",
      value: stats.averageVotesPerPoll.toFixed(1),
      description: "Average engagement per poll",
      icon: TrendingUp,
      trend: {
        value: 5,
        label: "vs last month",
        type: stats.averageVotesPerPoll > 10 ? "increase" as const : "neutral" as const,
      },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {detailedStatsConfig.map((config, index) => (
        <StatsCard key={index} {...config} />
      ))}
    </div>
  );
}

// Quick stats component for smaller displays
export function QuickStats({ stats, isLoading = false }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const quickStatsConfig = [
    {
      title: "Polls",
      value: stats.totalPolls,
      description: `${stats.activePolls} active`,
      icon: Vote,
    },
    {
      title: "Votes",
      value: stats.totalVotes,
      description: `${stats.votesToday} today`,
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2">
      {quickStatsConfig.map((config, index) => (
        <StatsCard key={index} {...config} />
      ))}
    </div>
  );
}

export default StatsCards;
