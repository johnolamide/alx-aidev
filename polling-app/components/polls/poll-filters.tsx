"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar,
  CalendarIcon,
} from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  X,
  Calendar as CalendarLucide,
  User,
  Vote,
  Clock,
  Eye,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { format } from "date-fns";

export type FilterType = "all" | "active" | "expired" | "my-polls" | "participated";
export type SortType = "newest" | "oldest" | "most-votes" | "least-votes" | "most-popular" | "alphabetical";
export type DateRange = {
  from?: Date;
  to?: Date;
};

export interface PollFilters {
  search: string;
  filter: FilterType;
  sortBy: SortType;
  dateRange?: DateRange;
  creatorFilter?: string;
  minVotes?: number;
  maxVotes?: number;
  tags?: string[];
  isPublic?: boolean;
}

interface PollFiltersProps {
  filters: PollFilters;
  onFiltersChange: (filters: PollFilters) => void;
  stats?: {
    total: number;
    active: number;
    expired: number;
    myPolls: number;
    participated: number;
  };
  showAdvanced?: boolean;
  className?: string;
}

const FILTER_OPTIONS: Array<{
  value: FilterType;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}> = [
  {
    value: "all",
    label: "All Polls",
    description: "Show all available polls",
    icon: Vote,
  },
  {
    value: "active",
    label: "Active",
    description: "Polls currently accepting votes",
    icon: Clock,
  },
  {
    value: "expired",
    label: "Expired",
    description: "Polls that have ended",
    icon: Clock,
  },
  {
    value: "my-polls",
    label: "My Polls",
    description: "Polls you created",
    icon: User,
  },
  {
    value: "participated",
    label: "Participated",
    description: "Polls you voted in",
    icon: Vote,
  },
];

const SORT_OPTIONS: Array<{
  value: SortType;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}> = [
  {
    value: "newest",
    label: "Newest First",
    description: "Most recently created",
    icon: SortDesc,
  },
  {
    value: "oldest",
    label: "Oldest First",
    description: "Oldest polls first",
    icon: SortAsc,
  },
  {
    value: "most-votes",
    label: "Most Votes",
    description: "Highest vote count first",
    icon: Vote,
  },
  {
    value: "least-votes",
    label: "Least Votes",
    description: "Lowest vote count first",
    icon: Vote,
  },
  {
    value: "most-popular",
    label: "Most Popular",
    description: "Most participants first",
    icon: Eye,
  },
  {
    value: "alphabetical",
    label: "A-Z",
    description: "Alphabetical by title",
    icon: SortAsc,
  },
];

export function PollFilters({
  filters,
  onFiltersChange,
  stats,
  showAdvanced = false,
  className,
}: PollFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(showAdvanced);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(filters.dateRange);

  const updateFilter = (key: keyof PollFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      filter: "all",
      sortBy: "newest",
    });
    setDateRange(undefined);
  };

  const hasActiveFilters = () => {
    return (
      filters.search !== "" ||
      filters.filter !== "all" ||
      filters.sortBy !== "newest" ||
      filters.dateRange ||
      filters.creatorFilter ||
      filters.minVotes !== undefined ||
      filters.maxVotes !== undefined ||
      (filters.tags && filters.tags.length > 0) ||
      filters.isPublic !== undefined
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.filter !== "all") count++;
    if (filters.sortBy !== "newest") count++;
    if (filters.dateRange) count++;
    if (filters.creatorFilter) count++;
    if (filters.minVotes !== undefined) count++;
    if (filters.maxVotes !== undefined) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    if (filters.isPublic !== undefined) count++;
    return count;
  };

  const getFilterLabel = (filterValue: FilterType) => {
    const option = FILTER_OPTIONS.find(o => o.value === filterValue);
    return option?.label || filterValue;
  };

  const getFilterCount = (filterValue: FilterType) => {
    if (!stats) return "";

    switch (filterValue) {
      case "all":
        return ` (${stats.total})`;
      case "active":
        return ` (${stats.active})`;
      case "expired":
        return ` (${stats.expired})`;
      case "my-polls":
        return ` (${stats.myPolls})`;
      case "participated":
        return ` (${stats.participated})`;
      default:
        return "";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search polls by title, description, or creator..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
          {filters.search && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => updateFilter("search", "")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filter Type */}
        <Select
          value={filters.filter}
          onValueChange={(value: FilterType) => updateFilter("filter", value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>
                      {option.label}
                      {getFilterCount(option.value)}
                    </span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select
          value={filters.sortBy}
          onValueChange={(value: SortType) => updateFilter("sortBy", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Advanced Filters</h3>
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Date Range Filter */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarLucide className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Pick a date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange(range);
                      updateFilter("dateRange", range);
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Creator Filter */}
            <div className="space-y-2">
              <Label>Creator</Label>
              <Input
                placeholder="Filter by creator name"
                value={filters.creatorFilter || ""}
                onChange={(e) => updateFilter("creatorFilter", e.target.value || undefined)}
              />
            </div>

            {/* Vote Range Filter */}
            <div className="space-y-2">
              <Label>Vote Range</Label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Min votes"
                  value={filters.minVotes || ""}
                  onChange={(e) => updateFilter("minVotes", e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full"
                />
                <Input
                  type="number"
                  placeholder="Max votes"
                  value={filters.maxVotes || ""}
                  onChange={(e) => updateFilter("maxVotes", e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Visibility Filter */}
            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select
                value={filters.isPublic === undefined ? "all" : filters.isPublic ? "public" : "private"}
                onValueChange={(value) => {
                  if (value === "all") {
                    updateFilter("isPublic", undefined);
                  } else {
                    updateFilter("isPublic", value === "public");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Polls</SelectItem>
                  <SelectItem value="public">Public Only</SelectItem>
                  <SelectItem value="private">Private Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags Filter */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                placeholder="Enter tags separated by commas"
                value={filters.tags?.join(", ") || ""}
                onChange={(e) => {
                  const tags = e.target.value
                    .split(",")
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0);
                  updateFilter("tags", tags.length > 0 ? tags : undefined);
                }}
              />
            </div>
          </div>

          <Separator />

          {/* Quick Filter Presets */}
          <div className="space-y-2">
            <Label>Quick Filters</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    filter: "active",
                    sortBy: "most-votes",
                  });
                }}
              >
                Popular Active Polls
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    filter: "my-polls",
                    sortBy: "newest",
                  });
                }}
              >
                My Recent Polls
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const lastWeek = new Date();
                  lastWeek.setDate(lastWeek.getDate() - 7);
                  onFiltersChange({
                    ...filters,
                    dateRange: { from: lastWeek, to: new Date() },
                    sortBy: "newest",
                  });
                  setDateRange({ from: lastWeek, to: new Date() });
                }}
              >
                This Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    minVotes: 10,
                    sortBy: "most-votes",
                  });
                }}
              >
                High Engagement
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {filters.search && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Search: {filters.search}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => updateFilter("search", "")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.filter !== "all" && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>{getFilterLabel(filters.filter)}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => updateFilter("filter", "all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.dateRange && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>
                {filters.dateRange.from && filters.dateRange.to
                  ? `${format(filters.dateRange.from, "MMM d")} - ${format(filters.dateRange.to, "MMM d")}`
                  : filters.dateRange.from
                  ? `From ${format(filters.dateRange.from, "MMM d")}`
                  : "Date range"
                }
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => {
                  updateFilter("dateRange", undefined);
                  setDateRange(undefined);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.creatorFilter && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Creator: {filters.creatorFilter}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => updateFilter("creatorFilter", undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {(filters.minVotes !== undefined || filters.maxVotes !== undefined) && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>
                Votes: {filters.minVotes || 0}-{filters.maxVotes || "∞"}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => {
                  updateFilter("minVotes", undefined);
                  updateFilter("maxVotes", undefined);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.tags && filters.tags.length > 0 && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Tags: {filters.tags.join(", ")}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => updateFilter("tags", undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.isPublic !== undefined && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>{filters.isPublic ? "Public" : "Private"} only</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => updateFilter("isPublic", undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
