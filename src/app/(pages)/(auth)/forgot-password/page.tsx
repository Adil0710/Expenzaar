"use client";

import { useState } from "react";
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
import { emailSchema, otpSchema, passwordSchema } from "@/schemas/forgotPasswordSchema";
import PasswordIcon from "@/components/SVG/password";



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

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Email form
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  // OTP form
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
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

  // Handle email submission
  const onSubmitEmail = async (data: z.infer<typeof emailSchema>) => {
    setLoading(true);

    try {
      // Simulate API call to check if email exists
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store email for later steps
      setEmail(data.email);

      // Move to next step
      setStep(2);

      toast({
        title: "Email verified",
        description: "We've sent a 6-digit code to your email",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP submission
  const onSubmitOTP = async (data: z.infer<typeof otpSchema>) => {
    setLoading(true);

    try {
      // Simulate API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Move to next step
      setStep(3);

      toast({
        title: "OTP verified",
        description: "Please set your new password",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle password submission
  const onSubmitPassword = async (data: z.infer<typeof passwordSchema>) => {
    setLoading(true);

    try {
      // Simulate API call to reset password
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Move to success step
      setStep(4);

      toast({
        title: "Success",
        description: "Your password has been reset successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center dark:bg-black bg-neutral-100 p-6 md:p-10">
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
                          className={`md:mt-2 ml-2 md:ml-0 text-xs font-medium ${
                            isActive || isCompleted
                              ? "text-primary"
                              : "text-neutral-500 dark:text-neutral-400"
                          }`}
                          initial={false}
                          animate={{
                            opacity: isActive ? 1 : 0.7,
                            y: isActive ? 0 : 2,
                          }}
                        >
                       
                        </motion.span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center dark:bg-neutral-950 ">
                <AnimatePresence mode="wait">
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

                            <motion.div
                              className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center "
                              variants={formItemVariants}
                              initial="hidden"
                              animate="visible"
                              custom={3}
                            >
                            
                            </motion.div>
                            <div className=""></div>
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
                              <p className="text-balance text-muted-foreground mt-2 text-sm">
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
                          onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
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
                              Your password has been reset successfully. You can
                              now log in with your new password.
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
                              onClick={() => router.push("/login")}
                            >
                              Go to Login
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative hidden bg-neutral-50 dark:bg-neutral-300 md:flex md:justify-center md:items-center">
               <PasswordIcon/>
              </div>
            </div>
          </Card>
         
        </div>
      </div>
    </div>
  );
}
