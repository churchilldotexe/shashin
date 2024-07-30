export default function StatsPage() {
  return (
    <div>
      <div className="scale-105 rounded-md border bg-gradient-to-br from-natural/10 to-natural/0 p-2 shadow-[0_8px_6px_0_rgba(0,0,0,.37),-6px_-4px_10px_white] backdrop-blur-sm transition-all dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black] ">
        Your Stats
      </div>
      users stats here
    </div>
  );
}

// className={cn(
//   "rounded-md border border-white/0 hocus-visible:border-border p-2 active:scale-95 ",
//   {
//     " scale-105 border-border bg-gradient-to-br from-natural/10 to-natural/0 shadow-[0_8px_6px_0_rgba(0,0,0,.37),-6px_-4px_10px_white] backdrop-blur-sm transition-all dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black] ":
//       pathname === `${route}`,
//   },
// )}
