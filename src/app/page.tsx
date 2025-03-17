"use client";
import Image from "next/image";
import { motion } from "framer-motion";
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <motion.svg
          width={54}
          height={54}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <g filter="url(#filter0_ddiii_3202_880)">
            <motion.g
              clipPath="url(#clip0_3202_880)"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.rect
                x={3}
                width={48}
                height={48}
                rx={12}
                fill="black"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.rect
                width={48}
                height={48}
                transform="translate(3)"
                fill="url(#paint0_linear_3202_880)"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <g filter="url(#filter1_d_3202_880)">
                <motion.path
                  d="M26.7005 9.71436C24.1005 9.71436 22.0005 11.7888 22.0005 14.3572C22.0005 16.9059 24.1005 18.9803 26.6805 19.0001C26.0405 18.9803 25.5405 18.4667 25.5405 17.8344C25.5405 17.2022 26.0605 16.6688 26.7205 16.6688C29.5205 16.6688 35.7405 16.6688 38.4805 16.6688C40.4205 16.6688 42.0005 15.108 42.0005 13.1916C42.0005 11.2751 40.4205 9.71436 38.4805 9.71436L26.7005 9.71436Z"
                  fill="white"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.path
                  d="M20.9861 19C18.3861 19 16.2861 21.0745 16.2861 23.6429C16.2861 26.1916 18.3861 28.266 20.9661 28.2858C20.3261 28.266 19.8261 27.7523 19.8261 27.1201C19.8261 26.4879 20.3461 25.9545 21.0062 25.9545C23.8061 25.9545 30.0261 25.9545 32.7661 25.9545C34.7061 25.9545 36.2861 24.3937 36.2861 22.4773C36.2861 20.5608 34.7061 19 32.7661 19L20.9861 19Z"
                  fill="white"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.path
                  d="M17.0357 28.2858C14.25 28.2858 12 30.5198 12 33.2858C12 36.0305 14.25 38.2645 17.0143 38.2858C16.3286 38.2645 15.7929 37.7113 15.7929 37.0304C15.7929 36.3496 16.35 35.7752 17.0572 35.7752C20.0571 35.7752 26.7214 35.7752 29.6572 35.7752C31.7357 35.7752 33.4286 34.0943 33.4286 32.0305C33.4286 29.9666 31.7357 28.2858 29.6572 28.2858H17.0357Z"
                  fill="white"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </g>
            </motion.g>
            <motion.rect
              x={4}
              y={1}
              width={46}
              height={46}
              rx={11}
              stroke="url(#paint1_linear_3202_880)"
              strokeWidth={2}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </g>
          <defs>
            <filter
              id="filter0_ddiii_3202_880"
              x={0}
              y={-3}
              width={54}
              height={57}
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              {/* Filter content unchanged */}
            </filter>
            <filter
              id="filter1_d_3202_880"
              x={8}
              y={5}
              width={38.0005}
              height={44}
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              {/* Filter content unchanged */}
            </filter>
            <linearGradient
              id="paint0_linear_3202_880"
              x1={24}
              y1={5.96047e-7}
              x2={26}
              y2={48}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity={0} />
              <stop offset={1} stopColor="white" stopOpacity={0.12} />
            </linearGradient>
            <linearGradient
              id="paint1_linear_3202_880"
              x1={27}
              y1={0}
              x2={27}
              y2={48}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity={0.12} />
              <stop offset={1} stopColor="white" stopOpacity={0} />
            </linearGradient>
            <clipPath id="clip0_3202_880">
              <rect x={3} width={48} height={48} rx={12} fill="white" />
            </clipPath>
          </defs>
        </motion.svg>
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
