"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Vote,
  Users,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Share2,
  Copy,
  ExternalLink,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Poll } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface PollCardProps {
  poll: Poll;
  currentUserId?: string;
  variant?: "default" | "compact";
  showActions?: boolean;
  onVote?: (pollId: string, optionId: string) => void;
  onEdit?: (poll: Poll) => void;
  onDelete?: (pollId: string) => void;
  onShare?: (poll: Poll) => void;
}

export function PollCard({
  poll,
  currentUserId,
  variant = "default",
  showActions = true,
  onVote,
  onEdit,
  onDelete,
  onShare
}: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const isCreator = currentUserId === poll.creatorId;
  const hasVoted = poll.votes.some(vote => vote.userId === currentUserId);
  const totalVotes = poll.votes.length;
  const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date();

  const getVoteCount = (optionId: string) => {
    return poll.votes.filter(vote => vote.optionId === optionId).length;
  };

  const getVotePercentage = (optionId: string) => {
    if (totalVotes === 0) return 0;
    return Math.round((getVoteCount(optionId) / totalVotes) * 100);
  };

  const getUserVote = () => {
    return poll.votes.find(vote => vote.userId === currentUserId);
  };

  const handleVote = async (optionId: string) => {
    if (!onVote || hasVoted || isExpired) return;

    setIsVoting(true);
    try {
      await onVote(poll.id, optionId);
    } catch (error) {
      console.error("Failed to vote:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/polls/${poll.id}`;
    navigator.clipboard.writeText(url);
    // TODO: Add toast notification
  };

  const formatTimeLeft = () => {
    if (!poll.expiresAt) return null;

    const now = new Date();
    const expires = new Date(poll.expiresAt);

    if (expires < now) {
      return "Expired";
    }

    return `Expires ${formatDistanceToNow(expires, { addSuffix: true })}`;
  };

  if (variant === "compact") {
    return (
      <Card className="hover:shadow-md transition-all duration-200 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Link href={`/polls/${poll.id}`}>
                <h3 className="font-semibold text-lg hover:text-primary cursor-pointer line-clamp-2 mb-2">
                  {poll.title}
                </h3>
              </Link>
              <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Vote className="h-3 w-3" />
                  {totalVotes} votes
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {poll.options.length} options
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {hasVoted && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Voted
                </Badge>
              )}
              {isExpired && (
                <Badge variant="destructive">
                  <Clock className="h-3 w-3 mr-1" />
                  Expired
                </Badge>
              )}
              {!poll.isPublic && (
                <Badge variant="secondary">Private</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={poll.creator.avatar} />
                <AvatarFallback>
                  {poll.creator.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{poll.creator.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            <Link href={`/polls/${poll.id}`}>
              <CardTitle className="text-xl hover:text-primary cursor-pointer">
                {poll.title}
              </CardTitle>
            </Link>

            {poll.description && (
              <CardDescription className="mt-2">
                {poll.description}
              </CardDescription>
            )}
          </div>

          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/polls/${poll.id}`} className="flex items-center cursor-pointer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </DropdownMenuItem>
                {onShare && (
                  <DropdownMenuItem onClick={() => onShare(poll)}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                )}
                {isCreator && (
                  <>
                    <DropdownMenuSeparator />
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(poll)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={() => onDelete(poll.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center space-x-2 mt-3">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Vote className="h-4 w-4 mr-1" />
              {totalVotes} votes
            </span>
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {poll.options.length} options
            </span>
          </div>

          <div className="flex items-center space-x-1 ml-auto">
            {!poll.isPublic && (
              <Badge variant="secondary" className="text-xs">
                Private
              </Badge>
            )}
            {poll.allowMultipleVotes && (
              <Badge variant="outline" className="text-xs">
                Multiple votes
              </Badge>
            )}
            {isExpired && (
              <Badge variant="destructive" className="text-xs">
                Expired
              </Badge>
            )}
            {hasVoted && !isExpired && (
              <Badge variant="default" className="text-xs bg-green-600">
                Voted
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {poll.options.map((option) => {
            const voteCount = getVoteCount(option.id);
            const percentage = getVotePercentage(option.id);
            const userVoted = getUserVote()?.optionId === option.id;

            return (
              <div
                key={option.id}
                className={`relative p-3 rounded-lg border transition-all ${
                  userVoted
                    ? "border-primary bg-primary/5"
                    : hasVoted || isExpired
                    ? "border-muted bg-muted/30"
                    : "border-muted hover:border-primary/50 cursor-pointer"
                }`}
                onClick={() => !hasVoted && !isExpired && handleVote(option.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.text}</span>
                  <div className="flex items-center space-x-2">
                    {(hasVoted || isExpired) && (
                      <span className="text-sm text-muted-foreground">
                        {percentage}%
                      </span>
                    )}
                    <span className="text-sm font-medium">{voteCount}</span>
                    {userVoted && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                </div>

                {(hasVoted || isExpired) && (
                  <div className="mt-2">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          userVoted ? "bg-primary" : "bg-muted-foreground"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-muted-foreground">
            {poll.expiresAt && (
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatTimeLeft()}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Link href={`/polls/${poll.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
