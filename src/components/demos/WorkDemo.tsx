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
import { MagicText } from "@/components/demos/MagicText";
import { Button, buttonVariants } from "@/components/primitives/Button";
import { Tooltip } from "@/components/primitives/Tooltip";
import {
  ArrowUpRight,
  Code2Icon,
  FullscreenIcon,
  RefreshCcw,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { CushionCommand } from "@/components/demos/CushionCommand";
import { Toolbar } from "@/components/demos/Toolbar";
import { Prompt } from "@/components/demos/Prompt";
import { Keyboard } from "@/components/demos/Keyboard";

type WorkDemoContextProps = {
  activeComponentId: string | null;
  setActiveComponentId: (id: string | null) => void;
} | null;

type TechTypes = "react" | "tailwind" | "motion" | "next" | "tiptap";

interface ComponentItem {
  id: string;
  name: string;
  description: string;
  tech?: TechTypes[];
  fileName?: string;
  isFullWidth: boolean;
  component: React.ReactNode;
}

interface WorkDemoCardProps {
  component: React.ReactNode;
  componentId: string;
  className?: string;
}

interface WorkDemoActionsProps {
  componentId: string;
  onReset: () => void;
}

interface WorkDemoTechProps {
  tech: TechTypes[];
}

interface AnimatedActionProps {
  delay: number;
  children: React.ReactNode;
}

// Animation constants
const FADE_IN_BLUR = {
  initial: { opacity: 0, y: 10, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: 10, filter: "blur(2px)" },
} as const;

const STAGGER_TRANSITIONS = {
  heading: { ease: "easeOut" as const, duration: 0.2, delay: 0.25 },
  description: { ease: "easeOut" as const, duration: 0.2, delay: 0.45 },
  tech: { ease: "easeOut" as const, duration: 0.2, delay: 0.55 },
  links: {
    ease: "easeOut" as const,
    duration: 0.2,
    delay: 0.65,
    staggerChildren: 0.1,
  },
} as const;

const ACTION_TRANSITION = {
  type: "spring" as const,
  duration: 0.2,
  bounce: 0,
} as const;

// Tech icons constants
const TECH_ICONS = {
  react: (
    <svg
      height="18"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="18"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5 1.93782C4.70129 1.82161 4.99472 1.7858 5.41315 1.91053C5.83298 2.03567 6.33139 2.31073 6.87627 2.73948C7.01136 2.84578 7.14803 2.96052 7.28573 3.08331C6.86217 3.53446 6.44239 4.04358 6.03752 4.60092C5.35243 4.67288 4.70164 4.78186 4.09916 4.92309C4.06167 4.74244 4.03064 4.56671 4.00612 4.39656C3.90725 3.71031 3.91825 3.14114 4.01979 2.71499C4.12099 2.29025 4.29871 2.05404 4.5 1.93782ZM7.49466 1.95361C7.66225 2.08548 7.83092 2.22804 7.99999 2.38067C8.16906 2.22804 8.33773 2.08548 8.50532 1.95361C9.10921 1.47842 9.71982 1.12549 10.3012 0.952202C10.8839 0.778496 11.4838 0.7738 12 1.0718C12.5161 1.3698 12.812 1.89169 12.953 2.48322C13.0936 3.07333 13.0932 3.77858 12.9836 4.53917C12.9532 4.75024 12.9141 4.9676 12.8665 5.19034C13.0832 5.26044 13.291 5.33524 13.489 5.41444C14.2025 5.69983 14.8134 6.05217 15.2542 6.46899C15.696 6.8868 16 7.404 16 8C16 8.596 15.696 9.11319 15.2542 9.53101C14.8134 9.94783 14.2025 10.3002 13.489 10.5856C13.291 10.6648 13.0832 10.7396 12.8665 10.8097C12.9141 11.0324 12.9532 11.2498 12.9837 11.4608C13.0932 12.2214 13.0936 12.9267 12.953 13.5168C12.812 14.1083 12.5161 14.6302 12 14.9282C11.4839 15.2262 10.8839 15.2215 10.3012 15.0478C9.71984 14.8745 9.10923 14.5216 8.50534 14.0464C8.33775 13.9145 8.16906 13.7719 7.99999 13.6193C7.83091 13.7719 7.66223 13.9145 7.49464 14.0464C6.89075 14.5216 6.28014 14.8745 5.69879 15.0478C5.11605 15.2215 4.51613 15.2262 3.99998 14.9282C3.48383 14.6302 3.18794 14.1083 3.047 13.5168C2.9064 12.9267 2.90674 12.2214 3.01632 11.4608C3.04673 11.2498 3.08586 11.0324 3.13351 10.8097C2.91679 10.7395 2.709 10.6648 2.511 10.5856C1.79752 10.3002 1.18658 9.94783 0.745833 9.53101C0.304028 9.11319 0 8.596 0 8C0 7.404 0.304028 6.8868 0.745833 6.46899C1.18658 6.05217 1.79752 5.69983 2.511 5.41444C2.709 5.33524 2.9168 5.26044 3.13352 5.19034C3.08587 4.9676 3.04675 4.75024 3.01634 4.53917C2.90676 3.77858 2.90642 3.07332 3.04702 2.48321C3.18796 1.89169 3.48385 1.3698 4 1.0718C4.51615 0.773798 5.11607 0.778495 5.69881 0.952201C6.28016 1.12549 6.89077 1.47841 7.49466 1.95361ZM7.36747 4.51025C7.57735 4.25194 7.78881 4.00927 7.99999 3.78356C8.21117 4.00927 8.42263 4.25194 8.63251 4.51025C8.42369 4.50346 8.21274 4.5 8 4.5C7.78725 4.5 7.5763 4.50345 7.36747 4.51025ZM8.71425 3.08331C9.13781 3.53447 9.55759 4.04358 9.96246 4.60092C10.6475 4.67288 11.2983 4.78186 11.9008 4.92309C11.9383 4.74244 11.9693 4.56671 11.9939 4.39657C12.0927 3.71031 12.0817 3.14114 11.9802 2.71499C11.879 2.29025 11.7013 2.05404 11.5 1.93782C11.2987 1.82161 11.0053 1.7858 10.5868 1.91053C10.167 2.03568 9.66859 2.31073 9.12371 2.73948C8.98862 2.84578 8.85196 2.96052 8.71425 3.08331ZM8 5.5C8.48433 5.5 8.95638 5.51885 9.41188 5.55456C9.67056 5.93118 9.9229 6.33056 10.1651 6.75C10.4072 7.16944 10.6269 7.58766 10.8237 7.99998C10.6269 8.41232 10.4072 8.83055 10.165 9.25C9.92288 9.66944 9.67053 10.0688 9.41185 10.4454C8.95636 10.4812 8.48432 10.5 8 10.5C7.51567 10.5 7.04363 10.4812 6.58813 10.4454C6.32945 10.0688 6.0771 9.66944 5.83494 9.25C5.59277 8.83055 5.37306 8.41232 5.17624 7.99998C5.37306 7.58765 5.59275 7.16944 5.83492 6.75C6.07708 6.33056 6.32942 5.93118 6.5881 5.55456C7.04361 5.51884 7.51566 5.5 8 5.5ZM11.0311 6.25C11.1375 6.43423 11.2399 6.61864 11.3385 6.80287C11.4572 6.49197 11.5616 6.18752 11.6515 5.89178C11.3505 5.82175 11.0346 5.75996 10.706 5.70736C10.8163 5.8848 10.9247 6.06576 11.0311 6.25ZM11.0311 9.75C11.1374 9.56576 11.2399 9.38133 11.3385 9.19709C11.4572 9.50801 11.5617 9.81246 11.6515 10.1082C11.3505 10.1782 11.0346 10.24 10.7059 10.2926C10.8162 10.1152 10.9247 9.93424 11.0311 9.75ZM11.9249 7.99998C12.2051 8.62927 12.4362 9.24738 12.6151 9.83977C12.7903 9.78191 12.958 9.72092 13.1176 9.65708C13.7614 9.39958 14.2488 9.10547 14.5671 8.80446C14.8843 8.50445 15 8.23243 15 8C15 7.76757 14.8843 7.49555 14.5671 7.19554C14.2488 6.89453 13.7614 6.60042 13.1176 6.34292C12.958 6.27907 12.7903 6.21808 12.6151 6.16022C12.4362 6.7526 12.2051 7.37069 11.9249 7.99998ZM9.96244 11.3991C10.6475 11.3271 11.2983 11.2181 11.9008 11.0769C11.9383 11.2576 11.9694 11.4333 11.9939 11.6034C12.0928 12.2897 12.0817 12.8589 11.9802 13.285C11.879 13.7098 11.7013 13.946 11.5 14.0622C11.2987 14.1784 11.0053 14.2142 10.5868 14.0895C10.167 13.9643 9.66861 13.6893 9.12373 13.2605C8.98863 13.1542 8.85196 13.0395 8.71424 12.9167C9.1378 12.4655 9.55758 11.9564 9.96244 11.3991ZM8.63249 11.4898C8.42262 11.7481 8.21116 11.9907 7.99999 12.2164C7.78881 11.9907 7.57737 11.7481 7.36749 11.4897C7.57631 11.4965 7.78726 11.5 8 11.5C8.21273 11.5 8.42367 11.4965 8.63249 11.4898ZM4.96891 9.75C5.07528 9.93424 5.18375 10.1152 5.29404 10.2926C4.9654 10.24 4.64951 10.1782 4.34844 10.1082C4.43833 9.81246 4.54276 9.508 4.66152 9.19708C4.76005 9.38133 4.86254 9.56575 4.96891 9.75ZM6.03754 11.3991C5.35244 11.3271 4.70163 11.2181 4.09914 11.0769C4.06165 11.2576 4.03062 11.4333 4.0061 11.6034C3.90723 12.2897 3.91823 12.8589 4.01977 13.285C4.12097 13.7098 4.29869 13.946 4.49998 14.0622C4.70127 14.1784 4.9947 14.2142 5.41313 14.0895C5.83296 13.9643 6.33137 13.6893 6.87625 13.2605C7.01135 13.1542 7.14802 13.0395 7.28573 12.9167C6.86217 12.4655 6.4424 11.9564 6.03754 11.3991ZM4.07507 7.99998C3.79484 8.62927 3.56381 9.24737 3.38489 9.83977C3.20969 9.78191 3.042 9.72092 2.88239 9.65708C2.23864 9.39958 1.75123 9.10547 1.43294 8.80446C1.11571 8.50445 1 8.23243 1 8C1 7.76757 1.11571 7.49555 1.43294 7.19554C1.75123 6.89453 2.23864 6.60042 2.88239 6.34292C3.042 6.27907 3.2097 6.21808 3.3849 6.16022C3.56383 6.75261 3.79484 7.37069 4.07507 7.99998ZM4.66152 6.80287C4.54277 6.49197 4.43835 6.18752 4.34846 5.89178C4.64952 5.82175 4.96539 5.75996 5.29402 5.70736C5.18373 5.8848 5.07526 6.06576 4.96889 6.25C4.86253 6.43423 4.76005 6.61864 4.66152 6.80287ZM9.25 8C9.25 8.69036 8.69036 9.25 8 9.25C7.30964 9.25 6.75 8.69036 6.75 8C6.75 7.30965 7.30964 6.75 8 6.75C8.69036 6.75 9.25 7.30965 9.25 8Z"
        fill="#149ECA"
      />
    </svg>
  ),
  motion: (
    <svg xmlns="http://www.w3.org/2000/svg" width={18} viewBox="0 0 34 12">
      <path
        d="M 12.838 0 L 6.12 11.989 L 0 11.989 L 5.245 2.628 C 6.059 1.176 8.088 0 9.778 0 Z M 27.846 2.997 C 27.846 1.342 29.216 0 30.906 0 C 32.596 0 33.966 1.342 33.966 2.997 C 33.966 4.653 32.596 5.995 30.906 5.995 C 29.216 5.995 27.846 4.653 27.846 2.997 Z M 13.985 0 L 20.105 0 L 13.387 11.989 L 7.267 11.989 Z M 21.214 0 L 27.334 0 L 22.088 9.362 C 21.275 10.813 19.246 11.989 17.556 11.989 L 14.496 11.989 Z"
        fill="#000"
      />
    </svg>
  ),
  tailwind: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={18}
      viewBox="0 0 54 33"
    >
      <g clipPath="url(#prefix__clip0)">
        <path
          fill="#38bdf8"
          fillRule="evenodd"
          d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="prefix__clip0">
          <path fill="#fff" d="M0 0h54v32.4H0z" />
        </clipPath>
      </defs>
    </svg>
  ),
  next: (
    <svg xmlns="http://www.w3.org/2000/svg" width={18} viewBox="0 0 180 180">
      <mask
        id="mask0_408_139"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="180"
        height="180"
      >
        <circle cx="90" cy="90" r="90" fill="black" />
      </mask>
      <g mask="url(#mask0_408_139)">
        <circle cx="90" cy="90" r="90" fill="black" />
        <path
          d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
          fill="url(#paint0_linear_408_139)"
        />
        <rect
          x="115"
          y="54"
          width="12"
          height="72"
          fill="url(#paint1_linear_408_139)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_408_139"
          x1="109"
          y1="116.5"
          x2="144.5"
          y2="160.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_408_139"
          x1="121"
          y1="54"
          x2="120.799"
          y2="106.875"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  ),
  tiptap: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 22 22"
      fill="none"
    >
      <path
        d="M10.9999 0C8.97378 0 7.07561 0.547792 5.44543 1.50334C5.11704 1.69583 4.97302 2.12364 5.25193 2.38269C5.49733 2.61062 5.82611 2.75 6.18743 2.75H15.8123C16.1737 2.75 16.5024 2.61062 16.7478 2.38269C17.0267 2.12364 16.8827 1.69583 16.5543 1.50334C14.9242 0.547792 13.026 0 10.9999 0Z"
        fill="#000"
      ></path>
      <path
        d="M21.9998 11C21.9998 10.2406 21.3842 9.625 20.6248 9.625H1.37499C0.615588 9.625 0 10.2406 0 11C0 11.7594 0.615588 12.375 1.37499 12.375H20.6248C21.3842 12.375 21.9998 11.7594 21.9998 11Z"
        fill="#000"
      ></path>
      <path
        d="M16.7478 19.6173C17.0267 19.8764 16.8827 20.3042 16.5543 20.4967C14.9242 21.4522 13.026 22 10.9999 22C8.97378 22 7.0756 21.4522 5.44542 20.4967C5.11704 20.3042 4.97302 19.8764 5.25192 19.6173C5.49732 19.3894 5.8261 19.25 6.18743 19.25H15.8123C16.1737 19.25 16.5024 19.3894 16.7478 19.6173Z"
        fill="#000"
      ></path>
      <path
        d="M1.37499 6.1875C1.37499 5.42809 1.99057 4.8125 2.74997 4.8125H19.2498C20.0092 4.8125 20.6248 5.42809 20.6248 6.1875C20.6248 6.94691 20.0092 7.5625 19.2498 7.5625H2.74997C1.99057 7.5625 1.37499 6.94691 1.37499 6.1875Z"
        fill="#000"
      ></path>
      <path
        d="M1.37499 15.8125C1.37499 15.0531 1.99057 14.4375 2.74997 14.4375H19.2498C20.0092 14.4375 20.6248 15.0531 20.6248 15.8125C20.6248 16.5719 20.0092 17.1875 19.2498 17.1875H2.74997C1.99057 17.1875 1.37499 16.5719 1.37499 15.8125Z"
        fill="#000"
      ></path>
    </svg>
  ),
} as const;

const COMPONENTS: ComponentItem[] = [
  {
    id: "magic",
    name: "Magic Text",
    description:
      "Animated text transformation, staggering in each chunk. Perfect for landing page headers.",
    tech: ["react", "tailwind", "motion"],
    fileName: "MagicText.tsx",
    isFullWidth: false,
    component: <MagicText />,
  },
  {
    id: "cmdk",
    name: "Command K",
    description:
      "⌘K menu used in cushion.so. Full workspace search with pagniation and shortcuts",
    tech: ["react", "tailwind"],
    fileName: "CushionCommand.tsx",
    isFullWidth: false,
    component: <CushionCommand />,
  },
  {
    id: "thinking",
    name: "Agent Feedback",
    description:
      "Cushion agent giving status feedback, showing how the model is processing the request and what tools it's using, then replying with the model response to the query.",
    tech: ["react", "tailwind", "motion"],
    fileName: "Thinking.tsx",
    isFullWidth: false,
    component: <Thinking />,
  },
  {
    id: "ai-stream",
    name: "Streaming",
    description:
      "Prompt and streamdown of text, typical in AI chatbots. Parses markdown and animates in each chunk to simulate a SSE stream from API.",
    tech: ["react", "tailwind", "motion"],
    fileName: "Prompt.tsx",
    isFullWidth: false,
    component: <Prompt />,
  },
  {
    id: "checkin",
    name: "Checkin",
    description:
      "Checkin submission for cushion. Rich-text editor with animated activity feed and transitions.",
    tech: ["react", "tailwind", "tiptap", "motion"],
    fileName: "Checkin.tsx",
    isFullWidth: false,
    component: <Checkin />,
  },
  {
    id: "calendar",
    name: "Calendar",
    description:
      "Calendar with adaptive height, key controls, and transitions. Works in a popover as a custom DatePicker.",
    tech: ["react", "tailwind", "motion"],
    fileName: "Calendar.tsx",
    isFullWidth: false,
    component: <Calendar />,
  },
  {
    id: "toolbar",
    name: "Toolbar",
    description:
      "Adaptive floating toolbar, used for contextual actions on an item, with loading and success states",
    tech: ["react", "tailwind", "motion"],
    fileName: "Toolbar.tsx",
    isFullWidth: false,
    component: <Toolbar />,
  },
  {
    id: "form",
    name: "Email login",
    description:
      "Animated form with state transitions we use on cushion.so login",
    tech: ["react", "tailwind", "motion"],
    fileName: "Form.tsx",
    isFullWidth: false,
    component: <Form />,
  },
  {
    id: "keyboard",
    name: "Email login",
    description:
      "Animated form with state transitions we use on cushion.so login",
    tech: ["react", "tailwind", "motion"],
    fileName: "Form.tsx",
    isFullWidth: false,
    component: <Keyboard />,
  },
];

const WorkDemoContext = React.createContext<WorkDemoContextProps>(null);

function useWorkDemoContext() {
  const context = React.useContext(WorkDemoContext);
  if (!context) {
    throw new Error(
      "useWorkDemoContext must be used within WorkDemoContext.Provider",
    );
  }
  return context;
}

export function WorkDemos() {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const contextValue = React.useMemo(
    () => ({
      activeComponentId,
      setActiveComponentId: handleSetActiveComponentId,
    }),
    [activeComponentId, handleSetActiveComponentId],
  );

  return (
    <WorkDemoContext.Provider value={contextValue}>
      <div className="px-4 pb-4 lg:px-8 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {COMPONENTS.map((item) => (
            <WorkDemoCard
              key={item.id}
              component={item.component}
              componentId={item.id}
            />
          ))}
        </div>
      </div>
      <WorkDemoFullscreen />
    </WorkDemoContext.Provider>
  );
}

function WorkDemoCard({
  component,
  componentId,
  className,
}: WorkDemoCardProps) {
  const [showActions, setShowActions] = React.useState(false);
  const [resetKey, setResetKey] = React.useState(0);

  const handleReset = React.useCallback(() => {
    setResetKey((prev) => prev + 1);
  }, []);

  return (
    <motion.figure
      tabIndex={0}
      onFocus={() => setShowActions(true)}
      onBlur={() => setShowActions(false)}
      onMouseOver={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={cn(
        "relative grid place-items-center aspect-square bg-gray-2 rounded-3xl focus transition-all overflow-hidden 2xl:aspect-video",
        className,
      )}
    >
      <motion.div key={resetKey}>{component}</motion.div>
      <AnimatePresence mode="wait" initial={false}>
        {showActions && (
          <WorkDemoActions componentId={componentId} onReset={handleReset} />
        )}
      </AnimatePresence>
    </motion.figure>
  );
}

// Reusable animated action wrapper
function AnimatedAction({ delay, children }: AnimatedActionProps) {
  return (
    <motion.div {...FADE_IN_BLUR} transition={{ ...ACTION_TRANSITION, delay }}>
      {children}
    </motion.div>
  );
}

function WorkDemoFullscreen() {
  const { activeComponentId, setActiveComponentId } = useWorkDemoContext();
  const [resetKey, setResetKey] = React.useState(0);

  const activeComponent = React.useMemo(
    () => COMPONENTS.find((c) => c.id === activeComponentId),
    [activeComponentId],
  );

  const handleOpenChange = () => setActiveComponentId(null);

  const handleReset = React.useCallback(() => {
    setResetKey((prev) => prev + 1);
  }, []);

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
            "fixed inset-0 z-50 h-full bg-background outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:blur-in-md",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:blur-out-md",
          )}
        >
          <div className="flex flex-col lg:grid lg:grid-cols-[340px_1fr] h-full p-4 group/fullscreen">
            <aside className="w-full flex flex-col p-4 gap-4">
              <motion.h3
                {...FADE_IN_BLUR}
                transition={STAGGER_TRANSITIONS.heading}
                className="text-lg font-medium font-serif text-primary"
              >
                {activeComponent?.name}
              </motion.h3>
              <motion.p
                {...FADE_IN_BLUR}
                transition={STAGGER_TRANSITIONS.description}
                className="text-base font-medium text-gray-10 tracking-[-0.01em] text-balance"
              >
                {activeComponent?.description}
              </motion.p>
              {activeComponent?.tech && (
                <motion.div
                  {...FADE_IN_BLUR}
                  transition={STAGGER_TRANSITIONS.tech}
                >
                  <WorkDemoTech tech={activeComponent.tech} />
                </motion.div>
              )}
              <motion.ul
                {...FADE_IN_BLUR}
                transition={STAGGER_TRANSITIONS.links}
                className="flex flex-col gap-2 mt-4"
              >
                <li>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-gray-10 font-medium hover:text-primary transition-all tracking-[-0.01em] focus"
                  >
                    <RefreshCcw className="size-4" />
                    <span>Reset instance</span>
                  </button>
                </li>
                <li>
                  <a
                    href={`https://github.com/heymynameisrob/website-25/blob/main/src/components/demos/${activeComponent?.fileName || ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-10 font-medium hover:text-primary transition-all tracking-[-0.01em] focus"
                  >
                    <Code2Icon className="size-4 mr-2" />
                    <span>View on Github</span>
                    <ArrowUpRight className="ml-1 size-4 opacity-50" />
                  </a>
                </li>
              </motion.ul>
            </aside>
            <section className="grid place-items-center">
              <motion.div key={resetKey}>
                {activeComponent?.component}
              </motion.div>
            </section>
          </div>
          <div className="absolute top-4 right-4">
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

function WorkDemoActions({ componentId, onReset }: WorkDemoActionsProps) {
  const { setActiveComponentId } = useWorkDemoContext();

  const thisComponent = React.useMemo(
    () => COMPONENTS.find((c) => c.id === componentId),
    [componentId],
  );

  return (
    <div className="absolute bottom-0 right-0 p-3 flex items-center justify-end gap-3">
      <AnimatedAction delay={0.15}>
        <Tooltip content="Reset">
          <Button size="icon" variant="ghost" onClick={onReset}>
            <RefreshCcw className="size-4 opacity-70" />
          </Button>
        </Tooltip>
      </AnimatedAction>
      <AnimatedAction delay={0.05}>
        <Tooltip content="Fullscreen">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setActiveComponentId(componentId)}
          >
            <FullscreenIcon className="size-4 opacity-70" />
          </Button>
        </Tooltip>
      </AnimatedAction>
      <AnimatedAction delay={0}>
        <Tooltip content="View on GitHub">
          <Button size="icon" variant="ghost" asChild>
            <a
              href={`https://github.com/heymynameisrob/website-25/blob/main/src/components/demos/${thisComponent?.fileName}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Code2Icon className="size-4 opacity-70" />
            </a>
          </Button>
        </Tooltip>
      </AnimatedAction>
    </div>
  );
}

function WorkDemoTech({ tech }: WorkDemoTechProps) {
  const techLabels: Record<TechTypes, string> = {
    react: "React",
    motion: "Motion",
    tailwind: "TailwindCSS",
    next: "Next.js",
    tiptap: "TipTap",
  };

  return (
    <div className="flex items-center gap-2">
      {tech.map((t) => (
        <Tooltip key={t} content={techLabels[t]}>
          <div
            className={cn(
              "size-6 grid place-items-center p-px rounded-md",
              t === "react" && "hover:bg-gray-3",
              t === "motion" && "bg-[#FFF312]",
            )}
          >
            {TECH_ICONS[t]}
          </div>
        </Tooltip>
      ))}
    </div>
  );
}
