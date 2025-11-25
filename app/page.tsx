import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className=""
          src="/zxc.svg"
          alt="Next.js logo"
          width={70}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To begin embedding, use the links provided below.
          </h1>
          <div>
            <h1 className="font-medium">Movies</h1>
            <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              https://zxc-backend.vercel.app/embed/movie/
              <span className="font-medium text-zinc-950 dark:text-zinc-50">
                {"{"}id{"}"}
              </span>
            </p>
          </div>
          <div>
            <h1>TV Shows</h1>
            <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              https://zxc-backend.vercel.app/embed/tv/
              <span className="font-medium text-zinc-950 dark:text-zinc-50">
                {"{"}id{"}"}/{"{"}season{"}"}/{"{"}episode{"}"}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://zxc-backend.vercel.app/embed/movie/238"
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
            href="https://zxc-backend.vercel.app/embed/tv/60625/1/1"
            target="_blank"
            rel="noopener noreferrer"
          >
            TV Show
          </a>
        </div>
      </main>
    </div>
  );
}
