"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Vote,
  PlusCircle,
  Settings,
  User,
  TrendingUp,
  Clock,
  Users,
  Eye,
  Home
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview and statistics"
  },
  {
    name: "All Polls",
    href: "/polls",
    icon: Vote,
    description: "Browse all polls"
  },
  {
    name: "Create Poll",
    href: "/polls/create",
    icon: PlusCircle,
    description: "Create a new poll"
  },
];

const analytics = [
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "Poll performance"
  },
  {
    name: "Trending",
    href: "/dashboard/trending",
    icon: TrendingUp,
    description: "Popular polls"
  },
  {
    name: "Recent Activity",
    href: "/dashboard/activity",
    icon: Clock,
    description: "Latest votes and polls"
  },
];

const management = [
  {
    name: "My Polls",
    href: "/dashboard/my-polls",
    icon: Eye,
    description: "Polls you created"
  },
  {
    name: "Participated",
    href: "/dashboard/participated",
    icon: Users,
    description: "Polls you voted in"
  },
];

const settings = [
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
    description: "Manage your profile"
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "App preferences"
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      <div className="flex-1 space-y-4 py-4">
        {/* Main Navigation */}
        <div className="px-4 py-2">
          <h2 className="mb-3 px-2 text-sm font-semibold tracking-tight text-muted-foreground uppercase">
            Navigation
          </h2>
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="block">
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className="w-full justify-start h-10 px-3"
                    size="sm"
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    <span className="truncate">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        <Separator className="mx-4" />

        {/* Analytics Section */}
        <div className="px-4 py-2">
          <h2 className="mb-3 px-2 text-sm font-semibold tracking-tight text-muted-foreground uppercase">
            Analytics
          </h2>
          <div className="space-y-1">
            {analytics.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="block">
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className="w-full justify-start h-10 px-3"
                    size="sm"
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    <span className="truncate">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        <Separator className="mx-4" />

        {/* Poll Management */}
        <div className="px-4 py-2">
          <h2 className="mb-3 px-2 text-sm font-semibold tracking-tight text-muted-foreground uppercase">
            My Polls
          </h2>
          <div className="space-y-1">
            {management.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="block">
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className="w-full justify-start h-10 px-3"
                    size="sm"
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    <span className="truncate">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        <Separator className="mx-4" />

        {/* Settings */}
        <div className="px-4 py-2">
          <h2 className="mb-3 px-2 text-sm font-semibold tracking-tight text-muted-foreground uppercase">
            Account
          </h2>
          <div className="space-y-1">
            {settings.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="block">
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className="w-full justify-start h-10 px-3"
                    size="sm"
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    <span className="truncate">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
