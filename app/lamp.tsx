import { AnimatePresence, motion } from "framer-motion";

export default function Lamp() {
  return (
    <div className="absolute top-15 isolate z-0 w-screen flex-1 items-start justify-center hidden dark:flex lg:scale-100 scale-50">
      {/* Optional Blur Layer */}
      <div className="absolute top-0 z-50 h-48 w-screen bg-transparent opacity-10 backdrop-blur-md" />

      {/* Main glow */}
      <div className="absolute inset-auto z-50 h-40 w-[28rem] -translate-y-[-30%] rounded-full bg-red-600/10 opacity-80 blur-3xl" />

      {/* Lamp effect pulse */}
      <motion.div
        initial={{ width: "8rem" }}
        whileInView={{ width: "16rem" }}
        transition={{ ease: "easeInOut", delay: 0.8, duration: 1.2 }}
        className="absolute top-0 z-30 h-36 -translate-y-[20%] rounded-full bg-red-600/10 blur-2xl"
      />

      {/* Top line */}
      <motion.div
        initial={{ width: "15rem" }}
        whileInView={{ width: "30rem" }}
        transition={{ ease: "easeInOut", delay: 0.8, duration: 1.2 }}
        className="absolute inset-auto z-50 h-0.5 -translate-y-[-10%] bg-red-600/40"
      />

      {/* Left conic gradient */}
      <motion.div
        initial={{ opacity: 0.5, width: "15rem" }}
        whileInView={{ opacity: 1, width: "30rem" }}
        transition={{ delay: 0.8, duration: 1.2, ease: "easeInOut" }}
        style={{
          backgroundImage:
            "conic-gradient(from 80deg at center top, rgba(220,38,38,0.6), transparent, transparent)",
        }}
        className="absolute inset-auto right-1/2 h-56 w-[30rem]"
      >
        <div className="absolute w-full left-0 bg-zinc-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        <div className="absolute w-40 h-full left-0 bg-zinc-950 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
      </motion.div>

      {/* Right conic gradient */}
      <motion.div
        initial={{ opacity: 0.5, width: "15rem" }}
        whileInView={{ opacity: 1, width: "30rem" }}
        transition={{ delay: 0.8, duration: 1.2, ease: "easeInOut" }}
        style={{
          backgroundImage:
            "conic-gradient(from 280deg at center top, transparent, transparent, rgba(220,38,38,0.6))",
        }}
        className="absolute inset-auto left-1/2 h-56 w-[30rem]"
      >
        <div className="absolute w-40 h-full right-0 bg-zinc-950 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
        <div className="absolute w-full right-0 bg-zinc-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
      </motion.div>
    </div>
  );
}
