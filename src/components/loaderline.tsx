"use client";
import { motion } from "framer-motion";

const LoaderLine = () => (
  <svg
    width={54}
    height={41}
    viewBox="0 0 54 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="dark:invert"
  >
    <motion.path
      d="M26.7005 9.71436C24.1005 9.71436 22.0005 11.7888 22.0005 14.3572C22.0005 16.9059 24.1005 18.9803 26.6805 19.0001C26.0405 18.9803 25.5405 18.4667 25.5405 17.8344C25.5405 17.2022 26.0605 16.6688 26.7205 16.6688C29.5205 16.6688 35.7405 16.6688 38.4805 16.6688C40.4205 16.6688 42.0005 15.108 42.0005 13.1916C42.0005 11.2751 40.4205 9.71436 38.4805 9.71436L26.7005 9.71436Z"
      initial={{ fill: "rgba(255, 255, 255, 0)" }}
      animate={{ fill: "rgba(255, 255, 255, 1)" }}
      transition={{
        duration: 1.2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    />

    <motion.path
      d="M20.9861 19C18.3861 19 16.2861 21.0745 16.2861 23.6429C16.2861 26.1916 18.3861 28.266 20.9661 28.2858C20.3261 28.266 19.8261 27.7523 19.8261 27.1201C19.8261 26.4879 20.3461 25.9545 21.0062 25.9545C23.8061 25.9545 30.0261 25.9545 32.7661 25.9545C34.7061 25.9545 36.2861 24.3937 36.2861 22.4773C36.2861 20.5608 34.7061 19 32.7661 19L20.9861 19Z"
      initial={{ fill: "rgba(255, 255, 255, 0)" }}
      animate={{ fill: "rgba(255, 255, 255, 1)" }}
      transition={{
        duration: 1.2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: 0.4,
      }}
    />

    <motion.path
      d="M17.0357 28.2858C14.25 28.2858 12 30.5198 12 33.2858C12 36.0305 14.25 38.2645 17.0143 38.2858C16.3286 38.2645 15.7929 37.7113 15.7929 37.0304C15.7929 36.3496 16.35 35.7752 17.0572 35.7752C20.0571 35.7752 26.7214 35.7752 29.6572 35.7752C31.7357 35.7752 33.4286 34.0943 33.4286 32.0305C33.4286 29.9666 31.7357 28.2858 29.6572 28.2858H17.0357Z"
      initial={{ fill: "rgba(255, 255, 255, 0)" }}
      animate={{ fill: "rgba(255, 255, 255, 1)" }}
      transition={{
        duration: 1.2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: 0.8,
      }}
    />
  </svg>
);

export default LoaderLine;
