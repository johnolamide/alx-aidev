"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  X,
  Calendar,
  Users,
  Lock,
  Unlock,
  Vote,
  Loader2,
  AlertCircle
} from "lucide-react";
import { CreatePollData } from "@/lib/types";

interface CreatePollFormProps {
  onSubmit?: (data: CreatePollData) => Promise<void>;
}

export function CreatePollForm({ onSubmit }: CreatePollFormProps) {
  const [formData, setFormData] = useState<CreatePollData>({
    title: "",
    description: "",
    options: ["", ""],
    isPublic: true,
    allowMultipleVotes: false,
  });
  const [expirationOption, setExpirationOption] = useState<string>("never");
  const [customExpirationDays, setCustomExpirationDays] = useState<string>("7");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Poll title is required";
    }

    const validOptions = formData.options.filter(option => option.trim());
    if (validOptions.length < 2) {
      newErrors.options = "At least 2 options are required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Set expiration date
    let expiresAt: Date | undefined;
    if (expirationOption !== "never") {
      const days = expirationOption === "custom"
        ? parseInt(customExpirationDays)
        : parseInt(expirationOption);
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);
    }

    const pollData: CreatePollData = {
      ...formData,
      options: validOptions,
      expiresAt,
    };

    try {
      if (onSubmit) {
        await onSubmit(pollData);
      } else {
        // Default submit logic - replace with actual API call
        console.log("Creating poll:", pollData);
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push("/polls");
      }
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : "Failed to create poll" });
    } finally {
      setIsLoading(false);
    }
  };

  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, ""]
      }));
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }));
    // Clear option errors when user starts typing
    if (errors.options) {
      setErrors(prev => ({ ...prev, options: "" }));
    }
  };

  const handleInputChange = (field: keyof CreatePollData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validOptionsCount = formData.options.filter(option => option.trim()).length;
  const isFormValid = formData.title.trim() && validOptionsCount >= 2;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create New Poll</h1>
        <p className="text-muted-foreground mt-2">
          Create a poll and get instant feedback from your audience
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Vote className="mr-2 h-5 w-5" />
              Poll Details
            </CardTitle>
            <CardDescription>
              Provide the basic information about your poll
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {errors.submit && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                {errors.submit}
              </div>
            )}

            {/* Poll Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Poll Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="What's your poll about?"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                disabled={isLoading}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Poll Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add more context to your poll..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                disabled={isLoading}
                rows={3}
              />
            </div>

            <Separator />

            {/* Poll Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  Poll Options <span className="text-red-500">*</span>
                </Label>
                <span className="text-sm text-muted-foreground">
                  {validOptionsCount} of {formData.options.length} options
                </span>
              </div>

              {errors.options && (
                <div className="p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {errors.options}
                </div>
              )}

              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        disabled={isLoading}
                        className={errors.options && !option.trim() ? "border-red-300" : ""}
                      />
                    </div>
                    {formData.options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {formData.options.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Option
                </Button>
              )}
            </div>

            <Separator />

            {/* Poll Settings */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Poll Settings</Label>

              {/* Visibility */}
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select
                  value={formData.isPublic ? "public" : "private"}
                  onValueChange={(value) => handleInputChange("isPublic", value === "public")}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center">
                        <Unlock className="mr-2 h-4 w-4" />
                        Public - Anyone can see and vote
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center">
                        <Lock className="mr-2 h-4 w-4" />
                        Private - Only people with link can vote
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Multiple Votes */}
              <div className="space-y-2">
                <Label>Voting Rules</Label>
                <Select
                  value={formData.allowMultipleVotes ? "multiple" : "single"}
                  onValueChange={(value) => handleInputChange("allowMultipleVotes", value === "multiple")}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">
                      <div className="flex items-center">
                        <Vote className="mr-2 h-4 w-4" />
                        Single choice - One vote per person
                      </div>
                    </SelectItem>
                    <SelectItem value="multiple">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Multiple choice - Multiple votes allowed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Expiration */}
              <div className="space-y-2">
                <Label>Poll Duration</Label>
                <div className="space-y-2">
                  <Select
                    value={expirationOption}
                    onValueChange={setExpirationOption}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          Never expires
                        </div>
                      </SelectItem>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">1 week</SelectItem>
                      <SelectItem value="14">2 weeks</SelectItem>
                      <SelectItem value="30">1 month</SelectItem>
                      <SelectItem value="custom">Custom duration</SelectItem>
                    </SelectContent>
                  </Select>

                  {expirationOption === "custom" && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="1"
                        max="365"
                        value={customExpirationDays}
                        onChange={(e) => setCustomExpirationDays(e.target.value)}
                        disabled={isLoading}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">days</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Vote className="mr-2 h-4 w-4" />
                    Create Poll
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
