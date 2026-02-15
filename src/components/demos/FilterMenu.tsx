import * as React from "react";

import * as Combobox from "@/components/primitives/Combobox";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/primitives/Popover";
import { Switch } from "@/components/primitives/Switch";
import countries from "world-countries";
import { cn } from "@/lib/utils";

// FilterMenu component API for use in demos
interface FilterMenuProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

const FilterMenuContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

function useFilterMenu() {
  const ctx = React.useContext(FilterMenuContext);
  if (!ctx) throw new Error("FilterMenu context is required");
  return ctx;
}

export function FilterMenu({
  children,
  value,
  onValueChange,
}: FilterMenuProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <FilterMenuContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <Combobox.Root
        value={value}
        onValueChange={onValueChange}
        onClose={() => setOpen(false)}
      >
        <Popover open={open} onOpenChange={setOpen} modal={true}>
          {children}
        </Popover>
      </Combobox.Root>
    </FilterMenuContext.Provider>
  );
}

export const FilterMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  return (
    <PopoverTrigger ref={ref} className={className} {...props}>
      {children}
    </PopoverTrigger>
  );
});
FilterMenuTrigger.displayName = "FilterMenuTrigger";

export const FilterMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof PopoverContent>
>(({ className, children, ...props }, ref) => {
  return (
    <PopoverContent ref={ref} className={cn("p-0", className)} {...props}>
      {children}
    </PopoverContent>
  );
});
FilterMenuContent.displayName = "FilterMenuContent";

export const FilterMenuInput = Combobox.Input;

export const FilterMenuList = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Combobox.List>
>(({ className, children, ...props }, ref) => {
  return (
    <Combobox.List
      ref={ref}
      className={cn("max-h-[300px] p-1 overflow-y-scroll", className)}
      {...props}
    >
      {children}
    </Combobox.List>
  );
});
FilterMenuList.displayName = "FilterMenuList";

export const FilterMenuItem = Combobox.Item;

interface ComboboxControls {
  loop: boolean;
}

const COMBOBOX_PROPS = [
  { name: "value", type: "string | undefined", configurable: false },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    configurable: false,
  },
  { name: "defaultValue", type: "string", configurable: false },
  { name: "onClose", type: "() => void", configurable: false },
  { name: "loop", type: "boolean", configurable: true },
] as const;

function Controls({
  controls,
  onChange,
}: {
  controls: ComboboxControls;
  onChange: (controls: ComboboxControls) => void;
}) {
  return (
    <div className="flex flex-col gap-3 p-3 rounded-lg border bg-gray-2">
      <div className="text-xs font-medium text-gray-10 uppercase tracking-wide">
        Props
      </div>
      <div className="flex flex-col gap-2">
        {COMBOBOX_PROPS.map((prop) => (
          <div
            key={prop.name}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono text-primary">
                {prop.name}
              </code>
              <span className="text-xs text-gray-9 font-mono">{prop.type}</span>
            </div>
            {prop.configurable && prop.name === "loop" ? (
              <Switch
                checked={controls.loop}
                onCheckedChange={(checked) =>
                  onChange({ ...controls, loop: checked })
                }
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

const USERS = [
  { value: "dave-hawkins", label: "Dave Hawkins" },
  { value: "rob-hough", label: "Rob Hough" },
  { value: "jon-lay", label: "Jon Lay" },
  { value: "tim-bates", label: "Tim Bates" },
];

// Convert country code to flag emoji
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Process and group countries alphabetically
const COUNTRIES = countries
  .map((country) => ({
    value: country.cca2.toLowerCase(),
    label: country.name.common,
    flag: getFlagEmoji(country.cca2),
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const COUNTRIES_BY_LETTER = COUNTRIES.reduce(
  (acc, country) => {
    const letter = country.label[0].toUpperCase();
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(country);
    return acc;
  },
  {} as Record<string, typeof COUNTRIES>,
);

export function ComboboxMenu() {
  const [selected, setSelected] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [controls, setControls] = React.useState<ComboboxControls>({
    loop: false,
  });

  const selectedCountry = COUNTRIES.find(
    (country) => country.value === selected,
  );

  return (
    <div className="flex flex-col gap-4">
      <Combobox.Root
        value={selected}
        onValueChange={setSelected}
        onClose={() => setOpen(false)}
      >
        <Popover open={open} onOpenChange={setOpen} modal={true}>
          <PopoverTrigger
            className={cn(
              "px-2 w-[200px] inline-flex items-center justify-between h-9 gap-2 bg-gray-1 border transition-all whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-hidden cursor-default focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0 [&_svg]:opacity-80 text-primary",
              "transition-all hover:bg-gray-2 data[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2",
            )}
          >
            <div className="flex items-center gap-2">
              {selectedCountry ? (
                <>
                  <span className="text-base">{selectedCountry.flag}</span>
                  <span>{selectedCountry.label}</span>
                </>
              ) : (
                "Select a country"
              )}
            </div>
            <ChevronDownIcon className="w-4 h-4 opacity-60" />
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64 p-0">
            <Combobox.Input />
            <Combobox.List
              loop={controls.loop}
              className="max-h-[300px] px-1 overflow-y-scroll"
            >
              {Object.entries(COUNTRIES_BY_LETTER).map(
                ([letter, countries]) => (
                  <Combobox.Group key={letter} label={letter}>
                    {countries.map((country) => (
                      <Combobox.Item
                        key={country.value}
                        value={country.value}
                        keywords={[country.label]}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-base leading-[1lh]">
                            {country.flag}
                          </span>
                          <span className="truncate">{country.label}</span>
                        </div>
                      </Combobox.Item>
                    ))}
                  </Combobox.Group>
                ),
              )}
            </Combobox.List>
          </PopoverContent>
        </Popover>
      </Combobox.Root>
      <Controls controls={controls} onChange={setControls} />
    </div>
  );
}

export function ComboboxStandalone() {
  const [selected, setSelected] = React.useState("");
  const [controls, setControls] = React.useState<ComboboxControls>({
    loop: false,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="w-56 rounded-lg border overflow-hidden bg-background">
        <Combobox.Root value={selected} onValueChange={setSelected}>
          <Combobox.Input />
          <Combobox.List
            loop={controls.loop}
            className="max-h-[300px] p-1 overflow-y-scroll"
          >
            {USERS.map((user) => (
              <Combobox.Item
                key={user.value}
                value={user.value}
                keywords={[user.label]}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-cyan-500" />
                  <span>{user.label}</span>
                </div>
              </Combobox.Item>
            ))}
          </Combobox.List>
        </Combobox.Root>
      </div>
      <Controls controls={controls} onChange={setControls} />
    </div>
  );
}
