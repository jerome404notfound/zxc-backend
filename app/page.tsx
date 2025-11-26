"use client";
import { DiscordIcon, TelegramIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import Lamp from "./lamp";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans overflow-hidden">
      <Lamp />
      <main className="z-10 flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        >
          <Image
            src="/zxc.svg"
            alt="Next.js logo"
            width={70}
            height={20}
            priority
          />
        </motion.div>

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
            className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50"
          >
            To begin embedding, use the links provided below.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <h1 className="font-medium">Movies</h1>
            <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              https://zxcstream.xyz/embed/movie/
              <span className="font-medium text-zinc-950 dark:text-zinc-50">
                {"{"}tmdb-Id{"}"}
              </span>
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
          >
            <h1>TV Shows</h1>
            <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              https://zxcstream.xyz/embed/tv/
              <span className="font-medium text-zinc-950 dark:text-zinc-50">
                {"{"}tmdb-Id{"}"}/{"{"}season{"}"}/{"{"}episode{"}"}
              </span>
            </p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
          className="flex justify-between w-full"
        >
          <h1 className="text-lg font-semibold">Join our community!</h1>
          <div className="flex gap-6">
            <span className="flex items-center gap-3">
              <HugeiconsIcon
                icon={TelegramIcon}
                size={24}
                color="#0088CC"
                strokeWidth={1.5}
              />
              <Link target="_blank" href={"https://t.me/zxc_stream"}>
                <span className="text-sm hover:underline">Telegram</span>
              </Link>
            </span>
            <span className="flex items-center gap-3">
              <HugeiconsIcon
                icon={DiscordIcon}
                size={24}
                color="#7289DA"
                strokeWidth={1.5}
              />
              <Link target="_blank" href={"https://discord.gg/yv7wJV97Jd"}>
                <span className="text-sm hover:underline">Discord</span>
              </Link>
            </span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.8 }}
          className="flex flex-col gap-4 text-base font-medium sm:flex-row"
        >
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://zxcstream.xyz/embed/movie/1062722"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Movie
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/8 px-5 transition-colors hover:border-transparent hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://zxcstream.xyz/embed/tv/60625/1/1"
            target="_blank"
            rel="noopener noreferrer"
          >
            TV Show
          </a>
        </motion.div>
      </main>
    </div>
  );
}
