"use client";

import { useState } from "react";
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
  Calendar,
  Users,
  Lock,
  Unlock,
  Vote,
  Loader2,
  AlertCircle
} from "lucide-react";
import { createPoll, updatePoll } from "@/lib/actions/create-poll";

interface CreatePollFormProps {
  initialData?: {
    title: string;
    description: string;
    options: string[];
    isPublic: boolean;
    allowMultipleVotes: boolean;
    expirationDays: string | number;
  };
  pollId?: string;
  onSubmit?: (formData: FormData) => Promise<void>;
  submitButtonText?: string;
}

export function CreatePollForm({
  initialData,
  pollId,
  onSubmit,
  submitButtonText = "Create Poll"
}: CreatePollFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [options, setOptions] = useState<string[]>(initialData?.options || ["", ""]);
  const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? true);
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(initialData?.allowMultipleVotes ?? false);
  const [expirationDays, setExpirationDays] = useState<string>(
    typeof initialData?.expirationDays === 'number'
      ? initialData.expirationDays.toString()
      : initialData?.expirationDays || "7"
  );

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setErrors({});

    try {
      // Add pollId if editing
      if (pollId) {
        formData.append('pollId', pollId);
      }

      if (onSubmit) {
        await onSubmit(formData);
      } else {
        await createPoll(formData);
      }
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : "Failed to save poll" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create New Poll</h1>
        <p className="text-muted-foreground mt-2">
          Create a poll and get instant feedback from your audience
        </p>
      </div>

      <form action={handleSubmit}>
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
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your poll about?"
                disabled={isLoading}
                required
              />
            </div>

            {/* Poll Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more context to your poll..."
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
                  4 options available
                </span>
              </div>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index] = e.target.value;
                          setOptions(newOptions);
                        }}
                        placeholder={`Option ${index + 1}`}
                        disabled={isLoading}
                        required={index < 2}
                      />
                    </div>
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newOptions = options.filter((_, i) => i !== index);
                          setOptions(newOptions);
                        }}
                        disabled={isLoading}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}

                {options.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOptions([...options, ""])}
                    disabled={isLoading}
                  >
                    Add Option
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Poll Settings */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Poll Settings</Label>

              {/* Visibility */}
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select
                  value={isPublic.toString()}
                  onValueChange={(value) => setIsPublic(value === "true")}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">
                      <div className="flex items-center">
                        <Unlock className="mr-2 h-4 w-4" />
                        Public - Anyone can see and vote
                      </div>
                    </SelectItem>
                    <SelectItem value="false">
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
                  value={allowMultipleVotes.toString()}
                  onValueChange={(value) => setAllowMultipleVotes(value === "true")}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">
                      <div className="flex items-center">
                        <Vote className="mr-2 h-4 w-4" />
                        Single choice - One vote per person
                      </div>
                    </SelectItem>
                    <SelectItem value="true">
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
                    value={expirationDays}
                    onValueChange={setExpirationDays}
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {submitButtonText === "Create Poll" ? "Creating..." : "Updating..."}
                  </>
                ) : (
                  <>
                    <Vote className="mr-2 h-4 w-4" />
                    {submitButtonText}
                  </>
                )}
              </Button>
            </div>

            {/* Hidden inputs for form submission */}
            <input type="hidden" name="title" value={title} />
            <input type="hidden" name="description" value={description} />
            <input type="hidden" name="isPublic" value={isPublic.toString()} />
            <input type="hidden" name="allowMultipleVotes" value={allowMultipleVotes.toString()} />
            <input type="hidden" name="expirationDays" value={expirationDays} />
            {options.map((option, index) => (
              <input key={index} type="hidden" name={`options[${index}]`} value={option} />
            ))}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
