"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Vote,
  Users,
  Calendar,
  Clock,
  Share2,
  Copy,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  BarChart3,
  Download,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Poll, Vote as VoteType } from "@/lib/types";

// Mock data - Replace with actual API call
const mockPoll: Poll = {
  id: "poll_1",
  title: "What's your favorite programming language for web development in 2024?",
  description: "We're curious about the community's preferences for modern web development. Your vote will help us understand current trends and plan our technology stack accordingly. This poll will help inform our team's decisions for upcoming projects.",
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
    {
      id: "option_4",
      pollId: "poll_1",
      text: "Go",
      votes: [],
      createdAt: new Date(),
    },
    {
      id: "option_5",
      pollId: "poll_1",
      text: "Rust",
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
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "vote_2",
      pollId: "poll_1",
      optionId: "option_2",
      userId: "user_789",
      user: {
        id: "user_789",
        name: "Alice Johnson",
        email: "alice@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: "vote_3",
      pollId: "poll_1",
      optionId: "option_1",
      userId: "user_101",
      user: {
        id: "user_101",
        name: "Bob Wilson",
        email: "bob@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: "vote_4",
      pollId: "poll_1",
      optionId: "option_3",
      userId: "user_102",
      user: {
        id: "user_102",
        name: "Carol Davis",
        email: "carol@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
    },
  ],
  isPublic: true,
  allowMultipleVotes: false,
  expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(),
};

export default function PollDetailPage() {
  const params = useParams();
  const pollId = params.id as string;

  const [poll, setPoll] = useState<Poll | null>(mockPoll);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const currentUserId = "user_123"; // TODO: Get from auth context
  const isCreator = currentUserId === poll?.creatorId;
  const hasVoted = poll?.votes.some(vote => vote.userId === currentUserId) ?? false;
  const userVote = poll?.votes.find(vote => vote.userId === currentUserId);
  const totalVotes = poll?.votes.length ?? 0;
  const isExpired = poll?.expiresAt && new Date(poll.expiresAt) < new Date();

  useEffect(() => {
    // TODO: Fetch poll data from API
    // fetchPoll(pollId);
  }, [pollId]);

  const getVoteCount = (optionId: string) => {
    return poll?.votes.filter(vote => vote.optionId === optionId).length ?? 0;
  };

  const getVotePercentage = (optionId: string) => {
    if (totalVotes === 0) return 0;
    return Math.round((getVoteCount(optionId) / totalVotes) * 100);
  };

  const getRecentVoters = (optionId: string, limit: number = 3) => {
    return poll?.votes
      .filter(vote => vote.optionId === optionId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit) ?? [];
  };

  const handleVote = async (optionId: string) => {
    if (!poll || hasVoted || isExpired) return;

    setIsVoting(true);
    try {
      // TODO: Implement actual vote API call
      console.log("Voting on option:", optionId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update local state (replace with actual API response)
      const newVote: VoteType = {
        id: `vote_${Date.now()}`,
        pollId: poll.id,
        optionId,
        userId: currentUserId,
        user: {
          id: currentUserId,
          name: "John Doe",
          email: "john@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
      };

      setPoll(prev => prev ? {
        ...prev,
        votes: [...prev.votes, newVote]
      } : null);

    } catch (error) {
      console.error("Failed to vote:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/polls/${pollId}`;
    navigator.clipboard.writeText(url);
    // TODO: Add toast notification
    console.log("Poll URL copied to clipboard");
  };

  const handleDelete = async () => {
    try {
      // TODO: Implement delete API call
      console.log("Deleting poll:", pollId);
      setShowDeleteDialog(false);
      // Redirect to polls list after deletion
    } catch (error) {
      console.error("Failed to delete poll:", error);
    }
  };

  if (!poll) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Poll not found</h2>
          <p className="text-muted-foreground mb-4">
            The poll you're looking for doesn't exist or has been deleted.
          </p>
          <Link href="/polls">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Polls
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sortedOptions = poll.options
    .map(option => ({
      ...option,
      voteCount: getVoteCount(option.id),
      percentage: getVotePercentage(option.id),
    }))
    .sort((a, b) => b.voteCount - a.voteCount);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/polls">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Polls
          </Button>
        </Link>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>

          {isCreator && (
            <>
              <Link href={`/polls/${pollId}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Poll Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Poll Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={poll.creator.avatar} />
                    <AvatarFallback>
                      {poll.creator.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{poll.creator.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!poll.isPublic && (
                    <Badge variant="secondary">Private</Badge>
                  )}
                  {poll.allowMultipleVotes && (
                    <Badge variant="outline">Multiple votes</Badge>
                  )}
                  {isExpired ? (
                    <Badge variant="destructive">Expired</Badge>
                  ) : hasVoted ? (
                    <Badge className="bg-green-600">Voted</Badge>
                  ) : (
                    <Badge variant="default">Active</Badge>
                  )}
                </div>
              </div>

              <CardTitle className="text-2xl">{poll.title}</CardTitle>
              {poll.description && (
                <CardDescription className="text-base leading-relaxed">
                  {poll.description}
                </CardDescription>
              )}

              <div className="flex items-center space-x-6 text-sm text-muted-foreground pt-2">
                <span className="flex items-center">
                  <Vote className="h-4 w-4 mr-1" />
                  {totalVotes} votes
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {new Set(poll.votes.map(v => v.userId)).size} participants
                </span>
                {poll.expiresAt && (
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {isExpired
                      ? "Expired"
                      : `Expires ${formatDistanceToNow(new Date(poll.expiresAt), { addSuffix: true })}`
                    }
                  </span>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Voting Options */}
          <Card>
            <CardHeader>
              <CardTitle>Cast Your Vote</CardTitle>
              {!hasVoted && !isExpired && (
                <CardDescription>
                  Select your preferred option below
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {sortedOptions.map((option, index) => {
                const isUserChoice = userVote?.optionId === option.id;
                const recentVoters = getRecentVoters(option.id);

                return (
                  <div
                    key={option.id}
                    className={`relative p-4 rounded-lg border transition-all ${
                      isUserChoice
                        ? "border-primary bg-primary/5"
                        : hasVoted || isExpired
                        ? "border-muted bg-muted/30"
                        : "border-muted hover:border-primary/50 cursor-pointer"
                    }`}
                    onClick={() => !hasVoted && !isExpired && handleVote(option.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-lg">{option.text}</span>
                        {isUserChoice && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                        {index === 0 && totalVotes > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Leading
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        {(hasVoted || isExpired) && (
                          <span className="text-sm font-medium text-muted-foreground">
                            {option.percentage}%
                          </span>
                        )}
                        <span className="text-lg font-semibold">
                          {option.voteCount}
                        </span>
                      </div>
                    </div>

                    {(hasVoted || isExpired) && (
                      <div className="mb-3">
                        <div className="w-full bg-muted rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              isUserChoice ? "bg-primary" : "bg-muted-foreground"
                            }`}
                            style={{ width: `${option.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {recentVoters.length > 0 && (hasVoted || isExpired) && (
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {recentVoters.map((vote) => (
                            <Avatar key={vote.id} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={vote.user.avatar} />
                              <AvatarFallback className="text-xs">
                                {vote.user.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {recentVoters.length === 1
                            ? `${recentVoters[0].user.name} voted`
                            : `${recentVoters[0].user.name} and ${recentVoters.length - 1} others voted`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {!hasVoted && !isExpired && isVoting && (
                <div className="text-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Submitting your vote...
                  </p>
                </div>
              )}

              {hasVoted && (
                <div className="text-center py-4 border-t">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-green-600">
                    Thank you for voting!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You voted for "{poll.options.find(o => o.id === userVote?.optionId)?.text}"
                  </p>
                </div>
              )}

              {isExpired && (
                <div className="text-center py-4 border-t">
                  <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-medium text-muted-foreground">
                    This poll has expired
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Voting ended on {format(new Date(poll.expiresAt!), 'PPP')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Poll Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Poll Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Votes</span>
                <span className="font-semibold">{totalVotes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Participants</span>
                <span className="font-semibold">
                  {new Set(poll.votes.map(v => v.userId)).size}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Options</span>
                <span className="font-semibold">{poll.options.length}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-semibold">
                  {format(new Date(poll.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              {poll.expiresAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {isExpired ? "Expired" : "Expires"}
                  </span>
                  <span className="font-semibold">
                    {format(new Date(poll.expiresAt), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          {poll.votes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Votes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {poll.votes
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((vote) => (
                      <div key={vote.id} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={vote.user.avatar} />
                          <AvatarFallback className="text-xs">
                            {vote.user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {vote.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            voted for "{poll.options.find(o => o.id === vote.optionId)?.text}"
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(vote.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Poll
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const url = `${window.location.origin}/polls/${pollId}`;
                  navigator.clipboard.writeText(url);
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  // TODO: Implement export functionality
                  console.log("Exporting poll results");
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/polls/${pollId}/embed`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Embed Poll
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Poll</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this poll? This action cannot be undone.
              All votes and data associated with this poll will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Poll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Poll</DialogTitle>
            <DialogDescription>
              Share this poll with others using the link below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={`${window.location.origin}/polls/${pollId}`}
                readOnly
                className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm"
              />
              <Button
                size="sm"
                onClick={handleShare}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowShareDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
