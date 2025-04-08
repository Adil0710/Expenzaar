"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { signUpSchema } from "@/schemas/signUpSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import LoaderLine from "@/components/loaderline";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import AuthSVG from "@/components/SVG/authSVG";

// Animation variants
const fadeVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const formItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: custom * 0.1,
    },
  }),
};

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/signup", data);

      if (response.data.success) {
        // Automatically sign in after successful signup
        const result = await signIn("credentials", {
          redirect: false, // Prevent NextAuth's automatic redirect
          email: data.email,
          password: data.password,
        });

        if (result?.ok) {
          router.push("/dashboard");

          toast({
            title: "Success",
            description: "Your account has been created successfully.",
          });
        } else {
          toast({
            title: "Login Failed",
            description: "Account created, but login failed. Please login.",
            variant: "destructive",
          });
          router.push("/signin");
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ||
        "An unexpected error occurred. Please try again later.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      await signIn("google");

      toast({
        title: "Login Successful",
        description: "Welcome back!",
        variant: "default",
      });
    } catch (error) {
      console.error("Google Sign-In failed:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center dark:bg-black bg-neutral-100 p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl ">
        <div className={cn("relative z-0 flex flex-col gap-6")}>
          <div className=" dark:block hidden rounded-full h-44 w-44 bg-blue-400 absolute -left-10 -top-10 blur-3xl opacity-80"></div>
          <Card className="overflow-hidden z-10">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form {...form}>
                <motion.form
                  key="email-step"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-6 md:p-8 dark:bg-neutral-950 bg-white "
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <AnimatePresence mode="wait">
                    <div className="flex flex-col gap-6">
                      <motion.div
                        variants={formItemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        className="flex flex-col items-center text-center"
                      >
                        <h1 className="text-2xl font-bold">Welcome Back !</h1>
                        <p className="text-balance text-muted-foreground mt-2 text-sm">
                          Sign up to create your Expenzaar account
                        </p>
                      </motion.div>
                      <motion.div
                        className="grid gap-2"
                        variants={formItemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  required
                                  placeholder="john doe"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      <motion.div
                        className="grid gap-2"
                        variants={formItemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                      >
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  required
                                  placeholder="john@example.com"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(e.target.value.toLowerCase())
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      <motion.div
                        className="grid gap-2"
                        variants={formItemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={3}
                      >
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••"
                                    {...field}
                                    className=" mb-2"
                                  />
                                </FormControl>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                                  onClick={() => setShowPassword(!showPassword)}
                                  type="button" // Prevent button from submitting form
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      <motion.div
                        variants={formItemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={4}
                      >
                        <Button
                          type="submit"
                          className="w-full cursor-pointer [&_svg:not([class*='size-'])]:size-12"
                          disabled={loading}
                        >
                          {loading ? <LoaderLine /> : "Sign Up"}
                        </Button>
                      </motion.div>
                      <motion.div
                        variants={formItemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={5}
                        className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"
                      >
                        <span className="relative z-10 bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </motion.div>
                      <motion.div
                        variants={formItemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={6}
                      >
                        <Button
                          variant="outline"
                          className="w-full cursor-pointer"
                          type="button"
                          onClick={handleGoogleSignIn}
                          disabled={loading}
                        >
                          <Image
                            className="w-4 h-4 mr-1"
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            width={50}
                            height={50}
                            loading="lazy"
                            alt="google logo"
                          />{" "}
                          Continue with Google
                          <span className="sr-only">Continue with Google</span>
                        </Button>
                      </motion.div>
                      <motion.div
                        variants={formItemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={7}
                        className="text-center text-sm"
                      >
                        Already have an account?{" "}
                        <Link
                          href="/signin"
                          className="underline underline-offset-4"
                        >
                          Login
                        </Link>
                      </motion.div>
                    </div>
                  </AnimatePresence>
                </motion.form>
              </Form>
              <div className="relative hidden bg-neutral-50 dark:bg-neutral-300 md:flex md:justify-center md:items-center">
                <AuthSVG />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
