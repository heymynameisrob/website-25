import { motion } from "motion/react";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { CircleIcon } from "lucide-react";
import * as React from "react";

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
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
              delay: index * 0.1,
            }}
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
            <motion.div
              key={String(item.completed)}
              initial={{ scale: 0.98, opacity: 0, filter: "blur(2px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ ease: "easeOut", duration: 0.1 }}
            >
              {item.completed ? (
                <CheckCircleIcon className="size-5 shrink-0 transition-colors text-accent" />
              ) : (
                <CircleIcon className="size-5 shrink-0" />
              )}
            </motion.div>
            <span
              className={`text-sm font-medium ${
                item.completed ? "text-gray-11 line-through" : "text-primary"
              }`}
            >
              {item.title}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
