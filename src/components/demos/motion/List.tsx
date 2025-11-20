import { motion, useSpring } from "motion/react";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { CircleIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { id: 1, title: "Research user needs", completed: true },
  { id: 2, title: "Create wireframes", completed: true },
  { id: 3, title: "Design high-fidelity mockups", completed: true },
  { id: 4, title: "Build interactive prototype", completed: false },
  { id: 5, title: "Conduct usability testing", completed: false },
  { id: 6, title: "Iterate based on feedback", completed: false },
];

export function List() {
  const [items, setItems] = React.useState(ITEMS);
  return (
    <div className="w-full max-w-sm mx-auto">
      <motion.ul className="flex flex-col gap-2">
        {items.map((item, index) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: -8, filter: "blur(2px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
              delay: index * 0.1,
            }}
            viewport={{ once: true, amount: "all" }}
            className="flex items-center gap-3 p-3 bg-gray-2 rounded-lg hover:bg-gray-3 cursor-default"
            onClick={() => {
              setItems((prev) => {
                return prev.map((prevItem) =>
                  prevItem.id === item.id
                    ? { ...prevItem, completed: !prevItem.completed }
                    : prevItem,
                );
              });
            }}
          >
            <div
              className={cn(
                "relative pointer-events-none w-5 h-5 rounded-lg transition-all duration-300 shrink-0",
                item.completed
                  ? "bg-accent shadow-[inset_0_0_0_2px_var(--accent)] delay-[400ms]"
                  : "shadow-[inset_0_0_0_2px_var(--border)]",
              )}
            >
              <svg
                viewBox="0 0 21 21"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "absolute inset-0 w-full h-full fill-none",
                  item.completed &&
                    "animate-[checkboxFill_600ms_ease_forwards_300ms]",
                )}
                style={{
                  strokeDasharray: item.completed ? "16 86.12" : "86.12",
                  strokeDashoffset: item.completed ? "102.22" : "86.12",
                  transition: "stroke-dasharray 600ms, stroke-dashoffset 600ms",
                  stroke: "var(--accent)",
                }}
              >
                <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L7,1 C4,1 1,4 1,7 L1,14 C1,17 4,20 7,20 L14,20 C17,20 20,17 20,14 L20,7.99769186" />
              </svg>
            </div>
            <span
              className={cn(
                "text-sm font-medium",
                item.completed ? "text-gray-11 line-through" : "text-primary",
              )}
            >
              {item.title}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
