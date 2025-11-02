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
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "motion/react";
import { useMeasure } from "@uidotdev/usehooks";
import {
  CalendarDateRangeIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/16/solid";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

const variants = {
  enter: (direction: number) => ({
    x: `${40 * direction}%`,
    opacity: 0,
    filter: "blur(2px)",
  }),
  middle: {
    x: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      opacity: { duration: 0.1 },
    },
  },
  exit: (direction: number) => ({
    x: `${-40 * direction}%`,
    opacity: 0,
    filter: "blur(2px)",
  }),
};

type Days = EachDayOfIntervalResult<{ start: Date; end: Date }, undefined>;
type CalendarContext = {
  monthLabel: string;
  month: Date;
  direction: number | undefined;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date) => void;
  days: Days;
  onNext: () => void;
  onPrev: () => void;
} | null;
const CalendarContext = React.createContext<CalendarContext>(null);

function useCalendar() {
  const context = React.useContext(CalendarContext);
  if (!context) throw Error("Needs context provider");
  return context;
}

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "flex items-center gap-2 w-full justify-start text-left font-normal",
          !date && "text-gray-10",
          className,
        )}
      >
        <CalendarDateRangeIcon className="size-4 opacity-70" />
        <span>{date ? format(date, "PP") : placeholder}</span>
        <ChevronDownIcon className="size-4 opacity-50 text-gray-10" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 max-w-[420px]" align="start">
        <Calendar
          selectedDate={date}
          onSelectDate={(newDate) => {
            onDateChange?.(newDate);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

interface CalendarProps {
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
}

function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const [monthLabel, setMonthLabel] = React.useState<string>(
    format(selectedDate || new Date(), "yyyy-MM"),
  );
  const [direction, setDirection] = React.useState<1 | -1 | undefined>();
  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);

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

  const handleSelectDate = (date: Date) => {
    onSelectDate?.(date);
  };

  /** Handle swipe gestures */
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        handlePrevMonth();
      } else {
        handleNextMonth();
      }
    }
  };

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") handlePrevMonth();
      if (event.key === "ArrowRight") handleNextMonth();
      if (event.key === "t" || event.key === "T") {
        setMonthLabel(format(new Date(), "yyyy-MM"));
        onSelectDate?.(new Date());
        setDirection(undefined);
        setIsAnimating(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextMonth, handlePrevMonth, onSelectDate]);

  return (
    <CalendarContext.Provider
      value={{
        month,
        monthLabel,
        direction,
        selectedDate,
        setSelectedDate: handleSelectDate,
        days,
        onNext: handleNextMonth,
        onPrev: handlePrevMonth,
      }}
    >
      <MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
        <div className="relative shrink-0 w-full max-w-md overflow-hidden bg-background p-3">
          <div className="flex flex-col justify-center rounded-sm text-center">
            <Resizeable>
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0}
                style={{ x, opacity }}
                className="touch-pan-y"
                onDragEnd={handleDragEnd}
              >
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
              </motion.div>
            </Resizeable>
          </div>
        </div>
      </MotionConfig>
    </CalendarContext.Provider>
  );
}

function CalendarHeader() {
  const { onPrev, onNext, direction, month } = useCalendar();

  return (
    <header className="relative flex justify-between px-4">
      <motion.button
        type="button"
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
        type="button"
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
        className="mt-6 grid grid-cols-7 justify-center items-center gap-y-4 px-4 text-sm"
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
        className="mt-6 grid grid-cols-7 justify-center items-center gap-y-4 px-4 text-sm"
      >
        {days.map((day) => (
          <button
            type="button"
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full select-none focus font-medium hover:bg-gray-2 active:scale-[0.96] transition-all",
              format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") &&
                "text-accent",
              selectedDate &&
                format(day, "yyyy-MM-dd") ===
                  format(selectedDate, "yyyy-MM-dd") &&
                "text-white bg-accent hover:bg-accent",
              isSameMonth(day, month) ? "" : "text-gray-8 pointer-events-none",
            )}
            key={format(day, "yyyy-MM-dd")}
            onClick={() => setSelectedDate(day)}
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
