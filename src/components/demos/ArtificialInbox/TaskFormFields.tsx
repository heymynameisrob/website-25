import * as React from "react";
import { CalendarDaysIcon, UserIcon } from "@heroicons/react/16/solid";
import {
  CalendarIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  CircleIcon,
  XCircleIcon,
  ChevronDownIcon,
} from "lucide-react";
import { DatePicker } from "@/components/primitives/DatePicker";
import { Avatar } from "@/components/primitives/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/primitives/DropdownMenu";
import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import { cn } from "@/lib/utils";

// Reusable field components
function FieldRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <dt className="flex items-center gap-2 select-none w-full overflow-hidden max-w-[120px] text-gray-10 [&_svg]:size-4 [&_svg]:opacity-70">
      {children}
    </dt>
  );
}

function FieldValue({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <dd
      className={cn(
        "w-full p-1 -mx-1 rounded-md bg-transparent hover:bg-gray-3 focus-visible:bg-gray-3 focus-within:bg-gray-3 has-[button[data-state=open]]:bg-gray-3",
        className,
      )}
    >
      {children}
    </dd>
  );
}

interface AssigneeFieldProps {
  control: Control<any>;
  name: string;
  options: Array<{ value: string; label: string }>;
}

export function AssigneeField({ control, name, options }: AssigneeFieldProps) {
  return (
    <FieldRow>
      <FieldLabel>
        <UserIcon />
        <span className="text-sm font-medium truncate">Assignee</span>
      </FieldLabel>
      <FieldValue>
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            const selectedOption = options.find((o) => o.value === field.value);
            return (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center w-full text-sm font-medium text-primary outline-none focus:outine-none h-7 px-2">
                  <div className="w-fit flex items-center just gap-2">
                    <Avatar fallback={selectedOption?.label || "U"} size="xs" />
                    <span>{selectedOption?.label || "Select"}</span>
                    <ChevronDownIcon className="size-3 ml-auto opacity-50" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuRadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    {options.map((option) => (
                      <DropdownMenuRadioItem
                        key={option.value}
                        value={option.value}
                        className="gap-2"
                      >
                        <Avatar fallback={option.label} size="xs" />
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }}
        />
      </FieldValue>
    </FieldRow>
  );
}

interface StatusFieldProps {
  control: Control<any>;
  name: string;
  options: Array<{ value: string; label: string }>;
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  todo: <CircleDashedIcon className="size-4" />,
  in_progress: <CircleIcon className="size-4" />,
  done: <CheckCircle2Icon className="size-4" />,
  cancelled: <XCircleIcon className="size-4" />,
};

export function StatusField({ control, name, options }: StatusFieldProps) {
  return (
    <FieldRow>
      <FieldLabel>
        <CircleIcon strokeWidth={3} />
        <span className="text-sm font-medium truncate">Status</span>
      </FieldLabel>
      <FieldValue>
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            const selectedOption = options.find((o) => o.value === field.value);
            return (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 w-full text-sm font-medium text-primary outline-none focus:outline-none h-7 px-2">
                  <div className="flex items-center gap-2">
                    {STATUS_ICONS[field.value]}
                    <span>{selectedOption?.label || "Select"}</span>
                    <ChevronDownIcon className="size-3 ml-auto opacity-50" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuRadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    {options.map((option) => (
                      <DropdownMenuRadioItem
                        key={option.value}
                        value={option.value}
                        className="gap-2"
                      >
                        {STATUS_ICONS[option.value]}
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }}
        />
      </FieldValue>
    </FieldRow>
  );
}

interface DueDateFieldProps {
  control: Control<any>;
  name: string;
}

export function DueDateField({ control, name }: DueDateFieldProps) {
  return (
    <FieldRow>
      <FieldLabel>
        <CalendarDaysIcon />
        <span className="text-sm font-medium truncate">Due Date</span>
      </FieldLabel>
      <FieldValue>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <DatePicker
              date={field.value}
              onDateChange={field.onChange}
              placeholder="Select due date"
              className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-7 px-2 py-0.5 pr-8 text-sm font-medium shadow-none"
            />
          )}
        />
      </FieldValue>
    </FieldRow>
  );
}
