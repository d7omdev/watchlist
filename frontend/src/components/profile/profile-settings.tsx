import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api";
import type { User as UserType } from "@/types/entry";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getImageUrl } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileSettingsProps {
  onClose: () => void;
  onProfileUpdate: (user: UserType) => void;
}

export function ProfileSettings({
  onClose,
  onProfileUpdate,
}: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await apiClient.getProfile();
        setUser(profile);
        setValue("name", profile.name);
        setAvatarPreview(profile.avatarUrl || "");
      } catch {
        toast.error("Failed to load profile");
      }
    };
    loadProfile();
  }, [setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setAvatarPreview("");
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      let avatarUrl = user?.avatarUrl;

      // Upload new image if selected
      if (selectedFile) {
        const uploadResponse = await apiClient.uploadImage(selectedFile);
        avatarUrl = uploadResponse.imageUrl;
      } else if (avatarPreview === "") {
        // User removed the image
        avatarUrl = "";
      }

      // Update profile
      const updatedUser = await apiClient.updateProfile({
        name: data.name,
        avatarUrl,
      });

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully!");
      onProfileUpdate(updatedUser);
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto rounded-md">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar
                src={avatarPreview ? (avatarPreview.startsWith('http') ? avatarPreview : getImageUrl(avatarPreview)) : undefined}
                fallback={getInitials(user.name)}
                size={120}
                className="border-2 border-border"
              />
              {avatarPreview && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-0 cursor-pointer  h-6 w-6 rounded-full p-0"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex flex-col items-center space-y-2">
              <Label htmlFor="avatar" className="cursor-pointer">
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Upload Photo</span>
                </div>
              </Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground text-center">
                JPG, PNG or GIF. Max 5MB.
              </p>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
