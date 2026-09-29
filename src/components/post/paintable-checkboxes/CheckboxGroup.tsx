import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { PostDemo } from "@/components/post/PostDemo";
import { cn } from "@/lib/utils";

const fruitOptions = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Orange", value: "orange" },
];

const users = [
  { name: "Ada Lovelace", email: "ada@example.com", role: "Admin", value: "ada" },
  { name: "Grace Hopper", email: "grace@example.com", role: "Editor", value: "grace" },
  { name: "Alan Turing", email: "alan@example.com", role: "Viewer", value: "alan" },
  { name: "Katherine Johnson", email: "katherine@example.com", role: "Editor", value: "katherine" },
];

const fruitValues = fruitOptions.map(function getValue(option) {
  return option.value;
});

const userValues = users.map(function getValue(user) {
  return user.value;
});

interface CheckboxGroupProps {
  children: React.ReactNode;
  label: string;
  values: string[];
  className?: string;
}

interface CheckboxProps {
  children?: React.ReactNode;
  label: string;
  value: string;
  index: number;
  className?: string;
}

function CheckboxGroup({ children, label, values, className }: CheckboxGroupProps) {
  const [checked, setChecked] = React.useState<string[]>([]);

  const rootIndexRef = React.useRef<number | null>(null);
  const currentIndexRef = React.useRef<number | null>(null);
  const checkedBeforeDragRef = React.useRef<Set<string>>(new Set());
  const isDragStarted = React.useRef(false);
  const didDragRef = React.useRef(false);

  function getPointerIndex(event: React.PointerEvent<HTMLElement>) {
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const checkbox = element?.closest<HTMLElement>("[data-checkbox-index]");
    if (!checkbox) return null;

    const index = Number(checkbox.dataset.checkboxIndex);
    return Number.isInteger(index) ? index : null;
  }

  function getRange(rootIndex: number, currentIndex: number) {
    const start = Math.min(rootIndex, currentIndex);
    const end = Math.max(rootIndex, currentIndex);

    return values.slice(start, end + 1);
  }

  function updatePaintedRange(currentIndex: number) {
    const rootIndex = rootIndexRef.current;
    if (rootIndex === null) return;

    const next = new Set(checkedBeforeDragRef.current);
    const range = getRange(rootIndex, currentIndex);

    for (const value of range) {
      next.add(value);
    }

    setChecked([...next]);
    currentIndexRef.current = currentIndex;
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    if (!event.isPrimary) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const index = getPointerIndex(event);
    if (index === null) return;

    rootIndexRef.current = index;
    currentIndexRef.current = index;
    checkedBeforeDragRef.current = new Set(checked);
    isDragStarted.current = true;
    didDragRef.current = false;
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (!isDragStarted.current) return;

    const index = getPointerIndex(event);
    if (index === null || index === currentIndexRef.current) return;

    if (!didDragRef.current) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    didDragRef.current = true;
    updatePaintedRange(index);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLElement>) {
    isDragStarted.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handlePointerCancel(event: React.PointerEvent<HTMLElement>) {
    isDragStarted.current = false;
    didDragRef.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleClickCapture(event: React.MouseEvent<HTMLElement>) {
    if (!didDragRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    didDragRef.current = false;
  }

  return (
    <CheckboxGroupPrimitive
      value={checked}
      onValueChange={setChecked}
      aria-label={label}
      className={cn("text-neutral-950 dark:text-white", className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClickCapture={handleClickCapture}
    >
      {children}
    </CheckboxGroupPrimitive>
  );
}

function Checkbox({ children, label, value, index, className }: CheckboxProps) {
  return (
    <label
      data-checkbox-index={index}
      className="flex items-center gap-2 text-base font-medium text-primary dark:text-white select-none"
    >
      <CheckboxPrimitive.Root
        name={label}
        value={value}
        className={cn(
          "flex size-4.5 shrink-0 items-center justify-center rounded-md border p-0 bg-white text-white dark:border-white dark:bg-neutral-950 dark:text-neutral-950 data-checked:bg-neutral-950 data-checked:text-white dark:data-checked:bg-white dark:data-checked:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 dark:focus-visible:outline-white",
          className
        )}
      >
        <CheckboxPrimitive.Indicator className="flex data-unchecked:hidden">
          <CheckIcon />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {children ?? label}
    </label>
  );
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      {...props}
      style={{ display: "block", ...props.style }}
    >
      <path d="m2.5 8.5 4 4 7-9" />
    </svg>
  );
}

function renderFruitDemo() {
  return (
    <CheckboxGroup label="Fruits" values={fruitValues} className="flex flex-col items-start gap-1">
      <div className="mb-1 text-sm font-bold">Fruits</div>
      {fruitOptions.map(function renderOption(option, index) {
        return (
          <div className="h-6" key={option.value}>
            <Checkbox label={option.label} value={option.value} index={index} />
          </div>
        );
      })}
    </CheckboxGroup>
  );
}

function renderUserDemo() {
  return (
    <CheckboxGroup
      label="Users"
      values={userValues}
      className="w-full max-w-2xl overflow-x-auto bg-gray-1 border shadow-xs rounded-lg overflow-hidden"
    >
      <table className="w-full border-collapse text-left text-sm ">
        <thead>
          <tr className="border-b text-xs text-gray-9 bg-gray-2">
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">Email</th>
            <th className="px-3 py-2 font-medium">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(function renderUser(user, index) {
            return (
              <tr
                key={user.value}
                data-checkbox-index={index}
                className="border-b last:border-0 has-[[data-checked]]:bg-gray-3  hover:bg-gray-2"
              >
                <td className="px-3 py-3 select-none">
                  <Checkbox label={user.name} value={user.value} index={index}>
                    <span className="whitespace-nowrap font-medium text-sm">{user.name}</span>
                  </Checkbox>
                </td>
                <td className="p-3 select-none text-gray-10 font-medium">{user.email}</td>
                <td className="p-3 select-none text-gray-10 font-medium">{user.role}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </CheckboxGroup>
  );
}

export function FruitCheckboxesDemo() {
  return (
    <PostDemo initialOptions={null} caption="Paint across a simple list of fruit">
      {renderFruitDemo}
    </PostDemo>
  );
}

export function UserTableCheckboxesDemo() {
  return (
    <PostDemo initialOptions={null} caption="Click and drag to select multiple rows">
      {renderUserDemo}
    </PostDemo>
  );
}
