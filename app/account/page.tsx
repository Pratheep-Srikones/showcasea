"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Upload, User, Lock, Bell, Palette, Shield } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { UserType } from "@/types/types";
import { trpc } from "@/lib/trpc/client";
import { toastError, toastSuccess } from "@/lib/helpers/toast";

export default function AccountPage() {
  const { user, setUser } = useAuthStore();
  const [image, setImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState(
    user?.profile_picture_url || null
  );
  const [userData, setUserData] = useState<UserType | null>({} as UserType);
  useEffect(() => {
    if (user) {
      setUserData({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        bio: user.bio,
        profile_picture_url: user.profile_picture_url,
        __v: user.__v,
        privacy: user.privacy,
        notifications: user.notifications,
        social_media: user.social_media,
      });
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])?[a-zA-Z\d\W_]{8,}$/;
    return passwordRegex.test(password);
  };

  const updatePicMutation = trpc.user.updateProfilePic.useMutation();
  const updateDetailsMutation = trpc.user.updateDetails.useMutation();
  const updateSocialMediaMutation = trpc.user.updateSocialMedia.useMutation();
  const updatePasswordMutation = trpc.user.changePassword.useMutation();
  const updatenotifiationsMutation =
    trpc.user.updateNotifications.useMutation();
  const updatePrivacyMutation = trpc.user.updatePrivacy.useMutation();

  const handleUpdateDetails = async () => {
    if (!userData?.first_name || !userData?.last_name || !userData?.bio) {
      toastError("Please fill in all fields");
      return;
    }
    await updateDetailsMutation.mutateAsync(
      {
        first_name: userData.first_name,
        last_name: userData.last_name,
        bio: userData.bio,
      },
      {
        onSuccess: (data) => {
          toastSuccess("Profile updated successfully");
          setUser(data);
        },
        onError: (error) => {
          console.error("Error updating profile:", error);
          toastError("Failed to update profile");
        },
      }
    );
  };

  const handleUpdateProfilePic = async () => {
    if (image) {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64String = reader.result as string;

        await updatePicMutation.mutateAsync(base64String, {
          onSuccess: (data) => {
            toastSuccess("Profile picture updated successfully");
            setUser(data);
          },
          onError: (error) => {
            console.error("Error updating profile picture:", error);
            toastError("Failed to update profile picture");
          },
        });
      };

      reader.readAsDataURL(image); // 🛑 YOU MISSED THIS LINE
    } else {
      toastError("Please select an image to upload");
    }
  };

  const handleUpdateSocialMedia = async () => {
    if (
      !userData?.social_media?.website &&
      !userData?.social_media?.twitter &&
      !userData?.social_media?.instagram
    ) {
      toastError("Please fill in at least one social media link");
      return;
    }
    await updateSocialMediaMutation.mutateAsync(
      {
        website: userData.social_media.website || "",
        twitter: userData.social_media.twitter || "",
        instagram: userData.social_media.instagram || "",
      },
      {
        onSuccess: (data) => {
          toastSuccess("Social media links updated successfully");
          console.log("Updated user data:", data);
          setUser(data);
        },
        onError: (error) => {
          console.error("Error updating social media links:", error);
          toastError("Failed to update social media links");
        },
      }
    );
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toastError("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toastError("New password and confirmation do not match");
      return;
    }
    if (!validatePassword(newPassword)) {
      toastError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      );
      return;
    }

    await updatePasswordMutation.mutateAsync(
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
      {
        onSuccess: () => {
          toastSuccess("Password updated successfully");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (error) => {
          console.error("Error updating password:", error);
          toastError("Failed to update password");
        },
      }
    );
  };

  const handleUpdateNotifications = async () => {
    await updatenotifiationsMutation.mutateAsync(
      {
        comments: userData?.notifications?.comments || false,
        likes: userData?.notifications?.likes || false,
        follows: userData?.notifications?.follows || false,
        messages: userData?.notifications?.messages || false,
        marketing: userData?.notifications?.marketing || false,
      },
      {
        onSuccess: (data) => {
          toastSuccess("Notification preferences updated successfully");
          setUser(data);
        },
        onError: (error) => {
          console.error("Error updating notification preferences:", error);
          toastError("Failed to update notification preferences");
        },
      }
    );
  };

  const handleUpdatePrivacy = async () => {
    await updatePrivacyMutation.mutateAsync(
      {
        profile_visibility: userData?.privacy?.profile_visibility || false,
        search_visibility: userData?.privacy?.search_visibility || false,
        comments: userData?.privacy?.comments || false,
        data_collection: userData?.privacy?.data_collection || false,
      },
      {
        onSuccess: (data) => {
          toastSuccess("Privacy settings updated successfully");
          setUser(data);
        },
        onError: (error) => {
          console.error("Error updating privacy settings:", error);
          toastError("Failed to update privacy settings");
        },
      }
    );
  };
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 p-6 lg:p-10">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Account Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Password</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>

              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information and public details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={profileImage || "/placeholder.svg"}
                          alt="Profile"
                        />
                        <AvatarFallback>
                          {user?.first_name?.charAt(0).toUpperCase()}
                          {user?.last_name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-center gap-2">
                        <Input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <span
                          className="cursor-pointer text-xs font-light text-purple-500 hover:underline"
                          onClick={() =>
                            document.getElementById("profile-image")?.click()
                          }
                        >
                          Select Image
                        </span>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleUpdateProfilePic}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          JPG or PNG. 1MB max.
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First name</Label>
                          <Input
                            id="first-name"
                            value={userData?.first_name}
                            onChange={(e) => {
                              setUserData({
                                ...userData!,
                                first_name: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last name</Label>
                          <Input
                            id="last-name"
                            value={userData?.last_name}
                            onChange={(e) => {
                              setUserData({
                                ...userData!,
                                last_name: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          defaultValue={user?.username}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={user?.email}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={userData?.bio}
                          onChange={(e) => {
                            setUserData({
                              ...userData!,
                              bio: e.target.value,
                            });
                          }}
                          placeholder="Tell us about yourself"
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleUpdateDetails}>Save Changes</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>
                    Connect your social media accounts to your profile.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://yourwebsite.com"
                      value={userData?.social_media?.website}
                      onChange={(e) => {
                        setUserData({
                          ...userData!,
                          social_media: {
                            ...userData?.social_media!,
                            website: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      placeholder="@username"
                      value={userData?.social_media?.instagram}
                      onChange={(e) => {
                        setUserData({
                          ...userData!,
                          social_media: {
                            ...userData?.social_media!,
                            instagram: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      placeholder="@username"
                      value={userData?.social_media?.twitter}
                      onChange={(e) => {
                        setUserData({
                          ...userData!,
                          social_media: {
                            ...userData?.social_media!,
                            twitter: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleUpdateSocialMedia}>Save Links</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="password" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => {
                        setOldPassword(e.target.value);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    variant="default"
                    onClick={handleUpdatePassword}
                    disabled={!oldPassword || !newPassword || !confirmPassword}
                  >
                    Update Password
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="comments">Comments</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when someone comments on your
                        artwork.
                      </p>
                    </div>
                    <Switch
                      id="comments"
                      checked={userData?.notifications?.comments}
                      onCheckedChange={(checked) => {
                        setUserData({
                          ...userData!,
                          notifications: {
                            ...userData?.notifications!,
                            comments: checked,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="likes">Likes</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when someone likes your artwork.
                      </p>
                    </div>
                    <Switch
                      id="likes"
                      checked={userData?.notifications?.likes}
                      onCheckedChange={(checked) => {
                        setUserData({
                          ...userData!,
                          notifications: {
                            ...userData?.notifications!,
                            likes: checked,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="follows">Follows</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when someone follows you.
                      </p>
                    </div>
                    <Switch
                      id="follows"
                      checked={userData?.notifications?.follows}
                      onCheckedChange={(checked) => {
                        setUserData({
                          ...userData!,
                          notifications: {
                            ...userData?.notifications!,
                            follows: checked,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="messages">Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for new messages.
                      </p>
                    </div>
                    <Switch
                      id="messages"
                      checked={userData?.notifications?.messages}
                      onCheckedChange={(checked) => {
                        setUserData({
                          ...userData!,
                          notifications: {
                            ...userData?.notifications!,
                            messages: checked,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing">Marketing</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about new features and special offers.
                      </p>
                    </div>
                    <Switch
                      id="marketing"
                      checked={userData?.notifications?.marketing}
                      onCheckedChange={(checked) => {
                        console.log("checked", checked);
                        setUserData({
                          ...userData!,
                          notifications: {
                            ...userData?.notifications!,
                            marketing: checked,
                          },
                        });
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleUpdateNotifications}>
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Manage your privacy and security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="profile-visibility">
                        Profile Visibility
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to everyone.
                      </p>
                    </div>
                    <Switch
                      id="profile-visibility"
                      checked={userData?.privacy?.profile_visibility}
                      onCheckedChange={(checked) => {
                        setUserData({
                          ...userData!,
                          privacy: {
                            ...userData?.privacy!,
                            profile_visibility: checked,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="artwork-comments">Artwork Comments</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to comment on your artworks.
                      </p>
                    </div>
                    <Switch
                      id="artwork-comments"
                      checked={userData?.privacy?.comments}
                      onCheckedChange={(checked) => {
                        setUserData({
                          ...userData!,
                          privacy: {
                            ...userData?.privacy!,
                            comments: checked,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="search-visibility">
                        Search Visibility
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow your profile to appear in search results.
                      </p>
                    </div>
                    <Switch
                      id="search-visibility"
                      checked={userData?.privacy?.search_visibility}
                      onCheckedChange={(checked) => {
                        setUserData({
                          ...userData!,
                          privacy: {
                            ...userData?.privacy!,
                            search_visibility: checked,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-collection">Data Collection</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow us to collect usage data to improve your
                        experience.
                      </p>
                    </div>
                    <Switch
                      id="data-collection"
                      checked={userData?.privacy?.data_collection}
                      onCheckedChange={(checked) => {
                        setUserData({
                          ...userData!,
                          privacy: {
                            ...userData?.privacy!,
                            data_collection: checked,
                          },
                        });
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleUpdatePrivacy}>
                    Save Privacy Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
