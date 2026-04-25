"use client";
import { useState, useEffect } from "react";

function getNextMidnightUTC() {
  const now = new Date();
  const nextMidnight = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0, 0, 0
    )
  );
  return nextMidnight;
}

function getTimeLeft(endTime: Date) {
  const now = new Date();
  const difference = endTime.getTime() - now.getTime();

  if (difference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, isExpired: false };
}

function ProductCardWithSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const endTime = getNextMidnightUTC();
    setTimeLeft(getTimeLeft(endTime));

    const timer = setInterval(() => {
      const newTimeLeft = getTimeLeft(endTime);
      setTimeLeft(newTimeLeft);
      if (newTimeLeft.isExpired) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (timeLeft.isExpired) return null;

  const units = [
    { value: timeLeft.hours, label: "H" },
    { value: timeLeft.minutes, label: "M" },
    { value: timeLeft.seconds, label: "S" },
  ];

  return (
    <div className="w-full md:max-w-[400px] mx-auto px-4 sm:px-6">
      {/* Glass card — same language as header & hero */}
      <div className="relative bg-primary backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4  overflow-hidden">
        
        {/* Subtle top gloss */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Label */}
        <p className="text-center text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">
          OFFER ENDS IN
        </p>

        {/* Countdown tiles */}
        <div className="flex items-center justify-center gap-3">
          {units.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              {/* Tile */}
              <div className="flex flex-col items-center">
                <div className="bg-white/[0.07] border border-white/[0.08] rounded-2xl w-16 h-16 flex flex-col items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <span className="text-white font-bold text-2xl tabular-nums leading-none">
                    {item.value.toString().padStart(2, "0")}
                  </span>
                  <span className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mt-0.5">
                    {item.label}
                  </span>
                </div>
              </div>

              {/* Separator dot between tiles */}
              {index < units.length - 1 && (
                <div className="flex flex-col gap-1.5 mb-3">
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { ProductCardWithSale };