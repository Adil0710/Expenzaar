"use client";

import {
  CheckIcon,
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { type Profile, useProfileStore } from "@/lib/store/profileStore";
import LoaderLine from "./loaderline";
import { currencies } from "@/lib/currencies";

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
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ProfileFormValues } from "@/types/profile";



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
  const [currencyOpen, setCurrencyOpen] = useState(false);
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
  const [selectedCurrency, setSelectedCurrency] = useState<
    (typeof currencies)[0] | null
  >(null);

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
      currencySymbol: profile?.user?.currencySymbol || "",
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
      if (!selectedCurrency) {
        profileForm.setError("currencySymbol", {
          type: "manual",
          message: "Please select a currency",
        });
        return;
      }

      const profileData: Partial<Profile> = {
        user: {
          name: data.name,
          email: data.email,
          salary: data.salary ?? 0,
          currencySymbol: selectedCurrency.symbol,
          currencyCode: selectedCurrency.code,
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
      console.log(error);
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

  useEffect(() => {
    if (profile?.user) {
      profileForm.reset({
        name: profile.user.name || "",
        email: profile.user.email || "",
        salary: profile.user.salary,
        currencySymbol: profile.user.currencySymbol || "",
      });

      // Set the selected currency based on the stored code
      if (profile.user.currencyCode) {
        const userCurrency = currencies.find(
          (c) => c.code === profile.user.currencyCode
        );
        setSelectedCurrency(userCurrency || null);
      } else {
        setSelectedCurrency(null);
      }
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
                    <TabsTrigger value="profile" className="cursor-pointer">
                      <CircleUser className="mr-2" size={20} />
                      Profile
                    </TabsTrigger>
                    {!loggedUser.googleAccount && (
                      <TabsTrigger value="password" className="cursor-pointer">
                        <LockKeyhole className="mr-2" size={20} />
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
                                <Skeleton className="w-full h-8" />
                              ) : (
                                <div className="relative">
                                  <FormControl className="pl-10">
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
                                <Skeleton className="w-full h-8" />
                              ) : (
                                <div className="relative">
                                  <FormControl className="pl-10">
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
                        <FormLabel>Salary</FormLabel>
                        <div className="relative flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Popover
                              open={currencyOpen}
                              onOpenChange={setCurrencyOpen}
                            >
                              <PopoverTrigger asChild>
                                {profileLoading ? (
                                  <Skeleton className="w-[180px] h-8" />
                                ) : (
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={currencyOpen}
                                    className="w-[180px] justify-between"
                                  >
                                    {selectedCurrency ? (
                                      <span className="text-ellipsis line-clamp-1">
                                        {selectedCurrency.symbol} -{" "}
                                        {selectedCurrency.name}
                                      </span>
                                    ) : (
                                      <>
                                        {" "}
                                        <DollarSign /> - &nbsp; Currency{" "}
                                      </>
                                    )}
                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                )}
                              </PopoverTrigger>
                              <PopoverContent className="w-[280px] p-0">
                                <Command className="overflow-hidden">
                                  <CommandInput
                                    placeholder="Search currency..."
                                    className="h-9"
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      No currency found.
                                    </CommandEmpty>
                                    <div
                                      className="max-h-[300px] overflow-y-auto"
                                      onWheel={(e) => e.stopPropagation()}
                                    >
                                      <CommandGroup>
                                        {currencies.map((currency) => (
                                          <CommandItem
                                            key={currency.code}
                                            value={`${currency.name} ${currency.code} ${currency.symbol}`}
                                            onSelect={() => {
                                              setSelectedCurrency(currency);
                                              profileForm.setValue(
                                                "currencySymbol",
                                                currency.symbol
                                              );
                                              profileForm.clearErrors(
                                                "currencySymbol"
                                              );
                                              setCurrencyOpen(false);
                                            }}
                                            className="cursor-pointer"
                                          >
                                            <CheckIcon
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedCurrency?.code ===
                                                  currency.code
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {currency.symbol} - {currency.name}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </div>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>

                            <FormField
                              control={profileForm.control}
                              name="salary"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  {profileLoading ? (
                                    <Skeleton className="w-full h-8" />
                                  ) : (
                                    <div className="relative">
                                      <FormControl className="pl-10">
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
                                          disabled={!selectedCurrency}
                                        />
                                      </FormControl>
                                      <span
                                        className={cn(
                                          "absolute left-3 top-1/2 transform -translate-y-1/2 text-sm",
                                          !selectedCurrency &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        {selectedCurrency?.symbol || (
                                          <DollarSign className=" h-4 w-4 " />
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={profileForm.control}
                            name="currencySymbol"
                            render={({ field }) => (
                              <FormItem className="m-0 p-0">
                                <FormControl>
                                  <Input {...field} className="hidden" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

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
                                <Skeleton className="w-full h-8" />
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
                                <Skeleton className="w-full h-8" />
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
                                <Skeleton className="w-full h-8" />
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

export default NavUser;
