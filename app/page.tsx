"use client";

import Image from "next/image";
import Link from "next/link";
import Lamp from "./lamp";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconBrandDiscordFilled, IconBrandTelegram } from "@tabler/icons-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans overflow-hidden bg-linear-to-b via-background from-background to-red-900/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        className="absolute z-20 top-8 left-12"
      >
        <img
          src="/zxc.svg"
          alt="Next.js logo"
          className="lg:size-10 size-12  "
        />
      </motion.div>

      <Lamp />
      <main className="z-10 flex  w-full max-w-5xl flex-col items-center  py-25 lg:px-16 px-6  space-y-15 sm:items-start">
        <div className="flex flex-col items-center gap-6 lg:text-left sm:items-start sm:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
            className="lg:max-w-sm lg:text-3xl text-xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50"
          >
            To begin embedding, use the links provided below.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <h1 className="font-medium">Movies</h1>
            <p className="max-w-4xl lg:text-lg text-sm leading-8 text-zinc-600 dark:text-zinc-400">
              1. https://zxcstream.xyz/player/movie/
              <span className="font-medium text-zinc-950 dark:text-zinc-50">
                {"{"}tmdb-Id{"}"}/{"{"}
                language{"}"}
              </span>{" "}
              - for audiotrack ex. "en"
            </p>
            <p className="max-w-4xl lg:text-lg text-sm leading-8 text-zinc-600 dark:text-zinc-400">
              2. https://zxcstream.xyz/embed/movie/
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
            <p className="max-w-4xl lg:text-lg text-sm leading-8 text-zinc-600 dark:text-zinc-400">
              1. https://zxcstream.xyz/player/tv/
              <span className="font-medium text-zinc-950 dark:text-zinc-50">
                {"{"}tmdb-Id{"}"}/{"{"}season{"}"}/{"{"}episode{"}"}/{"{"}
                language{"}"}
              </span>{" "}
              - for audiotrack ex. "en"
            </p>
            <p className="max-w-4xl lg:text-lg text-sm leading-8 text-zinc-600 dark:text-zinc-400">
              2. https://zxcstream.xyz/embed/tv/
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
          className="flex justify-between w-full lg:flex-row flex-col  items-center gap-3"
        >
          <h1 className="text-lg font-semibold">Join our community!</h1>
          <div className="flex gap-6">
            <span className="flex items-center gap-3">
              <IconBrandTelegram size={24} color="#0088CC" strokeWidth={1.5} />
              <Link target="_blank" href={"https://t.me/+AZZmZ7-_SFsxM2M9"}>
                <span className="text-sm hover:underline">Telegram</span>
              </Link>
            </span>
            <span className="flex items-center gap-3">
              <IconBrandDiscordFilled
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
          className="flex flex-col gap-4 text-base font-medium sm:flex-row w-full"
        >
          <Button>
            <Link href="https://zxcstream.xyz/embed/movie/157336">
              {" "}
              Test Movie (Embed)
            </Link>
          </Button>
          <Button variant="outline">
            {" "}
            <Link href="https://zxcstream.xyz/player/movie/157336/en">
              {" "}
              Test Movie (Player)
            </Link>
          </Button>
          <Button>
            {" "}
            <Link href="https://zxcstream.xyz/embed/tv/66732/1/1">
              {" "}
              Test TV Show (Embed)
            </Link>
          </Button>
          <Button variant="outline">
            {" "}
            <Link href="https://zxcstream.xyz/player/tv/66732/1/1/fil">
              {" "}
              Test TV Show (Player)
            </Link>
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
