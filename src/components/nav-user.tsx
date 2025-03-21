"use client";

import {
  CircleUser,
  DollarSign,
  EllipsisVertical,
  EyeIcon,
  EyeOffIcon,
  LockKeyhole,
  LogOut,
  Mail,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getUserInitials } from "@/helpers/getUserInitials";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileUpdateSchema,
  passwordUpdateSchema,
} from "@/schemas/profileSchema";
import { useProfileStore } from "@/lib/store/profileStore";
import LoaderLine from "./loaderline";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "@/lib/utils";

type ProfileFormValues = {
  name: string;
  email: string;
  salary?: number;
};

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { data: session } = useSession();
  const { isMobile } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);

  const {
    profile,
    profileLoading,
    fetchProfile,
    updateProfile,
    updatePassword,
  } = useProfileStore();
  const { toast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tabType, setTabType] = useState<"profile" | "password">("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);

  const loggedUser = {
    name: session?.user.name || "Unknown",
    email: session?.user.email || "No email",
    googleAccount: session?.user.googleAccount || false,
  };

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: profile?.user?.name || "",
      email: profile?.user?.email || "",
      salary: profile?.user?.salary,
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      // Transform the form data to match the Profile structure
      const profileData = {
        user: {
          name: data.name,
          email: data.email,
          salary: data.salary ?? 0,
          createdAt: profile?.user?.createdAt || "",
        },
      };

      const success = await updateProfile(profileData);
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        setIsOpen(false);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPasswordSubmit = async (data: any) => {
    try {
      const success = await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (success) {
        toast({
          title: "Password Updated",
          description: "Your password has been changed successfully.",
        });
        setIsOpen(false);
        passwordForm.reset();
      } else {
        throw new Error("Failed to update password");
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Update Failed",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen, fetchProfile]);

  // Reset form with profile data when it's available
  useEffect(() => {
    if (profile && profile.user) {
      console.log("Setting form values with profile.user:", profile.user);
      profileForm.reset({
        name: profile.user.name || "",
        email: profile.user.email || "",
        salary: profile.user.salary,
      });
    }
  }, [profile, profileForm]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip="Profile"
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {getUserInitials(loggedUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{loggedUser.name}</span>
                <span className="truncate text-xs">{loggedUser.email}</span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {getUserInitials(loggedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {loggedUser.name}
                  </span>
                  <span className="truncate text-xs">{loggedUser.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer"
                >
                  <CircleUser className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <Tabs
                  defaultValue="profile"
                  onValueChange={(value) =>
                    setTabType(value as "profile" | "password")
                  }
                >
                  <TabsList
                    className={cn(
                      "grid w-[90%] max-w-2xl mx-auto grid-cols-1 mb-6 pb-8",
                      !loggedUser.googleAccount && "grid-cols-2"
                    )}
                  >
                    <TabsTrigger value="profile" className=" cursor-pointer">
                      <CircleUser className=" mr-2" size={20} />
                      Profile
                    </TabsTrigger>
                    {!loggedUser.googleAccount && (
                      <TabsTrigger value="password" className=" cursor-pointer">
                        <LockKeyhole className=" mr-2" size={20} />
                        Password
                      </TabsTrigger>
                    )}
                  </TabsList>
                  <TabsContent value="profile">
                    <DialogHeader>
                      <DialogTitle>Edit profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...profileForm}>
                      <form
                        className="space-y-6 mt-5"
                        onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                      >
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              {profileLoading ? (
                                <Skeleton className=" w-full h-8" />
                              ) : (
                                <div className="relative">
                                  <FormControl className=" pl-10">
                                    <Input placeholder="John Doe" {...field} />
                                  </FormControl>

                                  <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              {profileLoading ? (
                                <Skeleton className=" w-full h-8" />
                              ) : (
                                <div className="relative">
                                  <FormControl className=" pl-10">
                                    <Input
                                      type="email"
                                      placeholder="m@example.com"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value.toLowerCase()
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                                </div>
                              )}

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="salary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Salary</FormLabel>
                              {profileLoading ? (
                                <Skeleton className=" w-full h-8" />
                              ) : (
                                <div className="relative">
                                  <FormControl className=" pl-10">
                                    <Input
                                      type="number"
                                      placeholder="10000"
                                      {...field}
                                      value={field.value || ""}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value
                                            ? Number(e.target.value)
                                            : undefined
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                                </div>
                              )}

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full cursor-pointer [&_svg:not([class*='size-'])]:size-12"
                          disabled={profileLoading}
                        >
                          {profileLoading ? <LoaderLine /> : "Save Changes"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  <TabsContent value="password">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one to
                        update.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...passwordForm}>
                      <form
                        className="space-y-6 mt-5"
                        onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                      >
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              {profileLoading ? (
                                <Skeleton className=" w-full h-8" />
                              ) : (
                                <div className="relative">
                                  <FormControl>
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Enter current password"
                                      {...field}
                                    />
                                  </FormControl>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    type="button"
                                  >
                                    {showPassword ? (
                                      <EyeOffIcon className="h-4 w-4" />
                                    ) : (
                                      <EyeIcon className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">
                                      Toggle password visibility
                                    </span>
                                  </Button>
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              {profileLoading ? (
                                <Skeleton className=" w-full h-8" />
                              ) : (
                                <div className="relative">
                                  <FormControl>
                                    <Input
                                      type={newPassword ? "text" : "password"}
                                      placeholder="Enter new password"
                                      {...field}
                                    />
                                  </FormControl>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                                    onClick={() => setNewPassword(!newPassword)}
                                    type="button"
                                  >
                                    {newPassword ? (
                                      <EyeOffIcon className="h-4 w-4" />
                                    ) : (
                                      <EyeIcon className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">
                                      Toggle password visibility
                                    </span>
                                  </Button>
                                </div>
                              )}

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              {profileLoading ? (
                                <Skeleton className=" w-full h-8" />
                              ) : (
                                <div className="relative">
                                  <FormControl>
                                    <Input
                                      type={
                                        confirmPassword ? "text" : "password"
                                      }
                                      placeholder="Confirm new password"
                                      {...field}
                                    />
                                  </FormControl>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                                    onClick={() =>
                                      setConfirmPassword(!confirmPassword)
                                    }
                                    type="button"
                                  >
                                    {confirmPassword ? (
                                      <EyeOffIcon className="h-4 w-4" />
                                    ) : (
                                      <EyeIcon className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">
                                      Toggle password visibility
                                    </span>
                                  </Button>
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full cursor-pointer [&_svg:not([class*='size-'])]:size-12"
                          disabled={profileLoading}
                        >
                          {profileLoading ? <LoaderLine /> : "Update Password"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            {/* {!loggedUser.googleAccount && (
              <Dialog open={passwordChange} onOpenChange={setPasswordChange}>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="cursor-pointer"
                  >
                    <LockKeyhole className="mr-2 h-4 w-4" />
                    Change Password
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and choose a new one.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...passwordForm}>
                    <form
                      className="space-y-6"
                      onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    >
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            {profileLoading ? (
                              <Skeleton className=" w-full h-8" />
                            ) : (
                              <div className="relative">
                                <FormControl>
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    {...field}
                                  />
                                </FormControl>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                                  onClick={() => setShowPassword(!showPassword)}
                                  type="button" 
                                >
                                  {showPassword ? (
                                    <EyeOffIcon className="h-4 w-4" />
                                  ) : (
                                    <EyeIcon className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">
                                    Toggle password visibility
                                  </span>
                                </Button>
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              {profileLoading ? (
                                <Skeleton className=" w-full h-8" />
                              ) : (
                                <Input
                                  type="password"
                                  placeholder="Enter new password"
                                  {...field}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              {profileLoading ? (
                                <Skeleton className=" w-full h-8" />
                              ) : (
                                <Input
                                  type="password"
                                  placeholder="Confirm new password"
                                  {...field}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full cursor-pointer [&_svg:not([class*='size-'])]:size-12"
                        disabled={profileLoading}
                      >
                        {profileLoading ? <LoaderLine /> : "Update Password"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )} */}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500 cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4 text-red-500" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
