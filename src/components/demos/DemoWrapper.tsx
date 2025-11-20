import * as React from "react";
import { useSearchParams } from "@/lib/hooks/useSearchParams";
import { FilterMenuExample } from "@/components/demos/UIExample";
import { Checkin } from "@/components/demos/Checkin";
import { Calendar } from "@/components/demos/Calendar";
import { Gallery } from "@/components/demos/Gallery";
import { Calculator } from "@/components/demos/Calculator";
import { Form } from "@/components/demos/Form";
import { cn } from "@/lib/utils";
import { Thinking } from "@/components/demos/motion/Thinking";
import { MagicText } from "@/components/demos/motion/MagicText";
import { Button, buttonVariants } from "@/components/primitives/Button";
import { Tooltip } from "@/components/primitives/Tooltip";
import { Code2Icon, FullscreenIcon, RefreshCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/16/solid";

type DemoWrapperContextProps = {
  activeComponentId: string | null;
  setActiveComponentId: (id: string | null) => void;
} | null;

type TechTypes = "react" | "tailwind" | "motion" | "next";

type ComponentItem = {
  id: string;
  name: string;
  description: string;
  tech?: TechTypes[];
  fileName?: string;
  isFullWidth: boolean;
  component: React.ReactNode;
};

const COMPONENTS: ComponentItem[] = [
  {
    id: "magic",
    name: "Magic Text",
    description: "Animated text transformation",
    tech: ["react", "tailwind", "motion"],
    fileName: "MagicText.tsx",
    isFullWidth: false,
    component: <MagicText title="Hey my name is Rob" />,
  },
  {
    id: "thinking",
    name: "Thinking",
    description: "Animated thinking indicator",
    isFullWidth: false,
    component: <Thinking />,
  },
  {
    id: "filter-menu",
    name: "Filter Menu",
    description: "Searchable dropdown filter menu component",
    isFullWidth: false,
    component: <FilterMenuExample />,
  },
  {
    id: "checkin",
    name: "Check-in",
    description: "Interactive check-in component",
    isFullWidth: false,
    component: <Checkin />,
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Interactive calendar with animations",
    isFullWidth: false,
    component: <Calendar />,
  },
  {
    id: "gallery",
    name: "Gallery",
    description: "Masonry photo gallery with lightbox",
    isFullWidth: false,
    component: <Gallery />,
  },
  {
    id: "calculator",
    name: "Calculator",
    description: "Expandable calculator menu",
    isFullWidth: false,
    component: <Calculator />,
  },
  {
    id: "form",
    name: "Form",
    description: "Animated form with state transitions",
    isFullWidth: false,
    component: <Form />,
  },
];

const DemoWrapperContext = React.createContext<DemoWrapperContextProps>(null);

function useDemoContext() {
  const context = React.useContext(DemoWrapperContext);
  if (!context) {
    throw Error("Must be used in provider");
  }
  return context;
}

export function Demos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeComponentId, setActiveComponentId] = React.useState<
    string | null
  >(null);

  // Initialize from URL on mount
  React.useEffect(() => {
    const demoParam = searchParams.get("demo");
    if (demoParam && COMPONENTS.find((c) => c.id === demoParam)) {
      setActiveComponentId(demoParam);
    }
  }, [searchParams]);

  // Update URL when active component changes
  const handleSetActiveComponentId = React.useCallback(
    (id: string | null) => {
      setActiveComponentId(id);

      const newParams = new URLSearchParams(searchParams);
      if (id) {
        newParams.set("demo", id);
      } else {
        newParams.delete("demo");
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  return (
    <DemoWrapperContext.Provider
      value={{
        activeComponentId,
        setActiveComponentId: handleSetActiveComponentId,
      }}
    >
      <div className="p-4 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {COMPONENTS.map((item) => (
            <div
              key={item.id}
              className={cn(item.isFullWidth ? "md:col-span-2" : "")}
            >
              <DemoCard
                component={item.component}
                componentId={item.id}
                className={cn(item.isFullWidth ? "aspect-video" : "")}
              />
            </div>
          ))}
        </div>
      </div>
      <DemoFullscreen />
    </DemoWrapperContext.Provider>
  );
}

function DemoCard({
  component,
  componentId,
  className,
}: {
  component: React.ReactNode;
  componentId: string;
  className?: string;
}) {
  const [showActions, setShowActions] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const [resetKey, setResetKey] = React.useState(0);

  const handleReset = React.useCallback(() => {
    setResetKey((prev) => prev + 1);
  }, []);

  return (
    <motion.figure
      tabIndex={0}
      onFocus={() => setShowActions(true)}
      onBlur={() => setShowActions(false)}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
      onMouseOver={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={cn(
        "relative grid place-items-center aspect-video bg-gray-2 rounded-3xl focus transition-all",
        className,
      )}
    >
      <motion.div key={resetKey}>{isInView ? component : null}</motion.div>
      <AnimatePresence mode="wait" initial={false}>
        {showActions && isInView && (
          <DemoActions componentId={componentId} onReset={handleReset} />
        )}
      </AnimatePresence>
    </motion.figure>
  );
}

function DemoFullscreen() {
  const { activeComponentId, setActiveComponentId } = useDemoContext();

  const activeComponent = COMPONENTS.find((c) => c.id === activeComponentId);

  const handleOpenChange = () => {
    if (!activeComponent) return;
    setActiveComponentId(null);
  };

  return (
    <DialogPrimitive.Root
      open={!!activeComponentId}
      onOpenChange={handleOpenChange}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 backdrop-blur-sm z-40" />
        <DialogPrimitive.Content
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "fixed inset-4 z-50 h-full bg-background outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:blur-in-md",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:blur-out-md",
          )}
        >
          <div className="flex flex-col lg:grid lg:grid-cols-[260px_1fr] h-full">
            <aside className="flex flex-col p-4 gap-2">
              <motion.h3
                initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                transition={{
                  ease: "easeOut",
                  duration: 0.2,
                  delay: 0.25,
                }}
                className="text-lg font-medium font-serif text-primary"
              >
                {activeComponent?.name}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                transition={{
                  ease: "easeOut",
                  duration: 0.2,
                  delay: 0.45,
                }}
                className="text-base font-medium text-gray-10"
              >
                {activeComponent?.description}
              </motion.p>
              {activeComponent?.tech && (
                <motion.div
                  initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                  transition={{
                    ease: "easeOut",
                    duration: 0.2,
                    delay: 0.55,
                  }}
                >
                  <DemoTech tech={activeComponent.tech} />
                </motion.div>
              )}
              <motion.ul
                initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                transition={{
                  ease: "easeOut",
                  duration: 0.2,
                  delay: 0.65,
                  staggerChildren: 0.1,
                }}
                className="flex flex-col gap-1 mt-4"
              >
                <li>
                  <a
                    href="/"
                    className="flex items-center gap-2 text-gray-10 font-medium hover:text-primary transition-all tracking-[-0.01em]"
                  >
                    <Code2Icon className="size-4" />
                    <span>View on Github</span>
                  </a>
                </li>
              </motion.ul>
            </aside>
            <section className="grid place-items-center">
              {activeComponent?.component}
            </section>
          </div>
          <div className="absolute top-0 right-0">
            <DialogPrimitive.Close
              className={buttonVariants({ size: "icon", variant: "ghost" })}
            >
              <XMarkIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function DemoActions({
  componentId,
  onReset,
}: {
  componentId: string;
  onReset: () => void;
}) {
  const { setActiveComponentId } = useDemoContext();

  const thisComponent = COMPONENTS.find((c) => c.id === componentId);

  return (
    <div className="absolute bottom-0 right-0 p-3 flex items-center justify-end gap-3">
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 0, filter: "blur(2px)" }}
        transition={{
          type: "spring",
          duration: 0.2,
          bounce: 0,
          delay: 0.15,
        }}
      >
        <Tooltip content="Reset">
          <Button size="icon" variant="ghost" onClick={onReset}>
            <RefreshCcw className="size-4 opacity-70" />
          </Button>
        </Tooltip>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 10, filter: "blur(2px)" }}
        transition={{
          type: "spring",
          duration: 0.2,
          bounce: 0,
          delay: 0.05,
        }}
      >
        <Tooltip content="Fullscreen">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setActiveComponentId(componentId)}
          >
            <FullscreenIcon className="size-4 opacity-70" />
          </Button>
        </Tooltip>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 10, filter: "blur(2px)" }}
        transition={{
          type: "spring",
          duration: 0.2,
          bounce: 0,
        }}
      >
        <Tooltip content="View on GitHub">
          <Button size="icon" variant="ghost" asChild>
            <a
              href={`https://github.com/heymynameisrob/website-25/blob/main/src/components/demos/${thisComponent?.fileName}`}
              target="_blank"
            >
              <Code2Icon className="size-4 opacity-70" />
            </a>
          </Button>
        </Tooltip>
      </motion.div>
    </div>
  );
}

function DemoTech({ tech }: { tech: TechTypes[] }) {
  return (
    <div className="flex items-center gap-2">
      {tech.map((t) => {
        if (t === "react") {
          return (
            <Tooltip content="React">
              <div className="size-6 grid place-items-center p-px rounded-md hover:bg-gray-3">
                <svg
                  height="18"
                  stroke-linejoin="round"
                  viewBox="0 0 16 16"
                  width="18"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.5 1.93782C4.70129 1.82161 4.99472 1.7858 5.41315 1.91053C5.83298 2.03567 6.33139 2.31073 6.87627 2.73948C7.01136 2.84578 7.14803 2.96052 7.28573 3.08331C6.86217 3.53446 6.44239 4.04358 6.03752 4.60092C5.35243 4.67288 4.70164 4.78186 4.09916 4.92309C4.06167 4.74244 4.03064 4.56671 4.00612 4.39656C3.90725 3.71031 3.91825 3.14114 4.01979 2.71499C4.12099 2.29025 4.29871 2.05404 4.5 1.93782ZM7.49466 1.95361C7.66225 2.08548 7.83092 2.22804 7.99999 2.38067C8.16906 2.22804 8.33773 2.08548 8.50532 1.95361C9.10921 1.47842 9.71982 1.12549 10.3012 0.952202C10.8839 0.778496 11.4838 0.7738 12 1.0718C12.5161 1.3698 12.812 1.89169 12.953 2.48322C13.0936 3.07333 13.0932 3.77858 12.9836 4.53917C12.9532 4.75024 12.9141 4.9676 12.8665 5.19034C13.0832 5.26044 13.291 5.33524 13.489 5.41444C14.2025 5.69983 14.8134 6.05217 15.2542 6.46899C15.696 6.8868 16 7.404 16 8C16 8.596 15.696 9.11319 15.2542 9.53101C14.8134 9.94783 14.2025 10.3002 13.489 10.5856C13.291 10.6648 13.0832 10.7396 12.8665 10.8097C12.9141 11.0324 12.9532 11.2498 12.9837 11.4608C13.0932 12.2214 13.0936 12.9267 12.953 13.5168C12.812 14.1083 12.5161 14.6302 12 14.9282C11.4839 15.2262 10.8839 15.2215 10.3012 15.0478C9.71984 14.8745 9.10923 14.5216 8.50534 14.0464C8.33775 13.9145 8.16906 13.7719 7.99999 13.6193C7.83091 13.7719 7.66223 13.9145 7.49464 14.0464C6.89075 14.5216 6.28014 14.8745 5.69879 15.0478C5.11605 15.2215 4.51613 15.2262 3.99998 14.9282C3.48383 14.6302 3.18794 14.1083 3.047 13.5168C2.9064 12.9267 2.90674 12.2214 3.01632 11.4608C3.04673 11.2498 3.08586 11.0324 3.13351 10.8097C2.91679 10.7395 2.709 10.6648 2.511 10.5856C1.79752 10.3002 1.18658 9.94783 0.745833 9.53101C0.304028 9.11319 0 8.596 0 8C0 7.404 0.304028 6.8868 0.745833 6.46899C1.18658 6.05217 1.79752 5.69983 2.511 5.41444C2.709 5.33524 2.9168 5.26044 3.13352 5.19034C3.08587 4.9676 3.04675 4.75024 3.01634 4.53917C2.90676 3.77858 2.90642 3.07332 3.04702 2.48321C3.18796 1.89169 3.48385 1.3698 4 1.0718C4.51615 0.773798 5.11607 0.778495 5.69881 0.952201C6.28016 1.12549 6.89077 1.47841 7.49466 1.95361ZM7.36747 4.51025C7.57735 4.25194 7.78881 4.00927 7.99999 3.78356C8.21117 4.00927 8.42263 4.25194 8.63251 4.51025C8.42369 4.50346 8.21274 4.5 8 4.5C7.78725 4.5 7.5763 4.50345 7.36747 4.51025ZM8.71425 3.08331C9.13781 3.53447 9.55759 4.04358 9.96246 4.60092C10.6475 4.67288 11.2983 4.78186 11.9008 4.92309C11.9383 4.74244 11.9693 4.56671 11.9939 4.39657C12.0927 3.71031 12.0817 3.14114 11.9802 2.71499C11.879 2.29025 11.7013 2.05404 11.5 1.93782C11.2987 1.82161 11.0053 1.7858 10.5868 1.91053C10.167 2.03568 9.66859 2.31073 9.12371 2.73948C8.98862 2.84578 8.85196 2.96052 8.71425 3.08331ZM8 5.5C8.48433 5.5 8.95638 5.51885 9.41188 5.55456C9.67056 5.93118 9.9229 6.33056 10.1651 6.75C10.4072 7.16944 10.6269 7.58766 10.8237 7.99998C10.6269 8.41232 10.4072 8.83055 10.165 9.25C9.92288 9.66944 9.67053 10.0688 9.41185 10.4454C8.95636 10.4812 8.48432 10.5 8 10.5C7.51567 10.5 7.04363 10.4812 6.58813 10.4454C6.32945 10.0688 6.0771 9.66944 5.83494 9.25C5.59277 8.83055 5.37306 8.41232 5.17624 7.99998C5.37306 7.58765 5.59275 7.16944 5.83492 6.75C6.07708 6.33056 6.32942 5.93118 6.5881 5.55456C7.04361 5.51884 7.51566 5.5 8 5.5ZM11.0311 6.25C11.1375 6.43423 11.2399 6.61864 11.3385 6.80287C11.4572 6.49197 11.5616 6.18752 11.6515 5.89178C11.3505 5.82175 11.0346 5.75996 10.706 5.70736C10.8163 5.8848 10.9247 6.06576 11.0311 6.25ZM11.0311 9.75C11.1374 9.56576 11.2399 9.38133 11.3385 9.19709C11.4572 9.50801 11.5617 9.81246 11.6515 10.1082C11.3505 10.1782 11.0346 10.24 10.7059 10.2926C10.8162 10.1152 10.9247 9.93424 11.0311 9.75ZM11.9249 7.99998C12.2051 8.62927 12.4362 9.24738 12.6151 9.83977C12.7903 9.78191 12.958 9.72092 13.1176 9.65708C13.7614 9.39958 14.2488 9.10547 14.5671 8.80446C14.8843 8.50445 15 8.23243 15 8C15 7.76757 14.8843 7.49555 14.5671 7.19554C14.2488 6.89453 13.7614 6.60042 13.1176 6.34292C12.958 6.27907 12.7903 6.21808 12.6151 6.16022C12.4362 6.7526 12.2051 7.37069 11.9249 7.99998ZM9.96244 11.3991C10.6475 11.3271 11.2983 11.2181 11.9008 11.0769C11.9383 11.2576 11.9694 11.4333 11.9939 11.6034C12.0928 12.2897 12.0817 12.8589 11.9802 13.285C11.879 13.7098 11.7013 13.946 11.5 14.0622C11.2987 14.1784 11.0053 14.2142 10.5868 14.0895C10.167 13.9643 9.66861 13.6893 9.12373 13.2605C8.98863 13.1542 8.85196 13.0395 8.71424 12.9167C9.1378 12.4655 9.55758 11.9564 9.96244 11.3991ZM8.63249 11.4898C8.42262 11.7481 8.21116 11.9907 7.99999 12.2164C7.78881 11.9907 7.57737 11.7481 7.36749 11.4897C7.57631 11.4965 7.78726 11.5 8 11.5C8.21273 11.5 8.42367 11.4965 8.63249 11.4898ZM4.96891 9.75C5.07528 9.93424 5.18375 10.1152 5.29404 10.2926C4.9654 10.24 4.64951 10.1782 4.34844 10.1082C4.43833 9.81246 4.54276 9.508 4.66152 9.19708C4.76005 9.38133 4.86254 9.56575 4.96891 9.75ZM6.03754 11.3991C5.35244 11.3271 4.70163 11.2181 4.09914 11.0769C4.06165 11.2576 4.03062 11.4333 4.0061 11.6034C3.90723 12.2897 3.91823 12.8589 4.01977 13.285C4.12097 13.7098 4.29869 13.946 4.49998 14.0622C4.70127 14.1784 4.9947 14.2142 5.41313 14.0895C5.83296 13.9643 6.33137 13.6893 6.87625 13.2605C7.01135 13.1542 7.14802 13.0395 7.28573 12.9167C6.86217 12.4655 6.4424 11.9564 6.03754 11.3991ZM4.07507 7.99998C3.79484 8.62927 3.56381 9.24737 3.38489 9.83977C3.20969 9.78191 3.042 9.72092 2.88239 9.65708C2.23864 9.39958 1.75123 9.10547 1.43294 8.80446C1.11571 8.50445 1 8.23243 1 8C1 7.76757 1.11571 7.49555 1.43294 7.19554C1.75123 6.89453 2.23864 6.60042 2.88239 6.34292C3.042 6.27907 3.2097 6.21808 3.3849 6.16022C3.56383 6.75261 3.79484 7.37069 4.07507 7.99998ZM4.66152 6.80287C4.54277 6.49197 4.43835 6.18752 4.34846 5.89178C4.64952 5.82175 4.96539 5.75996 5.29402 5.70736C5.18373 5.8848 5.07526 6.06576 4.96889 6.25C4.86253 6.43423 4.76005 6.61864 4.66152 6.80287ZM9.25 8C9.25 8.69036 8.69036 9.25 8 9.25C7.30964 9.25 6.75 8.69036 6.75 8C6.75 7.30965 7.30964 6.75 8 6.75C8.69036 6.75 9.25 7.30965 9.25 8Z"
                    fill="#149ECA"
                  ></path>
                </svg>
              </div>
            </Tooltip>
          );
        }
        if (t === "motion") {
          return (
            <Tooltip content="Motion">
              <div className="size-6 grid place-items-center p-px rounded-md bg-[#FFF312]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={18}
                  viewBox="0 0 34 12"
                >
                  <path
                    d="M 12.838 0 L 6.12 11.989 L 0 11.989 L 5.245 2.628 C 6.059 1.176 8.088 0 9.778 0 Z M 27.846 2.997 C 27.846 1.342 29.216 0 30.906 0 C 32.596 0 33.966 1.342 33.966 2.997 C 33.966 4.653 32.596 5.995 30.906 5.995 C 29.216 5.995 27.846 4.653 27.846 2.997 Z M 13.985 0 L 20.105 0 L 13.387 11.989 L 7.267 11.989 Z M 21.214 0 L 27.334 0 L 22.088 9.362 C 21.275 10.813 19.246 11.989 17.556 11.989 L 14.496 11.989 Z"
                    fill="#000"
                  ></path>
                </svg>
              </div>
            </Tooltip>
          );
        }
        if (t === "tailwind") {
          return (
            <Tooltip content="TailwindCSS">
              <div className="size-6 grid place-items-center p-px rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  width={18}
                  viewBox="0 0 54 33"
                >
                  <g clip-path="url(#prefix__clip0)">
                    <path
                      fill="#38bdf8"
                      fill-rule="evenodd"
                      d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
                      clip-rule="evenodd"
                    />
                  </g>
                  <defs>
                    <clipPath id="prefix__clip0">
                      <path fill="#fff" d="M0 0h54v32.4H0z" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </Tooltip>
          );
        }
      })}
    </div>
  );
}
