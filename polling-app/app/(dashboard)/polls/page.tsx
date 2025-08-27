"use client";

import { useState } from "react";
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
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Poll } from "@/lib/types";

// Mock data - Replace with real data from API
const mockPolls: Poll[] = [
  {
    id: "poll_1",
    title: "What's your favorite programming language?",
    description: "Let's see what the community prefers for web development in 2024.",
    creatorId: "user_123",
    creator: {
      id: "user_123",
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://github.com/shadcn.png",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    options: [
      {
        id: "option_1",
        pollId: "poll_1",
        text: "JavaScript",
        votes: [],
        createdAt: new Date(),
      },
      {
        id: "option_2",
        pollId: "poll_1",
        text: "TypeScript",
        votes: [],
        createdAt: new Date(),
      },
      {
        id: "option_3",
        pollId: "poll_1",
        text: "Python",
        votes: [],
        createdAt: new Date(),
      },
    ],
    votes: [
      {
        id: "vote_1",
        pollId: "poll_1",
        optionId: "option_2",
        userId: "user_456",
        user: {
          id: "user_456",
          name: "Jane Smith",
          email: "jane@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
      },
    ],
    isPublic: true,
    allowMultipleVotes: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "poll_2",
    title: "Best time for team meetings?",
    description: "Help us find the optimal meeting time that works for everyone.",
    creatorId: "user_789",
    creator: {
      id: "user_789",
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    options: [
      {
        id: "option_4",
        pollId: "poll_2",
        text: "9:00 AM",
        votes: [],
        createdAt: new Date(),
      },
      {
        id: "option_5",
        pollId: "poll_2",
        text: "2:00 PM",
        votes: [],
        createdAt: new Date(),
      },
      {
        id: "option_6",
        pollId: "poll_2",
        text: "4:00 PM",
        votes: [],
        createdAt: new Date(),
      },
    ],
    votes: [],
    isPublic: false,
    allowMultipleVotes: true,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "poll_3",
    title: "Office lunch preferences",
    description: "What type of catering should we order for the team lunch?",
    creatorId: "user_123",
    creator: {
      id: "user_123",
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://github.com/shadcn.png",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    options: [
      {
        id: "option_7",
        pollId: "poll_3",
        text: "Pizza",
        votes: [],
        createdAt: new Date(),
      },
      {
        id: "option_8",
        pollId: "poll_3",
        text: "Sandwiches",
        votes: [],
        createdAt: new Date(),
      },
      {
        id: "option_9",
        pollId: "poll_3",
        text: "Salads",
        votes: [],
        createdAt: new Date(),
      },
      {
        id: "option_10",
        pollId: "poll_3",
        text: "Asian cuisine",
        votes: [],
        createdAt: new Date(),
      },
    ],
    votes: [
      {
        id: "vote_2",
        pollId: "poll_3",
        optionId: "option_7",
        userId: "user_456",
        user: {
          id: "user_456",
          name: "Jane Smith",
          email: "jane@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
      },
      {
        id: "vote_3",
        pollId: "poll_3",
        optionId: "option_7",
        userId: "user_789",
        user: {
          id: "user_789",
          name: "Alice Johnson",
          email: "alice@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
      },
    ],
    isPublic: true,
    allowMultipleVotes: false,
    expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Expired
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];

type FilterType = "all" | "active" | "expired" | "my-polls" | "voted";
type SortType = "newest" | "oldest" | "most-votes" | "least-votes";
type ViewType = "grid" | "list";

export default function PollsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [viewType, setViewType] = useState<ViewType>("grid");
  const currentUserId = "user_123"; // TODO: Get from auth context

  const filteredPolls = mockPolls.filter((poll) => {
    // Search filter
    const matchesSearch = poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.creator.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Status filter
    switch (filter) {
      case "active":
        return !poll.expiresAt || new Date(poll.expiresAt) > new Date();
      case "expired":
        return poll.expiresAt && new Date(poll.expiresAt) <= new Date();
      case "my-polls":
        return poll.creatorId === currentUserId;
      case "voted":
        return poll.votes.some(vote => vote.userId === currentUserId);
      default:
        return true;
    }
  });

  const sortedPolls = [...filteredPolls].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "most-votes":
        return b.votes.length - a.votes.length;
      case "least-votes":
        return a.votes.length - b.votes.length;
      default: // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const getFilterStats = () => {
    const total = mockPolls.length;
    const active = mockPolls.filter(p => !p.expiresAt || new Date(p.expiresAt) > new Date()).length;
    const expired = mockPolls.filter(p => p.expiresAt && new Date(p.expiresAt) <= new Date()).length;
    const myPolls = mockPolls.filter(p => p.creatorId === currentUserId).length;
    const voted = mockPolls.filter(p => p.votes.some(v => v.userId === currentUserId)).length;

    return { total, active, expired, myPolls, voted };
  };

  const stats = getFilterStats();

  const handleVote = async (pollId: string, optionId: string) => {
    // TODO: Implement vote functionality
    console.log("Voting on poll:", pollId, "option:", optionId);
  };

  const handleEditPoll = (poll: Poll) => {
    // TODO: Implement edit functionality
    console.log("Editing poll:", poll.id);
  };

  const handleDeletePoll = (pollId: string) => {
    // TODO: Implement delete functionality
    console.log("Deleting poll:", pollId);
  };

  const handleSharePoll = (poll: Poll) => {
    // TODO: Implement share functionality
    const url = `${window.location.origin}/polls/${poll.id}`;
    navigator.clipboard.writeText(url);
    console.log("Sharing poll:", poll.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Polls</h1>
          <p className="text-muted-foreground">
            Discover and participate in polls from the community
          </p>
        </div>
        <Link href="/polls/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Poll
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Vote className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Polls</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.expired}</p>
                <p className="text-xs text-muted-foreground">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.myPolls}</p>
                <p className="text-xs text-muted-foreground">My Polls</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Vote className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.voted}</p>
                <p className="text-xs text-muted-foreground">Participated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search polls..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter */}
            <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter polls" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Polls ({stats.total})</SelectItem>
                <SelectItem value="active">Active ({stats.active})</SelectItem>
                <SelectItem value="expired">Expired ({stats.expired})</SelectItem>
                <SelectItem value="my-polls">My Polls ({stats.myPolls})</SelectItem>
                <SelectItem value="voted">Participated ({stats.voted})</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: SortType) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most-votes">Most Votes</SelectItem>
                <SelectItem value="least-votes">Least Votes</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewType === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {sortedPolls.length} of {mockPolls.length} polls
        </div>
        <div className="flex items-center space-x-2">
          {filter !== "all" && (
            <Badge variant="secondary" className="capitalize">
              {filter.replace("-", " ")}
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="outline">
              Search: {searchQuery}
            </Badge>
          )}
        </div>
      </div>

      {/* Polls Grid/List */}
      {sortedPolls.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Vote className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No polls found</h3>
            <p className="text-muted-foreground text-center mb-6">
              {searchQuery
                ? `No polls match your search for "${searchQuery}"`
                : "There are no polls matching your current filter"
              }
            </p>
            {filter === "all" && !searchQuery && (
              <Link href="/polls/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first poll
                </Button>
              </Link>
            )}
            {(filter !== "all" || searchQuery) && (
              <Button
                variant="outline"
                onClick={() => {
                  setFilter("all");
                  setSearchQuery("");
                }}
              >
                Clear filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewType === "grid"
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            : "space-y-4"
        }>
          {sortedPolls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              currentUserId={currentUserId}
              variant={viewType === "list" ? "compact" : "default"}
              onVote={handleVote}
              onEdit={handleEditPoll}
              onDelete={handleDeletePoll}
              onShare={handleSharePoll}
            />
          ))}
        </div>
      )}
    </div>
  );
}
