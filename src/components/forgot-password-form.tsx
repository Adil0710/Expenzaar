"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  EyeIcon,
  EyeOffIcon,
  Mail,
  KeyRound,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import axios from "axios";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import LoaderLine from "@/components/loaderline";
import PasswordIcon from "@/components/SVG/password";
import {
  emailSchema,
  otpSchema,
  passwordSchema,
} from "@/schemas/forgotPasswordSchema";

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

const stepData = [
  { title: "Email", icon: Mail },
  { title: "Verify", icon: KeyRound },
  { title: "Reset", icon: Lock },
  { title: "Done", icon: CheckCircle2 },
];

interface ForgotPasswordFormProps {
  initialStep?: number;
  initialEmail?: string;
  initialOtp?: string;
}

export default function ForgotPasswordForm({
  initialStep = 1,
  initialEmail = "",
  initialOtp = "",
}: ForgotPasswordFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [otpValue, setOtpValue] = useState(initialOtp);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [error, setError] = useState<string | null>(null);

  // Email form
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: initialEmail,
    },
  });

  // OTP form
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: initialOtp,
    },
  });

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Update URL with current step and email
  useEffect(() => {
    // Initialize from props when component mounts
    if (initialStep > 1) {
      setStep(initialStep);
    }

    if (initialEmail) {
      setEmail(initialEmail);
    }

    if (initialOtp) {
      setOtpValue(initialOtp);
    }
  }, [initialStep, initialEmail, initialOtp]);
  // Handle email submission
  const onSubmitEmail = async (data: z.infer<typeof emailSchema>) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/auth/forgot-password", {
        email: data.email,
      });

      if (!res.data.success) {
        toast({
          title: "Error",
          description:
            res.data.message || "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
        setError(res.data.message);
        return;
      }

      // Store email for later steps
      setEmail(data.email);

      toast({
        title: "OTP Sent",
        description: "We've sent a 6-digit code to your email",
      });
      setStep(2);
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to verify email. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP submission
  const onSubmitOTP = async (data: z.infer<typeof otpSchema>) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/auth/verify-otp", {
        email,
        otp: data.otp,
      });

      if (!res.data.success) {
        toast({
          title: "Error",
          description: res.data.message || "Invalid OTP. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Store OTP for password reset step
      setOtpValue(data.otp);

      toast({
        title: "OTP verified",
        description: "Please set your new password",
      });

      setStep(3);
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || "Invalid OTP. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle password submission
  const onSubmitPassword = async (data: z.infer<typeof passwordSchema>) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/auth/reset-password", {
        email,
        password: data.password,
        otp: otpValue,
      });

      if (!res.data.success) {
        toast({
          title: "Error",
          description:
            res.data.message || "Failed to reset password. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Your password has been reset successfully",
      });

      setStep(4);
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/auth/forgot-password", {
        email,
      });

      if (!res.data.success) {
        toast({
          title: "Error",
          description:
            res.data.message || "Failed to resend OTP. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "OTP Sent",
        description: "We've sent a new 6-digit code to your email",
      });
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to resend OTP. Please try again.";
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
    <div className="w-full max-w-sm md:max-w-3xl">
      <div className={cn("relative z-0 flex flex-col gap-6")}>
        <div className="dark:block hidden rounded-full h-44 w-44 bg-blue-400 absolute -left-10 -top-10 blur-3xl opacity-80"></div>
        <Card className="overflow-hidden z-10">
          <div className="flex md:flex-row flex-col">
            {/* Modern Step Indicator - Left Side */}
            <div className="bg-gradient-to-b from-neutral-50 to-neutral-100 p-4 dark:from-neutral-900 dark:to-neutral-800 md:border-r border-b md:w-24 w-full">
              <div className="flex md:flex-col items-center justify-between relative md:h-full">
                {/* Connecting Line - Background (Vertical on md+) */}
                <div className="absolute md:left-1/2 md:top-0 md:h-full md:w-[2px] top-1/2 left-0 w-full h-[2px] bg-neutral-200 dark:bg-neutral-700 z-10"></div>

                {/* Connecting Line - Progress (Vertical on md+) */}
                <div
                  className="absolute md:left-1/2 md:top-0 md:w-[2px] top-1/2 left-0 h-[2px] bg-primary z-10 transition-all duration-500 ease-in-out"
                  style={{
                    height: !isMobile
                      ? `${((step - 1) / (stepData.length - 0.5)) * 100}%`
                      : "2px",
                    width: !isMobile
                      ? "2px"
                      : `${((step - 1) / (stepData.length - 1)) * 100}%`,
                  }}
                ></div>

                {stepData.map((s, i) => {
                  const isActive = i + 1 === step;
                  const isCompleted = i + 1 < step;
                  const Icon = s.icon;

                  return (
                    <div
                      key={i}
                      className="flex md:flex-col items-center z-10 md:mb-auto"
                    >
                      {/* Step Circle */}
                      <motion.div
                        className={`relative flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-2 ${
                          isActive
                            ? "border-primary bg-primary text-primary-foreground"
                            : isCompleted
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-neutral-300 bg-neutral-100 text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800"
                        }`}
                        initial={false}
                        animate={{
                          scale: isActive ? 1.1 : 1,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          },
                        }}
                      >
                        {isCompleted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 20,
                            }}
                          >
                            <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
                          </motion.div>
                        ) : (
                          <Icon className="h-5 w-5 md:h-6 md:w-6" />
                        )}
                      </motion.div>

                      {/* Step Title */}
                      <motion.span
                        className={`md:mt-2 ml-2 md:ml-0 text-xs font-bold z-30 bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800  ${
                          isActive || isCompleted
                            ? "text-primary"
                            : "text-neutral-900 dark:text-neutral-400"
                        }`}
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0.7,
                          y: isActive ? 0 : 2,
                        }}
                      >
                        {s.title}
                      </motion.span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center dark:bg-neutral-950 ">
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div
                    key="error-step"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-5 w-full text-center flex flex-col"
                  >
                    <span className="text-muted-foreground text-sm">
                      {error}
                    </span>
                    {error.includes("Please use Google to login") ? (
                      <div className="flex flex-row justify-center items-center gap-4 mt-5">
                        <Link href="/signin">
                          <Button>Sign in</Button>
                        </Link>
                        <Link href="/signup">
                          <Button variant="secondary">Sign up</Button>
                        </Link>
                      </div>
                    ) : error.includes("User not found with this email") ? (
                      <Link href="/signup" className="mt-5">
                        <Button variant="default">Sign up</Button>
                      </Link>
                    ) : (
                      <Button
                        variant="default"
                        className="mt-5"
                        onClick={() => {
                          setError(null);
                          setStep(1);
                          emailForm.reset();
                          otpForm.reset();
                          passwordForm.reset();
                        }}
                      >
                        Try Again
                      </Button>
                    )}
                  </motion.div>
                ) : (
                  <>
                    {step === 1 && (
                      <motion.div
                        key="email-step"
                        variants={fadeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <Form {...emailForm}>
                          <form
                            className="p-5 dark:bg-neutral-950 bg-white h-full"
                            onSubmit={emailForm.handleSubmit(onSubmitEmail)}
                          >
                            <div className="flex flex-col gap-6">
                              <motion.div
                                className="flex flex-col items-center text-center"
                                variants={formItemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={0}
                              >
                                <h1 className="text-2xl font-bold">
                                  Forgot Password
                                </h1>
                                <p className="text-balance text-muted-foreground mt-2 text-sm">
                                  Enter your email to reset your password
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
                                  control={emailForm.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Email</FormLabel>
                                      <FormControl>
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
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>

                              {error &&
                                error !==
                                  "User not found with this email. Please Signup." && (
                                  <motion.div
                                    variants={formItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={1.5}
                                    className="text-destructive text-sm"
                                  >
                                    {error}
                                  </motion.div>
                                )}

                              <motion.div
                                variants={formItemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={2}
                              >
                                <Button
                                  type="submit"
                                  className="w-full cursor-pointer [&_svg:not([class*='size-'])]:size-12"
                                  disabled={loading}
                                >
                                  {loading ? <LoaderLine /> : "Next"}
                                </Button>
                              </motion.div>

                              {error ===
                                "User not found with this email. Please Signup." && (
                                <motion.div
                                  variants={formItemVariants}
                                  initial="hidden"
                                  animate="visible"
                                  custom={3}
                                  className="flex flex-col gap-2 items-center"
                                >
                                  <span className="text-destructive text-sm">
                                    {error}
                                  </span>
                                  <Link href="/signup">
                                    <Button variant="outline" size="sm">
                                      Sign up
                                    </Button>
                                  </Link>
                                </motion.div>
                              )}
                            </div>
                          </form>
                        </Form>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="otp-step"
                        variants={fadeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <Form {...otpForm}>
                          <form
                            className="p-5 dark:bg-neutral-950 bg-white"
                            onSubmit={otpForm.handleSubmit(onSubmitOTP)}
                          >
                            <div className="flex flex-col gap-6">
                              <motion.div
                                className="flex flex-col items-center text-center"
                                variants={formItemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={0}
                              >
                                <h1 className="text-2xl font-bold">
                                  Verification Code
                                </h1>
                                <p className=" text-muted-foreground mt-2 text-sm">
                                  We've sent a 6-digit code to {email}
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
                                  control={otpForm.control}
                                  name="otp"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Enter 6-digit code</FormLabel>
                                      <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                          <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                          </InputOTPGroup>
                                        </InputOTP>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>

                              {error && (
                                <motion.div
                                  variants={formItemVariants}
                                  initial="hidden"
                                  animate="visible"
                                  custom={1.5}
                                  className="text-destructive text-sm"
                                >
                                  {error}
                                </motion.div>
                              )}

                              <motion.div
                                variants={formItemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={2}
                              >
                                <Button
                                  type="submit"
                                  className="w-full cursor-pointer [&_svg:not([class*='size-'])]:size-12"
                                  disabled={loading}
                                >
                                  {loading ? <LoaderLine /> : "Verify Code"}
                                </Button>
                              </motion.div>

                              <motion.div
                                variants={formItemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={3}
                                className="flex flex-col gap-2"
                              >
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="text-xs"
                                  onClick={() => setStep(1)}
                                  disabled={loading}
                                >
                                  Back to email
                                </Button>

                                <Button
                                  type="button"
                                  variant="link"
                                  className="text-xs text-muted-foreground"
                                  onClick={handleResendOTP}
                                  disabled={loading}
                                >
                                  Didn't receive a code? Resend
                                </Button>
                              </motion.div>
                            </div>
                          </form>
                        </Form>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="password-step"
                        variants={fadeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <Form {...passwordForm}>
                          <form
                            className="p-6 md:p-8 dark:bg-neutral-950 bg-white"
                            onSubmit={passwordForm.handleSubmit(
                              onSubmitPassword
                            )}
                          >
                            <div className="flex flex-col gap-6">
                              <motion.div
                                className="flex flex-col items-center text-center"
                                variants={formItemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={0}
                              >
                                <h1 className="text-2xl font-bold">
                                  Reset Password
                                </h1>
                                <p className="text-balance text-muted-foreground mt-2 text-sm">
                                  Create a new password for your account
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
                                  control={passwordForm.control}
                                  name="password"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>New Password</FormLabel>
                                      <div className="relative">
                                        <FormControl>
                                          <Input
                                            type={
                                              showPassword ? "text" : "password"
                                            }
                                            placeholder="••••••••"
                                            {...field}
                                            className="mb-2"
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
                                  control={passwordForm.control}
                                  name="confirmPassword"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Confirm Password</FormLabel>
                                      <div className="relative">
                                        <FormControl>
                                          <Input
                                            type={
                                              showConfirmPassword
                                                ? "text"
                                                : "password"
                                            }
                                            placeholder="••••••••"
                                            {...field}
                                            className="mb-2"
                                          />
                                        </FormControl>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                                          onClick={() =>
                                            setShowConfirmPassword(
                                              !showConfirmPassword
                                            )
                                          }
                                          type="button"
                                        >
                                          {showConfirmPassword ? (
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

                              {error && (
                                <motion.div
                                  variants={formItemVariants}
                                  initial="hidden"
                                  animate="visible"
                                  custom={2.5}
                                  className="text-destructive text-sm"
                                >
                                  {error}
                                </motion.div>
                              )}

                              <motion.div
                                variants={formItemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={3}
                              >
                                <Button
                                  type="submit"
                                  className="w-full cursor-pointer [&_svg:not([class*='size-'])]:size-12"
                                  disabled={loading}
                                >
                                  {loading ? <LoaderLine /> : "Reset Password"}
                                </Button>
                              </motion.div>

                              <motion.div
                                variants={formItemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={4}
                              >
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="w-full text-xs"
                                  onClick={() => setStep(2)}
                                  disabled={loading}
                                >
                                  Back to verification
                                </Button>
                              </motion.div>
                            </div>
                          </form>
                        </Form>
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div
                        key="success-step"
                        variants={fadeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="p-6 md:p-8 dark:bg-neutral-950 bg-white">
                          <div className="flex flex-col gap-6">
                            <motion.div
                              className="flex flex-col items-center text-center"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                                delay: 0.2,
                              }}
                            >
                              <motion.div
                                className="mb-4 rounded-full bg-green-100 p-4 dark:bg-green-900"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20,
                                  delay: 0.4,
                                }}
                              >
                                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                              </motion.div>
                              <h1 className="text-2xl font-bold">
                                Password Reset Successful
                              </h1>
                              <p className="text-balance text-muted-foreground mt-2 text-sm">
                                Your password has been reset successfully. You
                                can now log in with your new password.
                              </p>
                            </motion.div>

                            <motion.div
                              variants={formItemVariants}
                              initial="hidden"
                              animate="visible"
                              custom={1}
                            >
                              <Button
                                type="button"
                                className="w-full cursor-pointer"
                                onClick={() => router.push("/signin")}
                              >
                                Go to Login
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="relative hidden bg-neutral-50 dark:bg-neutral-300 md:flex md:justify-center md:items-center">
              <PasswordIcon />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
