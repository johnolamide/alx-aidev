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
import { Separator } from "@/components/ui/separator";
import {
  Vote,
  Users,
  BarChart3,
  Clock,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Star,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
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
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            ✨ Create polls in seconds
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Get instant feedback with
            <span className="text-primary"> beautiful polls</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create engaging polls, collect responses in real-time, and analyze
            results with powerful insights. Perfect for teams, educators, and
            content creators.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/polls">
              <Button variant="outline" size="lg" className="text-lg px-8">
                <Vote className="mr-2 h-5 w-5" />
                Browse Polls
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>10,000+ users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Vote className="h-4 w-4" />
              <span>50,000+ polls created</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>4.9/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to create amazing polls
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features that make poll creation and management effortless
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Quick Creation</CardTitle>
              <CardDescription>
                Create polls in seconds with our intuitive interface. No
                technical knowledge required.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-2 bg-blue-100 rounded-lg w-fit mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Real-time Analytics</CardTitle>
              <CardDescription>
                Watch results update in real-time with beautiful charts and
                detailed analytics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-2 bg-green-100 rounded-lg w-fit mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Share polls with your team, collect feedback, and make decisions
                together.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-2 bg-purple-100 rounded-lg w-fit mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Smart Scheduling</CardTitle>
              <CardDescription>
                Set expiration dates, schedule polls, and automate your feedback
                collection.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-2 bg-orange-100 rounded-lg w-fit mb-4">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Privacy Controls</CardTitle>
              <CardDescription>
                Choose between public and private polls with advanced privacy
                settings.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-2 bg-red-100 rounded-lg w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Trending Insights</CardTitle>
              <CardDescription>
                Discover trending topics and see what the community is talking
                about.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to get feedback from your audience
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="p-4 bg-primary rounded-full w-fit mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">
                  1
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Your Poll</h3>
              <p className="text-muted-foreground">
                Add your question and options. Customize privacy settings and
                expiration dates.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-primary rounded-full w-fit mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">
                  2
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Share & Collect</h3>
              <p className="text-muted-foreground">
                Share your poll link with your audience and watch responses come
                in real-time.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-primary rounded-full w-fit mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">
                  3
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Analyze Results</h3>
              <p className="text-muted-foreground">
                View detailed analytics, export data, and make informed
                decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to create your first poll?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who trust PollApp for their feedback needs
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Start Creating Polls
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/polls">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Explore Polls
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Vote className="h-5 w-5 text-primary" />
              <span className="font-semibold">PollApp</span>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="/support" className="hover:text-foreground">
                Support
              </Link>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 PollApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
