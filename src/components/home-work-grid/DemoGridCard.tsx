import { motion } from "framer-motion";

type DemoGridCardProps = {
  cardId: string;
  href: string;
  name: string;
  description: string;
  delay?: number;
};

export function DemoGridCard({ cardId, href, name, description, delay }: DemoGridCardProps) {
  return (
    <motion.a
      href={href}
      data-card-id={cardId}
      layoutId={cardId}
      aria-describedby={`${cardId}-description`}
      transition={{ type: "spring", bounce: 0, duration: 0.3, delay }}
      className="group relative block overflow-hidden rounded-xs border bg-gray-1 p-5 hover:bg-gray-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-gray-2 dark:hover:bg-gray-3"
    >
      <div className="pointer-events-none grid place-items-center aspect-[4/3]">
        <p className="text-sm font-medium text-primary">{name}</p>
      </div>
      <div className="mt-3 flex flex-col gap-0.5 sr-only">
        <span id={`${cardId}-description`} className="text-xs text-gray-10 line-clamp-2">
          {description}
        </span>
      </div>
    </motion.a>
  );
}
