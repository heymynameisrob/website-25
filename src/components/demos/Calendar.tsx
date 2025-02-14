import * as React from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
  type EachDayOfIntervalResult,
} from "date-fns";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useMeasure } from "@uidotdev/usehooks";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { cn } from "@/lib/utils";

const variants = {
  enter: (direction: number) => {
    return { x: `${40 * direction}%`, opacity: 0, filter: "blur(2px)" };
  },
  middle: { x: "0%", opacity: 1, filter: "blur(0px)" },
  exit: (direction: number) => {
    return { x: `${-40 * direction}%`, opacity: 0, filter: "blur(2px)" };
  },
};

type Days = EachDayOfIntervalResult<{ start: Date; end: Date }, undefined>;
type CalendrContext = {
  monthLabel: string;
  month: Date;
  direction: number | undefined;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  days: Days;
  onNext: () => void;
  onPrev: () => void;
} | null;
const CalendarContext = React.createContext<CalendrContext>(null);

function useCalendar() {
  const context = React.useContext(CalendarContext);
  if (!context) throw Error("Needs context provider");
  return context;
}

export function Calendar() {
  const [monthLabel, setMonthLabel] = React.useState<string>(
    format(new Date(), "yyyy-MM"),
  );
  const [direction, setDirection] = React.useState<1 | -1 | undefined>();
  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<string>("");

  // Explain why do this
  const month = parse(monthLabel, "yyyy-MM", new Date());

  const handleNextMonth = React.useCallback(() => {
    if (isAnimating) return;

    const next = addMonths(month, 1);

    setMonthLabel(format(next, "yyyy-MM"));
    setDirection(1);
    setIsAnimating(true);
  }, [isAnimating, month]);

  const handlePrevMonth = React.useCallback(() => {
    if (isAnimating) return;

    const previous = subMonths(month, 1);

    setMonthLabel(format(previous, "yyyy-MM"));
    setDirection(-1);
    setIsAnimating(true);
  }, [isAnimating, month]);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") handlePrevMonth();
      if (event.key === "ArrowRight") handleNextMonth();
      if (event.key === "t" || event.key === "T") {
        setMonthLabel(format(new Date(), "yyyy-MM"));
        setSelectedDate(format(new Date(), "yyyy-MM-dd"));
        setDirection(undefined);
        setIsAnimating(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextMonth, handlePrevMonth]);

  return (
    <CalendarContext.Provider
      value={{
        month,
        monthLabel,
        direction,
        selectedDate,
        setSelectedDate,
        days,
        onNext: handleNextMonth,
        onPrev: handlePrevMonth,
      }}
    >
      <MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
        <section className="flex flex-col justify-center items-center p-2 w-full lg:p-4">
          <div className="relative shrink-0 w-full max-w-md overflow-hidden rounded-2xl bg-gray-1 text-primary border shadow-xl">
            <div className="py-6 lg:py-8">
              <div className="flex flex-col justify-center rounded text-center">
                <Resizeable>
                  <AnimatePresence
                    mode="popLayout"
                    initial={false}
                    custom={direction}
                    onExitComplete={() => setIsAnimating(false)}
                  >
                    <motion.div
                      key={monthLabel}
                      initial="enter"
                      animate="middle"
                      exit="exit"
                    >
                      <CalendarHeader />
                      <CalendarMonth />
                    </motion.div>
                  </AnimatePresence>
                </Resizeable>
              </div>
            </div>
          </div>
        </section>
      </MotionConfig>
    </CalendarContext.Provider>
  );
}

function CalendarHeader() {
  const { onPrev, onNext, direction, month } = useCalendar();

  return (
    <header className="relative flex justify-between px-4 lg:px-8">
      <motion.button
        variants={{
          exit: { visibility: "hidden" as const },
        }}
        className="z-10 rounded-full p-1.5 hover:bg-gray-2"
        onClick={onPrev}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </motion.button>
      <motion.p
        variants={variants}
        custom={direction}
        className="absolute inset-0 flex items-center justify-center font-semibold"
      >
        {format(month, "MMMM yyyy")}
      </motion.p>
      <motion.button
        variants={{
          exit: { visibility: "hidden" as const },
        }}
        className="z-10 rounded-full p-1.5 hover:bg-gray-2"
        onClick={onNext}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </motion.button>
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--gray-1) 15%, transparent 30%, transparent 70%, var(--gray-1) 85%)",
        }}
        variants={{
          exit: { visibility: "hidden" as const },
        }}
      />
    </header>
  );
}

function CalendarMonth() {
  const { direction, selectedDate, setSelectedDate, month, days } =
    useCalendar();

  return (
    <>
      <motion.div
        variants={{
          exit: { visibility: "hidden" as const },
        }}
        className="mt-6 grid grid-cols-7 justify-center items-center gap-y-4 px-4 text-sm lg:px-8"
      >
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <span
            key={day}
            className={cn(
              "w-10 text-center font-medium",
              format(new Date(), "E")
                .toLowerCase()
                .startsWith(day.toLowerCase())
                ? "text-accent"
                : "text-secondary",
            )}
          >
            {day}
          </span>
        ))}
      </motion.div>

      <motion.div
        variants={variants}
        custom={direction}
        className="mt-6 grid grid-cols-7 justify-center items-center gap-y-4 px-4 text-sm lg:px-8"
      >
        {days.map((day) => (
          <button
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full select-none focus font-medium active:scale-[0.96]",
              format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") &&
                "text-accent",
              selectedDate === format(day, "yyyy-MM-dd") &&
                "text-white bg-accent",
              isSameMonth(day, month) ? "" : "text-gray-8 pointer-events-none",
            )}
            key={format(day, "yyyy-MM-dd")}
            onClick={() => setSelectedDate(format(day, "yyyy-MM-dd"))}
          >
            {format(day, "d")}
          </button>
        ))}
      </motion.div>
    </>
  );
}

function Resizeable({ children }: { children: React.ReactNode }) {
  const [ref, bounds] = useMeasure();

  return (
    <motion.div animate={{ height: bounds.height ? bounds.height : "auto" }}>
      <div ref={ref}>{children}</div>
    </motion.div>
  );
}
